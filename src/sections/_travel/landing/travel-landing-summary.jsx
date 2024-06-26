import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { fShortenNumber } from 'src/utils/format-number';

import Image from 'src/components/image';
import CountUp from 'src/components/count-up';

// ----------------------------------------------------------------------

const SUMMARY = [
  {
    total: 130,
    description: 'Billets d\'avion vendus',
    icon: '/assets/icons/travel/ic_travel_tickets.svg',
  },
  {
    total: 196,
    description: 'Circuits réservés',
    icon: '/assets/icons/travel/ic_travel_booking.svg',
  },
  {
    total: 10670,
    description: 'Visiteurs du site',
    icon: '/assets/icons/travel/ic_travel_site_visitors.svg',
  },
  {
    total: 877,
    description: 'Hôtels vérifiés',
    icon: '/assets/icons/travel/ic_travel_verified_hotels.svg',
  },
];

// ----------------------------------------------------------------------

export default function TravelLandingSummary() {
  return (
    <Container
      sx={{
        textAlign: 'center',
        py: { xs: 5, md: 10 },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          mx: 'auto',
          maxWidth: 480,
          mb: { xs: 8, md: 10 },
        }}
      >
        <Typography variant="h2">Réservez rapidement plus de 52 circuits incroyables</Typography>

        <Typography sx={{ color: 'text.secondary' }}>
          Profitez de notre plateforme facile et rapide pour découvrir les trésors des Caraïbes.
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 8, md: 3 },
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
        }}
      >
        {SUMMARY.map((value) => (
          <Stack key={value.description} spacing={1}>
            <Image
              alt={value.icon}
              src={value.icon}
              sx={{ mb: 3, width: 80, height: 80, mx: 'auto' }}
            />

            <Typography variant="h3">
              <CountUp
                start={value.total / 5}
                end={value.total}
                formattingFn={(newValue) => fShortenNumber(newValue)}
              />
            </Typography>

            <Typography sx={{ color: 'text.secondary' }}> {value.description} </Typography>
          </Stack>
        ))}
      </Box>
    </Container>
  );
}
