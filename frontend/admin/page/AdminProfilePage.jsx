import React, { useState, useEffect } from 'react'
import AdminHeader from '../component/AdminHeader'
import { toast } from 'react-toastify';
import { FaUserEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
// import axios from '../context/AdminAxiosConfig'
import axios from 'axios' // para ma fetch instead na adminaxiosconfig

const AdminProfilePage = () => {
  const [adminData, setAdminData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {

      try {
        const response = await axios.get('/api/admin/profile');
        setAdminData(response.data)
      } catch (error) {
        console.error(`Error fetching admin data: ${error}`)
      }
    };

    fetchAdminData();
  }, [])

  const handleSubmit = async () => {
    try {
      const response = await axios.put('/api/admin/profile', {
        name,
        email,
        password,
        confirmPassword
      });
      setAdminData(response.data);
      alert('Update profile successful!')
      window.location.reload(true)
      setIsModalOpen(false);
    } catch (error) {
      if (password !== confirmPassword) {
        toast.error('Password don\'t match!');
      }
      if (password.length < 8 || confirmPassword.length < 8) {
        toast.error('Password needs atleast 8 characters!');
      }
      setEmail('');
      setName('');
      setPassword('');
      setConfirmPassword('');
      console.error(`Error updating admin data: ${error}`)
    }
  }

  return (
    <>
      <AdminHeader />
      <section className='section-profile mt-[5rem] w-[90%] md:[50%] lg:w-[60%] xl:w-[40%] mx-auto px-[4rem] py-[2rem] rounded-[10px] text-slate-800'>
        <div className='relative'>
          <h1 className='text-center text-2xl font-bold mb-4'>Admin Profile Information</h1>
          <FaUserEdit className='absolute text-[1.5rem] right-0 -top-0 cursor-pointer'
            onClick={() => setIsModalOpen(true)}
          />
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-800 bg-opacity-25 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-2 rounded-[15px] py-[2rem] w-[40%]">
              <div className='relative'>
                <h1 className="font-semibold text-center text-xl text-slate-800 pb-[1.5rem]">
                  Update Profile Info
                </h1>
                <IoMdClose className='absolute text-[1.5rem] right-3 -top-0 cursor-pointer'
                  onClick={() => setIsModalOpen(false)}
                />
              </div>
              <div className="flex flex-col gap-[1.5rem]">
                <div className='flex items-center gap-[2rem] w-[80%] mx-auto'>
                  <FaUser className="text-[1.5rem]" />
                  <input
                    type="text"
                    className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
                    placeholder={adminData.name}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className='flex items-center gap-[2rem] w-[80%] mx-auto'>
                  <MdEmail className="text-[1.5rem]" />
                  <input
                    type="email"
                    className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
                    placeholder={adminData.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className='flex items-center gap-[2rem] w-[80%] mx-auto'>
                  <RiLockPasswordFill className="text-[1.5rem]" />
                  <input
                    type="password"
                    className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
                    placeholder='********'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className='flex items-center gap-[2rem] w-[80%] mx-auto'>
                  <RiLockPasswordFill className="text-[1.5rem]" />
                  <input
                    type="password"
                    className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
                    placeholder='********'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="text-center">
                <button className="mt-[1.5rem] py-[.5rem] px-[3rem] border-solid border-2 border-slate-800 rounded-[25px] font-[700] hover:bg-slate-800 hover:text-gray-300"
                  onClick={handleSubmit}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
        {/* <div className='flex justify-between'>
                <h1 className='text-center text-2xl font-bold mb-4'>Profile Information</h1>
                <FaUserEdit className='text-[1.5rem]' />
            </div> */}
        {adminData ? (
          <div className='text-lg'>
            <p className='pt-[.7rem]'><span className='font-semibold'>Name:</span> {adminData.name}</p>
            <p className='pt-[.7rem]'><span className='font-semibold'>Email:</span> {adminData.email}</p>
          </div>
        ) : (
          <div className='text-lg'>
            <p>Loading admin data...</p>
          </div>
        )}
      </section>
    </>
  )
}

export default AdminProfilePage