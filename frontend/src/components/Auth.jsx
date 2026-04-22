import { useState } from "react";
import { motion } from "motion/react";
import "./auth-sliding.css";

// Componente helper para animar texto letra por letra
function AnimatedText({ text, tag: Tag = "span", className, style, delay = 0 }) {
  return (
    <Tag className={className} style={{ ...style, display: "inline-block" }}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: delay + i * 0.03,
            ease: "easeOut",
          }}
          style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char}
        </motion.span>
      ))}
    </Tag>
  );
}

export default function Auth({ onLogin, showToast }) {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  // Sign In State (Cambiado a Email)
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPass, setSignInPass] = useState("");
  const [showSignInPass, setShowSignInPass] = useState(false);

  // Sign Up State (Cambiado a Email)
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPass, setSignUpPass] = useState("");
  const [showSignUpPass, setShowSignUpPass] = useState(false);

  // Lógica de Validación de Contraseña Maestra
  const passReqs = {
    length: signUpPass.length >= 8,
    upper: /[A-Z]/.test(signUpPass),
    lower: /[a-z]/.test(signUpPass),
    number: /[0-9]/.test(signUpPass),
    special: /[^A-Za-z0-9]/.test(signUpPass),
  };

  // Verifica si TODOS los requisitos son verdaderos
  const isPassValid = Object.values(passReqs).every(Boolean);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!signInEmail || !signInPass) {
      if (showToast) showToast("Por favor completa todos los campos.");
      return;
    }

    try {
      const res = await fetch("http://localhost/api1/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Enviamos el email bajo la clave 'username' para no romper tu backend actual
        body: JSON.stringify({ username: signInEmail, password: signInPass }),
      });

      const data = await res.json();

      if (res.ok) {
        onLogin({ username: signInEmail }, data.token);
      } else {
        if (showToast) showToast(data.error || "Credenciales incorrectas");
      }
    } catch (error) {
      if (showToast) showToast("Error al conectar con el servidor");
      console.log(error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!signUpEmail || !signUpPass) {
      if (showToast) showToast("Por favor completa todos los campos.");
      return;
    }

    if (!isPassValid) {
      if (showToast)
        showToast(
          "La contraseña maestra no cumple con los requisitos de seguridad.",
        );
      return;
    }

    try {
      const res = await fetch("http://localhost/api1/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Enviamos el email bajo la clave 'username'
        body: JSON.stringify({ username: signUpEmail, password: signUpPass }),
      });

      const data = await res.json();

      if (res.ok) {
        if (showToast)
          showToast("Cuenta creada de forma segura. Ahora inicia sesión.");
        setSignUpEmail("");
        setSignUpPass("");
        setIsRightPanelActive(false);
      } else {
        if (showToast) showToast(data.error || "No se pudo crear la cuenta");
      }
    } catch (error) {
      if (showToast) showToast("Error al conectar con el servidor");
      console.log(error);
    }
  };

  // Función auxiliar para renderizar los iconos de checklist
  const renderCheckIcon = (isValid) => {
    return (
      <i
        className={`fa-solid ${isValid ? "fa-check" : "fa-xmark"}`}
        style={{
          color: isValid ? "#10b981" : "#ef4444",
          width: "15px",
          marginRight: "8px",
        }}
      ></i>
    );
  };

  return (
    <motion.div
      className={`auth-container ${isRightPanelActive ? "right-panel-active" : ""}`}
      id="auth-box"
      style={{ minHeight: "480px", position: "relative", zIndex: 1 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Sign Up Form */}
      <div className="form-container sign-up-container">
        <form className="auth-form" onSubmit={handleSignUp}>
          <motion.h1
            style={{ marginBottom: "10px" }}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Crear Bóveda
          </motion.h1>
          <motion.p
            style={{ marginBottom: "20px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            Registra tu correo y contraseña maestra
          </motion.p>

          <motion.div
            className="auth-input-container"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <i
              className="fa-solid fa-envelope icon-prefix"
              style={{ position: "absolute", left: "15px" }}
            ></i>
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              required
            />
          </motion.div>

          <motion.div
            className="auth-input-container"
            style={{ marginBottom: "10px" }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <i
              className="fa-solid fa-shield-halved icon-prefix"
              style={{ position: "absolute", left: "15px" }}
            ></i>
            <input
              type={showSignUpPass ? "text" : "password"}
              placeholder="Contraseña Maestra"
              value={signUpPass}
              onChange={(e) => setSignUpPass(e.target.value)}
              required
              style={{ paddingRight: "40px" }}
            />
            <button
              type="button"
              onClick={() => setShowSignUpPass(!showSignUpPass)}
              style={{
                position: "absolute",
                right: "15px",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              <i
                className={`fa-solid ${showSignUpPass ? "fa-eye-slash" : "fa-eye"}`}
                style={{ position: "static", transform: "none" }}
              ></i>
            </button>
          </motion.div>

          {/* Panel de Requisitos de Seguridad */}
          <motion.div
            style={{
              width: "100%",
              textAlign: "left",
              fontSize: "0.8rem",
              backgroundColor: "var(--bg-secondary)",
              padding: "10px 15px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <li
                style={{
                  color: passReqs.length
                    ? "var(--text-main)"
                    : "var(--text-muted)",
                }}
              >
                {renderCheckIcon(passReqs.length)} Mínimo 8 caracteres
              </li>
              <li
                style={{
                  color: passReqs.upper
                    ? "var(--text-main)"
                    : "var(--text-muted)",
                }}
              >
                {renderCheckIcon(passReqs.upper)} Una letra mayúscula
              </li>
              <li
                style={{
                  color: passReqs.lower
                    ? "var(--text-main)"
                    : "var(--text-muted)",
                }}
              >
                {renderCheckIcon(passReqs.lower)} Una letra minúscula
              </li>
              <li
                style={{
                  color: passReqs.number
                    ? "var(--text-main)"
                    : "var(--text-muted)",
                }}
              >
                {renderCheckIcon(passReqs.number)} Un número
              </li>
              <li
                style={{
                  color: passReqs.special
                    ? "var(--text-main)"
                    : "var(--text-muted)",
                }}
              >
                {renderCheckIcon(passReqs.special)} Un carácter especial
                (!@#$...)
              </li>
            </ul>
          </motion.div>

          <motion.button
            type="submit"
            className="auth-btn"
            disabled={!isPassValid}
            style={{
              opacity: isPassValid ? 1 : 0.6,
              cursor: isPassValid ? "pointer" : "not-allowed",
            }}
            whileHover={isPassValid ? { scale: 1.05 } : {}}
            whileTap={isPassValid ? { scale: 0.95 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Registrar Bóveda
          </motion.button>
        </form>
      </div>

      {/* Sign In Form */}
      <div className="form-container sign-in-container">
        <form className="auth-form" onSubmit={handleSignIn}>
          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Iniciar Sesión
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            Accede con tus credenciales
          </motion.p>

          <motion.div
            className="auth-input-container"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <i
              className="fa-solid fa-envelope icon-prefix"
              style={{ position: "absolute", left: "15px" }}
            ></i>
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              required
            />
          </motion.div>

          <motion.div
            className="auth-input-container"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <i
              className="fa-solid fa-key icon-prefix"
              style={{ position: "absolute", left: "15px" }}
            ></i>
            <input
              type={showSignInPass ? "text" : "password"}
              placeholder="Contraseña Maestra"
              value={signInPass}
              onChange={(e) => setSignInPass(e.target.value)}
              required
              style={{ paddingRight: "40px" }}
            />
            <button
              type="button"
              onClick={() => setShowSignInPass(!showSignInPass)}
              style={{
                position: "absolute",
                right: "15px",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              <i
                className={`fa-solid ${showSignInPass ? "fa-eye-slash" : "fa-eye"}`}
                style={{ position: "static", transform: "none" }}
              ></i>
            </button>
          </motion.div>

          <motion.button
            type="submit"
            className="auth-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Iniciar Sesion
          </motion.button>
        </form>
      </div>

      {/* Overlay Animations */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <AnimatedText
              text="¡Bienvenido!"
              tag="h1"
              style={{ color: "#fff" }}
              key={isRightPanelActive ? "left-visible" : "left-hidden"}
            />
            <motion.p
              style={{
                color: "#fff",
                fontSize: "15px",
                marginTop: "20px",
                marginBottom: "30px",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Inicia sesión para acceder a tu bóveda.
            </motion.p>
            <motion.button
              className="auth-btn ghost"
              onClick={() => setIsRightPanelActive(false)}
              whileHover={{ scale: 1.08, boxShadow: "0 0 20px rgba(255,255,255,0.3)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Iniciar Sesión
            </motion.button>
          </div>
          <div className="overlay-panel overlay-right">
            <AnimatedText
              text="¿Nuevo?"
              tag="h1"
              style={{ color: "#fff" }}
              key={!isRightPanelActive ? "right-visible" : "right-hidden"}
            />
            <motion.p
              style={{
                color: "#fff",
                fontSize: "15px",
                marginTop: "20px",
                marginBottom: "30px",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Crea tu bóveda registrando tu nueva cuenta aquí.
            </motion.p>
            <motion.button
              className="auth-btn ghost"
              onClick={() => setIsRightPanelActive(true)}
              whileHover={{ scale: 1.08, boxShadow: "0 0 20px rgba(255,255,255,0.3)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Registrarse
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
