import React from 'react'
import heroImage from '../../assets/hero.jpg'
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Hero = () => {

    const { isAuthenticated } = useContext(AuthContext);

    return (
        <div className="w-100% sm:w-[90%] mx-auto mt-[1rem] sm:mt-[3rem]  px-[2rem] py-[3rem] rounded-[25px] shadow-xl">
            <div>
                <h1 className="text-center font-[700] text-[3rem]">Order Noodles Instantly!</h1>
            </div>
            <div className="mt-[1rem] sm:mt-[3rem] flex justify-between">
                <div className="flex-1 px-[3rem] pt-[3rem]">
                    <h1 className="text-[2rem] font-[700] pb-[1rem]">Winter 2024</h1>
                    <h1 className="text-[3rem] font-[700] pb-[1rem]">NEW NOODLES</h1>
                    <p className="pr-[6rem] font-[500] text-slate-600 pb-[2rem]">Lorem ipsum dolor sit amet consectetur adipisicing
                        elit. Nesciunt pariatur consequuntur sequi est, itaque mollitia accusamus perferendis quia quisquam eum
                        molestias hic nihil fugit maiores beatae iusto veritatis similique impedit.
                    </p>
                    {isAuthenticated ? (
                        <Link
                            to='/home'
                            className="py-[.5rem] px-[3rem] border-solid border-2 border-slate-800 rounded-[25px] font-[700] hover:bg-slate-800 hover:text-gray-300"
                        >
                            SHOP NOW
                        </Link>
                    ) : (
                        <Link
                            to='/login'
                            className="py-[.5rem] px-[3rem] border-solid border-2 border-slate-800 rounded-[25px] font-[700] hover:bg-slate-800 hover:text-gray-300"
                        >
                            SHOP NOW
                        </Link>
                    )}
                </div>
                <div className="flex-1 h-full">
                    <img
                        src={heroImage}
                        alt="noodles"
                        className="mx-auto max-h-[1000px] object-contain rounded-[50%]"
                    />
                </div>
            </div>
        </div>
    )
}

export default Hero