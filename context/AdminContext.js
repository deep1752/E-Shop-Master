
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


const AdminContext = createContext();


export const AdminProvider = ({ children }) => {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState('');


  useEffect(() => {
    // Check localStorage for existing session
    const storedAdmin = localStorage.getItem('admin_user');
    const storedToken = localStorage.getItem('admin_token');
    if (storedAdmin && storedToken) {
      setAdmin(JSON.parse(storedAdmin));
      setToken(storedToken);
    }
  }, []);


  const login = (adminData, accessToken) => {
    setAdmin(adminData);
    setToken(accessToken);
    localStorage.setItem('admin', JSON.stringify(adminData));
    localStorage.setItem('admin_token', accessToken);
  };


  const logout = () => {
    setAdmin(null);
    setToken('');
    localStorage.removeItem('admin');
    localStorage.removeItem('admin_token');
    router.push('/admin'); // redirect to login
  };


  const isAdminAuthenticated = !!admin;


  return (
    <AdminContext.Provider value={{ admin, token, login, logout, isAdminAuthenticated }}>
      {children}
    </AdminContext.Provider>
  );
};


export const useAdmin = () => useContext(AdminContext);




