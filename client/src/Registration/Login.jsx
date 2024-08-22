import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useDispatch, useSelector} from 'react-redux';
import { LoginStart, LoginSuccess, LoginFailure } from '../redux/user/userSlice';

const Login = () => {

    const [formData, setFormData] = useState({});
    const { loading, error } = useSelector((state) => state.user);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //stroing the data entered by users
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };
    //registering Agents
    const loginUser = async (e) => {
        e.preventDefault();
        // Handle form submission
        try {
            dispatch(LoginStart());
            const res = await fetch('https://keystate-1.onrender.com/login', {
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
                dispatch(LoginFailure(errorMessage));
            } else {
                const data = await res.json();
                dispatch(LoginSuccess(data));
                localStorage.setItem('user:token', data.token);
                setFormData({});
                navigate('/home'); // Navigate only on successful registration
            }
        } catch (error) {
          dispatch(LoginFailure(error.response.data.error));     
        }

    };
  return (
    <div  className="w-full h-screen overflow-y-scroll no-scrollbar bg-gray-100 flex flex-col justify-center items-center" >
        <div className='w-full h-screen '>
          <div className='p-3 max-w-lg mx-auto '>
            <form onSubmit={loginUser} className="flex flex-col gap-4">
                <h1 className="text-3xl text-center font-semibold">Sign IN</h1>
                <select type="text" id="role" name="name" placeholder = "Role" required className="p-3 rounded-lg border border-gray-400 hover:border-[#1f1f1f]" onChange={handleChange}>
                    <option className ='p-3 rounded-lg border border-gray-400 hover:border-[#1f1f1f]' value="">-- Select --</option>
                    <option className ='p-3 rounded-lg border border-gray-400 hover:border-[#1f1f1f]' value="agent">Agent</option>
                    <option className ='p-3 rounded-lg border border-gray-400 hover:border-[#1f1f1f]' value="owner">Owner</option>
                </select>
                <input type="email" id="email" name="email" placeholder = "Email" required className="p-3 rounded-lg border border-gray-400 hover:border-[#1f1f1f]" onChange={handleChange}/>
                <input type="password" id="password" placeholder='Password' name="password" required className="p-3 rounded-lg border border-gray-400 hover:border-[#1f1f1f]" onChange={handleChange}/>
                <button disabeld={loading} type="submit" className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85">
                    {loading ? 'Loading...' : 'SIGN IN'}
                </button>
                <div className='flex justify-between mt-1 '>
                    <Link to='/signUp'><p className=' text-black text-lg font-medium  hover:underline transition ease-in-out delay-150 duration-300 cursor-pointer'> Dont have an account? Sign Up</p></Link>
                </div>
                {/* {error && <div className='text-red-600'>{error}</div>} */}
            </form> 
            <ToastContainer />
            </div>          
        </div>
    </div>
  ) 
}

export default Login