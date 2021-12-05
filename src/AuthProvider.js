import React, { useState, createContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const signIn = () => {
        setIsLoggedIn(true)
    };

    const signOut = () => {
        setIsLoggedIn(false)
    };

    const value = {
        isLoggedIn,
        signIn,
        signOut
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export default AuthContext;
