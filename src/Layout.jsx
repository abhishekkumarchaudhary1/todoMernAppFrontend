import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <>
      <Header isAuthenticated={isAuthenticated} />
      <Outlet context={{ isAuthenticated, setIsAuthenticated }} />
      <Footer />
    </>
  );
}

export default Layout;
