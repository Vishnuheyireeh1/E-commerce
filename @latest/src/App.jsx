import React from 'react'
import { Routes,Route } from "react-router-dom"
import Home from './Pages/Home'
import Navbar from './Components/Navbar'
import Auth from './Components/Login'
import Shop from './Pages/Shop'
import MyOrders from './Pages/MyOrders'
import ProductDetails from './Pages/ProductDetails'
import PaymentPage from './Pages/PaymentPage'
import AdminDashboard from './Pages/AdminDashboard'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
  <Route path='/' element={<Home/>}/>
  <Route path='/login' element={<Auth/>}/>
  <Route path='/shop' element={<Shop/>}/>
  <Route path='/orders' element={<MyOrders/>}/>
  <Route path='/product/:id' element={<ProductDetails/>}/> 
  <Route path='/payment' element={<PaymentPage/>}/>
  <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
</Routes>

<ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  )
}

export default App