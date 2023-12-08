import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'

const Header = () => {

  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [dropdown, setDropdown] = useState(false);

  return (
    <nav className="flex justify-between px-[2rem] py-[1rem] mb-[1rem] text-stone-950 font-[700]">
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
                <div className="profile absolute right-[120px] bg-white px-[1rem] py-[.1rem] rounded-[5px] text-center">
                  <Link to='/profile'>User Profile</Link>
                </div>
              )}
            </div>
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
