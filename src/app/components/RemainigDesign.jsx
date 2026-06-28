import React from 'react';

const ArtCategoriesPage = () => {
    return (
        <>
            {/* ইনলাইন কাস্টম সিএসএস স্টাইল যা আপনার দেওয়া কোডের নিখুঁত রূপ */}
            <style dangerouslySetInnerHTML={{
                __html: `
        :root {
          --bg-1: #1e1e20;
          --bg-2: #0c0c0d;
          --card-bg: #18181a;
          --card-bg-soft: #1b1b1d;
          --card-border: rgba(255,255,255,0.07);
          --text-hi: #f3efe8;
          --text-mid: #9a9a9e;
          --text-low: #6e6e73;
          --accent: #c9943a;
          --accent-soft: #dcae5c;
        }

        .art-hub-body {
          background: var(--bg-2);
          color: var(--text-hi);
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }

        .container {
          max-width: 980px;
          margin: 0 auto;
          padding: 0 32px;
        }

        .eyebrow {
          text-align: center;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 10px;
        }

        .heading {
          text-align: center;
          font-weight: 700;
          font-size: 34px;
          color: var(--text-hi);
          margin-bottom: 40px;
          letter-spacing: -0.01em;
        }

        /* ---------- Section 1 : Top Artists ---------- */
        .artists-section {
          background: var(--bg-1);
          padding: 64px 0 68px;
        }

        .artists-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .artist-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 14px;
          padding: 28px 20px 26px;
          text-align: center;
          transition: transform .25s ease, border-color .25s ease;
        }

        .artist-card:hover {
          transform: translateY(-3px);
          border-color: rgba(255,255,255,0.14);
        }

        .avatar-wrap {
          position: relative;
          width: 68px;
          height: 68px;
          margin: 0 auto 18px;
        }

        .avatar {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 20px;
          color: rgba(255,255,255,0.92);
          box-shadow: 0 0 0 2px rgba(255,255,255,0.06);
        }

        .avatar.a1 { background: linear-gradient(145deg, #6a2c30, #3c1b1e); }
        .avatar.a2 { background: linear-gradient(145deg, #46504f, #262d2c); }
        .avatar.a3 { background: linear-gradient(145deg, #3a3f5c, #1f2233); }

        .rank-badge {
          position: absolute;
          top: -4px;
          right: -6px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        }

        .rank-badge svg { width: 12px; height: 12px; }

        .artist-name {
          font-weight: 700;
          font-size: 16px;
          color: var(--text-hi);
          margin-bottom: 5px;
        }

        .artist-specialty {
          font-size: 12.5px;
          color: var(--text-mid);
          margin-bottom: 16px;
        }

        .sales-row {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .sales-row svg { width: 13px; height: 13px; color: var(--accent); flex-shrink: 0; }
        .sales-count { color: var(--text-hi); font-weight: 700; }
        .sales-label { color: var(--accent-soft); text-transform: uppercase; letter-spacing: 0.04em; font-size: 11px; }

        /* ---------- Section 2 : Art Categories ---------- */
        .categories-section {
          background: var(--bg-2);
          padding: 62px 0 80px;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 14px;
          margin-bottom: 56px;
        }

        .category-card {
          position: relative;
          aspect-ratio: 4/4.6;
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          isolation: isolate;
          cursor: pointer;
          transition: transform .25s ease;
        }

        .category-card:hover { transform: translateY(-3px); }

        .category-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 75%);
          z-index: 1;
        }

        .category-card .cat-info {
          position: relative;
          z-index: 2;
          text-align: center;
          padding-bottom: 14px;
        }

        .category-card .cat-name {
          display: block;
          font-weight: 700;
          font-size: 12.5px;
          color: #fff;
          margin-bottom: 2px;
        }

        .category-card .cat-count {
          display: block;
          font-size: 10px;
          color: rgba(255,255,255,0.65);
          letter-spacing: 0.02em;
        }

        .cat-painting { background: radial-gradient(circle at 30% 20%, #f0c14b, transparent 55%), linear-gradient(155deg,#e8743a 0%, #b23a2e 45%, #1f8a7a 100%); }
        .cat-digital { background: radial-gradient(circle at 60% 40%, #ff7ad1 0%, transparent 60%), linear-gradient(155deg,#5e1a73 0%, #9c2d8e 55%, #2c0f3d 100%); }
        .cat-sculpture { background: radial-gradient(circle at 50% 30%, #c9a23a 0%, transparent 45%), linear-gradient(155deg,#3a3a3a 0%, #161616 60%, #050505 100%); }
        .cat-photography { background: linear-gradient(155deg,#4a4a4a 0%, #232323 55%, #101010 100%); }
        .cat-watercolor { background: linear-gradient(155deg,#bcd4dd 0%, #d8a85e 55%, #8a5b35 100%); }
        .cat-illustration { background: linear-gradient(155deg,#aebfd1 0%, #6f8fae 55%, #c98a7a 100%); }

        /* ---------- CTA ---------- */
        .cta-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          padding: 46px 48px;
          background:
            radial-gradient(circle at 88% 78%, rgba(120,120,120,0.16) 0%, transparent 38%),
            radial-gradient(circle at 10% 15%, rgba(255,255,255,0.03) 0%, transparent 40%),
            linear-gradient(155deg, #161514 0%, #0c0b0a 55%, #050505 100%);
        }

        .cta-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 3px);
          mix-blend-mode: overlay;
          pointer-events: none;
        }

        .cta-content { position: relative; z-index: 1; max-width: 420px; }
        .cta-heading {  font-weight: 700; font-size: 24px; color: var(--text-hi); margin-bottom: 10px; }
        .cta-sub { font-size: 13px; color: var(--text-mid); margin-bottom: 22px; }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--accent);
          color: #1a1408;
          font-weight: 700;
          font-size: 13px;
          padding: 11px 20px;
          border-radius: 7px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: background .2s ease, transform .2s ease;
        }

        .cta-button:hover { background: var(--accent-soft); transform: translateY(-1px); }
        .cta-button svg { width: 14px; height: 14px; }

        /* ---------- Responsive ---------- */
        @media (max-width: 760px) {
          .artists-grid { grid-template-columns: 1fr; gap: 14px; }
          .categories-grid { grid-template-columns: repeat(3, 1fr); }
          .heading { font-size: 26px; }
          .cta-card { padding: 34px 26px; }
        }

        @media (max-width: 480px) {
          .categories-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}} />

            <div className="art-hub-body">
                {/* Top Artists Section */}
                <section className="artists-section">
                    <div className="w-11/12 mx-auto">
                        <p className="eyebrow">Community</p>
                        <h2 className="heading">Top Artists</h2>

                        <div className="artists-grid">
                            {/* Artist 1 */}
                            <div className="artist-card">
                                <div className="avatar-wrap">
                                    <div className="avatar a1">LN</div>
                                    <span className="rank-badge">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2l2.4 4.86 5.36.78-3.88 3.78.92 5.34L12 14.27l-4.8 2.49.92-5.34L4.24 7.64l5.36-.78L12 2z" fill="#1a1408" />
                                        </svg>
                                    </span>
                                </div>
                                <h3 className="artist-name">Leila Nasser</h3>
                                <p className="artist-specialty">Digital &amp; Watercolor</p>
                                <div className="sales-row">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 12.5l2.2 2.2L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.6" />
                                    </svg>
                                    <span className="sales-count">47</span>
                                    <span className="sales-label">sales</span>
                                </div>
                            </div>

                            {/* Artist 2 */}
                            <div className="artist-card">
                                <div className="avatar-wrap">
                                    <div className="avatar a2">JC</div>
                                </div>
                                <h3 className="artist-name">James Calloway</h3>
                                <p className="artist-specialty">Painting &amp; Sculpture</p>
                                <div className="sales-row">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 12.5l2.2 2.2L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.6" />
                                    </svg>
                                    <span className="sales-count">39</span>
                                    <span className="sales-label">sales</span>
                                </div>
                            </div>

                            {/* Artist 3 */}
                            <div className="artist-card">
                                <div className="avatar-wrap">
                                    <div className="avatar a3">SM</div>
                                </div>
                                <h3 className="artist-name">Sofia Marchetti</h3>
                                <p className="artist-specialty">Digital Art</p>
                                <div className="sales-row">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 12.5l2.2 2.2L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.6" />
                                    </svg>
                                    <span className="sales-count">35</span>
                                    <span className="sales-label">sales</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Art Categories Section */}
                <section className="categories-section">
                    <div className="w-11/12 mx-auto">
                        <p className="eyebrow">Explore</p>
                        <h2 className="heading">Art Categories</h2>

                        <div className="categories-grid">
                            <div className="category-card cat-painting">
                                <div className="cat-info">
                                    <span className="cat-name">Painting</span>
                                    <span className="cat-count">284</span>
                                </div>
                            </div>
                            <div className="category-card cat-digital">
                                <div className="cat-info">
                                    <span className="cat-name">Digital</span>
                                    <span className="cat-count">192</span>
                                </div>
                            </div>
                            <div className="category-card cat-sculpture">
                                <div className="cat-info">
                                    <span className="cat-name">Sculpture</span>
                                    <span className="cat-count">97</span>
                                </div>
                            </div>
                            <div className="category-card cat-photography">
                                <div className="cat-info">
                                    <span className="cat-name">Photography</span>
                                    <span className="cat-count">156</span>
                                </div>
                            </div>
                            <div className="category-card cat-watercolor">
                                <div className="cat-info">
                                    <span className="cat-name">Watercolor</span>
                                    <span className="cat-count">128</span>
                                </div>
                            </div>
                            <div className="category-card cat-illustration">
                                <div className="cat-info">
                                    <span className="cat-name">Illustration</span>
                                    <span className="cat-count">211</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Card */}
                        <div className="cta-card">
                            <div className="cta-content">
                                <h3 className="cta-heading">Are you an artist?</h3>
                                <p className="cta-sub">Join thousands of creators selling their work globally.</p>
                                <button className="cta-button">
                                    Start Selling
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12h14M13 6l6 6-6 6" stroke="#1a1408" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default ArtCategoriesPage;