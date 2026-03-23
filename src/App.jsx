import { Route,Routes } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Hoodies from "./pages/Hoodies";
import Sneakers from "./pages/Sneakers";
import Jeans from "./pages/Jeans";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Checkout from "./pages/Checkout";
import Product from "./pages/Product";
import Favorites from "./pages/Favorites";
import { NavBar } from "./components/AvexLayout";
import Footer from "./components/Footer";
import { useEffect } from "react";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<><NavBar/><Shop/><Footer/></>} />
        <Route path="/cart" element={<><NavBar/><Cart/><Footer/></>} />
        <Route path="/checkout" element={<><NavBar/><Checkout/><Footer/></>} />
        <Route path="/hoodies" element={<><NavBar/><Hoodies/><Footer/></>} />
        <Route path="/sneakers" element={<><NavBar/><Sneakers/><Footer/></>} />
        <Route path="/jeans" element={<><NavBar/><Jeans/><Footer/></>} />
        <Route path="/product/:id" element={<><NavBar/><Product/><Footer/></>} />
        <Route path="/contact" element={<><NavBar/><Contact/><Footer/></>} />
        <Route path="/about" element={<><NavBar/><About/><Footer/></>} />
        <Route path="/favorites" element={<><NavBar/><Favorites/><Footer/></>} />
      </Routes>
    </>
  )
}

export default App
