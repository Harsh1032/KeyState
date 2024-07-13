import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {useSelector} from 'react-redux';
import { FaSearch } from 'react-icons/fa';

const Header = () => {
    
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    //setting the search term 
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    //getting the search term
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className='bg-[#1f1f1f] h-[100px] pt-4 shadow-md'>
        <div className=' flex justify-between items-center max-w-6xl mx-auto p-3'>
            <Link to='/home'>
                <div className=' border border-white w-[100px] sm:w-[150px]  p-2 font-bold text-sm sm:text-xl text-center shadow-md'>
                    <span className='text-gray-300 text-sm sm:text-xl'>KeyState</span>
                </div>
            </Link>
            <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
                <input 
                    type='text' placeholder='Search...' 
                    className='bg-transparent focus:outline-none w-24 sm:w-64'
                    value = {searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value) }
                />
                <button>
                    <FaSearch className='text-slate-600' />
                </button>
            </form>
            <ul className='flex gap-8'>
                <Link to='/home'><li className='hidden sm:inline text-white hover:underline hover:font-semibold'>Home</li></Link>
                <Link to='/profile'>
                    {currentUser ? (
                        <img  className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile' />
                    ) : (
                        <li className='hidden sm:inline text-white hover:underline hover:font-semibold'> Sign In</li>
                    )}
                </Link>
            </ul>
        </div>
    </header>
  )
}

export default Header