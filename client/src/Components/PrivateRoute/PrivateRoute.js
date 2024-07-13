import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = () => {
    const {currentUser} = useSelector((state) => state.user);

  return (
    <div className='w-full h-screen overflow-y-scroll no-scrollbar'>  
        {/*  so if user is not authenticated it will take them to login otherwise to their account */}
        { currentUser ? <Outlet/> : <Navigate to ='/login'/>}
    </div>
  )
}

export default PrivateRoute