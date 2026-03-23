import { useState, useEffect, useRef } from "react";
import '../styles/About.css'
const TIMELINE = [
    { year: "2018", event: "The Idea", desc: "Two friends, one city, one shared obsession with clothes that actually mean something. AVEX starts as a sketch on a napkin in a Casablanca café.", accent: false },
    { year: "2019", event: "First Drop", desc: "Twenty-four oversized hoodies, sold out in six hours. No ads, no influencers — just word of mouth and a blurry Instagram post.", accent: true },
    { year: "2020", event: "Going Digital", desc: "While the world stood still, we built the store. Lockdown gave us time to obsess over every detail — the fit, the weight, the colour. We launched online to 12 countries.", accent: false },
    { year: "2021", event: "Denim Era", desc: "The jeans line drops. Four fits, sixty waist-length combinations. The Slim Tapered sells out in under three days and stays sold out for two months.", accent: false },
    { year: "2022", event: "Sole Culture", desc: "We enter footwear. Sneakers that stand between high sport and low art — vulcanised, chunky, and built to last longer than your longest playlist.", accent: true },
    { year: "2024", event: "The Store", desc: "A physical flagship in Casablanca — bare concrete, accent-yellow railings, and a DJ booth in the corner. Because streetwear was never just online.", accent: false },
    { year: "2026", event: "Now", desc: "New season, new silhouettes. The same refusal to compromise. AVEX is still just two friends who care too much about the clothes you wear every day.", accent: true },
];

const VALUES = [
    {
        num: "01",
        title: "Built to Last",
        text: "We spec every gram of fabric before a single sample is cut. 400gsm minimums, reinforced seams, and colourways that age into something better — not worse.",
    },
    {
        num: "02",
        title: "No Hype Tax",
        text: "We don't charge a premium for marketing. What you pay covers the material, the craft, and a fair margin — nothing else. AVEX prices are what AVEX costs to make right.",
    },
    {
        num: "03",
        title: "Street, Not Stage",
        text: "Our clothes are designed for real movement in real cities. Every silhouette is tested walking, cycling, and sitting on concrete kerbs — not standing on a shoot set.",
    },
];

const TEAM = [
    { name: "Zakaryae Rouane", role: "Co-Founder & Creative", initials: "ZR" },
    { name: "Karim Benali", role: "Co-Founder & Operations", initials: "KB" },
    { name: "Nora El Fassi", role: "Head of Design", initials: "NE" },
    { name: "Amine Tahiri", role: "Fabric & Sourcing", initials: "AT" },
];

const SUSTAIN_ITEMS = [
    "100% GOTS-certified organic cotton on all basics",
    "Zero single-use plastic in packaging since 2022",
    "Carbon-neutral shipping on all domestic orders",
    "Repair programme: send it back, we'll fix it free",
    "Partner factories audited annually for fair wages",
];

