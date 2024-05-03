/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
import useSWR from 'swr';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import axios from 'src/lib/axios';

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const navigate = useNavigate();
  const params = useParams();

  const { data: user, error, mutate } = useSWR('/api/user', () =>
    axios
      .get('/api/user')
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) throw error;
        mutate('/verify-email');
      }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );

  // Intercepteur pour synchroniser automatiquement le jeton CSRF
  axios.interceptors.request.use(async (config) => {
    await axios.get('/sanctum/csrf-cookie');
    return config;
  });

  const register = async ({ setErrors, ...props }) => {
    setErrors([]);
    axios
      .post('/register', props)
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 422) throw error;
        setErrors(Object.values(error.response.data.errors).flat());
      });
  };

  const login = async ({ setErrors, setStatus, ...props }) => {
    setErrors([]);
    setStatus(null);
    axios
      .post('/login', props)
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 422) throw error;
        setErrors(Object.values(error.response.data.errors).flat());
      });
  };

  const forgotPassword = async ({ setErrors, setStatus, email }) => {
    setErrors([]);
    setStatus(null);
    axios
      .post('/forgot-password', { email })
      .then((response) => setStatus(response.data.status))
      .catch((error) => {
        if (error.response.status !== 422) throw error;
        setErrors(Object.values(error.response.data.errors).flat());
      });
  };

  const resetPassword = async ({ setErrors, setStatus, ...props }) => {
    setErrors([]);
    setStatus(null);
    axios
      .post('/reset-password', { token: params.token, ...props })
      .then((response) => navigate(`/login?reset=${btoa(response.data.status)}`))
      .catch((error) => {
        if (error.response.status !== 422) throw error;
        setErrors(Object.values(error.response.data.errors).flat());
      });
  };

  const resendEmailVerification = ({ setStatus }) => {
    axios
      .post('/email/verification-notification')
      .then((response) => setStatus(response.data.status));
  };

  const logout = async () => {
    if (!error) {
      await axios.post('/logout');
      mutate();
    }
    window.location.pathname = '/';
  };

  useEffect(() => {
    if (middleware === 'guest' && redirectIfAuthenticated && user) navigate(redirectIfAuthenticated);
    if (middleware === 'auth' && error) logout();
  }, [user, error]);

  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
  };
};
