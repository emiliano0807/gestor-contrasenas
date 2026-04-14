import { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
  };

  return (
    <>
      <button 
        onClick={toggleTheme} 
        className="btn-icon" 
        style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}
        title="Alternar tema claro/oscuro"
      >
        {theme === 'light' ? <i className="fa-solid fa-moon"></i> : <i className="fa-solid fa-sun"></i>}
      </button>

      {currentUser ? (
        <Dashboard currentUser={currentUser} onLogout={handleLogout} showToast={showToast} />
      ) : (
        <Auth onLogin={handleLogin} showToast={showToast} />
      )}

      {toastMessage && (
        <div className="toast">
          {toastMessage}
        </div>
      )}
    </>
  );
}

export default App;
