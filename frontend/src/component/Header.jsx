import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'
import { FaShoppingBag } from "react-icons/fa";

const Header = () => {

  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [dropdown, setDropdown] = useState(false);

  return (
    <nav className="flex justify-between px-[2rem] py-[1rem] mb-[1rem] text-slate-800 font-[700]">
      <div>
        <Link to='/'>MERN+AUTH</Link>
      </div>
      {isAuthenticated ? (
        <ul className="flex gap-[2rem]">
          <li>
            <Link to='/home'>Home</Link>
          </li>
          <li>
            <div>
              <button onClick={() => setDropdown(!dropdown)} className='relative'>
                {user ? `Welcome, ${user.name}!` : 'Loading...'}
              </button>
              {dropdown && (
                <div className="profile flex flex-col absolute bg-white px-[1rem] py-[.1rem] rounded-[5px] text-center">
                  <Link to='/profile'>User Profile</Link>
                  <Link to='/order'>Order</Link>
                </div>
              )}
            </div>
          </li>
          <li>
            <Link to='/cart' className='flex gap-[.5rem] items-center'>
              <span>Cart</span><FaShoppingBag className='text-[1.3rem]' />
            </Link>
          </li>
          <li>
            <Link to='/' onClick={logout}>Logout</Link>
          </li>
        </ul>
      ) : (
        <ul className="flex gap-[2rem]">
          <li>
            <Link to='/login'>Login</Link>
          </li>
          <li>
            <Link to='/register'>Register</Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Header;
