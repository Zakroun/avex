import '../styles/Footer.css';
const FOOTER_LINKS = {
    Shop: [
        { label: "Hoodies", href: "#hoodies" },
        { label: "Jeans", href: "#jeans" },
        { label: "Sneakers", href: "#sneakers" },
        { label: "New Arrivals", href: "#new" },
        { label: "Sale", href: "#sale" },
    ],
    Help: [
        { label: "Sizing Guide", href: "#sizing" },
        { label: "Shipping", href: "#shipping" },
        { label: "Returns", href: "#returns" },
        { label: "Track Order", href: "#tracking" },
        { label: "Contact Us", href: "#contact" },
    ],
    Company: [
        { label: "About AVEX", href: "#about" },
        { label: "Sustainability", href: "#sustainability" },
        { label: "Careers", href: "#careers" },
        { label: "Press", href: "#press" },
        { label: "Stockists", href: "#stockists" },
    ],
};

const SOCIALS = [
    {
        label: "Instagram",
        href: "https://instagram.com",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
            </svg>
        ),
    },
    {
        label: "TikTok",
        href: "https://tiktok.com",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
            </svg>
        ),
    },
    {
        label: "X / Twitter",
        href: "https://x.com",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L2.25 2.25h6.863l4.258 5.629 4.873-5.629Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
            </svg>
        ),
    },
    {
        label: "Pinterest",
        href: "https://pinterest.com",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.03-2.83.19-.77 1.27-5.35 1.27-5.35s-.32-.65-.32-1.61c0-1.51.88-2.64 1.97-2.64.93 0 1.38.7 1.38 1.53 0 .94-.6 2.33-.9 3.62-.26 1.08.53 1.96 1.59 1.96 1.9 0 3.18-2 3.18-4.9 0-2.56-1.84-4.35-4.47-4.35-3.05 0-4.84 2.29-4.84 4.65 0 .92.35 1.9.8 2.44.09.1.1.19.07.3-.08.33-.26 1.08-.3 1.23-.05.2-.16.24-.37.15-1.39-.65-2.26-2.68-2.26-4.32 0-3.51 2.55-6.74 7.35-6.74 3.86 0 6.86 2.75 6.86 6.42 0 3.83-2.41 6.9-5.76 6.9-1.12 0-2.18-.58-2.54-1.27l-.69 2.58c-.25.96-.93 2.16-1.39 2.89.5.16 1.03.24 1.59.24 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
            </svg>
        ),
    },
];

const LEGAL_LINKS = [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "Cookie Settings", href: "#cookies" },
];

export default function Footer() {
    const handleBackToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            
            <footer className="footer" role="contentinfo">
                <div className="footer__upper">
                    <div className="footer__brand">
                        <a href="/" className="footer__wordmark" aria-label="AVEX — back to home">
                            AVEX
                        </a>
                        <p className="footer__tagline">
                            Premium streetwear for those who move through the city on their own terms.
                        </p>
                        <ul className="footer__socials" role="list" aria-label="Social media links">
                            {SOCIALS.map(({ label, href, icon }) => (
                                <li key={label}>
                                    <a
                                        href={href}
                                        className="footer__social-link"
                                        aria-label={label}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {icon}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
                        <nav key={heading} aria-label={`${heading} links`}>
                            <p className="footer__col-heading" aria-hidden="true">{heading}</p>
                            <ul className="footer__nav-list" role="list">
                                {links.map(({ label, href }) => (
                                    <li key={label}>
                                        <a href={href} className="footer__nav-link">{label}</a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}
                </div>
                <div className="footer__lower">
                    <p className="footer__copy">
                        © {new Date().getFullYear()} AVEX Fashion. All rights reserved.
                    </p>
                    <ul className="footer__legal" role="list" aria-label="Legal links">
                        {LEGAL_LINKS.map(({ label, href }) => (
                            <li key={label}>
                                <a href={href} className="footer__legal-link">{label}</a>
                            </li>
                        ))}
                    </ul>
                    <button
                        className="footer__back-top"
                        onClick={handleBackToTop}
                        aria-label="Scroll back to top of page"
                    >
                        Top
                        <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                            <path d="M6 13V1M1 6l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </footer>
        </>
    );
}