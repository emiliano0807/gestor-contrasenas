import { useState } from 'react';
import { motion } from 'motion/react';
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
      <motion.div
        className="add-password-card"
        style={{ marginBottom: 0 }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <motion.h3
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <i className="fa-solid fa-magnifying-glass-shield"></i> Analizador de Seguridad
        </motion.h3>
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
          <motion.div
            style={{ marginTop: '15px' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Nivel de seguridad:</span>
              <motion.span
                style={{ fontSize: '0.9rem', fontWeight: 600, color: strength.color }}
                key={strength.label}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {strength.label}
              </motion.span>
            </div>
            {/* Barra de progreso de seguridad */}
            <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div 
                style={{ 
                  height: '100%', 
                  background: strength.color,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(strength.score / 4) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Generador de Contraseñas */}
      <motion.div
        className="add-password-card"
        style={{ marginBottom: 0 }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <motion.h3
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <i className="fa-solid fa-wand-magic-sparkles"></i> Generador Rápido
        </motion.h3>
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
          <motion.button
            type="button"
            className="btn-icon"
            onClick={copyGenerated}
            title="Copiar al portapapeles"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
          >
            <i className="fa-solid fa-copy"></i>
          </motion.button>
        </div>

        <motion.button
          type="button"
          className="btn-primary"
          onClick={handleGenerateClick}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          Generar Nueva
        </motion.button>
      </motion.div>
    </div>
  );
}
