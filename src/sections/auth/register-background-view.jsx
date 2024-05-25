import axios from 'axios';
import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { createUserWithEmailAndPassword } from "firebase/auth";

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { auth } from "../../../firebase";

// ----------------------------------------------------------------------

export default function RegisterBackgroundView() {
  const passwordShow = useBoolean();
  const navigate = useNavigate();

  const confirmPasswordShow = useBoolean();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const RegisterSchema = Yup.object().shape({
    fullName: Yup.string()
      .required('Full name is required')
      .min(6, 'Mininum 6 characters')
      .max(15, 'Maximum 15 characters'),
    email: Yup.string().required('Email is required').email('That is not an email'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password should be of minimum 6 characters length'),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], "Passwords don't match"),
  });

  const defaultValues = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const apiUrl = import.meta.env.VITE_CUSTOMER_API_URL;

  const onSubmit = handleSubmit(async (data) => {
    try {

      // Clear previous error messages
      setEmailError('');
      setPasswordError('');

      await createUserWithEmailAndPassword(auth, data.email, data.password);

      if (auth.currentUser) {
        await axios.post(apiUrl, {
          uid: auth.currentUser.uid,
          email: data.email,
        });
      }

      console.log('User created successfully!');

      reset();

      navigate("/");

    } catch (error) {
      console.error('Erreur de connexion :', error.message);

      // Display error messages based on the type of error
      if (error.code === 'auth/invalid-email') {
        setEmailError('Adresse e-mail invalide');
      } else if (error.code === 'auth/email-already-in-use') {
        setEmailError('Adresse e-mail déjà utilisée');
      } else if (error.code === 'auth/invalid-credential') {
        setPasswordError('Mot de passe incorrect');
      } else if (error.code === 'auth/too-many-requests') {
        setPasswordError('Trop de tentatives de connexion infructueuses. Réessayez plus tard');
      }
    }
  });

  const renderHead = (
    <div>
      <Typography variant="h3" paragraph>
        Get Started
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {`Already have an account? `}
        <Link
          component={RouterLink}
          href={paths.loginBackground}
          variant="subtitle2"
          color="primary"
        >
          Login
        </Link>
      </Typography>
    </div>
  );

  const renderSocials = (
    <Stack direction="row" spacing={2}>
      <Button fullWidth size="large" color="inherit" variant="outlined">
        <Iconify icon="logos:google-icon" width={24} />
      </Button>

      <Button fullWidth size="large" color="inherit" variant="outlined">
        <Iconify icon="carbon:logo-facebook" width={24} sx={{ color: '#1877F2' }} />
      </Button>

      <Button color="inherit" fullWidth variant="outlined" size="large">
        <Iconify icon="carbon:logo-github" width={24} sx={{ color: 'text.primary' }} />
      </Button>
    </Stack>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        <RHFTextField name="fullName" label="Full Name" />

        <RHFTextField
          name="email"
          label="Email address"
          value={methods.watch('email')}
        />
        {emailError && (<Typography variant="body2" sx={{ color: 'error.main' }}>{emailError}</Typography>)}

        <RHFTextField
          name="password"
          label="Password"
          type={passwordShow.value ? 'text' : 'password'}
          value={methods.watch('password')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={passwordShow.onToggle} edge="end">
                  <Iconify icon={passwordShow.value ? 'carbon:view' : 'carbon:view-off'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {passwordError && (<Typography variant="body2" sx={{ color: 'error.main' }}>{passwordError}</Typography>)}

        <RHFTextField
          name="confirmPassword"
          label="Confirm Password"
          type={confirmPasswordShow.value ? 'text' : 'password'}
          value={methods.watch('confirmPassword')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={confirmPasswordShow.onToggle} edge="end">
                  <Iconify icon={confirmPasswordShow.value ? 'carbon:view' : 'carbon:view-off'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {passwordError && (<Typography variant="body2" sx={{ color: 'error.main' }}>{passwordError}</Typography>)}

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Register
        </LoadingButton>

        <Typography variant="caption" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
          {`I agree to `}
          <Link color="text.primary" href="#" underline="always">
            Terms of Service
          </Link>
          {` and `}
          <Link color="text.primary" href="#" underline="always">
            Privacy Policy.
          </Link>
        </Typography>
      </Stack>
    </FormProvider>
  );

  return (
    <>
      {renderHead}

      {renderForm}

      <Divider>
        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
          or continue with
        </Typography>
      </Divider>

      {renderSocials}
    </>
  );
}
