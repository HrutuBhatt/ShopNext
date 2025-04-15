import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({children})=>{
    const [userId, setUserId] = useState(null);
    return (
        <UserContext.Provider value={{userId, setUserId}}>
            {children}
        </UserContext.Provider>
    );
}

// Custom hook for easy usage

export const useUser =()=> useContext(UserContext);