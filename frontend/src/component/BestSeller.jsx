import React, { useEffect, useState } from 'react'
import axios from 'axios'

const BestSeller = () => {

  const [bestSeller, setBestSeller] = useState()
  axios.defaults.withCredentials = true
  useEffect(() => {
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(`/api/users/best-selling`)
        setBestSeller(response.data)
        // console.log(response.data)
      } catch (error) {
        console.error(`Error fetching best seller product ${error}`)
      }
    }

    fetchBestSeller();
  }, [])

  //for image render and turn uploads\\image to this -> uploads/image para mabasa ng ayos
  const imageRender = (imagePath) => `https://mern-stack-backend-kappa.vercel.app/${imagePath.replace(/\\/g, '/')}`;

  return (
    <section className='w-100% sm:w-[90%] mx-auto mt-[1rem] sm:mt-[3rem] px-[2rem] py-[3rem]'>
      <div>
        <div className='flex justify-center'>
          {bestSeller && (
            <>
              <div className='pt-[4rem]'>
                <h1 className='text-[2rem] font-[700] pb-[.7rem]'>Our Best Selling Noodles!</h1>
                <p className='text-[1.3rem] font-[500]'>{bestSeller.name}</p>
                <p className='font-[500] text-slate-700'>{bestSeller.description}</p>
                <p className='text-[1.1rem] font-[500] text-green-300'>${bestSeller.price}</p>
              </div>
              <div className=''>
                {bestSeller.imagePath && (
                  <img 
                  src={imageRender(bestSeller.imagePath)}
                  alt={bestSeller.name}
                  className='h-[400px] w-[500px] object-contain'
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default BestSeller