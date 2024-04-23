import React, { useState } from 'react';
import SignUpOwner from './SignUpOwner';
import SignUpAgent from './SignUpAgent';

const SignUp = () => {
  const [signupType, setSignupType] = useState('');

  const handleSignupTypeSelect = (type) => {
    setSignupType(type);
  };

  return (
    <div className="w-full h-screen overflow-y-scroll no-scrollbar bg-gray-100 flex flex-col justify-center items-center ">
      {!signupType ? (
        <>
          <h1 className="text-4xl font-bold mb-4">Join as Property Owner or Agent</h1>
          <div className="flex space-x-10 mt-5">
            <button
              onClick={() => handleSignupTypeSelect('owner')}
              className={`transition ease-in-out hover:-translate-y-1 hover:scale-110 px-4 py-2 border border-gray-400 w-[250px] h-[200px] rounded-md font-semibold 
              text-xl text-black hover:border-[#000] hover:text-[#000]`}
            >
              List your Property? Join as an Owner
            </button>
            <button
              onClick={() => handleSignupTypeSelect('agent')}
              className={`transition ease-in-out hover:-translate-y-1 hover:scale-110 px-4 py-2 border border-gray-400 w-[250px] h-[200px] rounded-md font-semibold 
              text-xl text-black hover:border-[#000] hover:text-[#000]`}
            >
              List your Property? Join as an Agent
            </button>
          </div>
        </>
      ) : (
        <SignupForm signupType={signupType} setSignupType={setSignupType} />
      )}
    </div>
  );
};

const SignupForm = ({ signupType, setSignupType }) => {

    
    const handleSwitchSignupType = () => {
        setSignupType(signupType === 'owner' ? 'agent' : 'owner');
      };
    
      return (
        <div className='w-full h-screen '>
          <div className='p-3 max-w-lg mx-auto '>
              {signupType === 'owner' ? <SignUpOwner handleSwitchSignupType = {handleSwitchSignupType} signupType = {signupType}/>:<SignUpAgent handleSwitchSignupType = {handleSwitchSignupType} signupType = {signupType}/>} 
          </div>          
        </div>
  );
};

export default SignUp;
