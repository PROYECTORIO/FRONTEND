import React from 'react';
import Sidebar from '../componets/Sidebar';
import PrivateRoute from 'componets/PrivateRoute';

const PrivateLayout = ({ children }) => {
  return (
    <PrivateRoute>
      <div className='flex w-screen h-screen'>
        <div className='flex flex-nowrap h-full w-full'>
          <Sidebar />
          <main className='bg-white flex w-full  overflow-auto items-center justify-center pr-0 '>
            {children}
          </main>
        </div>
      </div>
    </PrivateRoute> 
  );
};

export default PrivateLayout;
