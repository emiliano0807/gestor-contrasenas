import { useState } from 'react';
import { analyzePasswordStrength, generatePassword } from '../utils/password';

export default function PasswordUtilities({ showToast }) {
  const [testPassword, setTestPassword] = useState('');
  const [generated, setGenerated] = useState('');

  const strength = analyzePasswordStrength(testPassword);

  const handleGenerateClick = () => {
    const pwd = generatePassword(16);
    setGenerated(pwd);
  };

  const copyGenerated = () => {
    if (generated) {
      navigator.clipboard.writeText(generated);
      if (showToast) {
        showToast('¡Contraseña generada copiada!');
      }
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
      {/* Analizador de Contraseñas */}
      <div className="add-password-card" style={{ marginBottom: 0 }}>
        <h3><i className="fa-solid fa-magnifying-glass-shield"></i> Analizador de Seguridad</h3>
        <p style={{ marginBottom: '15px' }}>Comprueba qué tan segura es tu contraseña.</p>
        
        <div className="input-group">
          <i className="fa-solid fa-lock"></i>
          <input 
            type="text" 
            placeholder="Escribe la contraseña a analizar" 
            value={testPassword}
            onChange={(e) => setTestPassword(e.target.value)}
          />
        </div>
        
        {testPassword && (
          <div style={{ marginTop: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Nivel de seguridad:</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: strength.color }}>{strength.label}</span>
            </div>
            {/* Barra de progreso de seguridad */}
            <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${(strength.score / 4) * 100}%`, 
                  background: strength.color,
                  transition: 'width 0.3s ease, background 0.3s ease'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Generador de Contraseñas */}
      <div className="add-password-card" style={{ marginBottom: 0 }}>
        <h3><i className="fa-solid fa-wand-magic-sparkles"></i> Generador Rápido</h3>
        <p style={{ marginBottom: '15px' }}>Genera una contraseña fuerte sin guardarla aún.</p>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <i className="fa-solid fa-key"></i>
            <input 
              type="text" 
              readOnly 
              value={generated} 
              placeholder="Contraseña generada..."
            />
          </div>
          <button type="button" className="btn-icon" onClick={copyGenerated} title="Copiar al portapapeles">
            <i className="fa-solid fa-copy"></i>
          </button>
        </div>

        <button type="button" className="btn-primary" onClick={handleGenerateClick}>
          Generar Nueva
        </button>
      </div>
    </div>
  );
}
