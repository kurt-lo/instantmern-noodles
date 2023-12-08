import React, { useState } from 'react'
import axios from '../context/axiosConfig'
import { useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";

const RegisterPage = () => {

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('api/users/register', {
        name,
        email,
        password
      });

      if (response.status === 201) {
        setEmail('');
        setName('');
        setPassword('');
        alert('Register successful!')
        navigate('/login');
      } else {
        setEmail('');
        setName('');
        setPassword('');
        console.log('Register error!', response.data);
      }
    } catch (error) {
      setEmail('');
      setName('');
      setPassword('');
      console.error('Error during registration:', error)
    }
  };

  return (
    <section className="mt-[10rem]">
      <form
        onSubmit={handleRegister}
        className='flex flex-col items-center w-[40%] mx-auto rounded-[25px] gap-[2rem] pb-[2rem] pt-[3rem]'
      >
        <div className="flex items-center gap-[2rem] w-[80%] mx-auto">
          <FaUser className="text-[1.5rem]" />
          <input type="text" value={name} placeholder='Enter Name' onChange={(e) => setName(e.target.value)}
            className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
          />
        </div>
        <div className="flex items-center gap-[2rem] w-[80%] mx-auto">
          <MdEmail className="text-[1.5rem]" />
          <input type="email" value={email} placeholder='Enter Email' onChange={(e) => setEmail(e.target.value)}
            className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
          />
        </div>
        <div className="flex items-center gap-[2rem] w-[80%] mx-auto">
          <RiLockPasswordFill className="text-[1.5rem]" />
          <input type="password" value={password} placeholder='Enter Password' onChange={(e) => setPassword(e.target.value)}
            className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
          />
        </div>
        <button type="submit"
                    className="py-[.5rem] px-[3rem] border-solid border-2 border-stone-950 rounded-[25px] font-[700] hover:bg-stone-950 hover:text-gray-300"
        >Register</button>
      </form>
    </section>
  )
}

export default RegisterPage