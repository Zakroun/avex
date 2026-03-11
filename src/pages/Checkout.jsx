import { useState, useCallback, useId, useMemo } from "react";
import '../styles/Checkout.css';

const ORDER_ITEMS = [
    { id: "cart-001", name: "Classic Oversized Hoodie", category: "Hoodies", price: 259, qty: 1, size: "L", color: { hex: "#0d0d0d", label: "Black" }, src: null },
    { id: "cart-002", name: "Chunky Sole Runner", category: "Sneakers", price: 259, qty: 1, size: "EU 42", color: { hex: "#c8f23a", label: "Acid" }, src: null },
    { id: "cart-003", name: "Slim Tapered Denim", category: "Jeans", price: 399, qty: 2, size: "32\"", color: { hex: "#2b3a6b", label: "Indigo" }, src: null },
];

const COUNTRIES = ["United States", "United Kingdom", "France", "Germany", "Morocco", "Spain", "Italy", "Netherlands", "Canada", "Australia"];
const SHIPPING_OPTIONS = [
    { id: "standard", label: "Standard Shipping", detail: "5–7 business days", price: 8 },
    { id: "express", label: "Express Shipping", detail: "2–3 business days", price: 18 },
    { id: "overnight", label: "Overnight Shipping", detail: "Next business day", price: 35 },
];

const STEPS = ["Information", "Shipping", "Payment"];
const fmt = (n) => `${n.toFixed(2).replace(/\.00$/, "")} Dh`;
const SHIPPING_COST = 8;

function detectCardNetwork(num) {
    const n = num.replace(/\s/g, "");
    if (/^4/.test(n)) return "VISA";
    if (/^5[1-5]/.test(n)) return "MC";
    if (/^3[47]/.test(n)) return "AMEX";
    if (/^6(?:011|5)/.test(n)) return "DISC";
    return null;
}

