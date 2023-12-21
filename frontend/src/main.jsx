import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LoginPage from './page/LoginPage.jsx';
import RegisterPage from './page/RegisterPage.jsx';
import HomePage from './page/HomePage.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './component/PrivateRoute.jsx';
import ProfilePage from './page/ProfilePage.jsx';
import AdminLoginPage from '../admin/page/AdminLoginPage.jsx';
import AdminPrivateRoute from '../admin/component/AdminPrivateRoute.jsx';
import AdminRegisterPage from '../admin/page/AdminRegisterPage.jsx';
import AdminHomePage from '../admin/page/AdminHomePage.jsx';
import AdminProfilePage from '../admin/page/AdminProfilePage.jsx'
import AdminMainPage from '../admin/page/AdminMainPage.jsx';
import AdminViewUsers from '../admin/page/AdminViewUsers.jsx';
import CartPage from './page/CartPage.jsx';
import OrderPage from './page/OrderPage.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer />
        <Routes>
          {/* FOR USER */}
          <Route path='/' element={<App />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='' element={<PrivateRoute />}>
            <Route path='/home' element={<HomePage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/order' element={<OrderPage />} />
          </Route>
          {/* FOR ADMIN */}
          <Route path='/admin' element={<AdminMainPage />} />
          <Route path='/admin/login' element={<AdminLoginPage />} />
          <Route path='/admin/register' element={<AdminRegisterPage />} />
          <Route path='' element={<AdminPrivateRoute />}>
            <Route path='/admin/home' element={<AdminHomePage />} />
            <Route path='/admin/profile' element={<AdminProfilePage />} />
            <Route path='/admin/access-users/users' element={<AdminViewUsers />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
