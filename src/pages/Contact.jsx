import { useState, useId } from "react";
import { useEffect } from "react";
import '../styles/Contact.css';
const CONTACT_CHANNELS = [
    {
        id: "email",
        label: "Email Us",
        value: "support@avex.com",
        detail: "Response within 24 hours",
        href: "mailto:support@avex.com",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 7l10 7 10-7" />
            </svg>
        ),
    },
    {
        id: "phone",
        label: "Call Us",
        value: "+1 (800) 283-9700",
        detail: "Mon – Fri, 9am – 6pm EST",
        href: "tel:+18002839700",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 5.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
        ),
    },
    {
        id: "location",
        label: "Visit Us",
        value: "130 Greene St, New York",
        detail: "SoHo Flagship Store",
        href: "https://maps.google.com",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                <circle cx="12" cy="10" r="3" />
            </svg>
        ),
    },
];

const SUBJECTS = [
    "Order enquiry",
    "Returns & exchanges",
    "Product information",
    "Wholesale",
    "Press & media",
    "Other",
];

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const INITIAL_FORM = { firstName: "", lastName: "", email: "", subject: "", message: "" };
const INITIAL_ERRS = { firstName: "", lastName: "", email: "", subject: "", message: "" };

function validate(fields) {
    const errs = { ...INITIAL_ERRS };
    if (!fields.firstName.trim()) errs.firstName = "Required.";
    if (!fields.lastName.trim()) errs.lastName = "Required.";
    if (!fields.email.trim()) errs.email = "Required.";
    else if (!isValidEmail(fields.email)) errs.email = "Invalid email address.";
    if (!fields.subject) errs.subject = "Please choose a subject.";
    if (!fields.message.trim()) errs.message = "Please write a message.";
    const hasError = Object.values(errs).some(Boolean);
    return { errs, hasError };
}
export default function Contact() {
    const ids = {
        firstName: useId(),
        lastName: useId(),
        email: useId(),
        subject: useId(),
        message: useId(),
    };
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);
    const [fields, setFields] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState(INITIAL_ERRS);
    const [status, setStatus] = useState("idle");
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { errs, hasError } = validate(fields);
        if (hasError) { setErrors(errs); return; }
        setStatus("loading");
        await new Promise((res) => setTimeout(res, 1400));
        setStatus("success");
    };

    const isLoading = status === "loading";

    return (
        <>
            <section className="contact" id="contact" aria-labelledby="contact-heading">
                <div className="contact__layout">
                    <div className="contact__info">
                        <p className="contact__eyebrow" aria-hidden="true">Get in touch</p>
                        <h2 className="contact__heading" id="contact-heading">
                            Let's<br /><em>Talk</em>
                        </h2>
                        <p className="contact__intro">
                            Whether it's a question about your order, a wholesale enquiry,
                            or just want to say hello — we're here for it.
                        </p>
                        <ul className="contact__channels" role="list" aria-label="Contact channels">
                            {CONTACT_CHANNELS.map(({ id, label, value, detail, href, icon }) => (
                                <li key={id}>
                                    <a
                                        href={href}
                                        className="contact__channel"
                                        aria-label={`${label}: ${value}`}
                                        target={id === "location" ? "_blank" : undefined}
                                        rel={id === "location" ? "noopener noreferrer" : undefined}
                                    >
                                        <span className="contact__channel-icon">{icon}</span>
                                        <span>
                                            <span className="contact__channel-label">{label}</span>
                                            <span className="contact__channel-value" style={{ display: "block" }}>{value}</span>
                                            <span className="contact__channel-detail">{detail}</span>
                                        </span>
                                        <span className="contact__channel-arrow">
                                            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                                                <path d="M1 5h12M8.5 1l4.5 4-4.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="contact__form-wrap">
                        {status === "success" ? (
                            <div className="contact__success" role="status" aria-live="polite">
                                <span className="contact__success-badge">
                                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true">
                                        <path d="M1 4.5l3 3.5L10 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Message sent
                                </span>
                                <p className="contact__success-title">We'll be<br />in touch.</p>
                                <p className="contact__success-body">
                                    Thanks for reaching out. Expect a reply within one business day.
                                </p>
                            </div>
                        ) : (
                            <>
                                <h3 className="contact__form-heading">Send a Message</h3>
                                <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
                                    <div className="contact__row">
                                        <div className="contact__field">
                                            <label className="contact__label" htmlFor={ids.firstName}>First name</label>
                                            <input
                                                id={ids.firstName}
                                                className={`contact__input${errors.firstName ? " contact__input--error" : ""}`}
                                                type="text"
                                                name="firstName"
                                                value={fields.firstName}
                                                onChange={handleChange}
                                                placeholder="Jordan"
                                                autoComplete="given-name"
                                                aria-required="true"
                                                aria-invalid={!!errors.firstName}
                                                disabled={isLoading}
                                            />
                                            {errors.firstName && (
                                                <span className="contact__field-error" role="alert">{errors.firstName}</span>
                                            )}
                                        </div>
                                        <div className="contact__field">
                                            <label className="contact__label" htmlFor={ids.lastName}>Last name</label>
                                            <input
                                                id={ids.lastName}
                                                className={`contact__input${errors.lastName ? " contact__input--error" : ""}`}
                                                type="text"
                                                name="lastName"
                                                value={fields.lastName}
                                                onChange={handleChange}
                                                placeholder="Chen"
                                                autoComplete="family-name"
                                                aria-required="true"
                                                aria-invalid={!!errors.lastName}
                                                disabled={isLoading}
                                            />
                                            {errors.lastName && (
                                                <span className="contact__field-error" role="alert">{errors.lastName}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="contact__field">
                                        <label className="contact__label" htmlFor={ids.email}>Email address</label>
                                        <input
                                            id={ids.email}
                                            className={`contact__input${errors.email ? " contact__input--error" : ""}`}
                                            type="email"
                                            name="email"
                                            value={fields.email}
                                            onChange={handleChange}
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                            aria-required="true"
                                            aria-invalid={!!errors.email}
                                            disabled={isLoading}
                                        />
                                        {errors.email && (
                                            <span className="contact__field-error" role="alert">{errors.email}</span>
                                        )}
                                    </div>
                                    <div className="contact__field">
                                        <label className="contact__label" htmlFor={ids.subject}>Subject</label>
                                        <div className="contact__select-wrap">
                                            <select
                                                id={ids.subject}
                                                className={`contact__select${errors.subject ? " contact__select--error" : ""}`}
                                                name="subject"
                                                value={fields.subject}
                                                onChange={handleChange}
                                                aria-required="true"
                                                aria-invalid={!!errors.subject}
                                                disabled={isLoading}
                                            >
                                                <option value="" disabled>Choose a topic…</option>
                                                {SUBJECTS.map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {errors.subject && (
                                            <span className="contact__field-error" role="alert">{errors.subject}</span>
                                        )}
                                    </div>
                                    <div className="contact__field">
                                        <label className="contact__label" htmlFor={ids.message}>Message</label>
                                        <textarea
                                            id={ids.message}
                                            className={`contact__textarea${errors.message ? " contact__textarea--error" : ""}`}
                                            name="message"
                                            value={fields.message}
                                            onChange={handleChange}
                                            placeholder="Tell us what's on your mind…"
                                            aria-required="true"
                                            aria-invalid={!!errors.message}
                                            disabled={isLoading}
                                        />
                                        {errors.message && (
                                            <span className="contact__field-error" role="alert">{errors.message}</span>
                                        )}
                                    </div>
                                    <div className="contact__submit-row">
                                        <p className="contact__privacy-note">
                                            Your data is used solely to respond to your enquiry.
                                        </p>
                                        <button
                                            type="submit"
                                            className="contact__submit"
                                            disabled={isLoading}
                                            aria-label="Send message"
                                        >
                                            <span>
                                                {isLoading ? (
                                                    <><span className="spinner" aria-hidden="true" />Sending…</>
                                                ) : (
                                                    "Send Message"
                                                )}
                                            </span>
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}