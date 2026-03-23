import AvexLayout from "../components/AvexLayout"
import Categories from "../components/Categories"
import FeaturedProducts from "../components/FeaturedProducts"
import Newsletter from "../components/Newsletter"
import Footer from "../components/Footer"
import { useEffect } from "react";
export default function Home() {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);
    return (
        <div>
            <AvexLayout />
            <Categories />
            <FeaturedProducts />
            <Newsletter />
            <Footer />
        </div>
    )
}