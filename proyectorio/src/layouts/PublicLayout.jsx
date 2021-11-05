import React from 'react';
import Navbar from '../componets/NavBar';
import Footer from '../componets/Footer';

const PublicLayout = ({ children }) => {
  return (
    <div className='flex flex-col justify-between h-screen'>
      <Navbar />
      <main className='h-full w-full overflow-auto'>{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
