/* eslint-disable no-useless-catch */
/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
import useSWR from 'swr'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';

import axios from 'src/lib/axios'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const navigate = useNavigate();
  const params = useParams();

  const { data: user, error, mutate } = useSWR('/api/user', () =>
    axios
      .get('/api/user')
      .then(res => res.data)
      .catch(error => {
        if (error.response.status !== 409) throw error
        mutate('/verify-email')
      }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false
    }
  )

  const fetchCsrfToken = async () => {
    await axios.get('/sanctum/csrf-cookie')
  }

  const handleApiError = (error, setErrors) => {
    if (error.response && error.response.status === 422) {
      setErrors(Object.values(error.response.data.errors).flat())
    } else {
      throw error
    }
  }

  const register = async ({ setErrors, ...props }) => {
    await fetchCsrfToken()
    setErrors([])
    try {
      await axios.post('/register', props)
      mutate()
    } catch (error) {
      handleApiError(error, setErrors)
    }
  }

  const login = async ({ setErrors, setStatus, ...props }) => {
    await fetchCsrfToken()
    setErrors([])
    setStatus(null)
    try {
      await axios.post('/login', props)
      mutate()
    } catch (error) {
      handleApiError(error, setErrors)
    }
  }

  const forgotPassword = async ({ setErrors, setStatus, email }) => {
    await fetchCsrfToken()
    setErrors([])
    setStatus(null)
    try {
      const response = await axios.post('/forgot-password', { email })
      setStatus(response.data.status)
    } catch (error) {
      handleApiError(error, setErrors)
    }
  }

  const resetPassword = async ({ setErrors, setStatus, ...props }) => {
    await fetchCsrfToken()
    setErrors([])
    setStatus(null)
    try {
      const response = await axios.post('/reset-password', { token: params.token, ...props })
      navigate(`/login?reset=${btoa(response.data.status)}`)
    } catch (error) {
      handleApiError(error, setErrors)
    }
  }

  const resendEmailVerification = async ({ setStatus }) => {
    try {
      const response = await axios.post('/email/verification-notification')
      setStatus(response.data.status)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await axios.post('/logout')
      mutate()
    } catch (error) {
      throw error
    }
    window.location.pathname = '/'
  }

  useEffect(() => {
    if (middleware === 'guest' && redirectIfAuthenticated && user) navigate(redirectIfAuthenticated)
    if (middleware === 'auth' && error) logout()
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
