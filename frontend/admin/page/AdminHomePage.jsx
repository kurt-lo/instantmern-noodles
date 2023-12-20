import React, { useState, useEffect } from 'react'
import AdminHeader from '../component/AdminHeader'
import axios from 'axios';
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { MdFoodBank } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";
import { IoIosPricetags } from "react-icons/io";
import { GoFileSubmodule } from "react-icons/go";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const AdminHomePage = () => {

  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [files, setFiles] = useState(null);
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/admin/products`);
        // console.log(response.data)
        setProducts(response.data);
      } catch (error) {
        console.error(`Error fetching admin product ${error}`)
      }
    };

    fetchProduct();
  }, [])

  const imageUpload = (e) => {
    // console.log(e.target.files)
    setFiles(e.target.files[0])
  }

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('files', files);

      const response = await axios.post(`/api/admin/products`, formData)
      setProducts([...products, response.data]);
      alert('Product added successfully!')
      setIsModalOpen(false);
      setName('');
      setDescription('');
      setPrice('');
      setFiles(null);
    } catch (error) {
      console.error(`Error adding admin product ${error}`)
    }
  }

  const handleUpdateProduct = async (id) => {
    try {
      const updatedProductData = {
        name,
        description,
        price,
        files,
      };

      const formData = new FormData();
      formData.append('name', updatedProductData.name);
      formData.append('description', updatedProductData.description);
      formData.append('price', updatedProductData.price);
      if (updatedProductData.files) {
        formData.append('files', updatedProductData.files);
      }

      const response = await axios.put(`/api/admin/products/${id}`, formData);
      const updatedProducts = products.map((product) => (product._id === id ? response.data : product));
      setProducts(updatedProducts);
      alert('Product updated successfully!');
      setUpdateModalOpen(false);
      setName('');
      setDescription('');
      setPrice('');
      setFiles(null);
    } catch (error) {
      console.error(`Error updating product ${error}`);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`/api/admin/products/${id}`);
      const updatedProducts = products.filter((product) => product._id !== id);
      setProducts(updatedProducts);
      alert('Product deleted successfully!');
    } catch (error) {
      console.error(`Error delete specific user data: ${error}`)
    }
  };

  // to render the image
  const imageRender = (product) => `http://localhost:9999/${product.imagePath.replace(/\\/g, '/')}`;

  // to search product
  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase()) ||
      product.price.toString().includes(search.toLowerCase())
    )
  })

  return (
    <>
      <AdminHeader />
      <section className='text-slate-800'>
        <div className='pt-[2rem] px-[5rem]'>
          <h1 className='text-center font-[700] text-[3.5rem]'>Product List</h1>
          <div className='absolute right-0 flex items-center gap-[2rem]' style={{ marginRight: '5rem' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search Product'
              className=' font-[500] px-[1rem] py-[.3rem] rounded-md'
            />
            <MdOutlineProductionQuantityLimits
              onClick={() => setIsModalOpen(true)}
              className='text-[2rem] cursor-pointer border-2 border-solid border-slate-800 rounded-md'
            />
          </div>
          <div className='grid sm:grid-cols-2 xl:grid-cols-4 gap-[1.5rem] pt-[4rem] pb-[3rem] text-center'>
            {filteredProducts.map((product) => (
              <div key={product._id} className='hover:shadow-xl relative rounded-xl py-[1rem]'>
                <div className='absolute flex right-0' style={{ marginRight: '1rem', marginTop: '.7rem' }}>
                  <FaUserEdit className='text-[1.5rem] update-icon cursor-pointer'
                    onClick={() => setUpdateModalOpen(product._id)}
                  />
                  <MdDelete className='text-[1.5rem] delete-icon cursor-pointer'
                    onClick={() => handleDeleteProduct(product._id)}
                  />
                </div>
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
        {/* MODAL FOR ADDING PRODUCT */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-800 bg-opacity-25 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-2 rounded-[15px] py-[2rem] w-[40%]">
              <div className='relative'>
                <h1 className="text-center text-xl text-slate-800 pb-[1.5rem] font-[700]">
                  ADD PRODUCT
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Product Name"
                    className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
                  />
                </div>
                <div className='flex items-center gap-[2rem] w-[80%] mx-auto'>
                  <IoDocumentText className="text-[1.5rem]" />
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Product Description"
                    className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
                  />
                </div>
                <div className='flex items-center gap-[2rem] w-[80%] mx-auto'>
                  <IoIosPricetags className="text-[1.5rem]" />
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Product Price"
                    className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
                  />
                </div>
                <div className='flex items-center gap-[2rem] w-[80%] mx-auto'>
                  <GoFileSubmodule className="text-[1.5rem]" />
                  <input
                    type="file"
                    name='file'
                    onChange={imageUpload}
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
        {/* Modal and Map for each product update */}
        {products.map((product) => (
          <div key={product._id}>
            {updateModalOpen === product._id && (
              <div className="fixed inset-0 bg-slate-800 bg-opacity-25 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white p-2 rounded-[15px] py-[2rem] w-[40%]">
                  <div className='relative'>
                    <h1 className="font-[700] text-center text-xl text-slate-800 pb-[1.5rem]">
                      Product Info
                    </h1>
                    <IoMdClose className='absolute text-[1.5rem] right-3 -top-0 cursor-pointer'
                      onClick={() => setUpdateModalOpen(false)}
                    />
                  </div>
                  <div className="flex flex-col gap-[1.5rem]">
                    <div className='flex items-center gap-[2rem] w-[80%] mx-auto'>
                      <MdFoodBank className="text-[1.5rem]" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={product.name}
                        className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
                      />
                    </div>
                    <div className='flex items-center gap-[2rem] w-[80%] mx-auto'>
                      <IoDocumentText className="text-[1.5rem]" />
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={product.description}
                        className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
                      />
                    </div>
                    <div className='flex items-center gap-[2rem] w-[80%] mx-auto'>
                      <IoIosPricetags className="text-[1.5rem]" />
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder={product.price}
                        className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
                      />
                    </div>
                    <div className='flex items-center gap-[2rem] w-[80%] mx-auto'>
                      <GoFileSubmodule className="text-[1.5rem]" />
                      <input
                        type="file"
                        name='file'
                        onChange={imageUpload}
                        className="py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <button className="mt-[1.5rem] py-[.5rem] px-[3rem] border-solid border-2 border-slate-800 rounded-[25px] font-[700] hover:bg-slate-800 hover:text-gray-300"
                      onClick={() => handleUpdateProduct(product._id)}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>
    </>
  )
}

export default AdminHomePage