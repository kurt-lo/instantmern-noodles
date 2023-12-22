import React, { useEffect, useState } from 'react';
import Header from '../component/Header';
import axios from 'axios'
import { FaShoppingCart } from "react-icons/fa";
import { toast } from 'react-toastify';

const HomePage = () => {

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get('/api/users/products');
        setProducts(response.data);
      } catch (error) {
        console.error(`Error fetching product ${error}`)
      }
    }

    fetchProduct();
  }, []);

  const addToCart = async (productId) => {
    try {
      const response = await axios.post(`api/users/cart/${productId}`)
      // console.log(response.data);
      toast.success(`Added to cart!`);
    } catch (error) {
      console.error(`Error adding to cart ${error}`)
    }
  }

  //for image render and turn uploads\\image to this -> uploads/image para mabasa ng ayos
  const imageRender = (product) => `http://localhost:9999/${product.imagePath.replace(/\\/g, '/')}`;

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.price.toString().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <Header />
      <main className='text-slate-800'>
        <div className='pt-[2rem] px-[5rem]'>
          <h1 className='text-center font-[700] text-[3.5rem]'>Product List</h1>
          <input
            type="text"
            placeholder='Search Product'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='absolute right-0 mr-[10%] font-[500] px-[1rem] py-[.3rem] rounded-md'
          />
          <div className='grid gap-1 sm:grid-cols-2 xl:grid-cols-4 pt-[4rem] pb-[3rem] text-center'>
            {filteredProducts.map((product) => (
              <div key={product._id} className='border-2 border-solid border-slate-50 hover:shadow-xl relative rounded-xl py-[1rem]'>
                <p className='text-[1.5rem] font-[600]'>
                  {product.name}
                </p>
                {product.imagePath && (
                  <div className='flex justify-around'>
                    <img
                      src={imageRender(product)}
                      alt={product.name}
                      className='h-[200px] w-[300px] object-contain'
                    />
                  </div>
                )}
                <p className='text-[1.1rem] font-[500]'>
                  {product.description}
                </p>
                <p className='font-[500]'>
                  ₱{product.price}
                </p>
                <FaShoppingCart className='absolute bottom-[2rem] right-[2rem] text-[2rem] text-yellow-600 cursor-pointer hover:text-slate-800'
                  onClick={() => addToCart(product._id)}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage;
