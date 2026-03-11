import { useState, useCallback, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --font-display: 'Bebas Neue', sans-serif;
    --font-body:    'DM Sans', sans-serif;
    --color-ink:    #0d0d0d;
    --color-chalk:  #f5f3ee;
    --color-accent: #c8f23a;
    --color-muted:  #8a8778;
    --color-border: #e2dfd8;
    --color-error:  #e05c5c;
    --ease-expo:    cubic-bezier(0.16, 1, 0.3, 1);
    --nav-height:   72px;
  }

  .pdp {
    min-height: 100svh;
    padding-top: var(--nav-height);
    background: var(--color-chalk);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
  }

  .pdp__breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2.5rem;
    border-bottom: 1px solid var(--color-border);
    list-style: none;
    margin: 0;
  }

  .pdp__breadcrumb-item {
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-muted);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .pdp__breadcrumb-item a {
    color: var(--color-muted);
    text-decoration: none;
    transition: color 0.18s ease;
  }
  .pdp__breadcrumb-item a:hover { color: var(--color-ink); }
  .pdp__breadcrumb-item--current { color: var(--color-ink); font-weight: 500; }
  .pdp__breadcrumb-sep { color: var(--color-border); font-size: 0.8rem; }

  .pdp__layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: calc(100svh - var(--nav-height) - 46px);
  }

  .pdp__gallery {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 0;
    overflow: hidden;
    border-right: 1px solid var(--color-border);
    background: var(--color-chalk);
    height: calc(100svh - var(--nav-height) - 46px);
    max-height: 800px;
  }

  .pdp__thumbs {
    display: flex;
    flex-direction: column;
    gap: 0;
    border-right: 1px solid var(--color-border);
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .pdp__thumbs::-webkit-scrollbar { display: none; }

  .pdp__thumb {
    width: 80px;
    aspect-ratio: 1 / 1;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    border-bottom: 1px solid var(--color-border);
    border-right: 2px solid transparent;
    overflow: hidden;
    position: relative;
    transition: border-color 0.2s ease;
    flex-shrink: 0;
  }
  .pdp__thumb[aria-pressed='true'] { border-right-color: var(--color-ink); }
  .pdp__thumb-inner {
    width: 100%; height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(145deg, #dedad2, #ccc8be);
    transition: transform 0.4s var(--ease-expo);
  }
  .pdp__thumb:hover .pdp__thumb-inner { transform: scale(1.06); }
  .pdp__thumb-inner svg { opacity: 0.12; width: 24px; height: 24px; }
  .pdp__thumb-inner img { width: 100%; height: 100%; object-fit: cover; }

  .pdp__main-image {
    position: relative;
    overflow: hidden;
    background: #eceae4;
    width: 100%;
    height: 100%;
  }

  .pdp__main-inner {
    width: 100%; height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(145deg, #e4e0d8 0%, #d5d0c8 100%);
    animation: gallery-fade 0.4s var(--ease-expo) both;
  }
  .pdp__main-inner svg { opacity: 0.1; width: 100px; height: 100px; }
  .pdp__main-img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    animation: gallery-fade 0.4s var(--ease-expo) both;
    transition: transform 0.7s var(--ease-expo);
  }
  .pdp__main-image:hover .pdp__main-img { transform: scale(1.03); }

  @keyframes gallery-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .pdp__gallery-badge {
    position: absolute;
    top: 1.25rem;
    left: 1.25rem;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.3rem 0.65rem;
    z-index: 2;
  }
  .pdp__gallery-badge--bestseller { background: var(--color-ink); color: var(--color-chalk); }
  .pdp__gallery-badge--new        { background: var(--color-accent); color: var(--color-ink); }
  .pdp__gallery-badge--sale       { background: var(--color-error); color: #fff; }
  .pdp__gallery-badge--limited    { background: #f2d23a; color: var(--color-ink); }

  .pdp__gallery-wish {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    width: 38px; height: 38px;
    border: 1px solid var(--color-border);
    background: rgba(245,243,238,0.88);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--color-muted);
    transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
    z-index: 2;
  }
  .pdp__gallery-wish:hover { color: var(--color-error); background: #fff; border-color: var(--color-error); }
  .pdp__gallery-wish--active { color: var(--color-error); border-color: var(--color-error); }
  .pdp__gallery-wish:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }

  .pdp__zoom-hint {
    position: absolute;
    bottom: 1rem; right: 1rem;
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-muted);
    display: flex;
    align-items: center;
    gap: 0.35rem;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 2;
  }
  .pdp__main-image:hover .pdp__zoom-hint { opacity: 1; }

  .pdp__image-dots {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.4rem;
    z-index: 2;
  }
  .pdp__image-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--color-border);
    border: none;
    cursor: pointer;
    padding: 0;
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .pdp__image-dot[aria-pressed='true'] {
    background: var(--color-ink);
    transform: scale(1.4);
  }

  .pdp__info {
    padding: 3rem 3rem 4rem;
    display: flex;
    flex-direction: column;
    gap: 0;
    overflow-y: auto;
    background: var(--color-chalk);
    height: calc(100svh - var(--nav-height) - 46px);
    max-height: 800px;
  }

  .pdp__meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.6rem;
  }

  .pdp__category {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--color-muted);
  }

  .pdp__rating {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }
  .pdp__stars {
    display: flex;
    gap: 0.1rem;
    color: #f2d23a;
  }
  .pdp__rating-text {
    font-size: 0.72rem;
    font-weight: 300;
    color: var(--color-muted);
  }

  .pdp__name {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 5vw, 4rem);
    line-height: 0.92;
    letter-spacing: 0.01em;
    color: var(--color-ink);
    margin-bottom: 1.25rem;
    animation: fade-up 0.6s 0.05s var(--ease-expo) both;
  }

  .pdp__pricing {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    animation: fade-up 0.6s 0.1s var(--ease-expo) both;
  }

  .pdp__price {
    font-family: var(--font-display);
    font-size: 2.2rem;
    letter-spacing: 0.04em;
    color: var(--color-ink);
    line-height: 1;
  }
  .pdp__price--sale { color: var(--color-error); }

  .pdp__original-price {
    font-size: 1.1rem;
    font-weight: 300;
    color: var(--color-muted);
    text-decoration: line-through;
  }

  .pdp__discount-badge {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    padding: 0.2rem 0.55rem;
    background: var(--color-accent);
    color: var(--color-ink);
    align-self: center;
  }

  .pdp__divider {
    height: 1px;
    background: var(--color-border);
    margin: 1.5rem 0;
  }

  .pdp__option-heading {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-muted);
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .pdp__option-selected {
    font-weight: 400;
    color: var(--color-ink);
    text-transform: none;
    letter-spacing: 0.02em;
  }

  .pdp__colors {
    display: flex;
    gap: 0.6rem;
    margin-bottom: 0;
    animation: fade-up 0.6s 0.15s var(--ease-expo) both;
  }

  .pdp__color-btn {
    width: 32px; height: 32px;
    border-radius: 50%;
    border: 2.5px solid transparent;
    cursor: pointer;
    padding: 2px;
    background-clip: padding-box;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s ease, transform 0.2s var(--ease-expo);
    position: relative;
  }
  .pdp__color-btn:hover { transform: scale(1.1); }
  .pdp__color-btn[aria-pressed='true'] { border-color: var(--color-ink); }
  .pdp__color-btn:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }

  .pdp__color-inner {
    width: 100%; height: 100%;
    border-radius: 50%;
    border: 1px solid rgba(0,0,0,0.08);
  }

  .pdp__sizes {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 0;
    animation: fade-up 0.6s 0.2s var(--ease-expo) both;
  }

  .pdp__size-btn {
    min-width: 52px;
    height: 44px;
    border: 1.5px solid var(--color-border);
    background: none;
    font-family: var(--font-body);
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--color-muted);
    cursor: pointer;
    letter-spacing: 0.06em;
    transition: border-color 0.18s ease, color 0.18s ease, background 0.18s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.75rem;
    position: relative;
  }
  .pdp__size-btn:hover { border-color: var(--color-ink); color: var(--color-ink); }
  .pdp__size-btn[aria-pressed='true'] {
    border-color: var(--color-ink);
    background: var(--color-ink);
    color: var(--color-chalk);
  }
  .pdp__size-btn--unavailable {
    opacity: 0.32;
    cursor: not-allowed;
    text-decoration: line-through;
  }
  .pdp__size-btn--unavailable:hover {
    border-color: var(--color-border);
    color: var(--color-muted);
    background: none;
  }
  .pdp__size-btn:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }

  .pdp__size-guide-link {
    background: none;
    border: none;
    font-family: var(--font-body);
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 0.06em;
    color: var(--color-muted);
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;
    padding: 0;
    transition: color 0.18s ease;
    align-self: center;
    margin-left: auto;
  }
  .pdp__size-guide-link:hover { color: var(--color-ink); }

  .pdp__size-error {
    font-size: 0.72rem;
    color: var(--color-error);
    letter-spacing: 0.04em;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    min-height: 1.1rem;
    margin-top: 0.5rem;
    animation: fade-up 0.3s var(--ease-expo) both;
  }

  .pdp__qty-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    animation: fade-up 0.6s 0.25s var(--ease-expo) both;
  }

  .pdp__qty {
    display: flex;
    align-items: center;
    border: 1.5px solid var(--color-border);
    width: fit-content;
  }

  .pdp__qty-btn {
    background: none;
    border: none;
    width: 40px; height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--color-muted);
    font-size: 1.1rem;
    transition: background 0.15s ease, color 0.15s ease;
  }
  .pdp__qty-btn:hover:not(:disabled) { background: var(--color-ink); color: var(--color-chalk); }
  .pdp__qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .pdp__qty-num {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--color-ink);
    width: 36px;
    text-align: center;
    border-left: 1.5px solid var(--color-border);
    border-right: 1.5px solid var(--color-border);
    line-height: 44px;
    user-select: none;
  }

  .pdp__stock-tag {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .pdp__stock-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #5cb85c;
    animation: pulse-dot 2.2s ease infinite;
  }
  .pdp__stock-tag--low .pdp__stock-dot { background: var(--color-error); }
  .pdp__stock-tag--low { color: var(--color-error); }
  .pdp__stock-tag--in { color: #5cb85c; }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.7); }
  }

  .pdp__ctas {
    display: flex;
    gap: 0.75rem;
    animation: fade-up 0.6s 0.3s var(--ease-expo) both;
  }

  .pdp__add-btn {
    flex: 1;
    background: var(--color-ink);
    color: var(--color-chalk);
    border: none;
    padding: 1rem 1.5rem;
    font-family: var(--font-body);
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.15s ease;
  }
  .pdp__add-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: var(--color-accent);
    transform: translateX(-101%);
    transition: transform 0.4s var(--ease-expo);
    z-index: 0;
  }
  .pdp__add-btn:not(:disabled):hover::after { transform: translateX(0); }
  .pdp__add-btn:not(:disabled):hover        { color: var(--color-ink); }
  .pdp__add-btn:active    { transform: scale(0.99); }
  .pdp__add-btn:disabled  { background: var(--color-border); color: var(--color-muted); cursor: not-allowed; }
  .pdp__add-btn:disabled::after { display: none; }
  .pdp__add-btn--added    { background: var(--color-accent) !important; color: var(--color-ink) !important; }
  .pdp__add-btn span      { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
  .pdp__add-btn:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }

  .pdp__buy-btn {
    flex: 1;
    background: none;
    border: 1.5px solid var(--color-ink);
    color: var(--color-ink);
    padding: 1rem 1.5rem;
    font-family: var(--font-body);
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .pdp__buy-btn:hover { background: var(--color-ink); color: var(--color-chalk); }
  .pdp__buy-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .pdp__description {
    font-size: 0.9rem;
    font-weight: 300;
    line-height: 1.75;
    color: var(--color-muted);
    animation: fade-up 0.6s 0.35s var(--ease-expo) both;
  }

  .pdp__accordions {
    display: flex;
    flex-direction: column;
    gap: 0;
    animation: fade-up 0.6s 0.4s var(--ease-expo) both;
  }

  .pdp__accordion {
    border-top: 1px solid var(--color-border);
  }
  .pdp__accordion:last-child { border-bottom: 1px solid var(--color-border); }

  .pdp__accordion-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: none;
    border: none;
    font-family: var(--font-body);
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-ink);
    padding: 1.1rem 0;
    cursor: pointer;
    text-align: left;
    transition: opacity 0.18s ease;
  }
  .pdp__accordion-toggle:hover { opacity: 0.65; }

  .pdp__accordion-icon {
    width: 16px; height: 16px;
    position: relative;
    flex-shrink: 0;
  }
  .pdp__accordion-icon::before,
  .pdp__accordion-icon::after {
    content: '';
    position: absolute;
    background: var(--color-ink);
    border-radius: 1px;
    transition: transform 0.3s var(--ease-expo), opacity 0.3s ease;
  }
  .pdp__accordion-icon::before { width: 16px; height: 1.5px; top: 50%; left: 0; transform: translateY(-50%); }
  .pdp__accordion-icon::after  { width: 1.5px; height: 16px; left: 50%; top: 0; transform: translateX(-50%); }
  .pdp__accordion-toggle[aria-expanded='true'] .pdp__accordion-icon::after { transform: translateX(-50%) rotate(90deg); opacity: 0; }

  .pdp__accordion-body {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.4s var(--ease-expo);
  }
  .pdp__accordion-body--open { max-height: 400px; }

  .pdp__accordion-content {
    padding-bottom: 1.25rem;
    font-size: 0.85rem;
    font-weight: 300;
    line-height: 1.75;
    color: var(--color-muted);
  }

  .pdp__accordion-list {
    list-style: none;
    padding: 0; margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .pdp__accordion-list li {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    font-size: 0.84rem;
    font-weight: 300;
    color: var(--color-muted);
  }
  .pdp__accordion-list li::before {
    content: '—';
    flex-shrink: 0;
    color: var(--color-border);
  }

  .pdp__share {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-muted);
    animation: fade-up 0.6s 0.45s var(--ease-expo) both;
  }
  .pdp__share-btn {
    width: 32px; height: 32px;
    border: 1px solid var(--color-border);
    background: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--color-muted);
    transition: border-color 0.18s ease, color 0.18s ease;
  }
  .pdp__share-btn:hover { border-color: var(--color-ink); color: var(--color-ink); }

  .pdp__trust {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1.5rem;
    animation: fade-up 0.6s 0.5s var(--ease-expo) both;
  }
  .pdp__trust-item {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 0.04em;
    color: var(--color-muted);
  }

  .pdp__related {
    grid-column: 1 / -1;
    padding: 4rem 2.5rem;
    border-top: 1px solid var(--color-border);
    background: #eceae4;
    width: 100%;
    position: relative;
    z-index: 1;
  }

  .pdp__related-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 2.5rem;
  }

  .pdp__related-eyebrow {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-muted);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .pdp__related-eyebrow::before {
    content: '';
    display: block;
    width: 1.75rem;
    height: 1px;
    background: var(--color-muted);
  }

  .pdp__related-heading {
    font-family: var(--font-display);
    font-size: clamp(2rem, 4vw, 3.5rem);
    letter-spacing: 0.01em;
    color: var(--color-ink);
    line-height: 0.92;
    margin: 0;
  }

  .pdp__related-link {
    font-family: var(--font-body);
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-ink);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-bottom: 0.15rem;
    border-bottom: 1px solid var(--color-ink);
    transition: gap 0.25s var(--ease-expo);
    white-space: nowrap;
  }
  .pdp__related-link:hover { gap: 0.85rem; }

  .pdp__related-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }

  .rcard {
    display: flex;
    flex-direction: column;
    background: var(--color-chalk);
    cursor: pointer;
    position: relative;
    transition: transform 0.3s var(--ease-expo);
    text-decoration: none;
    color: inherit;
    width: 100%;
    height: 100%;
  }
  .rcard:hover { transform: translateY(-4px); }

  .rcard__media {
    aspect-ratio: 3 / 4;
    overflow: hidden;
    background: #dedad2;
    position: relative;
    width: 100%;
  }
  .rcard__placeholder {
    width: 100%; height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(145deg, #dedad2 0%, #ccc8be 100%);
    transition: transform 0.65s var(--ease-expo);
  }
  .rcard:hover .rcard__placeholder { transform: scale(1.06); }
  .rcard__placeholder svg { opacity: 0.12; width: 40px; height: 40px; }
  .rcard__placeholder img { width: 100%; height: 100%; object-fit: cover; }

  .rcard__badge {
    position: absolute;
    top: 0.65rem; left: 0.65rem;
    font-size: 0.58rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.2rem 0.5rem; z-index: 2;
  }
  .rcard__badge--bestseller { background: var(--color-ink); color: var(--color-chalk); }
  .rcard__badge--new        { background: var(--color-accent); color: var(--color-ink); }
  .rcard__badge--sale       { background: var(--color-error); color: #fff; }
  .rcard__badge--limited    { background: #f2d23a; color: var(--color-ink); }

  .rcard__body {
    padding: 0.85rem 0.85rem 1rem;
    width: 100%;
  }
  .rcard__name {
    font-size: 0.82rem;
    font-weight: 400;
    color: var(--color-ink);
    line-height: 1.3;
    margin-bottom: 0.35rem;
  }
  .rcard__prices {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
  }
  .rcard__price {
    font-family: var(--font-display);
    font-size: 1.2rem;
    letter-spacing: 0.04em;
    color: var(--color-ink);
    line-height: 1;
  }
  .rcard__original {
    font-size: 0.74rem;
    font-weight: 300;
    color: var(--color-muted);
    text-decoration: line-through;
  }

  .pdp__not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 1rem;
    text-align: center;
    padding: 2rem;
  }
  .pdp__not-found-glyph {
    font-family: var(--font-display);
    font-size: 6rem;
    color: var(--color-border);
    line-height: 1;
  }
  .pdp__not-found-title {
    font-family: var(--font-display);
    font-size: 2rem;
    color: var(--color-ink);
    letter-spacing: 0.04em;
  }
  .pdp__not-found-text {
    font-size: 0.875rem;
    font-weight: 300;
    color: var(--color-muted);
  }
  .pdp__not-found-btn {
    background: var(--color-ink);
    color: var(--color-chalk);
    border: none;
    padding: 0.875rem 2rem;
    font-family: var(--font-body);
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    margin-top: 0.5rem;
    text-decoration: none;
    display: inline-block;
    transition: background 0.2s ease;
  }
  .pdp__not-found-btn:hover { background: #222; }

  .spinner {
    width: 15px; height: 15px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 1024px) {
    .pdp__layout { grid-template-columns: 1fr; }
    .pdp__gallery {
      height: 70vw;
      max-height: 560px;
    }
    .pdp__info {
      height: auto;
      max-height: none;
    }
    .pdp__related-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 700px) {
    .pdp__breadcrumb  { padding: 0.85rem 1.25rem; }
    .pdp__info        { padding: 2rem 1.25rem 3rem; }
    .pdp__gallery     { height: 90vw; max-height: 420px; }
    .pdp__thumbs      { display: none; }
    .pdp__gallery     { grid-template-columns: 1fr; }
    .pdp__ctas        { flex-direction: column; }
    .pdp__related     { padding: 3rem 1.25rem; }
    .pdp__related-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
    .pdp__related-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
  }
`;

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
                <style>{styles}</style>
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
                <style>{styles}</style>
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
            <style>{styles}</style>
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