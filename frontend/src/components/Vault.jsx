import { useState } from 'react';

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
        <p style={{ textAlign: 'center', padding: '20px' }}>Aún no tienes contraseñas guardadas.</p>
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
      <h3>Bóveda Guardada</h3>
      <div className="vault-container">
        {sortedPasswords.map((item) => {
          const isVisible = visiblePasses[item.id];
          const displayPass = isVisible ? item.pass : '••••••••';
          const displayEmail = isVisible ? item.email : maskEmail(item.email);
          const isEditing = editId === item.id;

          if (isEditing) {
            return (
              <div className="vault-item" key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                  <button className="btn-primary" onClick={saveEdit} style={{ width: 'auto', padding: '6px 12px', background: 'var(--success)' }}>
                    Guardar
                  </button>
                  <button className="btn-primary" onClick={cancelEdit} style={{ width: 'auto', padding: '6px 12px', background: 'var(--text-muted)' }}>
                    Cancelar
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div className="vault-item" key={item.id}>
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
                <button 
                  className="action-btn copy" 
                  onClick={() => copyToClipboard(item.email, 'email')} 
                  title="Copiar SOLO Correo"
                  style={{ color: '#0284c7' }} /* color distinto para resaltar que es el correo */
                >
                  <i className="fa-solid fa-envelope-open-text"></i>
                </button>
                
                {/* Botón explícito para contraseña */}
                <button 
                  className="action-btn copy" 
                  onClick={() => copyToClipboard(item.pass, 'password')} 
                  title="Copiar SOLO Contraseña"
                  style={{ color: 'var(--primary)' }}
                >
                  <i className="fa-solid fa-copy"></i>
                </button>

                {/* Botón de ver/ocultar */}
                <button 
                  className="action-btn view" 
                  onClick={() => togglePass(item.id)} 
                  title="Ver/Ocultar contraseña"
                >
                  <i className={`fa-solid ${isVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>

                {/* Botón de editar */}
                <button 
                  className="action-btn view" 
                  onClick={() => startEdit(item)} 
                  title="Editar credencial"
                  style={{ color: '#f59e0b' }}
                >
                  <i className="fa-solid fa-pen"></i>
                </button>

                {/* Botón de eliminar */}
                <button 
                  className="action-btn delete" 
                  onClick={() => onDelete(item.id)} 
                  title="Eliminar del gestor"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
