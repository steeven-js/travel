/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
import useSWR from 'swr';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import axios from 'src/lib/axios';

const API_USER = '/api/user';
const API_REGISTER = '/register';
const API_LOGIN = '/login';
const API_FORGOT_PASSWORD = '/forgot-password';
const API_RESET_PASSWORD = '/reset-password';
const API_EMAIL_VERIFICATION = '/email/verification-notification';
const API_LOGOUT = '/logout';

const HTTP_STATUS_UNPROCESSABLE_ENTITY = 422;
const HTTP_STATUS_CONFLICT = 409;

const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const navigate = useNavigate();
  const params = useParams();

  const { data: user, error, mutate } = useSWR(API_USER, () =>
    axios.get(API_USER)
      .then(res => res.data)
      .catch(error => {
        if (error.response.status !== HTTP_STATUS_CONFLICT) throw error
        mutate('/verify-email')
      })
  );

  const csrf = async () => {
    await axios.get('/sanctum/csrf-cookie');
  }

  const handleErrors = (error, setErrors) => {
    if (error.response.status !== HTTP_STATUS_UNPROCESSABLE_ENTITY) throw error
    setErrors(Object.values(error.response.data.errors).flat())
  };

  const register = async ({ setErrors, ...props }) => {
    await csrf();
    setErrors([]);
    try {
      await axios.post(API_REGISTER, props);
      mutate();
    } catch (error) {
      handleErrors(error, setErrors);
    }
  }

  const login = async ({ setErrors, setStatus, ...props }) => {
    await csrf();
    setErrors([]);
    setStatus(null);
    try {
      await axios.post(API_LOGIN, props);
      mutate();
    } catch (error) {
      handleErrors(error, setErrors);
    }
  }

  const forgotPassword = async ({ setErrors, setStatus, email }) => {
    await csrf();
    setErrors([]);
    setStatus(null);
    try {
      const response = await axios.post(API_FORGOT_PASSWORD, { email });
      setStatus(response.data.status);
    } catch (error) {
      handleErrors(error, setErrors);
    }
  }

  const resetPassword = async ({ setErrors, setStatus, ...props }) => {
    await csrf();
    setErrors([]);
    setStatus(null);
    try {
      const response = await axios.post(API_RESET_PASSWORD, { token: params.token, ...props });
      navigate(`/login?reset=${btoa(response.data.status)}`);
    } catch (error) {
      handleErrors(error, setErrors);
    }
  }

  const resendEmailVerification = ({ setStatus }) => {
    axios.post(API_EMAIL_VERIFICATION)
      .then(response => setStatus(response.data.status));
  }

  const logout = async () => {
    if (!error) {
      await axios.post(API_LOGOUT);
      mutate();
    }
    window.location.pathname = '/';
  }

  useEffect(() => {
    if (middleware === 'guest' && redirectIfAuthenticated && user) navigate(redirectIfAuthenticated);
    if (middleware === 'auth' && error) logout();
  }, [user, error])

  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout
  }
}

export default useAuth;
