import { useState, useCallback, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/Product.css";

const ACCORDION_DATA = [
    {
        id: "details",
        title: "Product Details",
        content: (product) => (
            <ul className="pdp__accordion-list">
                <li>400gsm French terry cotton blend</li>
                <li>Relaxed oversized fit with dropped shoulders</li>
                <li>Ribbed cuffs and hem for shape retention</li>
                <li>Kangaroo front pocket</li>
                <li>Enzyme washed for a worn-in feel</li>
                <li>Unisex sizing — see size guide for fit</li>
            </ul>
        ),
    },
    {
        id: "sizing",
        title: "Sizing & Fit",
        content: () => (
            <ul className="pdp__accordion-list">
                <li>Model is 6'1" (185cm) wearing size L</li>
                <li>XS: Chest 32–34", Length 26"</li>
                <li>S: Chest 34–36", Length 27"</li>
                <li>M: Chest 36–38", Length 28"</li>
                <li>L: Chest 38–40", Length 29"</li>
                <li>XL: Chest 40–42", Length 30"</li>
                <li>XXL: Chest 42–44", Length 31"</li>
            </ul>
        ),
    },
    {
        id: "shipping",
        title: "Shipping & Returns",
        content: () => (
            <ul className="pdp__accordion-list">
                <li>Free standard shipping on orders over $120</li>
                <li>Express shipping: 2–3 business days</li>
                <li>30-day hassle-free returns on unworn items</li>
                <li>Free return label included in every order</li>
            </ul>
        ),
    },
    {
        id: "care",
        title: "Care Instructions",
        content: () => (
            <ul className="pdp__accordion-list">
                <li>Machine wash cold on gentle cycle</li>
                <li>Do not tumble dry — lay flat to dry</li>
                <li>Do not iron directly on print or embroidery</li>
                <li>Do not bleach</li>
            </ul>
        ),
    },
];

const TRUST_ITEMS = [
    { icon: "🔒", label: "Secure checkout" },
    { icon: "↩", label: "30-day returns" },
    { icon: "✦", label: "100% authentic" },
    { icon: "📦", label: "Free over $120" },
];

const fmt = (n) => `${Number(n).toFixed(2)} DH`;

function discountPct(original, sale) {
    if (!original || original <= sale) return null;
    return Math.round(((original - sale) / original) * 100);
}

function StarRating({ rating = 4.5 }) {
    return (
        <div className="pdp__rating" aria-label={`Rating: ${rating} out of 5`}>
            <div className="pdp__stars" aria-hidden="true">
                {[1, 2, 3, 4, 5].map(i => (
                    <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= Math.floor(rating) ? "currentColor" : i - 0.5 <= rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                ))}
            </div>
            <span className="pdp__rating-text">{rating} (128 reviews)</span>
        </div>
    );
}

function Accordion({ id, title, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="pdp__accordion">
            <button
                className="pdp__accordion-toggle"
                aria-expanded={open}
                aria-controls={`acc-${id}`}
                onClick={() => setOpen(v => !v)}
            >
                {title}
                <span className="pdp__accordion-icon" aria-hidden="true" />
            </button>
            <div
                id={`acc-${id}`}
                className={`pdp__accordion-body${open ? " pdp__accordion-body--open" : ""}`}
                role="region"
                aria-labelledby={`acc-${id}-btn`}
            >
                <div className="pdp__accordion-content">{children}</div>
            </div>
        </div>
    );
}

function RelatedCard({ item, type }) {
    return (
        <li>
            <a href={`/product/${item.id}`} className="rcard" aria-label={item.name}>
                <div className="rcard__media">
                    {item.tag && (
                        <span className={`rcard__badge rcard__badge--${item.tag.toLowerCase()}`}>{item.tag}</span>
                    )}
                    <div className="rcard__placeholder" aria-hidden="true">
                        {item.image ? (
                            <img src={item.image} alt={item.name} />
                        ) : (
                            <svg viewBox="0 0 56 56" fill="none">
                                <rect x="7" y="14" width="42" height="32" rx="2" stroke="#0d0d0d" strokeWidth="2" />
                                <path d="M7 25l14-11 11 9 7-6 11 8" stroke="#0d0d0d" strokeWidth="2" strokeLinejoin="round" />
                            </svg>
                        )}
                    </div>
                </div>
                <div className="rcard__body">
                    <p className="rcard__name">{item.name}</p>
                    <div className="rcard__prices">
                        <span className="rcard__price">{fmt(item.price)}</span>
                        {item.originalPrice && (
                            <span className="rcard__original">{fmt(item.originalPrice)}</span>
                        )}
                    </div>
                </div>
            </a>
        </li>
    );
}

function Gallery({ product, wished, onWishToggle }) {
    const [activeIdx, setActiveIdx] = useState(0);
    const VIEWS = 4;

    return (
        <div className="pdp__gallery" aria-label="Product gallery">
            <div className="pdp__thumbs" role="list" aria-label="Image thumbnails">
                {Array.from({ length: VIEWS }).map((_, i) => (
                    <button
                        key={i}
                        className="pdp__thumb"
                        role="listitem"
                        aria-pressed={activeIdx === i}
                        aria-label={`View ${i + 1}`}
                        onClick={() => setActiveIdx(i)}
                    >
                        <div className="pdp__thumb-inner">
                            {product.images && product.images[i] ? (
                                <img src={product.images[i]} alt="" />
                            ) : (
                                <svg viewBox="0 0 56 56" fill="none">
                                    <rect x="7" y="14" width="42" height="32" rx="2" stroke="#0d0d0d" strokeWidth="2" />
                                    <path d="M7 25l14-11 11 9 7-6 11 8" stroke="#0d0d0d" strokeWidth="2" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            <div className="pdp__main-image">
                {product.tag && (
                    <span className={`pdp__gallery-badge pdp__gallery-badge--${product.tag.toLowerCase()}`} aria-label={product.tag}>
                        {product.tag}
                    </span>
                )}

                <button
                    className={`pdp__gallery-wish${wished ? " pdp__gallery-wish--active" : ""}`}
                    onClick={onWishToggle}
                    aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
                    aria-pressed={wished}
                >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>

                <div key={activeIdx} className="pdp__main-inner" aria-hidden="true">
                    {product.images && product.images[activeIdx] ? (
                        <img src={product.images[activeIdx]} alt={product.name} className="pdp__main-img" />
                    ) : product.image ? (
                        <img src={product.image} alt={product.name} className="pdp__main-img" />
                    ) : (
                        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="15" y="30" width="90" height="70" rx="3" stroke="#0d0d0d" strokeWidth="2" />
                            <path d="M15 52l30-22 22 18 14-12 24 16" stroke="#0d0d0d" strokeWidth="2" strokeLinejoin="round" />
                            <circle cx="38" cy="44" r="6" stroke="#0d0d0d" strokeWidth="2" />
                        </svg>
                    )}
                </div>

                <div className="pdp__zoom-hint" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        <path d="M11 8v6M8 11h6" />
                    </svg>
                    Hover to zoom
                </div>

                <div className="pdp__image-dots" aria-hidden="true">
                    {Array.from({ length: VIEWS }).map((_, i) => (
                        <button
                            key={i}
                            className="pdp__image-dot"
                            aria-pressed={activeIdx === i}
                            onClick={() => setActiveIdx(i)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function Product() {
    const { id } = useParams();
    const location = useLocation();
    const { type } = location.state || {};

    const hoodies = useSelector(state => state.avex.hoodies);
    const jeans = useSelector(state => state.avex.jeans);
    const sneakers = useSelector(state => state.avex.sneakers);
    const featuredProducts = useSelector(state => state.avex.featuredProducts);
    const allProducts = useSelector(state => state.avex.allProducts);

    const product = useMemo(() => {
        const parsedId = parseInt(id) || id;
        switch (type) {
            case "hoodies": return hoodies?.find(p => p.id === parsedId || p.id === id);
            case "jeans": return jeans?.find(p => p.id === parsedId || p.id === id);
            case "sneakers": return sneakers?.find(p => p.id === parsedId || p.id === id);
            case "featuredProducts": return featuredProducts?.find(p => p.id === parsedId || p.id === id);
            case "all_products": return allProducts?.find(p => p.id === parsedId || p.id === id);
            default: return null;
        }
    }, [id, type, hoodies, jeans, sneakers, featuredProducts]);

    const relatedItems = useMemo(() => {
        const sourceMap = { hoodies, jeans, sneakers, featuredProducts };
        const source = sourceMap[type] || [];
        return source.filter(p => (p.id !== id && p.id !== parseInt(id))).slice(0, 4);
    }, [type, id, hoodies, jeans, sneakers, featuredProducts]);

    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [qty, setQty] = useState(1);
    const [wished, setWished] = useState(false);
    const [added, setAdded] = useState(false);
    const [sizeError, setSizeError] = useState(false);

    const handleAddToCart = useCallback(() => {
        if (!selectedSize) { setSizeError(true); return; }
        setSizeError(false);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    }, [selectedSize]);

    const handleSizeSelect = useCallback((sz) => {
        setSelectedSize(s => s === sz ? null : sz);
        setSizeError(false);
    }, []);

    if (!type) {
        return (
            <>
                
                <div className="pdp">
                    <div className="pdp__not-found">
                        <span className="pdp__not-found-glyph" aria-hidden="true">?</span>
                        <p className="pdp__not-found-title">Product Type Missing</p>
                        <p className="pdp__not-found-text">No product type was specified. Please navigate from a collection page.</p>
                        <a href="/shop" className="pdp__not-found-btn">Back to Shop</a>
                    </div>
                </div>
            </>
        );
    }

    if (!product) {
        return (
            <>
                
                <div className="pdp">
                    <div className="pdp__not-found">
                        <span className="pdp__not-found-glyph" aria-hidden="true">404</span>
                        <p className="pdp__not-found-title">Product Not Found</p>
                        <p className="pdp__not-found-text">This product doesn't exist or has been removed from our collection.</p>
                        <a href="/shop" className="pdp__not-found-btn">Back to Shop</a>
                    </div>
                </div>
            </>
        );
    }

    const pct = discountPct(product.originalPrice, product.price);
    const activeColor = product.colors?.[selectedColor];
    const categoryLabel = type === "featuredProducts" ? "Featured" : type.charAt(0).toUpperCase() + type.slice(1);

    return (
        <>
            
            <div className="pdp" id="pdp">
                <ol className="pdp__breadcrumb" aria-label="Breadcrumb">
                    <li className="pdp__breadcrumb-item"><a href="/">Home</a></li>
                    <li className="pdp__breadcrumb-item" aria-hidden="true"><span className="pdp__breadcrumb-sep">/</span></li>
                    <li className="pdp__breadcrumb-item"><a href={`/${type}`}>{categoryLabel}</a></li>
                    <li className="pdp__breadcrumb-item" aria-hidden="true"><span className="pdp__breadcrumb-sep">/</span></li>
                    <li className="pdp__breadcrumb-item pdp__breadcrumb-item--current" aria-current="page">{product.name}</li>
                </ol>

                <div className="pdp__layout">
                    <Gallery
                        product={product}
                        wished={wished}
                        onWishToggle={() => setWished(v => !v)}
                    />

                    <section className="pdp__info" aria-label="Product information">
                        <div className="pdp__meta-row">
                            <span className="pdp__category">{categoryLabel}</span>
                            <StarRating rating={4.5} />
                        </div>

                        <h1 className="pdp__name">{product.name}</h1>

                        <div className="pdp__pricing" aria-label="Pricing">
                            <span className={`pdp__price${product.originalPrice ? " pdp__price--sale" : ""}`}>
                                {fmt(product.price)}
                            </span>
                            {product.originalPrice && (
                                <>
                                    <span className="pdp__original-price" aria-label={`Original price: ${fmt(product.originalPrice)}`}>
                                        {fmt(product.originalPrice)}
                                    </span>
                                    {pct && <span className="pdp__discount-badge" aria-label={`${pct}% off`}>−{pct}%</span>}
                                </>
                            )}
                        </div>

                        <div className="pdp__divider" aria-hidden="true" />

                        {product.colors?.length > 0 && (
                            <div style={{ marginBottom: "1.5rem" }}>
                                <p className="pdp__option-heading">
                                    Colour
                                    {activeColor && <span className="pdp__option-selected">— {activeColor.label}</span>}
                                </p>
                                <div className="pdp__colors" role="group" aria-label="Select colour">
                                    {product.colors.map((c, i) => (
                                        <button
                                            key={c.hex}
                                            className="pdp__color-btn"
                                            style={{ borderColor: selectedColor === i ? c.hex : "transparent" }}
                                            aria-pressed={selectedColor === i}
                                            aria-label={c.label}
                                            onClick={() => setSelectedColor(i)}
                                        >
                                            <span className="pdp__color-inner" style={{ background: c.hex }} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.sizes?.length > 0 && (
                            <div style={{ marginBottom: "1.5rem" }}>
                                <p className="pdp__option-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span>
                                        Size
                                        {selectedSize && <span className="pdp__option-selected"> — {selectedSize}</span>}
                                    </span>
                                    <button className="pdp__size-guide-link" type="button" aria-label="Open size guide">
                                        Size guide
                                    </button>
                                </p>
                                <div className="pdp__sizes" role="group" aria-label="Select size">
                                    {product.sizes.map(sz => (
                                        <button
                                            key={sz}
                                            className="pdp__size-btn"
                                            aria-pressed={selectedSize === sz}
                                            aria-label={`Size ${sz}`}
                                            onClick={() => handleSizeSelect(sz)}
                                        >
                                            {sz}
                                        </button>
                                    ))}
                                </div>
                                {sizeError && (
                                    <p className="pdp__size-error" role="alert">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M6 3.5v3M6 8h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        Please select a size before adding to cart
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="pdp__divider" aria-hidden="true" />

                        <div style={{ marginBottom: "1.25rem" }}>
                            <div className="pdp__qty-row">
                                <div className="pdp__qty" role="group" aria-label="Quantity">
                                    <button
                                        className="pdp__qty-btn"
                                        onClick={() => setQty(q => Math.max(1, q - 1))}
                                        disabled={qty <= 1}
                                        aria-label="Decrease quantity"
                                    >−</button>
                                    <span className="pdp__qty-num" aria-label={`Quantity: ${qty}`}>{qty}</span>
                                    <button
                                        className="pdp__qty-btn"
                                        onClick={() => setQty(q => Math.min(10, q + 1))}
                                        disabled={qty >= 10}
                                        aria-label="Increase quantity"
                                    >+</button>
                                </div>

                                <div className={`pdp__stock-tag${qty >= 8 ? " pdp__stock-tag--low" : " pdp__stock-tag--in"}`} aria-live="polite">
                                    <span className="pdp__stock-dot" aria-hidden="true" />
                                    {qty >= 8 ? "Low stock — order soon" : "In stock — ready to ship"}
                                </div>
                            </div>
                        </div>

                        <div className="pdp__ctas" style={{ marginBottom: "1.5rem" }}>
                            <button
                                className={`pdp__add-btn${added ? " pdp__add-btn--added" : ""}`}
                                onClick={handleAddToCart}
                                aria-label={added ? "Added to cart" : selectedSize ? `Add ${product.name} in size ${selectedSize} to cart` : "Select size then add to cart"}
                            >
                                <span>
                                    {added ? (
                                        <>
                                            <svg width="13" height="11" viewBox="0 0 13 11" fill="none" aria-hidden="true">
                                                <path d="M1 5.5l4 4.5L12 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Added to Cart
                                        </>
                                    ) : (
                                        <>
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                                                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                            </svg>
                                            Add to Cart
                                        </>
                                    )}
                                </span>
                            </button>
                            <button
                                className="pdp__buy-btn"
                                disabled={!selectedSize}
                                aria-label={selectedSize ? "Buy now" : "Select a size to buy now"}
                            >
                                Buy Now
                            </button>
                        </div>

                        <div className="pdp__divider" aria-hidden="true" />

                        <p className="pdp__description" style={{ marginBottom: "1.5rem" }}>
                            {product.description || "Premium AVEX streetwear, designed for modern urban culture. Built to last with quality materials and meticulous construction."}
                        </p>

                        <div className="pdp__accordions" style={{ marginBottom: "1.5rem" }}>
                            {ACCORDION_DATA.map((acc, i) => (
                                <Accordion key={acc.id} id={acc.id} title={acc.title} defaultOpen={i === 0}>
                                    {acc.content(product)}
                                </Accordion>
                            ))}
                        </div>

                        <div className="pdp__share" style={{ marginBottom: "1.5rem" }} aria-label="Share product">
                            <span>Share</span>
                            {[
                                { label: "Instagram", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" /></svg> },
                                { label: "X / Twitter", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L2.25 2.25h6.863l4.258 5.629 4.873-5.629Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" /></svg> },
                                { label: "Link", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg> },
                            ].map(s => (
                                <button key={s.label} className="pdp__share-btn" aria-label={`Share on ${s.label}`}>
                                    {s.icon}
                                </button>
                            ))}
                        </div>

                        <div className="pdp__trust" role="list" aria-label="Trust signals">
                            {TRUST_ITEMS.map(t => (
                                <span key={t.label} className="pdp__trust-item" role="listitem">
                                    <span aria-hidden="true">{t.icon}</span>
                                    {t.label}
                                </span>
                            ))}
                        </div>
                    </section>

                    {relatedItems.length > 0 && (
                        <section className="pdp__related" aria-labelledby="related-heading">
                            <div className="pdp__related-header">
                                <div>
                                    <p className="pdp__related-eyebrow" aria-hidden="true">From the same collection</p>
                                    <h2 className="pdp__related-heading" id="related-heading">
                                        You May<br />Also Like
                                    </h2>
                                </div>
                                <a href={`/${type}`} className="pdp__related-link" aria-label={`View all ${categoryLabel}`}>
                                    View all {categoryLabel}
                                    <svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true">
                                        <path d="M1 4.5h12M8.5 1l4.5 3.5L8.5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                            </div>
                            <ul className="pdp__related-grid" role="list" aria-label="Related products">
                                {relatedItems.map(item => (
                                    <RelatedCard key={item.id} item={item} type={type} />
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </div>
        </>
    );
}