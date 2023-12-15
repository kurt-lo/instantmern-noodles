import React, { useEffect, useState } from 'react';
import Header from '../component/Header';
import axios from 'axios'

const HomePage = () => {

  const [products, setProducts] = useState([]);

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

  //for image render and turn uploads\\image to this -> uploads/image para mabasa ng ayos
  const imageRender = (product) => `http://localhost:9999/${product.imagePath.replace(/\\/g, '/')}`;

  return (
    <>
      <Header />
      <main className='text-slate-800'>
        <div className='pt-[2rem] px-[5rem]'>
          <h1 className='text-center font-[700] text-[3.5rem]'>Product List</h1>
          <div className='grid sm:grid-cols-2 xl:grid-cols-4  py-[3rem] text-center rounded-xl'>
            {products.map((product) => (
              <div key={product._id} className='hover:shadow-xl'>
                <p className='text-[1.5rem] font-[600]'>
                  {product.name}
                </p>
                {product.imagePath && (
                  <div className='flex justify-around'>
                    <img
                      src={imageRender(product)}
                      alt={product.name}
                      className='h-[300px] w-[400px] object-contain'
                    />
                  </div>
                )}
                <p className='text-[1.1rem] font-[500]'>
                  {product.description}
                </p>
                <p>
                  {product.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage;
