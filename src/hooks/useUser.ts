"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { UserProfile } from '@/types/user';
import { useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';

export const useUser = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const { data, isLoading, error } = useQuery<UserProfile | null>({
    queryKey: ['user', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!user,
  });

  return { user: data, isLoading, error };
};