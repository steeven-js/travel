import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import TravelTourItem from '../list/travel-tour-item';

// ----------------------------------------------------------------------

export default function TravelLandingTourFeatured({ tours }) {
  return (
    <Container
      sx={{
        py: { xs: 5, md: 10 },
      }}
    >
      <Stack spacing={3} sx={{ textAlign: 'center' }}>
        <Typography variant="h3">Circuits à la une</Typography>

        <Typography sx={{ color: 'text.secondary' }}>
          Nos circuits à la une peuvent vous aider à trouver le voyage parfait pour vous !
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          my: { xs: 8, md: 10 },
          gap: { xs: 4, md: 3 },
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
        }}
      >
        {tours.map((tour) => (
          <TravelTourItem key={tour.id} tour={tour} />
        ))}
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Button
          component={RouterLink}
          href={paths.travel.tours}
          size="large"
          variant="outlined"
          color="inherit"
        >
          Voir tous les circuits
        </Button>
      </Box>
    </Container>
  );
}

TravelLandingTourFeatured.propTypes = {
  tours: PropTypes.array,
};
