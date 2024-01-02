import React from 'react'
import { feedback } from '../utils/feedback'
import { FaUserTie } from "react-icons/fa";

const Rating = () => {

  return (
    <section className='w-100% sm:w-[90%] mx-auto px-[2rem] py-[3rem]'>
      <div className='grid grid-cols-3 gap-[1rem]'>
      {feedback.map((item) => (
        <div key={item.id}>
          <div className='flex flex-col items-center rounded-md shadow-lg'>
            <h3 className='text-[1.4rem] font-[700] pb-[1rem]'>{item.customerName}</h3>
            <FaUserTie className='text-[6rem] pb-[1rem]' />
            <p className='text-[1.1rem] font-[500] text-slate-700 pb-[.5rem]'>{item.comment}</p>
            <span className='font-[500] text-[1.1rem]'>Rating: {item.rating}/5</span>
          </div>
        </div>
      ))}
      </div>
    </section>
  )
}

export default Rating