function formatCardNumber(val) {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(val) {
    const d = val.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
}

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isPhone = (v) => v.replace(/\D/g, "").length >= 7;
const isPostal = (v) => v.trim().length >= 3;
const isCardNum = (v) => v.replace(/\s/g, "").length === 16;
const isExpiry = (v) => /^\d{2} \/ \d{2}$/.test(v);
const isCvc = (v) => /^\d{3,4}$/.test(v.trim());

function validateInfo(f) {
    const e = {};
    if (!f.firstName.trim()) e.firstName = "Required";
    if (!f.lastName.trim()) e.lastName = "Required";
    if (!f.email.trim()) e.email = "Required";
    else if (!isEmail(f.email)) e.email = "Invalid email";
    if (!f.phone.trim()) e.phone = "Required";
    else if (!isPhone(f.phone)) e.phone = "Invalid phone";
    if (!f.address.trim()) e.address = "Required";
    if (!f.city.trim()) e.city = "Required";
    if (!f.country) e.country = "Select a country";
    if (!f.postal.trim()) e.postal = "Required";
    else if (!isPostal(f.postal)) e.postal = "Invalid postal code";
    return e;
}

function validatePayment(f) {
    const e = {};
    if (!f.nameOnCard.trim()) e.nameOnCard = "Required";
    if (!isCardNum(f.cardNum)) e.cardNum = "Enter a valid 16-digit card number";
    if (!isExpiry(f.expiry)) e.expiry = "MM / YY";
    if (!isCvc(f.cvc)) e.cvc = "Invalid CVC";
    return e;
}

function FormField({ label, required, error, children }) {
    return (
        <div className="checkout__field">
            <label className={`checkout__label${required ? " checkout__label--required" : ""}`}>
                {label}
            </label>
            {children}
            {error && (
                <span className="checkout__field-error" role="alert">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M6 3.5v3M6 8h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    {error}
                </span>
            )}
        </div>
    );
}

function StepInformation({ fields, errors, onChange, onNext }) {
    return (
        <div style={{ animation: "fade-up 0.45s var(--ease-expo) both" }}>
            <h2 className="checkout__section-heading">Contact</h2>
            <div className="checkout__field-row">
                <FormField label="First name" required error={errors.firstName}>
                    <input
                        className={`checkout__input${errors.firstName ? " checkout__input--error" : fields.firstName ? " checkout__input--valid" : ""}`}
                        name="firstName" value={fields.firstName} onChange={onChange}
                        placeholder="Jordan" autoComplete="given-name"
                        aria-required="true" aria-invalid={!!errors.firstName}
                    />
                </FormField>
                <FormField label="Last name" required error={errors.lastName}>
                    <input
                        className={`checkout__input${errors.lastName ? " checkout__input--error" : fields.lastName ? " checkout__input--valid" : ""}`}
                        name="lastName" value={fields.lastName} onChange={onChange}
                        placeholder="Chen" autoComplete="family-name"
                        aria-required="true" aria-invalid={!!errors.lastName}
                    />
                </FormField>
            </div>

            <FormField label="Email" required error={errors.email}>
                <input
                    className={`checkout__input${errors.email ? " checkout__input--error" : isEmail(fields.email) ? " checkout__input--valid" : ""}`}
                    type="email" name="email" value={fields.email} onChange={onChange}
                    placeholder="you@example.com" autoComplete="email"
                    aria-required="true" aria-invalid={!!errors.email}
                />
            </FormField>

            <FormField label="Phone" required error={errors.phone}>
                <input
                    className={`checkout__input${errors.phone ? " checkout__input--error" : ""}`}
                    type="tel" name="phone" value={fields.phone} onChange={onChange}
                    placeholder="+1 555 000 0000" autoComplete="tel"
                    aria-required="true" aria-invalid={!!errors.phone}
                />
            </FormField>
            <h2 className="checkout__section-heading" style={{ marginTop: "2rem" }}>Shipping Address</h2>
            <FormField label="Address" required error={errors.address}>
                <input
                    className={`checkout__input${errors.address ? " checkout__input--error" : fields.address ? " checkout__input--valid" : ""}`}
                    name="address" value={fields.address} onChange={onChange}
                    placeholder="123 Main Street" autoComplete="street-address"
                    aria-required="true" aria-invalid={!!errors.address}
                />
            </FormField>
            <FormField label="Apartment, suite, etc." error={null}>
                <input
                    className="checkout__input"
                    name="apartment" value={fields.apartment} onChange={onChange}
                    placeholder="Apt 4B (optional)" autoComplete="address-line2"
                />
            </FormField>
            <div className="checkout__field-row">
                <FormField label="City" required error={errors.city}>
                    <input
                        className={`checkout__input${errors.city ? " checkout__input--error" : fields.city ? " checkout__input--valid" : ""}`}
                        name="city" value={fields.city} onChange={onChange}
                        placeholder="New York" autoComplete="address-level2"
                        aria-required="true" aria-invalid={!!errors.city}
                    />
                </FormField>
                <FormField label="Postal code" required error={errors.postal}>
                    <input
                        className={`checkout__input${errors.postal ? " checkout__input--error" : ""}`}
                        name="postal" value={fields.postal} onChange={onChange}
                        placeholder="10001" autoComplete="postal-code"
                        aria-required="true" aria-invalid={!!errors.postal}
                    />
                </FormField>
            </div>
            <FormField label="Country" required error={errors.country}>
                <div className="checkout__select-wrap">
                    <select
                        className={`checkout__select${errors.country ? " checkout__select--error" : ""}`}
                        name="country" value={fields.country} onChange={onChange}
                        autoComplete="country-name"
                        aria-required="true" aria-invalid={!!errors.country}
                    >
                        <option value="">Select country…</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </FormField>
            <div className="checkout__nav">
                <a href="#cart" style={{ textDecoration: "none" }}>
                    <button className="checkout__back-btn" type="button">
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                            <path d="M13 5H1M5.5 1L1 5l4.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Return to cart
                    </button>
                </a>
                <button className="checkout__next-btn" onClick={onNext}>
                    <span>
                        Continue to Shipping
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                            <path d="M1 5h12M8.5 1l4.5 4-4.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </button>
            </div>
        </div>
    );
}

function StepShipping({ infoFields, selectedShipping, onSelectShipping, onBack, onNext }) {
    const chosenOption = SHIPPING_OPTIONS.find(o => o.id === selectedShipping);

    return (
        <div style={{ animation: "fade-up 0.45s var(--ease-expo) both" }}>
            <div className="checkout__review-block" aria-label="Contact summary">
                <div className="checkout__review-row">
                    <span className="checkout__review-key">Contact</span>
                    <span className="checkout__review-val">{infoFields.email}</span>
                    <button className="checkout__review-edit" onClick={onBack} aria-label="Edit contact information">Edit</button>
                </div>
                <div className="checkout__review-row">
                    <span className="checkout__review-key">Ship to</span>
                    <span className="checkout__review-val">
                        {infoFields.address}{infoFields.apartment ? `, ${infoFields.apartment}` : ""}, {infoFields.city}, {infoFields.postal}, {infoFields.country}
                    </span>
                    <button className="checkout__review-edit" onClick={onBack} aria-label="Edit shipping address">Edit</button>
                </div>
            </div>
            <h2 className="checkout__section-heading">Shipping Method</h2>
            <div className="checkout__shipping-options" role="group" aria-label="Select shipping method">
                {SHIPPING_OPTIONS.map(opt => (
                    <button
                        key={opt.id}
                        className="checkout__shipping-option"
                        aria-pressed={selectedShipping === opt.id}
                        onClick={() => onSelectShipping(opt.id)}
                    >
                        <span className="checkout__shipping-radio" aria-hidden="true" />
                        <span className="checkout__shipping-info">
                            <span className="checkout__shipping-label">{opt.label}</span>
                            <span className="checkout__shipping-detail">{opt.detail}</span>
                        </span>
                        <span className={`checkout__shipping-price${opt.price === 0 ? " checkout__shipping-price--free" : ""}`}>
                            {opt.price === 0 ? "Free" : fmt(opt.price)}
                        </span>
                    </button>
                ))}
            </div>
            <div className="checkout__nav">
                <button className="checkout__back-btn" onClick={onBack} type="button">
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                        <path d="M13 5H1M5.5 1L1 5l4.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to information
                </button>
                <button className="checkout__next-btn" onClick={onNext} disabled={!selectedShipping}>
                    <span>
                        Continue to Payment
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                            <path d="M1 5h12M8.5 1l4.5 4-4.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </button>
            </div>
        </div>
    );
}

function StepPayment({ infoFields, shippingId, payFields, payErrors, payMethod, onChange, onMethodChange, onBack, onSubmit, submitting }) {
    const network = detectCardNetwork(payFields.cardNum);
    const shippingOption = SHIPPING_OPTIONS.find(o => o.id === shippingId);

    return (
        <div style={{ animation: "fade-up 0.45s var(--ease-expo) both" }}>
            <div className="checkout__review-block" aria-label="Order review">
                <div className="checkout__review-row">
                    <span className="checkout__review-key">Contact</span>
                    <span className="checkout__review-val">{infoFields.email}</span>
                    <button className="checkout__review-edit" onClick={() => onBack(0)} aria-label="Edit contact">Edit</button>
                </div>
                <div className="checkout__review-row">
                    <span className="checkout__review-key">Ship to</span>
                    <span className="checkout__review-val">
                        {infoFields.address}, {infoFields.city}, {infoFields.postal}, {infoFields.country}
                    </span>
                    <button className="checkout__review-edit" onClick={() => onBack(0)} aria-label="Edit address">Edit</button>
                </div>
                <div className="checkout__review-row">
                    <span className="checkout__review-key">Method</span>
                    <span className="checkout__review-val">{shippingOption?.label} · {shippingOption?.detail}</span>
                    <button className="checkout__review-edit" onClick={() => onBack(1)} aria-label="Edit shipping method">Edit</button>
                </div>
            </div>
            <h2 className="checkout__section-heading">Payment</h2>
            <div className="checkout__pay-methods" role="group" aria-label="Select payment method">
                {[
                    { id: "card", label: "Card", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" /><path d="M1 10h22" /></svg> },
                    { id: "paypal", label: "PayPal", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12c1.5 2.5 4.5 3 7 2s4-3 3.5-5.5C16 6 13.5 5 11 5H7L5 17h3l1-5" /></svg> },
                    { id: "apple", label: "Apple Pay", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a3 3 0 0 0-3 3M9 8C5.5 8 3 11 3 14c0 3.5 2.5 7 5 7 1.5 0 2-.5 4-.5s2.5.5 4 .5c2.5 0 5-3.5 5-7 0-3-2.5-6-6-6" /></svg> },
                ].map(m => (
                    <button
                        key={m.id}
                        className="checkout__pay-method"
                        aria-pressed={payMethod === m.id}
                        onClick={() => onMethodChange(m.id)}
                    >
                        {m.icon}
                        {m.label}
                    </button>
                ))}
            </div>
            {payMethod === "card" && (
                <>
                    <div className="checkout__card-icons" aria-label="Accepted cards">
                        {["VISA", "MC", "AMEX", "DISC"].map(n => (
                            <span key={n} className={`checkout__card-icon${network === n ? " checkout__card-icon--active" : ""}`}>
                                {n}
                            </span>
                        ))}
                    </div>
                    <FormField label="Name on card" required error={payErrors.nameOnCard}>
                        <input
                            className={`checkout__input${payErrors.nameOnCard ? " checkout__input--error" : payFields.nameOnCard ? " checkout__input--valid" : ""}`}
                            name="nameOnCard" value={payFields.nameOnCard} onChange={onChange}
                            placeholder="Jordan Chen" autoComplete="cc-name"
                            aria-required="true" aria-invalid={!!payErrors.nameOnCard}
                        />
                    </FormField>
                    <FormField label="Card number" required error={payErrors.cardNum}>
                        <div className="checkout__card-row">
                            <input
                                className={`checkout__input${payErrors.cardNum ? " checkout__input--error" : isCardNum(payFields.cardNum) ? " checkout__input--valid" : ""}`}
                                name="cardNum"
                                value={payFields.cardNum}
                                onChange={(e) => onChange({ target: { name: "cardNum", value: formatCardNumber(e.target.value) } })}
                                placeholder="0000 0000 0000 0000"
                                autoComplete="cc-number"
                                inputMode="numeric"
                                maxLength={19}
                                aria-required="true"
                            />
                            <input
                                className={`checkout__input${payErrors.expiry ? " checkout__input--error" : ""}`}
                                name="expiry"
                                value={payFields.expiry}
                                onChange={(e) => onChange({ target: { name: "expiry", value: formatExpiry(e.target.value) } })}
                                placeholder="MM / YY"
                                autoComplete="cc-exp"
                                inputMode="numeric"
                                maxLength={7}
                                aria-label="Expiry date"
                            />
                            <input
                                className={`checkout__input${payErrors.cvc ? " checkout__input--error" : ""}`}
                                name="cvc"
                                value={payFields.cvc}
                                onChange={onChange}
                                placeholder="CVC"
                                autoComplete="cc-csc"
                                inputMode="numeric"
                                maxLength={4}
                                aria-label="CVC security code"
                            />
                        </div>
                        {(payErrors.expiry || payErrors.cvc) && (
                            <span className="checkout__field-error" role="alert">
                                {payErrors.expiry || payErrors.cvc}
                            </span>
                        )}
                    </FormField>
                </>
            )}
            {payMethod === "paypal" && (
                <div style={{ padding: "1.5rem", background: "#eceae4", textAlign: "center", fontSize: "0.85rem", color: "var(--color-muted)", fontWeight: 300 }}>
                    You'll be redirected to PayPal to complete your payment securely.
                </div>
            )}
            {payMethod === "apple" && (
                <div style={{ padding: "1.5rem", background: "#eceae4", textAlign: "center", fontSize: "0.85rem", color: "var(--color-muted)", fontWeight: 300 }}>
                    Apple Pay will be prompted on supported devices.
                </div>
            )}
            <p className="checkout__security" aria-label="Security note">
                <svg width="13" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Your payment info is encrypted with 256-bit SSL and never stored on our servers.
            </p>
            <div className="checkout__nav">
                <button className="checkout__back-btn" onClick={() => onBack(1)} type="button">
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                        <path d="M13 5H1M5.5 1L1 5l4.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to shipping
                </button>
                <button
                    className="checkout__next-btn"
                    onClick={onSubmit}
                    disabled={submitting}
                    aria-label={submitting ? "Processing order" : "Place order"}
                >
                    <span>
                        {submitting ? (
                            <><span className="spinner" aria-hidden="true" />Processing…</>
                        ) : (
                            <>
                                Place Order
                                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                                    <path d="M1 5h12M8.5 1l4.5 4-4.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </>
                        )}
                    </span>
                </button>
            </div>
        </div>
    );
}

function OrderSide({ shippingId }) {
    const option = SHIPPING_OPTIONS.find(o => o.id === shippingId);
    const shippingCost = option ? option.price : SHIPPING_COST;
    const subtotal = ORDER_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
    const total = subtotal + shippingCost;

    return (
        <aside className="checkout__order-side" aria-label="Order summary">
            <p className="checkout__order-heading">Order Summary</p>
            <div className="checkout__order-items-wrap">
                {ORDER_ITEMS.map(item => (
                    <div key={item.id} className="checkout__order-item">
                        <div className="checkout__order-thumb">
                            {item.src ? (
                                <img className="checkout__order-thumb-img" src={item.src} alt={item.name} />
                            ) : (
                                <div className="checkout__order-thumb-placeholder" aria-hidden="true">
                                    <svg viewBox="0 0 56 56" fill="none">
                                        <rect x="7" y="14" width="42" height="32" rx="2" stroke="#0d0d0d" strokeWidth="2" />
                                        <path d="M7 25l14-11 11 9 7-6 11 8" stroke="#0d0d0d" strokeWidth="2" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            )}
                            {item.qty > 1 && (
                                <span className="checkout__order-badge" aria-label={`Quantity: ${item.qty}`}>
                                    {item.qty}
                                </span>
                            )}
                        </div>
                        <div className="checkout__order-info">
                            <p className="checkout__order-name">{item.name}</p>
                            <div className="checkout__order-attrs">
                                <span className="checkout__order-color-dot" style={{ backgroundColor: item.color.hex }} aria-hidden="true" />
                                <span>{item.color.label}</span>
                                <span className="checkout__order-dot" aria-hidden="true" />
                                <span>{item.size}</span>
                            </div>
                        </div>
                        <span className="checkout__order-price">{fmt(item.price * item.qty)}</span>
                    </div>
                ))}
            </div>
            <div className="checkout__order-divider" aria-hidden="true" />
            <div className="checkout__order-line">
                <span>Subtotal</span>
                <span className="checkout__order-line-val">{fmt(subtotal)}</span>
            </div>
            <div className="checkout__order-line">
                <span>Shipping</span>
                <span className="checkout__order-line-val">
                    {option ? (option.price === 0 ? "Free" : fmt(option.price)) : "—"}
                </span>
            </div>
            <div className="checkout__order-line checkout__order-line--total">
                <span>Total</span>
                <span className="checkout__order-line-val">{fmt(option ? total : subtotal)}</span>
            </div>
        </aside>
    );
}

const INITIAL_INFO = {
    firstName: "", lastName: "", email: "", phone: "",
    address: "", apartment: "", city: "", postal: "", country: "",
};
const INITIAL_PAY = { nameOnCard: "", cardNum: "", expiry: "", cvc: "" };

export default function Checkout() {
    const [step, setStep] = useState(0);
    const [infoFields, setInfoFields] = useState(INITIAL_INFO);
    const [infoErrors, setInfoErrors] = useState({});
    const [selectedShipping, setSelectedShipping] = useState("standard");
    const [payFields, setPayFields] = useState(INITIAL_PAY);
    const [payErrors, setPayErrors] = useState({});
    const [payMethod, setPayMethod] = useState("card");
    const [submitting, setSubmitting] = useState(false);

    const handleInfoChange = useCallback((e) => {
        const { name, value } = e.target;
        setInfoFields(p => ({ ...p, [name]: value }));
        setInfoErrors(p => ({ ...p, [name]: undefined }));
    }, []);

    const handlePayChange = useCallback((e) => {
        const { name, value } = e.target;
        setPayFields(p => ({ ...p, [name]: value }));
        setPayErrors(p => ({ ...p, [name]: undefined }));
    }, []);

    const handleInfoNext = useCallback(() => {
        const errs = validateInfo(infoFields);
        if (Object.keys(errs).length) { setInfoErrors(errs); return; }
        setStep(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [infoFields]);

    const handleShippingNext = useCallback(() => {
        setStep(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const handleBack = useCallback((targetStep) => {
        setStep(targetStep ?? (s => Math.max(0, s - 1)));
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const handleSubmit = useCallback(async () => {
        if (payMethod === "card") {
            const errs = validatePayment(payFields);
            if (Object.keys(errs).length) { setPayErrors(errs); return; }
        }
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 2000));
        setSubmitting(false);
        setStep(3);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [payFields, payMethod]);

    const orderNumber = useMemo(() => `AVX-${Math.floor(100000 + Math.random() * 900000)}`, []);

    if (step === 3) {
        return (
            <>
                <div className="checkout">
                    <div className="checkout__layout">
                        <div className="checkout__confirm" role="status" aria-live="polite">
                            <div className="checkout__confirm-icon" aria-hidden="true">
                                <svg width="28" height="24" viewBox="0 0 28 24" fill="none" aria-hidden="true">
                                    <path d="M2 12l8 9L26 2" stroke="#0d0d0d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className="checkout__confirm-eyebrow">Order confirmed</p>
                            <h1 className="checkout__confirm-heading">
                                Thank<br /><em>You</em>
                            </h1>
                            <p className="checkout__confirm-body">
                                Your order has been placed and is being prepared. We'll send a confirmation to{" "}
                                <strong>{infoFields.email || "your email"}</strong>.
                            </p>
                            <div className="checkout__order-num">
                                Order number: <span>{orderNumber}</span>
                            </div>
                            <button className="checkout__confirm-cta">
                                <span>Continue Shopping</span>
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="checkout">
                <div className="checkout__topbar">
                    <nav className="checkout__stepper" aria-label="Checkout steps">
                        {STEPS.map((label, i) => {
                            const state = i < step ? "complete" : i === step ? "active" : "upcoming";
                            return (
                                <div key={label} style={{ display: "flex", alignItems: "center" }}>
                                    <div className={`checkout__step checkout__step--${state}`} aria-current={state === "active" ? "step" : undefined}>
                                        <span className="checkout__step-num" aria-hidden="true">
                                            {state === "complete" ? (
                                                <svg width="9" height="8" viewBox="0 0 9 8" fill="none" aria-hidden="true">
                                                    <path d="M1 4l2.5 3L8 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            ) : i + 1}
                                        </span>
                                        <span className="checkout__step-label">{label}</span>
                                    </div>
                                    {i < STEPS.length - 1 && <div className="checkout__step-sep" aria-hidden="true" />}
                                </div>
                            );
                        })}
                    </nav>
                </div>
                <div className="checkout__layout">
                    <main className="checkout__form-side">
                        {step === 0 && (
                            <StepInformation
                                fields={infoFields}
                                errors={infoErrors}
                                onChange={handleInfoChange}
                                onNext={handleInfoNext}
                            />
                        )}
                        {step === 1 && (
                            <StepShipping
                                infoFields={infoFields}
                                selectedShipping={selectedShipping}
                                onSelectShipping={setSelectedShipping}
                                onBack={() => handleBack(0)}
                                onNext={handleShippingNext}
                            />
                        )}
                        {step === 2 && (
                            <StepPayment
                                infoFields={infoFields}
                                shippingId={selectedShipping}
                                payFields={payFields}
                                payErrors={payErrors}
                                payMethod={payMethod}
                                onChange={handlePayChange}
                                onMethodChange={setPayMethod}
                                onBack={handleBack}
                                onSubmit={handleSubmit}
                                submitting={submitting}
                            />
                        )}
                    </main>
                    <OrderSide shippingId={selectedShipping} />
                </div>
            </div>
        </>
    );
}