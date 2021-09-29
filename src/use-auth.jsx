/* eslint-disable react/prop-types */
import React, { useState, useContext, createContext } from 'react';

const axios = require('axios').default;

const authContext = createContext();

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => useContext(authContext);

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(false);
  const [jwt, setJWT] = useState('');

  const signin = async (username, password) => {
    try {
      const responseData = await axios.post('https://top-blog-jr.herokuapp.com/auth/login', {
        username,
        password,
      });
      setUser(true);
      setJWT(responseData.data);
      localStorage.setItem('jwt', responseData.data);
      return responseData.data;
    } catch (error) {
      return error;
    }
  };

  const signout = () => {
    setUser(false);
    setJWT('');
    localStorage.removeItem('jwt');
  };

  const checkAuth = async () => {
    try {
      await axios.get('https://top-blog-jr.herokuapp.com/user/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
      setUser(true);
    } catch (error) {
      setUser(false);
    }
  };

  // Return the user object and auth methods
  return {
    user,
    jwt,
    signin,
    signout,
    checkAuth,
  };
}

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
