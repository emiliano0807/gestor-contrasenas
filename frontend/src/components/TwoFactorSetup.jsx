import { useState, useEffect } from "react";

export default function TwoFactorSetup({
  userId,
  is2FAEnabled,
  onComplete,
  onDisable,
  onCancel,
  showToast,
}) {
  // Si ya lo tiene activo, saltamos directamente al paso 4 (Desactivar)
  const [step, setStep] = useState(is2FAEnabled ? 4 : 1);
  const [qrData, setQrData] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  // Paso 1: Obtener el QR solo si NO está activado
  useEffect(() => {
    if (step === 1) {
      const generateQR = async () => {
        try {
          const res = await fetch(
            "http://localhost/api1/api/users/2fa/generate",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId }),
            },
          );
          const data = await res.json();

          if (res.ok) {
            setQrData(data);
          } else {
            // ---> SISTEMA DE AUTORECUPERACIÓN <---
            // Si el servidor avisa que ya está activo, forzamos el panel a saltar al paso 4
            if (data.error === "El 2FA ya está activo") {
              setStep(4);
            } else {
              if (showToast)
                showToast(data.error || "Error al generar el código QR");
            }
          }
        } catch (error) {
          if (showToast) showToast("Error al generar el código QR");
        }
      };
      generateQR();
    }
  }, [userId, step]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost/api1/api/users/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, token }),
      });
      const data = await res.json();

      if (res.ok) {
        setStep(3);
        setTimeout(() => onComplete(), 2000);
      } else {
        showToast(data.error || "Código incorrecto");
      }
    } catch (error) {
      showToast("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas desactivar la seguridad 2FA? Tu cuenta será más vulnerable.",
      )
    ) {
      setLoading(true);
      try {
        const res = await fetch("http://localhost/api1/api/users/2fa/disable", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (res.ok) {
          showToast("Autenticación 2FA desactivada");
          onDisable(); // Avisamos al Dashboard para que actualice su estado
        }
      } catch (error) {
        showToast("Error al desactivar 2FA");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="glass-panel active"
      style={{ padding: "30px", maxWidth: "400px", textAlign: "center" }}
    >
      {step === 1 && qrData && (
        <>
          <h3 style={{ marginBottom: "15px" }}>Configurar Autenticador</h3>
          <p style={{ fontSize: "0.9rem", marginBottom: "20px" }}>
            Escanea este código con tu app de Microsoft Authenticator.
          </p>
          <div
            style={{
              background: "#fff",
              padding: "15px",
              borderRadius: "10px",
              display: "inline-block",
              marginBottom: "20px",
            }}
          >
            <img
              src={qrData.qrCode}
              alt="QR Code"
              style={{ width: "200px", height: "200px" }}
            />
          </div>
          <div
            style={{
              textAlign: "left",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              marginBottom: "20px",
            }}
          >
            <strong>Secreto manual:</strong> {qrData.secret}
          </div>
          <button className="auth-btn" onClick={() => setStep(2)}>
            Ya lo escaneé
          </button>
        </>
      )}

      {step === 2 && (
        <form onSubmit={handleVerify}>
          <h3 style={{ marginBottom: "15px" }}>Verificar Código</h3>
          <p style={{ fontSize: "0.9rem", marginBottom: "20px" }}>
            Ingresa el código de 6 dígitos que aparece en tu celular.
          </p>
          <div className="auth-input-container">
            <i className="fa-solid fa-clock-rotate-left icon-prefix"></i>
            <input
              type="text"
              placeholder="000000"
              maxLength="6"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              style={{
                textAlign: "center",
                fontSize: "1.5rem",
                letterSpacing: "5px",
              }}
              required
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Verificando..." : "Habilitar 2FA"}
          </button>
        </form>
      )}

      {step === 3 && (
        <div style={{ padding: "20px" }}>
          <i
            className="fa-solid fa-circle-check"
            style={{
              fontSize: "4rem",
              color: "var(--success)",
              marginBottom: "15px",
            }}
          ></i>
          <h3>¡2FA Activado!</h3>
          <p>Tu bóveda ahora está doblemente protegida.</p>
        </div>
      )}

      {step === 4 && (
        <div style={{ padding: "20px" }}>
          <i
            className="fa-solid fa-shield-check"
            style={{
              fontSize: "4rem",
              color: "var(--primary)",
              marginBottom: "15px",
            }}
          ></i>
          <h3 style={{ marginBottom: "15px" }}>Seguridad Activa</h3>
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-muted)",
              marginBottom: "25px",
            }}
          >
            La autenticación de dos pasos está configurada correctamente en tu
            cuenta.
          </p>
          <button
            className="auth-btn"
            onClick={handleDisable}
            disabled={loading}
            style={{
              backgroundColor: "#ef4444",
              borderColor: "#ef4444",
              width: "100%",
            }}
          >
            {loading ? "Desactivando..." : "Desactivar 2FA"}
          </button>
        </div>
      )}

      {step !== 3 && (
        <button
          onClick={onCancel}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            marginTop: "20px",
            cursor: "pointer",
          }}
        >
          Cerrar
        </button>
      )}
    </div>
  );
}
