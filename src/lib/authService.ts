import { supabase } from '@/lib/supabaseClient';
import { SolanaWeb3Credentials, User } from '@supabase/supabase-js';

export const getOrCreateUser = async (user: User) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message);
  }

  if (profile) {
    return profile;
  }

  console.log('Creating new user profile for:', user);

  const { data: newUser, error: insertError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      wallet_address: user.user_metadata.custom_claims.address,
      referral_code: Math.random().toString(36).substring(2, 12),
    })
    .select('*')
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }

  return newUser;
};

export const signInWithSolana = async (wallet: SolanaWeb3Credentials | any) => {
  try {
    if (!wallet.connected || !wallet.publicKey) {
      throw new Error('Wallet not connected or public key not available.');
    }

    const address = wallet.publicKey.toBase58();

    const message = `Sign in to Xzenlabs Contribute with wallet ${address} at ${new Date().toISOString()}`;

    const { data, error } = await supabase.auth.signInWithWeb3({
      chain: 'solana',
      statement: message,
      wallet,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      await getOrCreateUser(data.user);
    }

    return data;
  } catch (error: any) {
    console.error('Error signing in with Solana:', error.message);
    throw error;
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error.message);
    throw error;
  }
}