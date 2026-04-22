import { useState } from 'react';
import { motion } from 'motion/react';
import { generatePassword } from '../utils/password';

export default function PasswordForm({ onAdd }) {
  const [site, setSite] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!site || !email || !password) return;

    onAdd({
      id: Date.now().toString(),
      site,
      email,
      pass: password
    });

    setSite('');
    setEmail('');
    setPassword('');
  };

  const handleGenerate = () => {
    const newPass = generatePassword(16);
    setPassword(newPass);
  };

  return (
    <div className="add-password-card">
      <motion.h3
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        Nueva Credencial
      </motion.h3>
      <form onSubmit={handleSubmit} id="add-form">
        <div className="input-row">
          <motion.div
            className="input-group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <i className="fa-solid fa-globe"></i>
            <input 
              type="text" 
              placeholder="Sitio web o App (ej: Facebook)" 
              value={site}
              onChange={e => setSite(e.target.value)}
              required 
            />
          </motion.div>
          <motion.div
            className="input-group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <i className="fa-solid fa-envelope"></i>
            <input 
              placeholder="Correo electrónico" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
            />
          </motion.div>
          <motion.div
            className="input-group"
            style={{ display: 'flex', alignItems: 'center' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <i className="fa-solid fa-lock" style={{ position: 'absolute', left: '14px' }}></i>
            <input 
              type={showPass ? "text" : "password"}
              placeholder="Contraseña" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
              style={{ paddingRight: '40px' }}
            />
            <button 
              type="button" 
              onClick={() => setShowPass(!showPass)}
              style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', zIndex: 10 }}
            >
              <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'}`} style={{ position: 'relative', left: 'auto', top: 'auto', transform: 'none' }}></i>
            </button>
          </motion.div>
          
          <motion.div
            style={{ display: 'flex', gap: '8px' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <motion.button
              type="button"
              className="btn-primary btn-add"
              onClick={handleGenerate}
              title="Generar Contraseña Segura"
              style={{ background: 'var(--success)' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </motion.button>
            <motion.button
              type="submit"
              className="btn-primary btn-add"
              title="Guardar"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <i className="fa-solid fa-plus"></i>
            </motion.button>
          </motion.div>
        </div>
      </form>
    </div>
  );
}
