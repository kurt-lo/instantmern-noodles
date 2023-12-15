import React, { useEffect, useState } from 'react'
import Header from '../component/Header'
import axios from 'axios';

const OrderPage = () => {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`/api/users/order`);
                setOrders(response.data)
                // console.log(response.data)
            } catch (error) {
                console.error(`Error fetching order ${error}`)
            }
        }
        fetchOrder();
    }, [])

    const imageRender = (cart) => `http://localhost:9999/${cart.imagePath.replace(/\\/g, '/')}`;

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <>
            <Header />
            <section className='text-slate-800'>
                <div className='pt-[2rem] 2xl:px-[30rem] xl:px-[20rem] md:px-[5rem] sm:px-0'>
                    <h1 className='text-center font-[700] text-[3.5rem]'>
                        Completed Order
                    </h1>
                    <div className='py-[3rem]'>
                        {orders.map((order) => (
                            <div key={order._id}>
                                <h2>Order ID: {order._id}</h2>
                                {order.items.map((item) => (
                                    <div key={item._id}>
                                        <p>Order: {item.name}</p>
                                        {/* para marender yung description kasi nested */}
                                        <p>Description: {item.itemId && item.itemId.description}</p>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Price: ₱{item.price}</p>
                                        {item.imagePath && (
                                            <img 
                                            src={imageRender(item)} 
                                            alt={item.name} 
                                            className='h-[100px] w-[100px] object-contain'
                                            />
                                        )}

                                    </div>
                                ))}
                                <p>Total Amount: {order.totalAmount}</p>
                                <p>Created At: {formatDate(order.createdAt)}</p>
                                {order.deliveryDetails.map((delivery) => (
                                    <div key={delivery._id}>
                                        <p>Name: {delivery.name}</p>
                                        <p>Address: {delivery.address}</p>
                                        <p>Phone Number: {delivery.phoneNumber}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default OrderPage