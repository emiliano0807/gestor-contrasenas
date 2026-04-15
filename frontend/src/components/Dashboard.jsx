import { useState, useEffect } from 'react';
import PasswordForm from './PasswordForm';
import PasswordUtilities from './PasswordUtilities';
import Vault from './Vault';

export default function Dashboard({ currentUser, onLogout, showToast }) {
  const [passwords, setPasswords] = useState([]);

  useEffect(() => {
    // Cargo contraseñas por usuario (usar un key unico por usuario para guardar)
    const storageKey = `passwords_${currentUser.username}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setPasswords(JSON.parse(saved));
    }
  }, [currentUser]);

  const handleAddPassword = (newEntry) => {
    const updated = [...passwords, newEntry];
    setPasswords(updated);
    localStorage.setItem(`passwords_${currentUser.username}`, JSON.stringify(updated));
  };

  const handleDeletePassword = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta credencial?')) {
      const updated = passwords.filter(p => p.id !== id);
      setPasswords(updated);
      localStorage.setItem(`passwords_${currentUser.username}`, JSON.stringify(updated));
    }
  };

  const handleEditPassword = (updatedEntry) => {
    const updated = passwords.map(p => p.id === updatedEntry.id ? updatedEntry : p);
    setPasswords(updated);
    localStorage.setItem(`passwords_${currentUser.username}`, JSON.stringify(updated));
  };

  return (
    <main className="glass-panel active" style={{ maxWidth: '800px', display: 'block', position: 'relative', margin: '0 auto' }}>
      <div className="header dashboard-header">
        <div className="title-area">
          <i className="fa-solid fa-shield-halved icon-medium"></i>
          <h2>Bóveda de {currentUser.username}</h2>
        </div>
        <button className="btn-icon" title="Cerrar sesión" onClick={onLogout}>
          <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>

      <PasswordForm onAdd={handleAddPassword} />
      
      <PasswordUtilities showToast={showToast} />

      <Vault passwords={passwords} onDelete={handleDeletePassword} onEdit={handleEditPassword} showToast={showToast} />
    </main>
  );
}
