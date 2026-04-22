import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const maskEmail = (email) => {
  if (!email || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return local.charAt(0) + '*****@' + domain;
  }
  return local.substring(0, 2) + '*****@' + domain;
};

export default function Vault({ passwords, onDelete, onEdit, showToast }) {
  const [visiblePasses, setVisiblePasses] = useState({});
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  if (passwords.length === 0) {
    return (
      <div className="passwords-list" style={{ padding: '20px' }}>
        <h3>Bóveda Guardada</h3>
        <motion.p
          style={{ textAlign: 'center', padding: '20px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Aún no tienes contraseñas guardadas.
        </motion.p>
      </div>
    );
  }

  const togglePass = (id) => {
    setVisiblePasses(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      if (showToast) {
        showToast(`¡${type === 'email' ? 'Correo' : 'Contraseña'} copiad${type === 'email' ? 'o' : 'a'} al portapapeles!`);
      } else {
        alert(`¡${type === 'email' ? 'Correo' : 'Contraseña'} copiad${type === 'email' ? 'o' : 'a'} al portapapeles!`);
      }
    }).catch(err => {
      console.error('Error al copiar: ', err);
    });
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setEditData(item);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const saveEdit = () => {
    onEdit(editData);
    setEditId(null);
  };

  const sortedPasswords = [...passwords].reverse();

  return (
    <div className="passwords-list" style={{ padding: '20px' }}>
      <motion.h3
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        Bóveda Guardada
      </motion.h3>
      <div className="vault-container">
        <AnimatePresence mode="popLayout">
          {sortedPasswords.map((item, index) => {
            const isVisible = visiblePasses[item.id];
            const displayPass = isVisible ? item.pass : '••••••••';
            const displayEmail = isVisible ? item.email : maskEmail(item.email);
            const isEditing = editId === item.id;

            if (isEditing) {
              return (
                <motion.div
                  className="vault-item"
                  key={item.id}
                  style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <input 
                      type="text" 
                      value={editData.site} 
                      onChange={e => setEditData({...editData, site: e.target.value})} 
                      placeholder="Sitio web"
                      style={{ padding: '6px 10px', fontSize: '0.9rem' }}
                    />
                    <input 
                      type="email" 
                      value={editData.email} 
                      onChange={e => setEditData({...editData, email: e.target.value})} 
                      placeholder="Correo"
                      style={{ padding: '6px 10px', fontSize: '0.9rem' }}
                    />
                    <input 
                      type="text" 
                      value={editData.pass} 
                      onChange={e => setEditData({...editData, pass: e.target.value})} 
                      placeholder="Contraseña"
                      style={{ padding: '6px 10px', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div className="item-actions" style={{ justifyContent: 'flex-end', marginTop: '10px' }}>
                    <motion.button
                      className="btn-primary"
                      onClick={saveEdit}
                      style={{ width: 'auto', padding: '6px 12px', background: 'var(--success)' }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Guardar
                    </motion.button>
                    <motion.button
                      className="btn-primary"
                      onClick={cancelEdit}
                      style={{ width: 'auto', padding: '6px 12px', background: 'var(--danger)' }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancelar
                    </motion.button>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                className="vault-item"
                key={item.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="item-info">
                  <span className="item-site">{item.site}</span>
                  <span className="item-email">
                    <i className="fa-solid fa-envelope"></i> {displayEmail}
                  </span>
                  <div className="item-pass-container">
                    <span className="item-pass">{displayPass}</span>
                  </div>
                </div>
                
                <div className="item-actions">
                  {/* Botón explícito para correo */}
                  <motion.button 
                    className="action-btn copy" 
                    onClick={() => copyToClipboard(item.email, 'email')} 
                    title="Copiar SOLO Correo"
                    style={{ color: '#0284c7' }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.85 }}
                  >
                    <i className="fa-solid fa-envelope-open-text"></i>
                  </motion.button>
                  
                  {/* Botón explícito para contraseña */}
                  <motion.button 
                    className="action-btn copy" 
                    onClick={() => copyToClipboard(item.pass, 'password')} 
                    title="Copiar SOLO Contraseña"
                    style={{ color: 'var(--primary)' }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.85 }}
                  >
                    <i className="fa-solid fa-copy"></i>
                  </motion.button>

                  {/* Botón de ver/ocultar */}
                  <motion.button 
                    className="action-btn view" 
                    onClick={() => togglePass(item.id)} 
                    title="Ver/Ocultar contraseña"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.85 }}
                  >
                    <i className={`fa-solid ${isVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </motion.button>

                  {/* Botón de editar */}
                  <motion.button 
                    className="action-btn view" 
                    onClick={() => startEdit(item)} 
                    title="Editar credencial"
                    style={{ color: '#f59e0b' }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.85 }}
                  >
                    <i className="fa-solid fa-pen"></i>
                  </motion.button>

                  {/* Botón de eliminar */}
                  <motion.button 
                    className="action-btn delete" 
                    onClick={() => onDelete(item.id)} 
                    title="Eliminar del gestor"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.85 }}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
