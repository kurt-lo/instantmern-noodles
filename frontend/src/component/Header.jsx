import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'

const Header = () => {

  const { isAuthenticated, user, logout } = useContext(AuthContext);

  return (
    <nav className="flex justify-between px-[2rem] py-[1rem] bg-slate-400">
      <div>
        <Link to='/'>MERN+AUTH</Link>
      </div>
      {isAuthenticated ? (
        <ul className="flex">
          <li>
            <h1>{user ? user.name : 'Loading...'}</h1>
          </li>
          <li>
            <Link to='/' onClick={logout}>Logout</Link>
          </li>
        </ul>
      ) : (
        <ul className="flex">
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
