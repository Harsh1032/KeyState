import React, {useRef, useState, useEffect} from 'react';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { getDownloadURL, getStorage, ref, uploadBytesResumable,} from 'firebase/storage';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import {Link} from 'react-router-dom';

const Profile = () => {
  const {currentUser, loading, error} = useSelector((state) => state.user);
  const fileRef = useRef(null); // use for referring the choose file option to the image
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name; //always have a unique file name
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file); //tell the percentage of the upload

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const token = localStorage.getItem('user:token');
      const res = await fetch(`https://keystate.onrender.com/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        // Extract error message from response JSON
        const errorData = await res.json();
        const errorMessage = errorData.error;
        // Show toast notification for the error message
        toast.error(errorMessage);
        dispatch(updateUserFailure(errorMessage));
    } else {
        const data = await res.json();
        dispatch(updateUserSuccess(data));
        toast.success(setUpdateSuccess(true));
    }
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  }
  console.log(formData);
  //deleting user api routes
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const token = localStorage.getItem('user:token'); // Get the authentication token from localStorage or wherever it's stored
      const res = await fetch(`https://keystate.onrender.com/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the authentication token in the request headers
        },
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMessage = data.error;
        // Show toast notification for the error message
        toast.error(errorMessage);
        dispatch(deleteUserFailure(errorMessage));
        return;
      }
      // Clear the token from local storage
      localStorage.removeItem('user:token');      
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('https://keystate.onrender.com/signout');
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      localStorage.removeItem('user:token'); // Remove the token from localStorage
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const token = localStorage.getItem('user:token');
      const res = await fetch(`https://keystate.onrender.com/listings/${currentUser._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the authentication token in the request headers
        },
      });
      const data = await res.json();
      if (!res.ok) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const token = localStorage.getItem('user:token');
      const res = await fetch(`https://keystate.onrender.com/api/listing/deleteListing/${listingId}`, {
        method: 'DELETE', 
        headers: {
          'Authorization': `Bearer ${token}`, // Include the authentication token in the request headers
        },
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-4xl font-semibold text-center my-7'>
        Profile
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'/>
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt='Profile Image' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <select type="text" id="role" defaultValue = {currentUser.role} name="name" placeholder = "Role" required className="p-3 rounded-lg border border-gray-400 hover:border-[#1f1f1f]" onChange={handleChange}>
          <option className ='p-3 rounded-lg border border-gray-400 hover:border-[#1f1f1f]' value="">-- Select --</option>
          <option className ='p-3 rounded-lg border border-gray-400 hover:border-[#1f1f1f]' value="agent">Agent</option>
          <option className ='p-3 rounded-lg border border-gray-400 hover:border-[#1f1f1f]' value="owner">Owner</option>
        </select>
        <input type="email" id="email" name="email" defaultValue={currentUser.email} placeholder = "Email" className="p-3 rounded-lg border border-gray-400 hover:border-[#1f1f1f]" onChange={handleChange}/>
        <input type="password" id="password" placeholder='Password' name="password" className="p-3 rounded-lg border border-gray-400 hover:border-[#1f1f1f]" onChange={handleChange}/>
        {
          currentUser.role === 'Agent' && (
            <>
              <input type= 'text' value={`$${currentUser.accountBalance} earned through referal`} disabled className="p-3 rounded-lg border border-gray-400 hover:border-[#1f1f1f]" />
            </>  
          )
        }
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85">
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={'/create-listing'} >
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-3'>
      <span  onClick={handleDeleteUser}  className='text-black text-lg font-medium hover:underline transition ease-in-out delay-150 duration-300 cursor-pointer'> Delete Account</span>
      <span onClick={handleSignOut} className='text-black text-lg font-medium hover:underline transition ease-in-out delay-150 duration-300 cursor-pointer'> Sign Out</span>
      </div>
      <button onClick={handleShowListings} className='text-green-700 w-full'>
        Show Listings
      </button>
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error showing listings' : ''}
      </p>

      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
          </div>
        )}
      <ToastContainer />
    </div>
  )
}

export default Profile