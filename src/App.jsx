//App.jsx
import Home from './Home.jsx'
import './App.css'
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import Profile from './Profile.jsx'
import AddProduct from './AddProduct.jsx';
import ProductList from './ProductList.jsx';
import { useState } from 'react';
import Cart from './Cart.jsx'
import CheckOut from './CheckOut.jsx';
import Stock from './Stock.jsx';
import SalesHistory from './sales/SalesHistory.jsx';
import { supabase } from './suparbaseClient.js';


function LoginPage({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleAuth = () => {
    // These should ideally be in your .env file
    if (user === import.meta.env.VITE_USER && pass === import.meta.env.VITE_PASS) {
      localStorage.setItem("isLoggedIn", "true");
      onLogin(true);
    } else {
      alert("Invalid login details");
    }
  };

  return (
    <div className="login-container">
      <h2>Shop Management Login</h2>
      <input type="text" placeholder="Username" onChange={(e) => setUser(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPass(e.target.value)} />
      <button onClick={handleAuth}>Enter Shop</button>
    </div>
  );
}



function App() {
  const [cart, setCart] = useState([]);
  function updateCart(addItem){
    const existing = cart.find((item) => item.id === addItem.id);
    if(existing){
      setCart(
        cart.map((item) => 
          item.id === addItem.id
            ? {...item, quantity: item.quantity + 1}
            : item
        )
      );
    }
    else{
      setCart([...cart, {...addItem, quantity:1}]);
    }
  }
  function reduceQuantity(id){
    setCart(
      cart.map((item) => 
        item.id == id
        ? {...item, quantity: item.quantity - 1}
        : item
      )
      .filter((item) => item.quantity>0)
    );
  }
  function increaseQuantity(id){
    setCart(
      cart.map((item) => 
        item.id == id
        ? {...item, quantity: item.quantity + 1}
        : item
      )
    );
  }
  function customQuantity(id, value){
    const qValue = Number(value);
    setCart(
      cart.map((item) =>
        item.id == id
          ? {...item, quantity: qValue}
          : item
      )
    );
  }
  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <Home/>
      },
      {
        path: '/profile',
        element: <Profile/>
      },
      {
        path: '/add',
        element: <AddProduct/>
      },
      {
        path: '/products',
        element: <ProductList addToCart={updateCart} />
      },
      {
        path: '/cart',
        element: <Cart customQuantity={customQuantity} increaseQuantity={increaseQuantity} reduceQuantity={reduceQuantity} cartArray={cart}/>
      },
      {
        path:'/checkout',
        element: <CheckOut out={cart}/>
      },
      {
        path:'/stock',
        element: <Stock />
      },
      {
        path : '/salse',
        element : <SalesHistory />
      }
    ]
  );



  // 1. New state for Auth
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  // ... (keep all your existing cart functions like updateCart, reduceQuantity, etc.)

// keep your existing router

  // 2. Logic to show either Login or the Router
  if (!isLoggedIn) {
    return <LoginPage onLogin={setIsLoggedIn} />;
  }
  return (
    <div className="app-layout">
      {/* 3. Optional: Add a logout button so you can lock it again */}
      <button onClick={() => {
        localStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
      }} style={{position: 'absolute', top: 10, right: 10}}>Logout</button>
      
      <RouterProvider router={router}/>
    </div>
  );
}

export default App
