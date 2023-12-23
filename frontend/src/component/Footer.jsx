import React from 'react';
import { contactUs } from '../utils/utils';
import { links } from '../utils/utils';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-slate-800 text-gray-300 py-[2rem] rounded-sm">
            <div className='w-[70%] md:w-[80%] mx-auto flex flex-wrap justify-between'>
                <div className='w-full sm:w-1/2 md:w-1/4 lg:w-1/5 mb-4'>
                    <h1 className='text-[1.25rem] font-[500] mb-[.5rem]'>
                        {contactUs.name}
                    </h1>
                    <p>{contactUs.details.email}</p>
                    <p>{contactUs.details.phone}</p>
                    <p>{contactUs.details.address}</p>
                </div>
                <div className='w-full sm:w-1/2 md:w-1/4 lg:w-1/5 mb-4'>
                    <h1 className='text-[1.25rem] font-[500] mb-[.5rem]'>
                        {links.headLink}
                    </h1>
                    <ul>
                        <li>
                            <Link to='/'>{links.subLinks.about}</Link>
                        </li>
                        <li>
                            <Link to='/'>{links.subLinks.faq}</Link>
                        </li>
                        <li>
                            <Link to='/'>{links.subLinks.terms}</Link>
                        </li>
                        <li>
                            <Link to='/'>{links.subLinks.privacy}</Link>
                        </li>
                        <li>
                            <Link to='/'>{links.subLinks.shipping}</Link>
                        </li>
                    </ul>
                </div>
                <div className='w-full sm:w-1/2 md:w-1/4 lg:w-1/5 mb-4'>
                    <h1 className='text-[1.25rem] font-[500] mb-[.5rem]'>
                        Connect With Us
                    </h1>
                    <div className='flex items-center text-[1.1rem] gap-[1rem]'>
                        <FaFacebook />
                        <FaInstagram />
                        <FaTwitter />
                    </div>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5 mb-4">
                    <h3 className="text-xl font-bold mb-4">Newsletter</h3>
                    <p>Subscribe to our newsletter for updates and promotions.</p>
                    <form className="mt-2">
                        <input type="email" placeholder='Your Email'
                            className="w-[100%] text-slate-800 py-[.5rem] px-[1rem] text-left flex-1 rounded-[15px]"
                        />
                        <button type="submit"
                            className="mt-[.5rem] py-[.5rem] px-[3rem] border-solid border-2 rounded-[25px] font-[700] hover:bg-gray-300 hover:text-slate-800"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
            <div className='text-center mt-[2rem]'>
                <p>&copy; 2023 Your Business. All rights reserved.</p>
                <p>Made By: Russel Kurt G. Nolasco</p>
            </div>
        </footer>
    );
};

export default Footer;
