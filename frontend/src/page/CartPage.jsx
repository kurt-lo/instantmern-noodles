import React, { useEffect, useState } from 'react'
import Header from '../component/Header'
import axios from 'axios';
import { LuMinus } from "react-icons/lu";
import { LuPlus } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";

const CartPage = () => {

    const [carts, setCarts] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(`/api/users/cart`);
                setCarts(response.data.items);
                setTotalAmount(response.data.totalAmount);
                // console.log(response.data.totalAmount)
                // console.log(response.data)
            } catch (error) {
                console.error(`Error fetching cart ${error}`)
            }
        }

        fetchCart();
    }, []);

    const deleteProductInCart = async (productId) => {
        try {
            const response = await axios.delete(`api/users/cart/${productId}`)
            alert('Product removed in cart!')
            setCarts(response.data.items)
        } catch (error) {
            console.error(`Error deleting product in cart ${error}`)
        }
    }

    const reduceCart = async (productId) => {
        try {
            const response = await axios.delete(`/api/users/cart/reduce/${productId}`)
            setCarts(response.data.items);
        } catch (error) {
            console.error(`Error reducing cart ${error}`)
        }
    }

    const increaseCart = async (productId) => {
        try {
            const response = await axios.put(`/api/users/cart/increase/${productId}`)
            setCarts(response.data.items)
        } catch (error) {
            console.error(`Error increasing cart ${error}`)
        }
    }

    const handleCheckout = async () => {
        try {
            const response = await axios.post(`/api/users/order/checkout`, {
                // items: carts, hindi na need nito kasi hinahandle na ng server-side code which is sa checkout controller
                // totalAmount,
                name,
                address,
                phoneNumber,
            })
            alert('Order placed successfully!');
            setIsModalOpen(false);
            window.location.reload(true)
        } catch (error) {
            console.error(`Error checkingout the cart ${error}`)
        }
    }

    //for image render and turn uploads\\image to this -> uploads/image para mabasa ng ayos
    const imageRender = (cart) => `http://localhost:9999/${cart.imagePath.replace(/\\/g, '/')}`;

    return (
        <>
            <Header />
            <section className='text-slate-800'>
                <div className='pt-[2rem] 2xl:px-[30rem] xl:px-[20rem] md:px-[5rem] sm:px-0'>
                    <h1 className='text-center font-[700] text-[3.5rem]'>
                        Cart List
                    </h1>
                    {carts.length <= 0 ? (
                        <div className='font-[500] text-[1.5rem] py-[3rem]'>
                            No product in cart!
                        </div>
                    ) : (
                        <>
                            <div className='py-[3rem]'>
                                {carts.map((cart) => (
                                    <div key={cart._id} className='flex items-center gap-[5rem] hover:shadow-xl relative rounded-xl py-[1rem]'>
                                        {cart.imagePath && (
                                            <div className='pl-[2rem]'>
                                                <img
                                                    src={imageRender(cart)}
                                                    alt={cart.name}
                                                    className='h-[100px] w-[100px] object-contain'
                                                />
                                            </div>
                                        )}
                                        <div className='absolute flex items-center text-[1rem] gap-[.5rem] font-[500] top-[1.5rem] right-[1.5rem]'>
                                            <LuMinus className='cursor-pointer' onClick={() => reduceCart(cart.itemId)} />
                                            <span>
                                                {cart.quantity}x
                                            </span>
                                            <LuPlus className='cursor-pointer mr-[1rem]' onClick={() => increaseCart(cart.itemId)} />
                                            <MdDelete className='text-[1.2rem] text-red-900 cursor-pointer' onClick={() => deleteProductInCart(cart.itemId)} />
                                        </div>

                                        <div className='w-full'>
                                            <p className='text-[1.5rem] font-[600]'>
                                                {cart.name}
                                            </p>
                                            <p className='text-[1.1rem] font-[500]'>
                                                {cart.description}
                                            </p>
                                            <p className='font-[500]'>
                                                ₱{cart.price}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className='checkout'>
                                <div className='flex items-center justify-between px-[7rem]'>
                                    <h1 className='text-[2rem] font-[500]'>Total</h1>
                                    <p className='text-[1.5rem] font-[500]'>₱{totalAmount}</p>
                                </div>
                                <div className='px-[3rem] pt-[.5rem] float-right'>
                                    <button
                                        className='py-[.5rem] px-[3rem] border-solid border-2 border-slate-800 rounded-[25px] font-[700] hover:bg-slate-800 hover:text-gray-300'
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        Checkout
                                    </button>
                                    {isModalOpen && (
                                        <div className="fixed inset-0 bg-slate-800 bg-opacity-25 backdrop-blur-sm flex items-center justify-center">
                                            <div className="bg-white p-2 rounded-[15px] py-[2rem] w-[40%]">
                                                <div className='relative'>
                                                    <h1 className="font-semibold text-center text-xl text-slate-800 pb-[1.5rem]">
                                                        Delivery Details
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
                                                            placeholder='Enter name'
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className='flex items-center gap-[2rem] w-[80%] mx-auto'>
                                                        <IoHome className="text-[1.5rem]" />
                                                        <input
                                                            type="text"
                                                            className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
                                                            placeholder='Enter address'
                                                            value={address}
                                                            onChange={(e) => setAddress(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className='flex items-center gap-[2rem] w-[80%] mx-auto'>
                                                        <BsFillTelephoneFill className="text-[1.5rem]" />
                                                        <input
                                                            type="text"
                                                            className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
                                                            placeholder='Enter phone number'
                                                            value={phoneNumber}
                                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <button className="mt-[1.5rem] py-[.5rem] px-[3rem] border-solid border-2 border-slate-800 rounded-[25px] font-[700] hover:bg-slate-800 hover:text-gray-300"
                                                        onClick={handleCheckout}
                                                    >
                                                        Checkout
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>
    )
}

export default CartPage