const MARQUEE_ITEMS = [
    "Est. 2018", "Casablanca Born", "Global Shipped",
    "400gsm Standard", "Zero Compromises", "Worn Not Wasted",
    "Est. 2018", "Casablanca Born", "Global Shipped",
    "400gsm Standard", "Zero Compromises", "Worn Not Wasted",
];
function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.12 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return [ref, visible];
}
function RevealBlock({ children, delay = "", className = "", tag: Tag = "div" }) {
    const [ref, visible] = useReveal();
    return (
        <Tag
            ref={ref}
            className={`reveal${visible ? " reveal--visible" : ""}${delay ? ` reveal--delay-${delay}` : ""}${className ? ` ${className}` : ""}`}
        >
            {children}
        </Tag>
    );
}
export default function About() {
    return (
        <>
            <div className="about" id="about">
                <section className="about__hero" aria-label="About AVEX">
                    <div className="about__hero-year" aria-hidden="true">2018</div>
                    <div className="about__hero-content">
                        <p className="about__hero-eyebrow" aria-hidden="true">AVEX — Est. 2018</p>
                        <h1 className="about__hero-heading">
                            We Make<br />
                            <em>Real</em><br />
                            <span>Clothes</span>
                        </h1>
                    </div>
                    <div className="about__hero-bottom">
                        <p className="about__hero-tagline">
                            "AVEX started because we were tired of paying for the brand and not the garment.
                            So we made the garment, and let it be the brand."
                        </p>
                        <div className="about__hero-kpis" aria-label="Key figures">
                            <div className="about__hero-kpi">
                                <div className="about__hero-kpi-num">7<span>+</span></div>
                                <div className="about__hero-kpi-label">Years</div>
                            </div>
                            <div className="about__hero-kpi">
                                <div className="about__hero-kpi-num">40<span>+</span></div>
                                <div className="about__hero-kpi-label">Countries</div>
                            </div>
                            <div className="about__hero-kpi">
                                <div className="about__hero-kpi-num">0</div>
                                <div className="about__hero-kpi-label">Compromises</div>
                            </div>
                        </div>
                    </div>
                    <div className="about__hero-stitch" aria-hidden="true" />
                    <div className="about__scroll-hint" aria-hidden="true">
                        <span className="about__scroll-text">Scroll</span>
                        <div className="about__scroll-line" />
                    </div>
                </section>
                <section className="about__manifesto" aria-labelledby="manifesto-heading">
                    <div className="about__manifesto-label" id="manifesto-heading" aria-hidden="true">
                        Our Manifesto
                    </div>
                    <div className="about__manifesto-body">
                        <RevealBlock>
                            <h2 className="about__manifesto-intro">
                                Streetwear Built<br />for the <em>Street.</em><br />Not the Feed.
                            </h2>
                        </RevealBlock>
                        <RevealBlock delay="1">
                            <p className="about__manifesto-text">
                                Most brands are selling you a story. We're selling you <strong>a hoodie that still fits after
                                    three years of washing.</strong> The story is a bonus.
                            </p>
                        </RevealBlock>
                        <RevealBlock delay="2">
                            <p className="about__manifesto-text">
                                AVEX was founded in Casablanca by two people who cared too much about clothes to let
                                the industry keep cutting corners. We source the weight, we approve the fit, we test
                                the colourways in daylight and neon and whatever light your city throws at you at 2am.
                            </p>
                        </RevealBlock>
                        <RevealBlock delay="3">
                            <p className="about__manifesto-text">
                                <strong>We don't do seasons.</strong> We do pieces. Each one is made until it's right,
                                then made available until it's gone. No artificial scarcity. No restock theatre.
                                Just product that earns its place in your rotation.
                            </p>
                        </RevealBlock>
                    </div>
                </section>
                <section className="about__timeline" aria-labelledby="timeline-heading">
                    <RevealBlock>
                        <p className="about__section-eyebrow" id="timeline-heading">Our Journey</p>
                    </RevealBlock>
                    <div className="about__timeline-track" role="list">
                        {TIMELINE.map((item, i) => (
                            <RevealBlock
                                key={item.year}
                                delay={Math.min(i + 1, 5).toString()}
                                tag="div"
                                className={`about__timeline-item${item.accent ? " about__timeline-item--accent" : ""}`}
                            >
                                <div className="about__timeline-year" aria-label={`Year: ${item.year}`}>{item.year}</div>
                                <div className="about__timeline-content" role="listitem">
                                    <p className="about__timeline-event">{item.event}</p>
                                    <p className="about__timeline-desc">{item.desc}</p>
                                </div>
                            </RevealBlock>
                        ))}
                    </div>
                </section>
                <section className="about__values" aria-labelledby="values-heading">
                    <RevealBlock>
                        <p className="about__section-eyebrow" id="values-heading">What We Stand For</p>
                    </RevealBlock>
                    <ul className="about__values-grid" role="list">
                        {VALUES.map((v, i) => (
                            <RevealBlock
                                key={v.num}
                                delay={(i + 1).toString()}
                                tag="li"
                                className="about__value-item"
                            >
                                <span className="about__value-num" aria-hidden="true">{v.num}</span>
                                <h3 className="about__value-title">{v.title}</h3>
                                <p className="about__value-text">{v.text}</p>
                            </RevealBlock>
                        ))}
                    </ul>
                </section>
                <div className="about__stats-marquee" aria-hidden="true">
                    <div className="about__marquee-track">
                        {MARQUEE_ITEMS.map((item, i) => (
                            <span key={i} className="about__marquee-item">{item}</span>
                        ))}
                    </div>
                </div>
                <section className="about__team" aria-labelledby="team-heading">
                    <RevealBlock>
                        <p className="about__section-eyebrow">The People</p>
                    </RevealBlock>
                    <RevealBlock delay="1">
                        <h2 className="about__team-heading" id="team-heading">
                            Behind<br /><em>Every</em><br />Piece
                        </h2>
                    </RevealBlock>
                    <ul className="about__team-grid" role="list">
                        {TEAM.map((member, i) => (
                            <RevealBlock
                                key={member.name}
                                delay={(i + 1).toString()}
                                tag="li"
                            >
                                <div className="about__member">
                                    <div className="about__member-img" aria-hidden="true">
                                        <span className="about__member-initials">{member.initials}</span>
                                    </div>
                                    <p className="about__member-name">{member.name}</p>
                                    <p className="about__member-role">{member.role}</p>
                                </div>
                            </RevealBlock>
                        ))}
                    </ul>
                </section>
                <section className="about__sustain" aria-labelledby="sustain-heading">
                    <RevealBlock>
                        <div className="about__sustain-visual" aria-hidden="true">
                            <div className="about__sustain-ring" />
                            <div className="about__sustain-ring" />
                            <div className="about__sustain-ring" />
                            <div className="about__sustain-ring" />
                            <div className="about__sustain-ring">
                                <span className="about__sustain-center-label">ECO</span>
                            </div>
                        </div>
                    </RevealBlock>
                    <div className="about__sustain-content">
                        <RevealBlock delay="1">
                            <h2 className="about__sustain-heading" id="sustain-heading">
                                Made<br /><em>Right.</em><br />Worn Long.
                            </h2>
                        </RevealBlock>
                        <RevealBlock delay="2">
                            <p className="about__sustain-text">
                                We believe the most sustainable garment is the one you still wear in five years.
                                That starts with fabric weight, honest construction, and a repair programme that means
                                you never have to throw it away.
                            </p>
                        </RevealBlock>
                        <RevealBlock delay="3">
                            <ul className="about__sustain-list" role="list" aria-label="Sustainability commitments">
                                {SUSTAIN_ITEMS.map((item, i) => (
                                    <li key={i} className="about__sustain-list-item">
                                        <span className="about__sustain-check" aria-hidden="true">
                                            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                                <path d="M1 3.5l2.5 3L8 1" stroke="#0d0d0d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </RevealBlock>
                    </div>
                </section>
                <section className="about__cta-band" aria-label="Shop call to action">
                    <RevealBlock>
                        <h2 className="about__cta-heading">
                            Wear<br />What<br /><em>Lasts</em>
                        </h2>
                    </RevealBlock>
                    <RevealBlock delay="2">
                        <a href="/shop" className="about__cta-btn">
                            <span>
                                Shop Now
                                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                                    <path d="M1 5h12M8.5 1l4.5 4-4.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </a>
                    </RevealBlock>
                </section>
            </div>
        </>
    );
}