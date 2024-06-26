import { Helmet } from 'react-helmet-async';

import TravelLandingView from 'src/sections/_travel/view/travel-landing-view';

// ----------------------------------------------------------------------

export default function HomePage() {
  // console.log(import.meta.env.VITE_BACKEND_URL)
  return (
    <>
      <Helmet>
        <title> The starting point for your next project</title>
      </Helmet>

      <TravelLandingView />
    </>
  );
}
