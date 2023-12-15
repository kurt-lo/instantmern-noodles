import React, { useEffect, useState } from 'react'
import Header from '../component/Header'
import axios from 'axios';

const CartPage = () => {

    const [carts, setCarts] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(`/api/users/cart`);
                setCarts(response.data.items);
            } catch (error) {
                console.error(`Error fetching cart ${error}`)
            }
        }

        fetchCart();
    }, []);

    //for image render and turn uploads\\image to this -> uploads/image para mabasa ng ayos
    const imageRender = (cart) => `http://localhost:9999/${cart.imagePath.replace(/\\/g, '/')}`;

    return (
        <>
            <Header />
            <section className='text-slate-800'>
                <div className='pt-[2rem] px-[30rem]'>
                    <h1 className='text-center font-[700] text-[3.5rem]'>
                        Cart List
                    </h1>
                    <div className='py-[3rem]'>
                        {carts.map((cart) => (
                            <div key={cart._id} className='relative flex items-center gap-[5rem] hover:shadow-xl relative rounded-xl py-[1rem]'>
                                {cart.imagePath && (
                                    <div className='pl-[2rem]'>
                                        <img
                                            src={imageRender(cart)}
                                            alt={cart.name}
                                            className='h-[100px] w-[100px] object-contain'
                                        />
                                    </div>
                                )}
                                <p className='absolute text-[1.1rem] font-[500] top-[1.5rem] right-[1.5rem]'>
                                    {cart.quantity}x
                                </p>
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
                </div>
            </section>
        </>
    )
}

export default CartPage