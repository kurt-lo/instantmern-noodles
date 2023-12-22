import React, { useState } from 'react'
import AdminHeader from '../component/AdminHeader'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import axios from '../context/AdminAxiosConfig'

const AdminRegisterPage = () => {

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/admin/register', {
        name,
        email,
        password,
        confirmPassword
      });

      if (response.status === 201) {
        setEmail('');
        setName('');
        setPassword('');
        setConfirmPassword('');
        alert('Register successful!')
        navigate('/admin/login');
      } else {
        setEmail('');
        setName('');
        setPassword('');
        setConfirmPassword('');
        console.log('Register error!', response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error('Email already exist!');
      }
      if (password !== confirmPassword) {
        toast.error('Password don\'t match!');
      }
      if (password.length < 8 || confirmPassword.length < 8){
        toast.error('Password needs atleast 8 characters!');
      }
      setEmail('');
      setName('');
      setPassword('');
      setConfirmPassword('');
      console.error('Error during registration:', error)
    }
  };

  return (
    <>
      <AdminHeader />
      <section className="mt-[10rem] text-slate-800">
        <form
          onSubmit={handleRegister}
          className='flex flex-col items-center w-[40%] mx-auto rounded-[25px] gap-[2rem] pb-[2rem] pt-[3rem]'
        >
          <h1 className="text-[2rem] font-[700]">Howdy Admin, Register!</h1>
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
          <div className="flex items-center gap-[2rem] w-[80%] mx-auto">
            <RiLockPasswordFill className="text-[1.5rem]" />
            <input type="password" value={confirmPassword} placeholder='Enter Password' onChange={(e) => setConfirmPassword(e.target.value)}
              className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
            />
          </div>
          <button type="submit"
            className="py-[.5rem] px-[3rem] border-solid border-2 border-slate-800 rounded-[25px] font-[700] hover:bg-slate-800 hover:text-gray-300"
          >Register</button>
        </form>
      </section>
    </>
  )
}

export default AdminRegisterPage