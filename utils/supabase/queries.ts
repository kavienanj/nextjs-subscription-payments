import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

export const getSubscription = cache(async (supabase: SupabaseClient) => {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  return subscription;
});

export const getProducts = cache(async (supabase: SupabaseClient) => {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });

  return products;
});

export const getUserDetails = cache(async (supabase: SupabaseClient) => {
  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single();
  return userDetails;
});

export const updateUserFullName = async (supabase: SupabaseClient, fullName: string) => {
  const userDetails = await getUserDetails(supabase);
  const { error } = await supabase.from('users').update({
    full_name: fullName,
  }).eq('id', userDetails!.id);
  return { error };
}
