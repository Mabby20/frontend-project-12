import { useMemo, useState } from 'react';
import AuthContext from './index';

const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const userName = currentUser ? { username: currentUser.username } : null;
  const [user, setUser] = useState(userName);

  const memoContext = useMemo(() => {
    const logIn = (userData) => {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser({ username: userData.username });
    };

    const logOut = () => {
      localStorage.removeItem('user');
      setUser(null);
    };

    const getAuthHeader = () => {
      const userId = JSON.parse(localStorage.getItem('user'));

      return userId && userId.token
        ? { Authorization: `Bearer ${userId.token}` }
        : {};
    };
    return {
      user,
      getAuthHeader,
      logIn,
      logOut,
    };
  }, [user]);

  return (
    <AuthContext.Provider value={memoContext}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
