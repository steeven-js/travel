import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';

import { useAuth } from 'src/hooks/auth';
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import { NavBasicDesktop } from 'src/components/nav-basic';

import NavMobile from './nav/mobile';
import { HEADER } from '../config-layout';
import Searchbar from '../common/searchbar';
import HeaderShadow from '../common/header-shadow';
import SettingsButton from '../common/settings-button';

// ----------------------------------------------------------------------

export default function Header({ headerOnDark }) {
  const theme = useTheme();
  const offset = useOffSetTop();
  const mdUp = useResponsive('up', 'md');
  const { logout, user } = useAuth();

  const data = user
    ? [
        {
          title: 'Home',
          icon: <Iconify icon="solar:home-2-bold-duotone" />,
          path: '/',
        },
      ]
    : [
        {
          title: 'Home',
          icon: <Iconify icon="solar:home-2-bold-duotone" />,
          path: '/',
        },
        { title: 'Login', path: '/auth/login-background' },
        { title: 'Register', path: '/auth/register-background' },
      ];

  const renderContent = (
    <>
      <Box sx={{ lineHeight: 0, position: 'relative' }}>
        <Logo />
      </Box>

      <>
        <Stack
          flexGrow={1}
          alignItems="center"
          sx={{
            display: { xs: 'none', md: 'flex' },
          }}
        >
          <NavBasicDesktop
            slotProps={{
              rootItem: {
                '& .icon': { display: 'none' },
              },
            }}
            data={data}
          />
        </Stack>

        <Box sx={{ flexGrow: { xs: 1, md: 'unset' } }} />
      </>

      <Stack spacing={2} direction="row" alignItems="center" justifyContent="flex-end">
        <Stack spacing={1} direction="row" alignItems="center">
          <Searchbar />
          <SettingsButton />
        </Stack>

        {user && (
          <Button
            variant="contained"
            color="inherit"
            onClick={logout}
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

      {!mdUp && (
        <NavMobile
          data={[
            {
              title: 'Home',
              icon: <Iconify icon="solar:home-2-bold-duotone" />,
              path: '/',
            },
            { title: 'Login', path: '/auth/login' },
            { title: 'Register', path: '/auth/register-background' },
            { title: 'Logout', path: '/logout' },
          ]}
        />
      )}
    </>
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
          {renderContent}
        </Container>
      </Toolbar>

      {offset && <HeaderShadow />}
    </AppBar>
  );
}

Header.propTypes = {
  headerOnDark: PropTypes.bool,
};
