import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className=' p-5 w-full h-screen flex flex-col justify-center items-center bg-black text-white'>
        <TypeAnimation
          sequence={[
          // Same substring at the start will only be typed out once, initially
          'Keystate',
          500,
          'KeyEstate: Your Gateway to Effortless Property Management',
          1000,
          'KeyEstate: Streamlining Real Estate Management',
          1000
        ]}
        wrapper="span"
        speed={50}
        style={{ 
          fontSize: '45px', 
          display: 'inline-block', 
          color: 'white'
        }}
        repeat={Infinity}
      />
    <Link to='/home'><button type="submit" className="w-[200px] h-[60px] text-xl mt-10 rounded-md border border-gray-400 bg-transparent hover:border-[#0ea5e9] hover:text-[#0ea5e9]  text-white font-semibold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">Get Started</button></Link>
    </div>
  )
}

export default LandingPage