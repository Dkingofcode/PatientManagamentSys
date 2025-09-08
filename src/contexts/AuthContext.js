import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const login = async (identifier, password) => {
        setLoading(true);
        setError(null);
        try {
            // const response = await axios.post('https://pms-backend-postgresql.onrender.com/api/auth/login', {
            //   identifier,
            //   password,
            // });
            // const response = await axios.post(
            //   "https://pms-backend-postgresql.onrender.com/api/auth/login",
            //   {
            //     identifier,
            //     password,
            //   }
            // );
            const response = await axios.post("http://localhost:8000/api/auth/login", {
                identifier,
                password,
            });
            const { user, token } = response.data;
            setUser(user);
            setToken(token);
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            console.log(token);
            console.log(user);
            console.log("Attempting login", { identifier, password });
            return true;
        }
        catch (err) {
            setError(err.response?.data?.message || "Login failed");
            return false;
        }
        finally {
            setLoading(false);
        }
    };
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login"; // Redirect to login page
    };
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            }
            catch {
                logout();
            }
        }
    }, []);
    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
        error,
        setUser,
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
