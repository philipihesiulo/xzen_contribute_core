import { supabase } from '@/lib/supabaseClient';
import { SolanaWeb3Credentials } from '@supabase/supabase-js';

export const signInWithSolana = async (wallet: any | SolanaWeb3Credentials) => {
  try {
    if (!wallet.connected || !wallet.publicKey) {
      throw new Error('Wallet not connected or public key not available.');
    }

    const address = wallet.publicKey.toBase58();

    const message = `Sign in to Xzenlabs Contribute with wallet ${address} at ${new Date().toISOString()}`;

    const { data, error } = await supabase.auth.signInWithWeb3({
      chain: 'solana',
      statement: message,
      wallet
    });

    if (error) {
      throw new Error(error.message);
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