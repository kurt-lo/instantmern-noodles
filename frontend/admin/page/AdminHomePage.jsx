import React, { useState, useEffect } from 'react'
import AdminHeader from '../component/AdminHeader'
import axios from 'axios';
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { MdFoodBank } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";
import { IoIosPricetags } from "react-icons/io";
import { GoFileSubmodule } from "react-icons/go";

const AdminHomePage = () => {

  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/admin/products`);
        console.log(response.data)
        setProducts(response.data);
      } catch (error) {
        console.error(`Error fetching admin product ${error}`)
      }
    };

    fetchProduct();
  }, [])

  const handleSubmit = () => {
    
  }

  // to render the image
  const imageRender = (product) => `http://localhost:9999/${product.imagePath.replace(/\\/g, '/')}`;

  return (
    <>
      <AdminHeader />
      <section className='text-slate-800'>
        <div className='pt-[2rem] px-[5rem]'>
          <h1 className='text-center font-[700] text-[3.5rem]'>Product List</h1>
          <div className='absolute right-0 mr-[10%] flex items-center gap-[2rem]'>
            <input
              type="text"
              placeholder='Search Product'
              className=' font-[500] px-[1rem] py-[.3rem] rounded-md'
            />
            <MdOutlineProductionQuantityLimits
              onClick={() => setIsModalOpen(true)}
              className='text-[2rem] cursor-pointer'
            />
          </div>
          <div className='grid sm:grid-cols-2 xl:grid-cols-4 pt-[4rem] pb-[3rem] text-center'>
            {products.map((product) => (
              <div key={product._id} className='hover:shadow-xl relative rounded-xl py-[1rem]'>
                <div>
                  <h1 className='text-[1.5rem] font-[600]'>{product.name}</h1>
                  <div className='flex justify-around'>
                    {imageRender && (
                      <img
                        src={imageRender(product)}
                        alt={product.name}
                        className='h-[300px] w-[400px] object-contain'
                      />
                    )}
                  </div>
                  <p className='text-[1.1rem] font-[500]'>{product.description}</p>
                  <p className='font-[500]'>₱{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-800 bg-opacity-25 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-2 rounded-[15px] py-[2rem] w-[40%]">
              <div className='relative'>
                <h1 className="font-semibold text-center text-xl text-slate-800 pb-[1.5rem]">
                  Add Product
                </h1>
                <IoMdClose className='absolute text-[1.5rem] right-3 -top-0 cursor-pointer'
                  onClick={() => setIsModalOpen(false)}
                />
              </div>
              <div className="flex flex-col gap-[1.5rem]">
                <div className='flex items-center gap-[2rem] w-[80%] mx-auto'>
                  <MdFoodBank className="text-[1.5rem]" />
                  <input
                    type="text"
                    placeholder="Product Name"
                    className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
                  />
                </div>
                <div className='flex items-center gap-[2rem] w-[80%] mx-auto'>
                  <IoDocumentText className="text-[1.5rem]" />
                  <input
                    type="text"
                    placeholder="Product Description"
                    className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
                  />
                </div>
                <div className='flex items-center gap-[2rem] w-[80%] mx-auto'>
                  <IoIosPricetags className="text-[1.5rem]" />
                  <input
                    type="number"
                    placeholder="Product Price"
                    className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
                  />
                </div>
                <div className='flex items-center gap-[2rem] w-[80%] mx-auto'>
                  <GoFileSubmodule className="text-[1.5rem]" />
                  <input
                    type="file"
                    className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
                  />
                </div>
              </div>
              <div className="text-center">
                <button className="mt-[1.5rem] py-[.5rem] px-[3rem] border-solid border-2 border-slate-800 rounded-[25px] font-[700] hover:bg-slate-800 hover:text-gray-300"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  )
}

export default AdminHomePage