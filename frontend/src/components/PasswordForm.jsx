import { useState } from 'react';
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
      <h3>Nueva Credencial</h3>
      <form onSubmit={handleSubmit} id="add-form">
        <div className="input-row">
          <div className="input-group">
            <i className="fa-solid fa-globe"></i>
            <input 
              type="text" 
              placeholder="Sitio web o App (ej: Facebook)" 
              value={site}
              onChange={e => setSite(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <i className="fa-solid fa-envelope"></i>
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group" style={{ display: 'flex', alignItems: 'center' }}>
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
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn-primary btn-add" onClick={handleGenerate} title="Generar Contraseña Segura" style={{ background: 'var(--success)' }}>
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </button>
            <button type="submit" className="btn-primary btn-add" title="Guardar">
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
