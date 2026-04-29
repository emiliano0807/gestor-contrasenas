const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticator } = require('otplib');
const qrcode = require('qrcode');
const os = require('os');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '2h';

// Lógica de Registro
exports.register = async (req, res) => {
  const { username, password } = req.body;
  console.log(`[Auth] Registro solicitado por ${username} desde ${os.hostname()}`);
  
  if (!username || !password) return res.status(400).json({ error: 'Faltan credenciales' });

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password_hash });
    
    await newUser.save();
    
    res.status(201).json({ 
      message: 'Usuario registrado exitosamente', 
      userId: newUser._id,
      handled_by: os.hostname()
    });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'El usuario ya existe' });
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Lógica de Login (Paso 1)
exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Faltan credenciales' });

  try {
    const user = await User.findOne({ username, is_active: true });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

    // NUEVO: Verificar si el usuario tiene activado el 2FA
    if (user.two_factor_enabled) {
      // Retornamos un aviso de que falta el paso 2, junto con el ID del usuario
      return res.json({
        requires2FA: true,
        userId: user._id,
        two_factor_enabled: true,
        message: 'Requiere código de autenticación'
      });
    }

    // Si NO tiene 2FA, iniciamos sesión normalmente
    const token = jwt.sign(
      { userId: user._id, username: user.username, 
        two_factor_enabled: user.two_factor_enabled },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    res.json({ token, handled_by: os.hostname() });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Lógica de Verificación
exports.verify = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false, error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ 
      valid: true, 
      user: decoded, 
      handled_by: os.hostname() 
    });
  } catch (err) {
    res.status(401).json({ valid: false, error: 'Token inválido o expirado' });
  }
};

exports.verify2FALogin = async (req, res) => {
  const { userId, token } = req.body; // token aquí es el código de 6 dígitos

  if (!userId || !token) return res.status(400).json({ error: 'Faltan datos de verificación' });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

    // otplib verifica el código contra el secreto guardado
    const isValid = require('otplib').authenticator.verify({
      token: token,
      secret: user.two_factor_secret
    });

    if (!isValid) return res.status(401).json({ error: 'Código inválido o expirado' });

    // Si el código es correcto, AHORA SÍ generamos el JWT real
    const jwtToken = jwt.sign(
      { userId: user._id, username: user.username,
        two_factor_enabled: user.two_factor_enabled
       },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    res.json({ token: jwtToken, handled_by: os.hostname(), 
      two_factor_enabled: user.two_factor_enabled
     });
  } catch (err) {
    res.status(500).json({ error: 'Error verificando 2FA en login' });
  }
};

exports.generate2FA = async (req, res) => {
  // Asumimos que el usuario ya inició sesión y envía su userId
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (user.two_factor_enabled) {
      return res.status(400).json({ error: 'El 2FA ya está activo' });
    }

    // Generamos un secreto único de 32 caracteres para este usuario
    const secret = authenticator.generateSecret();

    // Guardamos el secreto en la base de datos temporalmente
    user.two_factor_secret = secret;
    await user.save();

    // Creamos la URI que entienden Google y Microsoft Authenticator
    // Formato: otpauth://totp/NombreApp:CorreoUsuario?secret=...&issuer=NombreApp
    const otpauthUrl = authenticator.keyuri(user.username, 'MiBovedaSegura', secret);

    // Convertimos esa URI en una imagen de Código QR (en base64)
    const qrImage = await qrcode.toDataURL(otpauthUrl);

    res.json({
      secret: secret, // Para usuarios que no pueden escanear el QR
      qrCode: qrImage // La imagen para mostrar en React
    });

  } catch (error) {
    res.status(500).json({ error: 'Error generando 2FA' });
  }
};

// 2. Verificar el código y activar el 2FA
exports.verifyAndEnable2FA = async (req, res) => {
  const { userId, token } = req.body; // El token es el código de 6 dígitos

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // otplib verifica si el código ingresado coincide con el secreto del usuario
    const isValid = authenticator.verify({
      token: token,
      secret: user.two_factor_secret
    });

    if (isValid) {
      user.two_factor_enabled = true;
      await user.save();
      res.json({ message: 'Autenticación de dos pasos activada exitosamente' });
    } else {
      res.status(400).json({ error: 'El código es inválido o ha expirado' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Error verificando 2FA' });
  }
};

// 3. Desactivar el 2FA
exports.disable2FA = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Borramos el secreto y apagamos el interruptor
    user.two_factor_secret = undefined;
    user.two_factor_enabled = false;
    await user.save();

    res.json({ message: 'Autenticación de dos pasos desactivada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al desactivar 2FA' });
  }
};