import React, { useEffect, useState } from 'react'
import axios from 'axios'

const BestSeller = () => {

  const [bestSeller, setBestSeller] = useState([])

  useEffect(() => {
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(`/api/users/best-selling`)
        setBestSeller(response.data)
        console.log(response.data)
      } catch (error) {
        console.error(`Error fetching best seller product ${error}`)
      }
    }

    fetchBestSeller();
  }, [])

  //for image render and turn uploads\\image to this -> uploads/image para mabasa ng ayos
  const imageRender = (product) => `http://localhost:9999/${product.imagePath.replace(/\\/g, '/')}`;

  // Check if bestSeller is an array, if not, convert it to an array
  const bestSellerArray = Array.isArray(bestSeller) ? bestSeller : [bestSeller];

  return (
    <section className='w-100% sm:w-[90%] mx-auto mt-[1rem] sm:mt-[3rem] px-[2rem] py-[3rem]'>
      <div>
        <h1>Our Best Selling Noodles!</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {bestSellerArray.map((product) => (
            <div key={product._id} className='bg-white p-4 rounded shadow'>
              <img
                src={imageRender(product)}
                alt={product.name}
                className='w-full h-32 object-cover mb-4'
              />
              <h2 className='text-xl font-bold mb-2'>{product.name}</h2>
              <p className='text-gray-700 mb-2'>{product.description}</p>
              <p className='text-lg font-bold text-green-500'>${product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BestSeller