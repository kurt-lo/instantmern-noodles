import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, loading, logout } = useContext(AuthContext);
  const [data, setData] = useState(null);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get('/api/users/profile');
  //       setData(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   if (isAuthenticated && !loading) {
  //     fetchData();
  //   } 
    
  // }, [isAuthenticated, loading]);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      const fetchData = async () => {
        try {
          const response = await axios.get('/api/users/profile');
          setData(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    } else {
      setData(null);
    }
  }, [isAuthenticated, loading]);

  return (
    <nav className="flex justify-between px-[2rem] py-[1rem] bg-slate-400">
      <div>
        <Link to='/'>MERN+AUTH</Link>
      </div>
      {isAuthenticated ? (
        <ul className="flex">
          <li>
            <h1>{data ? data.name : 'Loading...'}</h1>
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
