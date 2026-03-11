import { useState, useMemo, useCallback } from "react";
import '../styles/Cart.css';
import { useNavigate } from "react-router-dom";

const INITIAL_CART = [
    {
        id: "cart-001", productId: "h-001", name: "Classic Oversized Hoodie",
        category: "Hoodies", price: 259, color: { hex: "#0d0d0d", label: "Black" },
        size: "L", qty: 1, src: null,
    },
    {
        id: "cart-002", productId: "s-002", name: "Chunky Sole Runner",
        category: "Sneakers", price: 259, color: { hex: "#c8f23a", label: "Acid" },
        size: "EU 42", qty: 1, src: null,
    },
    {
        id: "cart-003", productId: "j-001", name: "Slim Tapered Denim",
        category: "Jeans", price: 399, color: { hex: "#2b3a6b", label: "Indigo" },
        size: "32\"", qty: 2, src: null,
    },
];

const SUGGESTED = [
    { id: "s-001", name: "Low-Top Court Sneaker", price: 300, category: "Sneakers", colors: ["#f5f3ee", "#0d0d0d"], src: null },
    { id: "h-004", name: "Thermal Heavyweight Hoodie", price: 400, category: "Hoodies", colors: ["#f5f3ee", "#8a8778"], src: null },
];

const PROMO_CODES = { "AVEX20": 0.20, "DROP10": 0.10, "STREET15": 0.15 };
const FREE_SHIPPING_THRESHOLD = 120;
const SHIPPING_COST = 8;

const fmt = (n) => `${n.toFixed(2).replace(/\.00$/, "")} Dh`;

function CartRow({ item, onQtyChange, onRemove, onSaveForLater }) {
    return (
        <li className="cart-row" aria-label={item.name}>
            <div className="cart-row__product">
                <a href={`#${item.productId}`} className="cart-row__thumb" aria-label={`View ${item.name}`}>
                    {item.src ? (
                        <img className="cart-row__thumb-img" src={item.src} alt={item.name} loading="lazy" />
                    ) : (
                        <div className="cart-row__thumb-placeholder" aria-hidden="true">
                            <svg viewBox="0 0 56 56" fill="none">
                                <rect x="7" y="14" width="42" height="32" rx="2" stroke="#0d0d0d" strokeWidth="2" />
                                <path d="M7 25l14-11 11 9 7-6 11 8" stroke="#0d0d0d" strokeWidth="2" strokeLinejoin="round" />
                                <circle cx="19" cy="22" r="3" stroke="#0d0d0d" strokeWidth="2" />
                            </svg>
                        </div>
                    )}
                </a>
                <div className="cart-row__info">
                    <p className="cart-row__category">{item.category}</p>
                    <a href={`#${item.productId}`} className="cart-row__name">{item.name}</a>
                    <div className="cart-row__attrs">
                        <span className="cart-row__attr">
                            <span className="cart-row__color-dot" style={{ backgroundColor: item.color.hex }} aria-hidden="true" />
                            {item.color.label}
                        </span>
                        <span className="cart-row__attr-divider" aria-hidden="true" />
                        <span className="cart-row__attr">Size: {item.size}</span>
                    </div>
                    <div className="cart-row__actions">
                        <button
                            className="cart-row__action-btn"
                            onClick={() => onSaveForLater(item.id)}
                            aria-label={`Save ${item.name} for later`}
                        >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            Save for later
                        </button>
                        <button
                            className="cart-row__action-btn cart-row__action-btn--remove"
                            onClick={() => onRemove(item.id)}
                            aria-label={`Remove ${item.name} from cart`}
                        >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                            </svg>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
            <div className="cart-row__price" aria-label={`Unit price: ${fmt(item.price)}`}>
                {fmt(item.price)}
            </div>
            <div className="cart-row__qty" role="group" aria-label={`Quantity for ${item.name}`}>
                <button
                    className="cart-row__qty-btn"
                    onClick={() => onQtyChange(item.id, item.qty - 1)}
                    disabled={item.qty <= 1}
                    aria-label="Decrease quantity"
                >
                    −
                </button>
                <span className="cart-row__qty-num" aria-label={`Quantity: ${item.qty}`}>
                    {item.qty}
                </span>
                <button
                    className="cart-row__qty-btn"
                    onClick={() => onQtyChange(item.id, item.qty + 1)}
                    disabled={item.qty >= 10}
                    aria-label="Increase quantity"
                >
                    +
                </button>
            </div>
            <div className="cart-row__subtotal" aria-label={`Subtotal: ${fmt(item.price * item.qty)}`}>
                {fmt(item.price * item.qty)}
            </div>
        </li>
    );
}

