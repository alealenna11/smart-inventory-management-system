// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {

//   const [user, setUser] = useState(null);

//   // 🔥 FORCE LOGIN EVERY TIME (FOR DEMO / SUBMISSION)
//   useEffect(() => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     localStorage.removeItem("lastActive");
//   }, []);

//   // 🔐 LOGIN
//   const login = (userData, token) => {
//     setUser(userData);

//     localStorage.setItem("user", JSON.stringify(userData));
//     localStorage.setItem("token", token);
//     localStorage.setItem("lastActive", Date.now());
//   };

//   // 🔓 LOGOUT
//   const logout = () => {
//     setUser(null);

//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     localStorage.removeItem("lastActive");

//     // 🔥 FORCE REDIRECT
//     window.location.href = "/login";
//   };

//   return (
//     <AuthContext.Provider value={{
//       user,
//       login,
//       logout
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    localStorage.setItem("lastActive", Date.now());
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("lastActive");
    window.location.href = "/login";
  };

  const updateActivity = () => {
    localStorage.setItem("lastActive", Date.now());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        updateActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);