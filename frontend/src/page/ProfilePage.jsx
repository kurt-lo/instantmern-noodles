import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaUserEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import Header from '../component/Header';

const ProfilePage = () => {

    const [userData, setUserData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {

            try {
                const response = await axios.get('api/users/profile');
                setUserData(response.data)
            } catch (error) {
                console.error(`Error fetching user data: ${error}`)
            }
        };

        fetchUserData();
    }, [])

    const handleSubmit = async () => {
        try {
            const response = await axios.put('api/users/profile', {
                name,
                email,
                password
            });
            setUserData(response.data);
            alert('Update profile successful!')
            window.location.reload(true)
            setIsModalOpen(false);
        } catch (error) {
            console.error(`Error updating user data: ${error}`)
        }
    }

    return (
        <>
            <Header />
            <section className='section-profile mt-[5rem] w-[50%] mx-auto px-[4rem] py-[2rem] rounded-[10px] text-slate-800'>
                <div className='relative'>
                    <h1 className='text-center text-2xl font-bold mb-4'>Profile Information</h1>
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
                                        placeholder={userData.name}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className='flex items-center gap-[2rem] w-[80%] mx-auto'>
                                    <MdEmail className="text-[1.5rem]" />
                                    <input
                                        type="email"
                                        className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
                                        placeholder={userData.email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className='flex items-center gap-[2rem] w-[80%] mx-auto'>
                                    <RiLockPasswordFill className="text-[1.5rem]" />
                                    <input
                                        type="password"
                                        className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
                                        placeholder='********'
                                        onChange={(e) => setPassword(e.target.value)}
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
                {userData ? (
                    <div className='text-lg'>
                        <p className='pt-[.7rem]'><span className='font-semibold'>Name:</span> {userData.name}</p>
                        <p className='pt-[.7rem]'><span className='font-semibold'>Email:</span> {userData.email}</p>
                    </div>
                ) : (
                    <div className='text-lg'>
                        <p>Loading user data...</p>
                    </div>
                )}
            </section>
        </>
    )
}

export default ProfilePage