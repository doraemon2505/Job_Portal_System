// import { createContext, useState, useEffect, useContext } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check if user is logged in on page load
//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     const storedToken = localStorage.getItem('token');
    
//     if (storedUser && storedToken) {
//       setUser(JSON.parse(storedUser));
//     }
//     setLoading(false);
//   }, []);

//   // Login Function
//   const login = async (email, password) => {
//     try {
//       const response = await fetch('https://job-portal-system-f2im.onrender.com/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Login failed');
//       }

//       // Save to local storage and state
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('user', JSON.stringify(data.user));
//       setUser(data.user);
//       return { success: true };
//     } catch (error) {
//       return { success: false, message: error.message };
//     }
//   };

//   // Register Function
//   const register = async (name, email, password) => {
//     try {
//       const response = await fetch('https://job-portal-system-bd3u.onrender.com/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, email, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Registration failed');
//       }

//       // Automatically login after register
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('user', JSON.stringify(data.user));
//       setUser(data.user);
//       return { success: true };
//     } catch (error) {
//       return { success: false, message: error.message };
//     }
//   };

//   // Logout Function
//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//     window.location.href = '/login';
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout, loading }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

// ✅ Single URL used everywhere — change only this one line if URL changes
const API_URL = import.meta.env.VITE_API_URL || "https://job-portal-system-bd3u.onrender.com/api";

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser  = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || 'Login failed' };

      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch {
      return { success: false, message: 'Network error — check your connection' };
    }
  };

  // ── REGISTER ───────────────────────────────────────────────────────────────
  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || 'Registration failed' };

      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch {
      return { success: false, message: 'Network error — check your connection' };
    }
  };

  // ── LOGOUT ─────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // ── UPDATE USER PROFILE (used in Profile.jsx after saving) ─────────────────
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);