import fs from 'fs';
import NavbarAuth from './components/NavbarAuth';
import NewsletterForm from './components/NewsletterForm';
import path from 'path';
import Image from "next/image";
import { 
  Search,
  Heart,
  ChevronDown,
  Smartphone, 
  Laptop, 
  Gamepad2, 
  Headphones, 
  Star, 
  ShoppingCart, 
  ShieldCheck, 
  Lock, 
  Truck, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Check,
  Globe,
  Share2,
  Mail,
  Play
} from "lucide-react";

// Image synchronization script (runs on the server when the page loads/builds)
function syncImages() {
  try {
    const srcDir = 'C:\\Users\\ADAN\\.gemini\\antigravity\\brain\\85930ca2-8859-450b-baac-0136578da9c5';
    const destDir = path.join(process.cwd(), 'public', 'images');

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    if (fs.existsSync(srcDir)) {
      const files = fs.readdirSync(srcDir);
      const targets = [
        { prefix: 'hero_macbook', dest: 'hero_macbook.png' },
        { prefix: 'category_smartphone', dest: 'category_smartphone.png' },
        { prefix: 'category_laptop', dest: 'category_laptop.png' },
        { prefix: 'listing_iphone', dest: 'listing_iphone.png' },
        { prefix: 'listing_macbook', dest: 'listing_macbook.png' },
        { prefix: 'listing_ps5', dest: 'listing_ps5.png' }
      ];

      targets.forEach(target => {
        const match = files.find(f => f.startsWith(target.prefix) && f.endsWith('.png'));
        if (match) {
          const srcPath = path.join(srcDir, match);
          const destPath = path.join(destDir, target.dest);
          if (!fs.existsSync(destPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Successfully synced image: ${target.dest}`);
          }
        }
      });
    }
  } catch (err) {
    console.error('Failed to sync generated images:', err);
  }
}

// Call sync script
syncImages();

export default function Home() {
  return (
    <>
      {/* Header / Navbar */}
      <header className="header">
        <div className="container">
          <nav className="navbar" role="navigation" aria-label="Main Navigation">
            {/* Left: Logo + Nav Links */}
            <div className="nav-left">
              <a href="#" className="logo" id="nav-logo">TechMarket</a>
              <div className="nav-links">
                <a href="#" className="nav-link" id="link-home">Home</a>
                <a href="#" className="nav-link nav-link-dropdown" id="link-categories">
                  Categories
                  <ChevronDown size={14} />
                </a>
              </div>
            </div>

            {/* Centre: Search bar (unchanged) */}
            <div className="nav-search-container">
              <Search className="search-icon" />
              <input 
                type="text" 
                placeholder="Search for iPhones, MacBooks, or Gaming Consoles" 
                className="search-input"
                id="search-bar"
              />
            </div>

            {/* Right: Guest auth actions */}
            <div className="nav-right">
              <NavbarAuth />
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-section" aria-label="Introduction">
          <div className="container hero-container">
            <div className="hero-content">
              <span className="hero-tag">The Secondary Market, Reimagined</span>
              <h1 className="hero-title">
                <span>Premium Tech.</span>
                <span>Guaranteed Trust.</span>
              </h1>
              <p className="hero-desc">
                Buy and sell high-end pre-owned devices with the confidence of a brand-new purchase. Every listing is verified by our SafeDeal protocol.
              </p>
              
              <div className="hero-actions">
                <button className="btn-primary" id="btn-shop-all">Shop All Devices</button>
                <button className="btn-secondary" id="btn-sell-device">Sell Your Device</button>
              </div>

              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-value">4.9/5</span>
                  <span className="stat-label">Customer Trust</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">24h</span>
                  <span className="stat-label">Avg. Payout</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">100%</span>
                  <span className="stat-label">SafeDeal Secure</span>
                </div>
              </div>
            </div>

            <div className="hero-image-container">
              <div className="hero-image-wrapper">
                <Image 
                  src="/images/hero_macbook.png" 
                  alt="Premium MacBook open on desk" 
                  fill
                  priority
                  className="hero-image"
                  sizes="(max-width: 1024px) 100vw, 500px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Explore Categories */}
        <section className="explore-section" aria-label="Explore Categories">
          <div className="container">
            <div className="section-header">
              <div className="section-title-group">
                <h2 className="section-title">Explore Categories</h2>
                <p className="section-subtitle">Refined selection of pre-owned technology.</p>
              </div>
              <a href="#" className="section-link" id="link-view-all-categories">
                <span>View All</span>
                <ArrowRight size={16} />
              </a>
            </div>

            <div className="categories-grid">
              {/* Smartphones Large Card */}
              <div className="category-card-large">
                <div className="category-info">
                  <div className="category-icon-wrapper flex-center">
                    <Smartphone size={24} />
                  </div>
                  <h3 className="category-card-title">Smartphones</h3>
                  <p className="category-card-desc">Flagship iPhones and Android devices with battery health guarantees.</p>
                  <button className="pill-btn" id="btn-browse-phones">Browse Phones</button>
                </div>
                <Image 
                  src="/images/category_smartphone.png" 
                  alt="Premium smartphones back cameras" 
                  width={320}
                  height={240}
                  className="category-img-phones"
                />
              </div>

              {/* Right Side Column (Laptops, and row of Gaming/Audio) */}
              <div className="right-categories-col">
                {/* Laptops Horizontal Card */}
                <div className="category-card-horizontal">
                  <div className="category-info">
                    <div className="category-icon-wrapper flex-center">
                      <Laptop size={24} />
                    </div>
                    <h3 className="category-card-title" style={{ fontSize: '24px', marginBottom: '16px' }}>Laptops</h3>
                    <button className="pill-btn" id="btn-explore-mac-pc">Explore Mac & PC</button>
                  </div>
                  <Image 
                    src="/images/category_laptop.png" 
                    alt="Two premium laptops side by side" 
                    width={220}
                    height={140}
                    className="category-img-laptops"
                  />
                </div>

                {/* Gaming & Audio Square Cards */}
                <div className="bottom-categories-row">
                  <div className="category-card-square" id="category-gaming">
                    <Gamepad2 size={32} className="category-square-icon" />
                    <div>
                      <h4 className="category-square-name">Gaming</h4>
                      <p className="category-square-sub">PS5, Xbox & PC</p>
                    </div>
                  </div>

                  <div className="category-card-square" id="category-audio">
                    <Headphones size={32} className="category-square-icon" />
                    <div>
                      <h4 className="category-square-name">Audio</h4>
                      <p className="category-square-sub">Hi-Fi & Wireless</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Listings */}
        <section className="trending-section" aria-label="Trending Listings">
          <div className="container">
            <div className="section-header">
              <div className="section-title-group">
                <h2 className="section-title">Trending Listings</h2>
                <p className="section-subtitle">Hand-picked devices from our top-rated sellers.</p>
              </div>
            </div>

            <div className="listings-grid">
              {/* Product 1 */}
              <div className="listing-card">
                <div className="listing-img-wrapper">
                  <span className="listing-tag tag-mint">Mint</span>
                  <button className="favorite-btn" aria-label="Add to Wishlist" id="fav-iphone">
                    <Heart size={16} />
                  </button>
                  <Image 
                    src="/images/listing_iphone.png" 
                    alt="iPhone 15 Pro Max" 
                    fill
                    className="listing-img"
                    sizes="(max-width: 768px) 100vw, 250px"
                  />
                </div>
                <div className="listing-info">
                  <h3 className="listing-title">iPhone 15 Pro Max, 256GB</h3>
                  <p className="listing-details">Silver Titanium • Battery 100%</p>
                  <div className="listing-footer">
                    <span className="listing-price">$1,049</span>
                    <button className="cart-btn" aria-label="Add to Cart" id="cart-iphone">
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product 2 */}
              <div className="listing-card">
                <div className="listing-img-wrapper">
                  <span className="listing-tag tag-excellent">Excellent</span>
                  <button className="favorite-btn" aria-label="Add to Wishlist" id="fav-macbook">
                    <Heart size={16} />
                  </button>
                  <Image 
                    src="/images/listing_macbook.png" 
                    alt="MacBook Pro 14" 
                    fill
                    className="listing-img"
                    sizes="(max-width: 768px) 100vw, 250px"
                  />
                </div>
                <div className="listing-info">
                  <h3 className="listing-title">MacBook Pro 14&quot; (M3 Pro)</h3>
                  <p className="listing-details">18GB RAM • 512GB SSD</p>
                  <div className="listing-footer">
                    <span className="listing-price">$1,799</span>
                    <button className="cart-btn" aria-label="Add to Cart" id="cart-macbook">
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product 3 */}
              <div className="listing-card">
                <div className="listing-img-wrapper">
                  <span className="listing-tag tag-mint">Mint</span>
                  <button className="favorite-btn" aria-label="Add to Wishlist" id="fav-ps5">
                    <Heart size={16} />
                  </button>
                  <Image 
                    src="/images/listing_ps5.png" 
                    alt="PlayStation 5" 
                    fill
                    className="listing-img"
                    sizes="(max-width: 768px) 100vw, 250px"
                  />
                </div>
                <div className="listing-info">
                  <h3 className="listing-title">PlayStation 5 Disc Edition</h3>
                  <p className="listing-details">Incl. 2 DualSense Controllers</p>
                  <div className="listing-footer">
                    <span className="listing-price">$449</span>
                    <button className="cart-btn" aria-label="Add to Cart" id="cart-ps5">
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product 4 */}
              <div className="listing-card">
                <div className="listing-img-wrapper">
                  <span className="listing-tag tag-good">Good</span>
                  <button className="favorite-btn" aria-label="Add to Wishlist" id="fav-sony">
                    <Heart size={16} />
                  </button>
                  {/* Using another available image since headphones didn't generate */}
                  <Image 
                    src="/images/listing_iphone.png" 
                    alt="Sony WH-1000XM5" 
                    fill
                    className="listing-img"
                    style={{ filter: 'hue-rotate(90deg) brightness(0.8)' }}
                    sizes="(max-width: 768px) 100vw, 250px"
                  />
                </div>
                <div className="listing-info">
                  <h3 className="listing-title">Sony WH-1000XM5</h3>
                  <p className="listing-details">Noise Cancelling • Wireless</p>
                  <div className="listing-footer">
                    <span className="listing-price">$265</span>
                    <button className="cart-btn" aria-label="Add to Cart" id="cart-sony">
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The SafeDeal Guarantee */}
        <section className="safedeal-section" aria-label="SafeDeal Guarantee">
          <div className="container safedeal-container">
            <div className="safedeal-content">
              <h2 className="safedeal-title">The SafeDeal Guarantee</h2>
              <div className="benefit-list">
                <div className="benefit-item">
                  <div className="benefit-icon-wrapper">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="benefit-info">
                    <h3 className="benefit-title">Authenticated Listings</h3>
                    <p className="benefit-desc">Every device goes through a digital verification process. We ensure serial numbers match and battery health is reported accurately.</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon-wrapper">
                    <Lock size={24} />
                  </div>
                  <div className="benefit-info">
                    <h3 className="benefit-title">Escrow Protection</h3>
                    <p className="benefit-desc">Your funds are held safely until you receive the item and confirm its condition. Only then is the seller paid.</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon-wrapper">
                    <Truck size={24} />
                  </div>
                  <div className="benefit-info">
                    <h3 className="benefit-title">Insured Shipping</h3>
                    <p className="benefit-desc">All shipments are fully insured and tracked. If it's lost or damaged, you get a full refund instantly.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="safedeal-stats-grid">
              <div className="safedeal-stat-box">
                <span className="safedeal-stat-num">50k+</span>
                <span className="safedeal-stat-label">Devices Sold</span>
              </div>
              <div className="safedeal-stat-box">
                <span className="safedeal-stat-num">12k</span>
                <span className="safedeal-stat-label">Verified Sellers</span>
              </div>
              <div className="safedeal-stat-box">
                <span className="safedeal-stat-num">4.9★</span>
                <span className="safedeal-stat-label">User Rating</span>
              </div>
              <div className="safedeal-stat-box">
                <span className="safedeal-stat-num">$0</span>
                <span className="safedeal-stat-label">Buyer Fees</span>
              </div>
            </div>
          </div>
        </section>

        {/* Top Verified Sellers */}
        <section className="sellers-section" aria-label="Top Verified Sellers">
          <div className="container">
            <div className="section-header">
              <div className="section-title-group">
                <h2 className="section-title">Top Verified Sellers</h2>
              </div>
              <div className="sellers-slider-controls">
                <button className="slider-arrow flex-center" aria-label="Previous Sellers" id="btn-seller-prev">
                  <ChevronLeft size={20} />
                </button>
                <button className="slider-arrow flex-center" aria-label="Next Sellers" id="btn-seller-next">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="sellers-grid">
              {/* Seller 1 */}
              <div className="seller-card">
                <div className="seller-avatar-wrapper">
                  {/* High quality fallback using generated styles */}
                  <div className="seller-avatar flex-center" style={{ background: '#3B82F6', color: 'white', fontWeight: 'bold', fontSize: '24px' }}>TH</div>
                  <span className="seller-badge flex-center">
                    <Check size={12} strokeWidth={3} />
                  </span>
                </div>
                <h3 className="seller-name">TechHustle_NYC</h3>
                <p className="seller-meta">Joined 2021 • 812 Sales</p>
                <div className="seller-rating">
                  <Star size={14} fill="#FBBF24" strokeWidth={0} />
                  <Star size={14} fill="#FBBF24" strokeWidth={0} />
                  <Star size={14} fill="#FBBF24" strokeWidth={0} />
                  <Star size={14} fill="#FBBF24" strokeWidth={0} />
                  <Star size={14} fill="#FBBF24" strokeWidth={0} />
                </div>
                <button className="seller-btn" id="btn-view-store-1">View Store</button>
              </div>

              {/* Seller 2 */}
              <div className="seller-card">
                <div className="seller-avatar-wrapper">
                  <div className="seller-avatar flex-center" style={{ background: '#10B981', color: 'white', fontWeight: 'bold', fontSize: '24px' }}>SR</div>
                  <span className="seller-badge flex-center">
                    <Check size={12} strokeWidth={3} />
                  </span>
                </div>
                <h3 className="seller-name">SiliconResell</h3>
                <p className="seller-meta">Joined 2022 • 890 Sales</p>
                <div className="seller-rating">
                  <Star size={14} fill="#FBBF24" strokeWidth={0} />
                  <Star size={14} fill="#FBBF24" strokeWidth={0} />
                  <Star size={14} fill="#FBBF24" strokeWidth={0} />
                  <Star size={14} fill="#FBBF24" strokeWidth={0} />
                  <Star size={14} fill="#FBBF24" strokeWidth={0} />
                </div>
                <button className="seller-btn" id="btn-view-store-2">View Store</button>
              </div>

              {/* Seller 3 */}
              <div className="seller-card">
                <div className="seller-avatar-wrapper">
                  <div className="seller-avatar flex-center" style={{ background: '#8B5CF6', color: 'white', fontWeight: 'bold', fontSize: '24px' }}>MC</div>
                  <span className="seller-badge flex-center">
                    <Check size={12} strokeWidth={3} />
                  </span>
                </div>
                <h3 className="seller-name">MacCollector</h3>
                <p className="seller-meta">Joined 2020 • 1,220 Sales</p>
                <div className="seller-rating">
                  <Star size={14} fill="#FBBF24" strokeWidth={0} />
                  <Star size={14} fill="#FBBF24" strokeWidth={0} />
                  <Star size={14} fill="#FBBF24" strokeWidth={0} />
                  <Star size={14} fill="#FBBF24" strokeWidth={0} />
                  <Star size={14} fill="#FBBF24" strokeWidth={0} />
                </div>
                <button className="seller-btn" id="btn-view-store-3">View Store</button>
              </div>
            </div>
          </div>
        </section>

        {/* Join the Tech Circle */}
        <section className="newsletter-section" aria-label="Newsletter Signup">
          <div className="container">
            <div className="newsletter-box">
              <h2 className="newsletter-title">Join the Tech Circle</h2>
              <p className="newsletter-desc">Get early access to premium listings, market value reports, and exclusive seller tips.</p>
              <NewsletterForm />
              <span className="newsletter-subtext">No spam. Only high-quality tech updates once a week.</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <span className="logo">TechMarket</span>
              <p className="footer-desc">The world&apos;s most trusted marketplace for pre-owned premium technology. Shop with confidence, sell with ease.</p>
              <div className="footer-socials">
                <a href="#" className="social-link" aria-label="Website" id="social-web"><Globe size={18} /></a>
                <a href="#" className="social-link" aria-label="Share" id="social-share"><Share2 size={18} /></a>
                <a href="#" className="social-link" aria-label="Email" id="social-mail"><Mail size={18} /></a>
              </div>
            </div>

            <div>
              <h3 className="footer-col-title">Quick Links</h3>
              <div className="footer-links">
                <a href="#" className="footer-link">Trust & Safety</a>
                <a href="#" className="footer-link">How It Works</a>
                <a href="#" className="footer-link">Categories</a>
                <a href="#" className="footer-link">Sell Your Device</a>
              </div>
            </div>

            <div>
              <h3 className="footer-col-title">Support</h3>
              <div className="footer-links">
                <a href="#" className="footer-link">Help Center</a>
                <a href="#" className="footer-link">Buyer Protection</a>
                <a href="#" className="footer-link">Contact Us</a>
                <a href="#" className="footer-link">Privacy Policy</a>
              </div>
            </div>

            <div className="footer-download">
              <h3 className="footer-col-title">Download App</h3>
              <p className="download-desc">Shop on the go and get real-time price alerts.</p>
              <a href="#" className="download-btn download-btn-appstore" id="btn-download-appstore">
                {/* Fallback Icon for AppStore */}
                <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%' }} />
                <div className="download-btn-content">
                  <span className="download-btn-small">Download on the</span>
                  <span className="download-btn-large">App Store</span>
                </div>
              </a>
              <a href="#" className="download-btn download-btn-googleplay" id="btn-download-googleplay">
                <Play size={18} fill="currentColor" />
                <div className="download-btn-content">
                  <span className="download-btn-small">GET IT ON</span>
                  <span className="download-btn-large">Google Play</span>
                </div>
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2024 TechMarket Premium. SafeDeal Protected.</span>
            <div className="footer-bottom-links">
              <a href="#" className="footer-link">Terms of Sale</a>
              <a href="#" className="footer-link">Cookies</a>
              <a href="#" className="footer-link">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
