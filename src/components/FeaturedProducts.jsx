import { useState } from "react";
import '../styles/FeaturedProducts.css';
import { FEATURED_PRODUCTS } from "../data/data";
import { Link } from "react-router-dom";
function ProductCard({ id, name, category, price, tag, src, alt, href, colors }) {
    const [added, setAdded] = useState(false);
    const [activeColor, setActiveColor] = useState(0);

    const handleQuickAdd = (e) => {
        e.preventDefault();
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    return (
        <article className="product-card" aria-label={name}>
            <Link to={`/product/${id}`} state={{type : "featuredProducts"}} className="product-card__media" tabIndex={-1} aria-hidden="true">
                {tag && <span className="product-card__badge">{tag}</span>}
                {src ? (
                    <img
                        className="product-card__img"
                        src={src}
                        alt={alt}
                        loading="lazy"
                        decoding="async"
                    />
                ) : (
                    <div className="product-card__placeholder">
                        <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="7" y="14" width="42" height="32" rx="2" stroke="#f5f3ee" strokeWidth="2" />
                            <path d="M7 25l14-11 11 9 7-6 11 8" stroke="#f5f3ee" strokeWidth="2" strokeLinejoin="round" />
                            <circle cx="19" cy="22" r="3" stroke="#f5f3ee" strokeWidth="2" />
                        </svg>
                    </div>
                )}

                <button
                    className={`product-card__quick-add${added ? " product-card__quick-add--added" : ""}`}
                    onClick={handleQuickAdd}
                    aria-label={added ? `${name} added to cart` : `Quick add ${name} to cart`}
                >
                    {added ? (
                        <>
                            <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true">
                                <path d="M1 5l4 4L12 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Added
                        </>
                    ) : (
                        <>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                            Quick Add
                        </>
                    )}
                </button>
            </Link>
            <div className="product-card__body">
                <span className="product-card__category">{category}</span>
                <a href={href} className="product-card__name" style={{ textDecoration: "none" }}>
                    {name}
                </a>
                <div className="product-card__footer">
                    <span className="product-card__price">{price}Dh</span>
                    <div className="product-card__swatches" role="group" aria-label={`Color options for ${name}`}>
                        {colors.map((hex, i) => (
                            <button
                                key={hex}
                                className="product-card__swatch"
                                style={{ background: hex }}
                                aria-label={`Color option ${i + 1}`}
                                aria-pressed={activeColor === i}
                                onClick={() => setActiveColor(i)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </article>
    );
}
export default function FeaturedProducts() {
    return (
        <>
            
            <section className="featured" aria-labelledby="featured-heading">
                <div className="featured__header">
                    <div>
                        <p className="featured__eyebrow" aria-hidden="true">Hand-picked for you</p>
                        <h2 className="featured__heading" id="featured-heading">
                            Featured<br /><em>Drops</em>
                        </h2>
                    </div>
                    <a href="#shop" className="featured__view-all" aria-label="View all featured products">
                        View all
                        <svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true">
                            <path d="M1 4.5h12M8.5 1l4.5 3.5L8.5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                </div>
                <ul className="featured__grid" role="list">
                    {FEATURED_PRODUCTS.map((product) => (
                        <li key={product.id}>
                            <ProductCard {...product} />
                        </li>
                    ))}
                </ul>
            </section>
        </>
    );
}