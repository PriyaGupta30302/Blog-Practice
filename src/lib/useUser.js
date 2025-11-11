// lib/useUser.js
'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export function useUser() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        setProfile(data);
        setIsAdmin(data?.role === 'admin');
      }
    }
    load();
  }, []);

  return { user, profile, isAdmin };
}
