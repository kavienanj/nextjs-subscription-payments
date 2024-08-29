import Pricing from '@/components/ui/Pricing/Pricing';
import {
  getProducts,
  getSubscription,
} from '@/utils/supabase/queries';
import { createClerkSupabaseSSRClient } from '@/utils/supabase/ssr_client';

export default async function PricingPage() {
  const supabase = createClerkSupabaseSSRClient();
  const [products, subscription] = await Promise.all([
    getProducts(supabase),
    getSubscription(supabase)
  ]);

  return (
    <Pricing
      products={products ?? []}
      subscription={subscription}
    />
  );
}
