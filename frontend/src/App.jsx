import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import AnimatedDots from "./components/AnimatedDots";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // VERIFICAR TOKEN AL INICIAR
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetch("http://localhost/api1/api/users/verify", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.valid) {
            setCurrentUser(data.user); // data.user contiene { userId, username }
          } else {
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Error validando sesión:", error);
        }
      }
    };
    checkSession();
  }, []);

  const handleLogin = (user, token) => {
    setCurrentUser(user);
    localStorage.setItem("token", token); // Guardamos el JWT real
    sessionStorage.setItem("currentUser", JSON.stringify(user)); // Guarda el objeto con two_factor_enabled
    if (token) {
      localStorage.setItem("token", token); 
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem("currentUser");
    localStorage.removeItem("token"); 
  };

  return (
    <>
      {/* Fondo animado de puntos */}
      <AnimatedDots />

      <motion.button
        onClick={toggleTheme}
        className="btn-icon"
        style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000 }}
        title="Alternar tema claro/oscuro"
        whileHover={{ scale: 1.15, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <AnimatePresence mode="wait">
          {theme === "light" ? (
            <motion.i
              key="moon"
              className="fa-solid fa-moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          ) : (
            <motion.i
              key="sun"
              className="fa-solid fa-sun"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence mode="wait">
        {currentUser ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Dashboard
              currentUser={currentUser}
              onLogout={handleLogout}
              showToast={showToast}
            />
          </motion.div>
        ) : (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Auth onLogin={handleLogin} showToast={showToast} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
