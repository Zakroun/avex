import AvexLayout from "../components/AvexLayout"
import Categories from "../components/Categories"
import FeaturedProducts from "../components/FeaturedProducts"
import Newsletter from "../components/Newsletter"
import Footer from "../components/Footer"

export default function Home() {
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