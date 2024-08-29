import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export function createClerkSupabaseSSRClient() {
    const { getToken } = auth();

    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                // Get the Supabase token with a custom fetch method
                fetch: async (url, options = {}) => {
                    const clerkToken = await getToken({
                        template: 'supabase',
                    })

                    const headers = new Headers(options?.headers)
                    // If there is no Clerk token, call the default fetch
                    if (!clerkToken) {
                        return fetch(url, {
                            ...options,
                            headers,
                        })
                    }
                    // Insert the Clerk Supabase token into the headers
                    headers.set('Authorization', `Bearer ${clerkToken}`)

                    // Now call the default fetch
                    return fetch(url, {
                        ...options,
                        headers,
                    })
                },
            },
        },
    );
}
