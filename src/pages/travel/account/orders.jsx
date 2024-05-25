import { Helmet } from 'react-helmet-async';

import EcommerceAccountOrdersView from 'src/sections/_travel/view/ecommerce-account-orders-view';

// ----------------------------------------------------------------------

export default function EcommerceAccountOrdersPage() {
  return (
    <>
      <Helmet>
        <title> E-commerce: Account Orders</title>
      </Helmet>

      <EcommerceAccountOrdersView />
    </>
  );
}
