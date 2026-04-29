import { useState } from "react";
import "./auth-sliding.css";

export default function Auth({ onLogin, showToast }) {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  // Estados de Login
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPass, setSignInPass] = useState("");
  const [showSignInPass, setShowSignInPass] = useState(false);

  // NUEVOS ESTADOS PARA 2FA
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempUserId, setTempUserId] = useState(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");

  // Estados de Registro
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPass, setSignUpPass] = useState("");
  const [showSignUpPass, setShowSignUpPass] = useState(false);

  const passReqs = {
    length: signUpPass.length >= 8,
    upper: /[A-Z]/.test(signUpPass),
    lower: /[a-z]/.test(signUpPass),
    number: /[0-9]/.test(signUpPass),
    special: /[^A-Za-z0-9]/.test(signUpPass),
  };
  const isPassValid = Object.values(passReqs).every(Boolean);

  // PASO 1 DEL LOGIN
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
        body: JSON.stringify({ username: signInEmail, password: signInPass }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.requires2FA) {
          // El servidor dice que necesitamos código
          setTempUserId(data.userId);
          setRequires2FA(true);
          if (showToast) showToast("Ingresa tu código de autenticación");
        } else {
          // No tiene 2FA, entramos directo
          onLogin(
            { username: signInEmail, two_factor_enabled: false },
            data.token,
          );
        }
      } else {
        if (showToast) showToast(data.error || "Credenciales incorrectas");
      }
    } catch (error) {
      if (showToast) showToast("Error al conectar con el servidor");
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      if (showToast) showToast("Ingresa un código válido de 6 dígitos.");
      return;
    }

    try {
      const res = await fetch("http://localhost/api1/api/users/login/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: tempUserId, token: twoFactorCode }),
      });

      const data = await res.json();

      if (res.ok) {
        // Código válido, el servidor nos dio el JWT
        onLogin(
          { username: signInEmail, two_factor_enabled: true },
          data.token,
        );
      } else {
        if (showToast) showToast(data.error || "Código incorrecto");
      }
    } catch (error) {
      if (showToast) showToast("Error de conexión");
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
    }
  };

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
    <div
      className={`auth-container ${isRightPanelActive ? "right-panel-active" : ""}`}
      id="auth-box"
      style={{ minHeight: "480px" }}
    >
      {/* Sign Up Form */}
      <div className="form-container sign-up-container">
        <form
          className="auth-form"
          onSubmit={handleSignUp}
          style={{ padding: "0 40px" }}
        >
          <h1 style={{ marginBottom: "10px" }}>Crear Bóveda</h1>
          <p style={{ marginBottom: "20px" }}>
            Registra tu correo y contraseña maestra
          </p>

          <div className="auth-input-container">
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
          </div>

          <div
            className="auth-input-container"
            style={{ marginBottom: "10px" }}
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
          </div>

          <div
            style={{
              width: "100%",
              textAlign: "left",
              fontSize: "0.8rem",
              backgroundColor: "var(--bg-secondary)",
              padding: "10px 15px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
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
              </li>
            </ul>
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={!isPassValid}
            style={{
              opacity: isPassValid ? 1 : 0.6,
              cursor: isPassValid ? "pointer" : "not-allowed",
            }}
          >
            Registrar Bóveda
          </button>
        </form>
      </div>

      {/* Sign In Form */}
      <div className="form-container sign-in-container">
        {/* RENDERIZADO CONDICIONAL: Muestra el Login normal O la pantalla de ingresar código */}
        {!requires2FA ? (
          <form className="auth-form" onSubmit={handleSignIn}>
            <h1>Iniciar Sesión</h1>
            <p>Accede con tu correo y contraseña maestra</p>

            <div className="auth-input-container">
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
            </div>

            <div className="auth-input-container">
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
            </div>

            <button type="submit" className="auth-btn">
              Desbloquear Bóveda
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handle2FASubmit}>
            <i
              className="fa-solid fa-shield-check"
              style={{
                fontSize: "3rem",
                color: "var(--primary)",
                marginBottom: "15px",
              }}
            ></i>
            <h1>Autenticación 2FA</h1>
            <p>
              Ingresa el código de 6 dígitos generado por tu aplicación móvil.
            </p>

            <div className="auth-input-container" style={{ margin: "20px 0" }}>
              <i
                className="fa-solid fa-clock-rotate-left icon-prefix"
                style={{ position: "absolute", left: "15px" }}
              ></i>
              <input
                type="text"
                placeholder="000000"
                maxLength="6"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                required
                style={{
                  textAlign: "center",
                  fontSize: "1.5rem",
                  letterSpacing: "8px",
                  paddingLeft: "0",
                }}
              />
            </div>

            <button
              type="submit"
              className="auth-btn"
              style={{ width: "100%" }}
            >
              Verificar Identidad
            </button>
            <button
              type="button"
              onClick={() => setRequires2FA(false)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                marginTop: "20px",
                cursor: "pointer",
              }}
            >
              Volver
            </button>
          </form>
        )}
      </div>

      {/* Overlay Animations */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1 style={{ color: "#fff" }}>¡Bienvenido!</h1>
            <p
              style={{
                color: "#fff",
                fontSize: "15px",
                marginTop: "20px",
                marginBottom: "30px",
              }}
            >
              Desbloquea tu bóveda personal para acceder a tus credenciales.
            </p>
            <button
              className="auth-btn ghost"
              onClick={() => setIsRightPanelActive(false)}
            >
              Iniciar Sesión
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1 style={{ color: "#fff" }}>¿Nuevo?</h1>
            <p
              style={{
                color: "#fff",
                fontSize: "15px",
                marginTop: "20px",
                marginBottom: "30px",
              }}
            >
              Protege tus credenciales creando una bóveda segura.
            </p>
            <button
              className="auth-btn ghost"
              onClick={() => setIsRightPanelActive(true)}
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
