import PropTypes from 'prop-types';
import { signOut } from '@firebase/auth';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { useAuth } from 'src/hooks/use-auth';
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';

import Logo from 'src/components/logo';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { NavBasicDesktop } from 'src/components/nav-basic';

import NavMobile from './nav/mobile';
import { auth } from '../../../firebase';
import { HEADER } from '../config-layout';
import HeaderShadow from '../common/header-shadow';
import SettingsButton from '../common/settings-button';

// ----------------------------------------------------------------------

export default function Header({ headerOnDark }) {
  const theme = useTheme();

  const offset = useOffSetTop();

  const mdUp = useResponsive('up', 'md');

  const navigation = useNavigate();

  // Logout function
  const handleLogout = () => {
    signOut(auth).then(() => {
      navigation.navigate("/");
      console.log("Déconnexion réussie");
    }).catch((error) => {
      console.error("Erreur de déconnexion:", error);
    });
  }

  // Auth check
  const { user, loading } = useAuth();

  const navData = user ? (
    [
      {
        title: 'Home',
        icon: <Iconify icon="solar:home-2-bold-duotone" />,
        path: '/',
      },
      { title: 'Account', path: '#' }, // Remplacer 'Logout' par votre chemin de déconnexion
      {
        title: 'Docs',
        icon: <Iconify icon="solar:notebook-bold-duotone" />,
        path: paths.docs,
      },
    ]
  ) : (
    [
      {
        title: 'Home',
        icon: <Iconify icon="solar:home-2-bold-duotone" />,
        path: '/',
      },
      { title: 'Login', path: paths.loginBackground },
      { title: 'Register', path: paths.registerBackground },
      {
        title: 'Docs',
        icon: <Iconify icon="solar:notebook-bold-duotone" />,
        path: paths.docs,
      },
    ]
  );

  return (
    <AppBar>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          transition: theme.transitions.create(['height', 'background-color'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(headerOnDark && {
            color: 'common.white',
          }),
          ...(offset && {
            ...bgBlur({ color: theme.palette.background.default }),
            color: 'text.primary',
            height: {
              md: HEADER.H_DESKTOP - 16,
            },
          }),
        }}
      >
        <Container
          sx={{
            height: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ lineHeight: 0, position: 'relative' }}>
            <Logo />

            <Link href="https://zone-docs.vercel.app/changelog" target="_blank" rel="noopener">
              <Label
                color="info"
                sx={{
                  ml: 0.5,
                  px: 0.5,
                  top: -14,
                  left: 60,
                  height: 20,
                  fontSize: 11,
                  cursor: 'pointer',
                  position: 'absolute',
                }}
              >
                v1.0.0
              </Label>
            </Link>
          </Box>

          {mdUp && (
            <Stack
              flexGrow={1}
              alignItems="center"
              sx={{
                display: { xs: 'none', md: 'flex' },
              }}
            >
              {!loading && (
                <NavBasicDesktop
                  slotProps={{
                    rootItem: {
                      '& .icon': { display: 'none' },
                    },
                  }}
                  data={navData}
                />
              )}
            </Stack>
          )}

          <Box sx={{ flexGrow: { xs: 1, md: 'unset' } }} />

          <Stack spacing={2} direction="row" alignItems="center" justifyContent="flex-end">
            <Stack spacing={1} direction="row" alignItems="center">
              {/* <Searchbar /> */}

              <SettingsButton />
            </Stack>

            {auth.currentUser && (
              <Button
                variant="contained"
                color="inherit"
                onClick={handleLogout}
                target="_blank"
                rel="noopener"
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                }}
              >
                Logout
              </Button>
            )}
          </Stack>

          {!mdUp && !loading && (
            <NavMobile
              data={navData}
            />
          )}
        </Container>
      </Toolbar>

      {offset && <HeaderShadow />}
    </AppBar>
  );
}


Header.propTypes = {
  headerOnDark: PropTypes.bool,
};
