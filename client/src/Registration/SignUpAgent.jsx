import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUpAgent = ({handleSwitchSignupType, signupType}) => {

    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    //stroing the data entered by users
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    //registering Agents
    const registerAgent = async (e) => {
        e.preventDefault();
        // Handle form submission
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8000/signUpAgent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            if (res.status === 400) {
                // Extract error message from response JSON
                const errorData = await res.json();
                const errorMessage = errorData.error;
                // Show toast notification for the error message
                toast.error(errorMessage);
                setLoading(false);
            } else {
                const data = await res.json();
                setLoading(false);
                setFormData({});
                navigate('/home'); // Navigate only on successful registration
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error);
                setLoading(false);
            } else {
                setError(toast.error('An unexpected error occurred'));
                setLoading(false);
            }
        }

    };
  return (
    <>
        <form onSubmit={registerAgent} className="flex flex-col gap-4">
            <h1 className="text-3xl text-center font-semibold">Agent Signup Form</h1>
            <input type="text" id="firstName" name="name" placeholder = "First Name" required className="p-3 rounded-lg border border-gray-400 hover:border-[#1f1f1f]" onChange={handleChange}/>
            <input type="text" id="lastName" name="name" placeholder = " Last Name" required className="p-3 rounded-lg border border-gray-400 hover:border-[#1f1f1f]" onChange={handleChange}/>     
            <input type="text" id="agencyName" name="name" placeholder = " Agency Name" required className="p-3 rounded-lg border border-gray-400 hover:border-[#1f1f1f]" onChange={handleChange}/>
            <input type="email" id="email" name="email" placeholder = "Email" required className="p-3 rounded-lg border border-gray-400 hover:border-[#1f1f1f]" onChange={handleChange}/>
            <input type="password" id="password" placeholder='Password' name="password" required className="p-3 rounded-lg border border-gray-400 hover:border-[#1f1f1f]" onChange={handleChange}/>
            <input type="password" id="confirmPassword" placeholder='Confirm Password' name="password" required className="p-3 rounded-lg border border-gray-400 hover:border-[#1f1f1f]" onChange={handleChange}/>
            <button disabeld={loading} type="submit" className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85">
                {loading ? 'Loading...' : 'Sign Up'}
            </button>
            <div className='flex justify-between mt-1 '>
                <Link to='/login'><p className=' text-black text-lg font-medium  hover:underline transition ease-in-out delay-150 duration-300 cursor-pointer'> Already have an account?</p></Link>
                <button  onClick={handleSwitchSignupType} className="text-black text-lg font-medium  hover:underline transition ease-in-out delay-150 duration-300 cursor-pointer">Switch to {signupType === 'owner' ? 'Agent' : 'Owner'}</button>
            </div>
            {error && <div className='text-red-600'>{error}</div>}
        </form> 
        <ToastContainer />
    </>
  ) 
}

export default SignUpAgent