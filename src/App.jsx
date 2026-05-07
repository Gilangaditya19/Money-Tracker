import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'dashboard'

  // Check local storage for session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('neo_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem('neo_user', JSON.stringify(user));
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('neo_user');
    setCurrentUser(null);
    setCurrentView('login');
  };

  return (
    <div className="app-root">
      {currentView === 'login' && (
        <Login 
          onLogin={handleLogin} 
          onNavigateRegister={() => setCurrentView('register')} 
        />
      )}
      
      {currentView === 'register' && (
        <Register 
          onRegister={handleLogin} 
          onNavigateLogin={() => setCurrentView('login')} 
        />
      )}
      
      {currentView === 'dashboard' && currentUser && (
        <Dashboard 
          user={currentUser} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
}

export default App;
