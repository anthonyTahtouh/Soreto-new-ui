'use client';

import { useEffect, useMemo, useState } from 'react';
import constants from '../shared/constants';
import { User } from '../types/user';
import Context from './Context';
import LoginService from '../service/LoginService';

const StoreProvider = ({ children }: { children: JSX.Element }) => {
  const authInfo = localStorage.getItem('authInfo');
  let cacheCurrentUser = null;
  if (authInfo) {
    cacheCurrentUser = JSON.parse(authInfo);
  }
  const [user, setUser] = useState<User | null>(
    cacheCurrentUser ? cacheCurrentUser.currentUser : cacheCurrentUser,
  );
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(
    !cacheCurrentUser,
  );

  const logout = async () => {
    setIsAuthLoading(false);
    setUser(null);
    localStorage.clear();

    if (window.location.pathname.includes('login')) return;
    
    window.location.href = '/auth/login';

    try {
      await LoginService.logOut();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Finding for a user logged if exist, set the user in const 'user' and so
    // the property isAuthenticated got o true.
    const validatesCurrentUser = async () => {
      try {
        const currentUser = await LoginService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem('authInfo', JSON.stringify({ currentUser }));
        }
      } catch (err) {
        setUser(null);
        logout();
        console.log(err);
      } finally {
        setIsAuthLoading(false);
      }
    };
    validatesCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    await LoginService.login(email, password);
    const currentUser = await LoginService.getCurrentUser();

    if (
      currentUser
      && currentUser.roles.some(
        (s: any) => s.name === constants.ROLES.CLIENT_USER
          || s.name === constants.ROLES.ADMIN,
      )
    ) {
      setUser(currentUser);
      localStorage.setItem('authInfo', JSON.stringify({ currentUser }));

      if (currentUser.roles.some((s: { name: string; }) => s.name === 'admin')) {
        window.location.href = '/';
      }
    } else {
      await logout();

      throw new Error('Invalid email or password');
    }
  };

  const userContext = useMemo(
    () => ({
      isAuthenticated: !!user,
      user,
      isAuthLoading,
      login,
      logout,
    }),
    [user],
  );

  return <Context.Provider value={userContext}>{children}</Context.Provider>;
};

export default StoreProvider;
