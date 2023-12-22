import React, { useEffect, useState } from 'react';
import Header from '../component/Header';
import axios from 'axios';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`/api/users/order`);
                setOrders(response.data);
            } catch (error) {
                console.error(`Error fetching order ${error}`);
            }
        };
        fetchOrder();
    }, []);

    // to render the image
    const imageRender = (cart) => `http://localhost:9999/${cart.imagePath.replace(/\\/g, '/')}`;

    // to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // for search
    const filteredOrders = orders.filter((order) => {
        return (
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            order.deliveryDetails.some((delivery) => delivery.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    return (
        <>
            <Header />
            <section className='text-slate-800'>
                <div className='pt-[2rem] 2xl:px-[30rem] xl:px-[20rem] md:px-[5rem] sm:px-0'>
                    <h1 className='text-center font-[700] text-[3.5rem] pb-[1rem]'>
                        Completed Order
                    </h1>
                    <div className='float-right'>
                        <input
                            type="text"
                            placeholder='Search Order'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='font-[500] px-[1rem] py-[.3rem] rounded-md'
                        />
                    </div>
                    <div className='py-[3rem]'>
                        {filteredOrders.map((order) => (
                            <div key={order._id} className='mb-[1rem] p-[1rem] rounded-[15px] font-[500] border-2 border-solid border-gray-100 hover:shadow-xl hover:border-0'>
                                <h2 className='font-[700] text-[1.1rem] pb-[1rem]'>
                                    Order ID: {order._id}
                                </h2>
                                {order.items.map((item) => (
                                    <div key={item._id} className='flex pb-[1rem]'>
                                        <div>
                                            <h1 className='font-[700] text-[1.1rem]'>Order Details</h1>
                                            <p>Order Name: {item.name}</p>
                                            <p>Description: {item.itemId && item.itemId.description}</p>
                                            <p>Quantity: {item.quantity}</p>
                                            <p>Price: ₱{item.price}</p>
                                            <p>Total Amount: {order.totalAmount}</p>
                                        </div>
                                        <div className='ml-auto'>
                                            {item.imagePath && (
                                                <img
                                                    src={imageRender(item)}
                                                    alt={item.name}
                                                    className='h-[100px] w-[100px] object-contain'
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {order.deliveryDetails.map((delivery) => (
                                    <div key={delivery._id}>
                                        <h1 className='font-[700] text-[1.1rem]'>Delivery Details</h1>
                                        <p>Name: {delivery.name}</p>
                                        <p>Address: {delivery.address}</p>
                                        <p>Phone Number: {delivery.phoneNumber}</p>
                                        <p>Date Delivered: {formatDate(order.createdAt)}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default OrderPage;
