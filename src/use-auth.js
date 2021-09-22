import React, { useState, useContext, createContext } from "react";

const axios = require('axios').default;
const authContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
  
// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
    return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {

    const [user, setUser] = useState(false);
    const [jwt, setJWT] = useState('')
  
    const signin = async (username, password) => {

        try{
            let responseData = await axios.post('http://localhost:5000/auth/login', {
                username: username,
                password: password
            });
            setUser(true)
            setJWT(responseData.data)
            localStorage.setItem('jwt', responseData.data)
            return responseData.data
        }catch(error){
            return error.response.data;
        }

    };
  
    const signup = (username, displayname, password) => {

    };
  
    const signout = () => {
        setUser(false)
        setJWT('')
        localStorage.removeItem('jwt')
    };
  
    const checkAuth = async () => {
        try{
            await axios.get(`http://localhost:5000/user/profile`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('jwt')}` 
                }
            })
            setUser(true)
        }catch(error){
            setUser(false)
        }
    }

    // Return the user object and auth methods
    return {
        user,
        jwt,
        signin,
        signup,
        signout,
        checkAuth
    };
}