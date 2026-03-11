import '../styles/Categories.css';
const CATEGORIES = [
    {
        id: "hoodies",
        label: "Hoodies",
        href: "#hoodies",
        src: "assets/images/Hero2.png",
        alt: "A premium AVEX hoodie",
        count: "24 styles",
        accent: "#c8f23a",
    },
    {
        id: "jeans",
        label: "Jeans",
        href: "#jeans",
        src: "assets/images/jeans2.png",
        alt: "AVEX denim jeans",
        count: "18 styles",
        accent: "#f2d23a",
    },
    {
        id: "sneakers",
        label: "Sneakers",
        href: "#sneakers",
        src: "assets/images/sneakers.png",
        alt: "AVEX sneakers",
        count: "31 styles",
        accent: "#f23a6e",
    },
];

function CategoryCard({ label, href, src, alt, count, accent }) {
    return (
        <a
            className="category-card"
            href={href}
            aria-label={`Browse ${label} — ${count}`}
            style={{ "--card-accent": accent }}
        >
            <div className="category-card__overlay" aria-hidden="true" />
            {src ? (
                <img
                    className="category-card__img"
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                />
            ) : (
                <div className="category-card__placeholder" aria-hidden="true">
                    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="7" y="14" width="42" height="32" rx="2" stroke="#0d0d0d" strokeWidth="2" />
                        <path d="M7 25l14-11 11 9 7-6 11 8" stroke="#0d0d0d" strokeWidth="2" strokeLinejoin="round" />
                        <circle cx="19" cy="22" r="3" stroke="#0d0d0d" strokeWidth="2" />
                    </svg>
                </div>
            )}
            <div className="category-card__body">
                <span className="category-card__label">{label}</span>
                <div className="category-card__meta" aria-hidden="true">
                    <span className="category-card__count">{count}</span>
                    <span className="category-card__cta">
                        Explore
                        <svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true">
                            <path d="M1 4.5h12M8.5 1l4.5 3.5L8.5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </div>
            </div>
        </a>
    );
}
export default function Categories() {
    return (
        <>
            
            <section className="categories" aria-labelledby="categories-heading">
                <div className="categories__header">
                    <div>
                        <p className="categories__eyebrow" aria-hidden="true">What we carry</p>
                        <h2 className="categories__heading" id="categories-heading">
                            Shop by<br />Category
                        </h2>
                    </div>
                    <a href="#shop" className="categories__view-all" aria-label="View all product categories">
                        All categories
                        <svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true">
                            <path d="M1 4.5h12M8.5 1l4.5 3.5L8.5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                </div>
                <ul className="categories__grid" role="list">
                    {CATEGORIES.map((cat) => (
                        <li key={cat.id}>
                            <CategoryCard {...cat} />
                        </li>
                    ))}
                </ul>
            </section>
        </>
    );
}