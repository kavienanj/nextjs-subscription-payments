'use server';

import { redirect } from 'next/navigation';
import { getErrorRedirect, getStatusRedirect } from 'utils/helpers';
import { createClerkSupabaseSSRClient } from '../supabase/ssr_client';
import { updateUserFullName } from '../supabase/queries';

export async function redirectToPath(path: string) {
  return redirect(path);
}

export async function updateName(formData: FormData) {
  // Get form data
  const fullName = String(formData.get('fullName')).trim();

  const supabase = createClerkSupabaseSSRClient();
  const { error } = await updateUserFullName(supabase, fullName);

  if (error) {
    return getErrorRedirect(
      '/account',
      'Hmm... Something went wrong.',
      'Your name could not be updated.'
    );
  } else {
    return getStatusRedirect(
      '/account',
      'Success!',
      'Your name has been updated.'
    );
  }
}