function SuggestedCard({ item }) {
    const [added, setAdded] = useState(false);
    const handleAdd = useCallback((e) => {
        e.preventDefault();
        setAdded(true);
        setTimeout(() => setAdded(false), 1600);
    }, []);

    return (
        <li>
            <a href={`#${item.id}`} className="sugg-card" aria-label={item.name}>
                <div className="sugg-card__thumb">
                    <div className="sugg-card__placeholder" aria-hidden="true">
                        <svg viewBox="0 0 56 56" fill="none">
                            <rect x="7" y="14" width="42" height="32" rx="2" stroke="#0d0d0d" strokeWidth="2" />
                            <path d="M7 25l14-11 11 9 7-6 11 8" stroke="#0d0d0d" strokeWidth="2" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                <div className="sugg-card__info">
                    <p className="sugg-card__cat">{item.category}</p>
                    <p className="sugg-card__name">{item.name}</p>
                    <p className="sugg-card__price">{item.price} Dh</p>
                    <div className="sugg-card__swatches" aria-hidden="true">
                        {item.colors.map(hex => (
                            <span key={hex} className="sugg-card__swatch" style={{ backgroundColor: hex }} />
                        ))}
                    </div>
                </div>
                <button
                    className="sugg-card__add"
                    onClick={handleAdd}
                    aria-label={added ? "Added to cart" : `Quick add ${item.name}`}
                >
                    {added ? (
                        <svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true">
                            <path d="M1 4.5l3 3.5L10 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    ) : (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                    )}
                </button>
            </a>
        </li>
    );
}

export default function Cart() {
    const [items, setItems] = useState(INITIAL_CART);
    const [savedItems, setSavedItems] = useState([]);
    const [promoInput, setPromoInput] = useState("");
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoStatus, setPromoStatus] = useState("idle");
    const [promoMsg, setPromoMsg] = useState("");
    const navigate = useNavigate();
    const subtotal = useMemo(
        () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
        [items]
    );
    
    const discount = appliedPromo ? subtotal * PROMO_CODES[appliedPromo] : 0;
    const afterDiscount = subtotal - discount;
    const shipping = afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = afterDiscount + shipping;
    const totalQty = items.reduce((s, i) => s + i.qty, 0);
    const shippingPct = Math.min((afterDiscount / FREE_SHIPPING_THRESHOLD) * 100, 100);
    const shippingEarned = shipping === 0;
    
    const handleQtyChange = useCallback((id, newQty) => {
        if (newQty < 1 || newQty > 10) return;
        setItems(prev => prev.map(i => i.id === id ? { ...i, qty: newQty } : i));
    }, []);

    const handleRemove = useCallback((id) => {
        setItems(prev => prev.filter(i => i.id !== id));
    }, []);

    const handleSaveForLater = useCallback((id) => {
        const item = items.find(i => i.id === id);
        if (!item) return;
        setItems(prev => prev.filter(i => i.id !== id));
        setSavedItems(prev => [...prev, item]);
    }, [items]);

    const handleMoveToCart = useCallback((id) => {
        const item = savedItems.find(i => i.id === id);
        if (!item) return;
        setSavedItems(prev => prev.filter(i => i.id !== id));
        setItems(prev => [...prev, item]);
    }, [savedItems]);

    const handleApplyPromo = useCallback(() => {
        const code = promoInput.trim().toUpperCase();
        if (!code) { 
            setPromoStatus("error"); 
            setPromoMsg("Enter a promo code."); 
            return; 
        }
        if (PROMO_CODES[code]) {
            setAppliedPromo(code);
            setPromoStatus("success");
            setPromoMsg(`${(PROMO_CODES[code] * 100).toFixed(0)}% discount applied.`);
            setPromoInput("");
        } else {
            setPromoStatus("error");
            setPromoMsg("Invalid code. Try AVEX20.");
        }
    }, [promoInput]);

    const handleRemovePromo = useCallback(() => {
        setAppliedPromo(null);
        setPromoStatus("idle");
        setPromoMsg("");
        setPromoInput("");
    }, []);

    return (
        <>
            <div className="cart" id="cart">
                <header className="cart__header">
                    <div>
                        <p className="cart__eyebrow" aria-hidden="true">Your selection</p>
                        <h1 className="cart__heading">Your <em>Cart</em></h1>
                    </div>
                    {items.length > 0 && (
                        <div className="cart__header-meta" aria-hidden="true">
                            <span className="cart__item-count">{totalQty}</span>
                            <span className="cart__item-label">{totalQty === 1 ? "item" : "items"}</span>
                        </div>
                    )}
                </header>
                {items.length > 0 && (
                    <div className="cart__shipping-bar" aria-label="Free shipping progress">
                        <svg className={`cart__shipping-icon${shippingEarned ? " cart__shipping-icon--earned" : ""}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
                            <rect x="9" y="11" width="14" height="10" rx="2" />
                            <circle cx="12" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                        </svg>
                        <div className="cart__progress-track" aria-hidden="true">
                            <div className="cart__progress-fill" style={{ width: `${shippingPct}%` }} />
                        </div>
                        {shippingEarned ? (
                            <p className="cart__shipping-text cart__shipping-text--earned" aria-live="polite">
                                🎉 Free shipping unlocked!
                            </p>
                        ) : (
                            <p className="cart__shipping-text" aria-live="polite">
                                <strong>{fmt(FREE_SHIPPING_THRESHOLD - afterDiscount)}</strong> away from free shipping
                            </p>
                        )}
                    </div>
                )}
                <div className="cart__layout">
                    <div className="cart__items">
                        {items.length > 0 ? (
                            <>
                                <div className="cart__items-header" aria-hidden="true">
                                    <span className="cart__col-label">Product</span>
                                    <span className="cart__col-label cart__col-label--right">Price</span>
                                    <span className="cart__col-label cart__col-label--center">Qty</span>
                                    <span className="cart__col-label cart__col-label--right">Subtotal</span>
                                </div>
                                <ul aria-label="Cart items" role="list">
                                    {items.map((item) => (
                                        <CartRow
                                            key={item.id}
                                            item={item}
                                            onQtyChange={handleQtyChange}
                                            onRemove={handleRemove}
                                            onSaveForLater={handleSaveForLater}
                                        />
                                    ))}
                                </ul>
                                {savedItems.length > 0 && (
                                    <div className="cart__saved-section">
                                        <p className="cart__saved-heading">Saved for later — {savedItems.length}</p>
                                        <ul role="list" aria-label="Saved for later items">
                                            {savedItems.map(item => (
                                                <CartRow
                                                    key={item.id}
                                                    item={{ ...item, qty: 1 }}
                                                    onQtyChange={() => {}}
                                                    onRemove={(id) => setSavedItems(p => p.filter(i => i.id !== id))}
                                                    onSaveForLater={handleMoveToCart}
                                                />
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="cart__empty" role="status">
                                <span className="cart__empty-glyph" aria-hidden="true">0</span>
                                <p className="cart__empty-title">Your cart is empty</p>
                                <p className="cart__empty-text">
                                    Looks like you haven't added anything yet. Head back to the shop and find your next drop.
                                </p>
                                <button className="cart__empty-cta">
                                    <span>Continue Shopping</span>
                                </button>
                            </div>
                        )}
                    </div>
                    {items.length > 0 && (
                        <aside className="cart__summary" aria-label="Order summary">
                            <h2 className="cart__summary-heading">Order Summary</h2>
                            <div className="cart__promo">
                                <p className="cart__promo-label">Promo Code</p>
                                {appliedPromo ? (
                                    <div className="cart__promo-applied">
                                        <span className="cart__promo-applied-label">
                                            <svg width="13" height="11" viewBox="0 0 13 11" fill="none" aria-hidden="true">
                                                <path d="M1 5.5l4 4.5L12 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            {appliedPromo}
                                        </span>
                                        <button className="cart__promo-remove" onClick={handleRemovePromo} aria-label="Remove promo code">
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="cart__promo-row">
                                            <input
                                                className={`cart__promo-input${promoStatus === "error" ? " cart__promo-input--error" : promoStatus === "success" ? " cart__promo-input--success" : ""}`}
                                                type="text"
                                                value={promoInput}
                                                onChange={(e) => { setPromoInput(e.target.value); setPromoStatus("idle"); setPromoMsg(""); }}
                                                onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                                                placeholder="Enter code"
                                                aria-label="Promo code input"
                                                autoComplete="off"
                                                autoCapitalize="characters"
                                                spellCheck={false}
                                            />
                                            <button
                                                className="cart__promo-apply"
                                                onClick={handleApplyPromo}
                                                disabled={!promoInput.trim()}
                                                aria-label="Apply promo code"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {promoMsg && (
                                            <p
                                                className={`cart__promo-feedback cart__promo-feedback--${promoStatus}`}
                                                role="alert"
                                                aria-live="polite"
                                            >
                                                {promoMsg}
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="cart__order-lines" aria-label="Price breakdown">
                                <div className="cart__order-line">
                                    <span>Subtotal ({totalQty} {totalQty === 1 ? "item" : "items"})</span>
                                    <span className="cart__order-line-value">{fmt(subtotal)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="cart__order-line cart__order-line--discount">
                                        <span>Discount ({appliedPromo})</span>
                                        <span className="cart__order-line-value">−{fmt(discount)}</span>
                                    </div>
                                )}
                                <div className="cart__order-line">
                                    <span>Shipping</span>
                                    {shippingEarned ? (
                                        <span className="cart__order-line-free">Free</span>
                                    ) : (
                                        <span className="cart__order-line-value">{fmt(SHIPPING_COST)}</span>
                                    )}
                                </div>
                                <div className="cart__order-line cart__order-line--total">
                                    <span>Total</span>
                                    <span className="cart__order-line-value">{fmt(total)}</span>
                                </div>
                            </div>
                            <button className="cart__checkout-btn" onClick={()=>navigate('/checkout')} aria-label={`Proceed to checkout — total ${fmt(total)}`}>
                                <span>
                                    Checkout — {fmt(total)}
                                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                                        <path d="M1 5h12M8.5 1l4.5 4-4.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </button>
                            <button className="cart__continue-btn" aria-label="Continue shopping">
                                Continue Shopping
                            </button>
                            <div className="cart__trust" aria-label="Trust signals" role="list">
                                {[
                                    { icon: "🔒", label: "Secure checkout" },
                                    { icon: "↩", label: "30-day returns" },
                                    { icon: "✦", label: "Authentic products" },
                                ].map(({ icon, label }) => (
                                    <span key={label} className="cart__trust-item" role="listitem">
                                        <span aria-hidden="true">{icon}</span>
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </aside>
                    )}
                    {items.length > 0 && (
                        <section className="cart__suggested" aria-labelledby="suggested-heading">
                            <h2 className="cart__suggested-heading" id="suggested-heading">Complete the Look</h2>
                            <p className="cart__suggested-sub">Others also bought with your selection</p>
                            <ul className="cart__suggested-grid" role="list" aria-label="Suggested products">
                                {SUGGESTED.map(item => (
                                    <SuggestedCard key={item.id} item={item} />
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </div>
        </>
    );
}