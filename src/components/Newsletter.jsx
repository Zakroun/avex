import { useState, useId } from "react";
import '../styles/Newsletter.css';
const PERKS = ["Early access to drops", "Members-only offers", "No spam, ever"];

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
export default function Newsletter() {
    const emailId = useId();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [status, setStatus] = useState("idle");

    const validate = () => {
        if (!email.trim()) return "Email address is required.";
        if (!isValidEmail(email)) return "Please enter a valid email address.";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }
        setError("");
        setStatus("loading");
        await new Promise((res) => setTimeout(res, 1200));
        setStatus("success");
    };

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (error) setError("");
    };

    return (
        <>
            
            <section className="newsletter" aria-labelledby="newsletter-heading">
                <div className="newsletter__inner">
                    {status === "success" ? (
                        <div className="newsletter__success" role="status" aria-live="polite">
                            <div className="newsletter__success-badge">
                                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                                    <path d="M1 5l3.5 4L11 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                You're in
                            </div>
                            <p className="newsletter__success-text">Welcome to<br />the community.</p>
                            <p className="newsletter__success-sub">
                                Check your inbox — your first drop alert is on its way.
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="newsletter__eyebrow" aria-hidden="true">Stay in the loop</p>
                            <h2 className="newsletter__heading" id="newsletter-heading">
                                Join the<br /><em>Community</em>
                            </h2>
                            <p className="newsletter__body">
                                Be first to know about new drops, exclusive restocks,
                                and members-only offers — straight to your inbox.
                            </p>
                            <ul className="newsletter__perks" aria-label="Subscription benefits">
                                {PERKS.map((perk) => (
                                    <li key={perk} className="newsletter__perk">{perk}</li>
                                ))}
                            </ul>
                            <form
                                className="newsletter__form"
                                onSubmit={handleSubmit}
                                noValidate
                                aria-label="Newsletter signup"
                            >
                                <div className="newsletter__field">
                                    <input
                                        id={emailId}
                                        type="email"
                                        className={`newsletter__input${error ? " newsletter__input--error" : ""}`}
                                        value={email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        autoComplete="email"
                                        aria-required="true"
                                        aria-invalid={!!error}
                                        aria-describedby={error ? `${emailId}-error` : undefined}
                                        disabled={status === "loading"}
                                    />
                                    <label className="newsletter__label" htmlFor={emailId}>
                                        Email address
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className="newsletter__submit"
                                    disabled={status === "loading"}
                                    aria-label="Subscribe to newsletter"
                                >
                                    <span>
                                        {status === "loading" ? (
                                            <><span className="spinner" aria-hidden="true" />Joining…</>
                                        ) : (
                                            "Subscribe"
                                        )}
                                    </span>
                                </button>
                            </form>
                            <p
                                id={`${emailId}-error`}
                                className="newsletter__error"
                                role="alert"
                                aria-live="polite"
                            >
                                {error}
                            </p>
                        </>
                    )}
                </div>
            </section>
        </>
    );
}