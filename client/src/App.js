import React from 'react';
import LandingPage from './Components/LandingPage/LandingPage';
import {Routes, Route} from 'react-router-dom';
import SignUp from './Registration/SignUp';
import Login from './Registration/Login';
import Home from './Components/Home/Home';
import Profile  from './Registration/Profile';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import CreateListing from './CreateListing/CreateListing';
import Header from './Components/Header/Header';
import UpdateListing from './UpdateListing/UpdateListing';
import Listing from './Listing/Listing';
import Search from './Components/Search/Search';
const App = () => {
  return (
    <>
      <Header/>
      <Routes>
        <Route path = '/' element={<LandingPage/>}/>
        <Route path = '/signUp' element={<SignUp/>}/>
        <Route path = '/login' element={<Login/>}/>
        <Route path = '/home' element={<Home/>}/>
        <Route path = '/search' element={<Search/>}/>
        <Route path = '/listing/:listingId' element={<Listing/>}/>
        <Route element = {<PrivateRoute/>}>
          <Route path = '/profile' element={<Profile/>}/>
          <Route path = '/create-listing' element={<CreateListing/>}/>
          <Route path = '/update-listing/:listingId' element={<UpdateListing/>}/>
        </Route>
      </Routes> 
    </>
  )
}

export default App;
