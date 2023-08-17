import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getCsrfToken } from 'next-auth/react';
import { SigninMessage } from '@/utils/signInMessage';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { supabaseAuth } from '@/lib/supabaseAuth';
import { supabase } from '@/lib/supabaseClient';

// Checking user in database
async function checkUserInDatabase(publicKey) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('public_key', publicKey)
    .single();

  if (error) throw error;

  return data;
}

// Creating user in database
async function createUserInDatabase(signinMessage) {
  const { data, error } = await supabase
    .from('users')
    .insert({
      public_key: signinMessage.publicKey,
    })
    .single();

  if (error) throw error;

  return data;
}

// Creating account in database (indicating Solana as the provider)
async function createAccountInDatabase(userId, publicKey) {
  const { data, error } = await supabase
    .from('next_auth.accounts')
    .insert([
      {
        type: 'wallet',
        provider: 'Solana',
        providerAccountId: publicKey,
        userId: userId,
      },
    ])
    .single();

  if (error) throw error;

  return data;
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const providers = [
    CredentialsProvider({
      name: 'Solana',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
        },
        signature: {
          label: 'Signature',
          type: 'text',
        },
      },
      async authorize(credentials, req) {
        try {
          const signinMessage = new SigninMessage(
            JSON.parse(credentials?.message || '{}'),
          );
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL);
          if (signinMessage.domain !== nextAuthUrl.host) {
            return null;
          }
          const csrfToken = await getCsrfToken({ req: { ...req, body: null } });

          if (signinMessage.nonce !== csrfToken) {
            return null;
          }

          const validationResult = await signinMessage.validate(
            credentials?.signature || '',
          );

          if (!validationResult)
            throw new Error('Could not validate the signed message');

          let user = await checkUserInDatabase(signinMessage.publicKey)
            .then(res => {
              console.log('found user in database', res);
            })
            .catch(err => {
              console.log('err, trying to create a new user', err);
              let newUser = createUserInDatabase(signinMessage)
                .then(res => {
                  console.log('created a new user', res);
                })
                .catch(err => {
                  console.log(
                    'err failed to create a new user',
                    err,
                    signinMessage,
                  );
                });
            });

          return {
            id: signinMessage.publicKey,
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ];

  const isDefaultSigninPage =
    req.method === 'GET' && req.query.nextauth?.includes('signin');

  // Hides Sign-In with Solana from the default sign page
  if (isDefaultSigninPage) {
    providers.pop();
  }

  return await NextAuth(req, res, {
    providers,
    session: {
      strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, token }) {
        // @ts-ignore
        session.publicKey = token.sub;
        if (session.user) {
          session.user.name = token.sub;
          session.user.image = `https://ui-avatars.com/api/?name=${token.sub}&background=random`;
        }
        return session;
      },
    },
    // adapter: SupabaseAdapter({
    //   url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    //   secret: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    // }),
  });
}
