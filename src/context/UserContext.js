import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({children})=>{
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 
    //because context variable is not persistent for refresh, we can use localStorage to store user data
    // and rehydrate it when the app loads
    useEffect(() => {
        // Attempt to rehydrate user from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setLoading(false);
      }, []);

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <UserContext.Provider value={{userId, setUserId, user, setUser, logout, loading}}>
            {children}
        </UserContext.Provider>
    );
}

// Custom hook for easy usage

export const useUser =()=> useContext(UserContext);