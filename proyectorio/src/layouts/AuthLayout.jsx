import React from 'react';
import NavAuth from '../componets/NavbarAuth';
import Footer from '../componets/Footer'
import '../styles/styles.css';


const AuthLayout = ({ children }) => {
  return (
    <div className='flex flex-col justify-between h-screen'>
      <NavAuth />
      <main className='h-full w-full overflow-y-scroll bg-black'>{children}</main>
      <Footer />
    </div>
  );
};

export default AuthLayout;