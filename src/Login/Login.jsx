/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
import './style.scss';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../use-auth';

function Login() {
  const auth = useAuth();
  const history = useHistory();

  // Error state
  const [errors, setErrors] = useState([]);

  // State and logic to change form display
  const [form, setForm] = useState('Login');
  const handleFormSwitch = (type) => {
    setForm(type);
  };
  // State and logic for login in form input vals
  const [loginUser, setLoginUser] = useState('');
  const handleLoginUser = (e) => {
    setLoginUser(e.target.value);
  };
  const [loginPassword, setLoginPassword] = useState('');
  const handleLoginPassword = (e) => {
    setLoginPassword(e.target.value);
  };

  // Form validation
  const validateLogin = () => {
    const localErrors = [];
    if (loginUser.length === 0) {
      localErrors.push('Email must be provided');
    }
    if (loginPassword.length === 0) {
      localErrors.push('Password must be provided');
    }
    if (localErrors.length) {
      setErrors(localErrors);
      return true;
    }
    setErrors([]);
    return false;
  };

  // Form submission
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    if (validateLogin()) return;

    const signIn = await auth.signin(loginUser, loginPassword);
    if (typeof signIn === 'object') {
      setErrors([signIn.message]);
    }
  };

  useEffect(() => {
    auth.checkAuth();
  }, [auth]);

  useEffect(() => {
    if (auth.user) {
      history.push('/');
    }
  }, [auth.user, history]);

  return (
    <div className="login-wrap">
      <main>

        <div className="main-head">
          <h1>
            {form}
            {' '}
            Form
          </h1>
        </div>

        <div className="toggle">
          <div
            onKeyDown={() => { handleFormSwitch('Login'); }}
            onClick={() => { handleFormSwitch('Login'); }}
            className={`tog-option ${form === 'Login' ? 'active' : ''}`}
          >
            login
          </div>
        </div>

        <form
          onSubmit={handleSubmitLogin}
          style={{ display: form === 'Login' ? 'block' : 'none' }}
          className="login"
        >
          <input type="email" onInput={handleLoginUser} value={loginUser} name="email" placeholder="email" required="required" />
          <input type="password" onInput={handleLoginPassword} value={loginPassword} name="password" placeholder="password" required="required" />
          <button type="submit">Login</button>
        </form>

        <div className="errors">
          <ul>
            {errors.map((error, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={index}>
                *
                {error}
                {' '}
                *
              </li>
            ))}
          </ul>
        </div>

      </main>
    </div>
  );
}

export default Login;
