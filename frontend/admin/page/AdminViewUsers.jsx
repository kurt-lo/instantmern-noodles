import React, { useEffect, useState } from 'react'
import AdminHeader from '../component/AdminHeader'
import axios from 'axios'
import { FaUserEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";

const AdminViewUsers = () => {

    const [allUserData, setAllUserData] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/admin/access-users/users');
                setAllUserData(response.data);
            } catch (error) {
                console.error(`Error fetching all user data: ${error}`)
            }

        }

        fetchUserData();
    }, [])

    const handleUpdateAllUser = async (id) => {
        try {
            const response = await axios.put(`/api/admin/access-users/users/${id}`, {
                name,
                email,
                password,
            });
            const updatedUserData = allUserData.map(user => (user._id === id ? response.data : user));
            setAllUserData(updatedUserData);
            alert('Update profile successful!')
            window.location.reload(true)
            setIsModalOpen(false);
        } catch (error) {
            console.error(`Error updating all user data: ${error}`)
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <>
            <AdminHeader />
            <section className='section-profile mt-[5rem] w-[50%] mx-auto px-[4rem] py-[2rem] rounded-[10px]'>
                <div className=''>
                    <h1 className='text-center text-2xl font-bold mb-4'>All Users Profile Information</h1>
                </div>
                {allUserData ? (
                    <div className='text-lg relative'>
                        {allUserData.map((user) => (
                            <div key={user._id} className='mb-4 ' >
                                <FaUserEdit className='absolute text-[1.5rem] cursor-pointer right-0'
                                    onClick={() => setIsModalOpen(user._id)}
                                />
                                <p className='pt-[.7rem]'>
                                    <span className='font-semibold'>Name:</span> {user.name}
                                </p>
                                <p className='pt-[.7rem]'>
                                    <span className='font-semibold'>Email:</span> {user.email}
                                </p>
                                <p className='pt-[.7rem]'>
                                    <span className='font-semibold'>Date Created:</span> {formatDate(user.createdAt)}
                                </p>
                                <p className='pt-[.7rem]'>
                                    <span className='font-semibold'>Date Updated:</span> {formatDate(user.updatedAt)}
                                </p>
                                {/* Modal for each user update */}
                                {isModalOpen === user._id && (
                                    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center">
                                        <div className="bg-white p-2 rounded-[15px] py-[2rem] w-[40%]">
                                            <div className='relative'>
                                                <h1 className="font-semibold text-center text-xl text-stone-900 pb-[1.5rem]">
                                                    User Profile Info
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
                                                        placeholder={user.name}
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                    />
                                                </div>
                                                <div className='flex items-center gap-[2rem] w-[80%] mx-auto'>
                                                    <MdEmail className="text-[1.5rem]" />
                                                    <input
                                                        type="email"
                                                        className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
                                                        placeholder={user.email}
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
                                                <button className="mt-[1.5rem] py-[.5rem] px-[3rem] border-solid border-2 border-stone-950 rounded-[25px] font-[700] hover:bg-stone-950 hover:text-gray-300"
                                                    onClick={() => handleUpdateAllUser(user._id)}
                                                >
                                                    Update
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='text-lg'>
                        <p>Loading all user data...</p>
                    </div>
                )}
            </section>
        </>
    )
}

export default AdminViewUsers