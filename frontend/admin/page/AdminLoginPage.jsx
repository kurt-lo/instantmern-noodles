import { useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from '../context/AdminAxiosConfig';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import AdminHeader from "../component/AdminHeader";

const AdminLoginPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('/api/admin/login', {
        email,
        password,
      });

      const data = await response.data;
      if (data.token) {
        localStorage.setItem('authAdminToken', data.token);
        alert('Login successful!')
        setEmail('');
        setPassword('');
        navigate('/admin/home');
      } else {
        setEmail('');
        setPassword('');
        toast.error('Invalid Email or Password!');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
    }
    window.location.reload(true) //para marefresh yung header kasi hindi nagrerefresh e
  }

  return (
    <>
      <AdminHeader />
      <section className="mt-[10rem]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-[40%] mx-auto rounded-[25px] gap-[2rem] py-[2rem] pt-[3rem]"
        >
          <div>
            <h1>Admin Login</h1>
          </div>
          <div className="flex items-center gap-[2rem] w-[80%] mx-auto">
            <FaUser className="text-[1.5rem]" />
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
          >Login Admin</button>
        </form>
      </section>
    </>
  );
};

export default AdminLoginPage;