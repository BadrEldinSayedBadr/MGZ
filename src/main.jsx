import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const products = [
  {
    id: 1,
    name: 'The Sunday Sweatshirt',
    category: 'Sweatshirts',
    price: 68,
    color: 'Moss',
    colors: [{ name: 'Moss', value: '#59634a' }, { name: 'Oatmeal', value: '#c9bda8' }, { name: 'Washed black', value: '#343631' }],
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=85',
    tag: 'Bestseller',
  },
  {
    id: 2,
    name: 'Off-Duty Crewneck',
    category: 'Sweatshirts',
    price: 74,
    color: 'Oatmeal',
    colors: [{ name: 'Oatmeal', value: '#c9bda8' }, { name: 'Moss', value: '#59634a' }, { name: 'Washed black', value: '#343631' }],
    image: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1000&q=85',
    tag: 'New in',
  },
  {
    id: 3,
    name: 'Good Days Hoodie',
    category: 'Sweatshirts',
    price: 82,
    color: 'Washed black',
    colors: [{ name: 'Washed black', value: '#343631' }, { name: 'Moss', value: '#59634a' }, { name: 'Oatmeal', value: '#c9bda8' }],
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=85&sat=-35',
    tag: '',
  },
  {
    id: 4,
    name: 'The Everyday Jogger',
    category: 'Sweatpants',
    price: 62,
    color: 'Moss',
    colors: [{ name: 'Moss', value: '#59634a' }, { name: 'Vintage grey', value: '#9a9b94' }, { name: 'Oatmeal', value: '#c9bda8' }],
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1000&q=85',
    tag: 'Bestseller',
  },
  {
    id: 5,
    name: 'Slow Morning Sweatpant',
    category: 'Sweatpants',
    price: 66,
    color: 'Vintage grey',
    colors: [{ name: 'Vintage grey', value: '#9a9b94' }, { name: 'Moss', value: '#59634a' }, { name: 'Oatmeal', value: '#c9bda8' }],
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=85',
    tag: '',
  },
  {
    id: 6,
    name: 'Weekend Uniform Set',
    category: 'Sweatpants',
    price: 118,
    color: 'Oatmeal',
    colors: [{ name: 'Oatmeal', value: '#c9bda8' }, { name: 'Moss', value: '#59634a' }, { name: 'Vintage grey', value: '#9a9b94' }],
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
    tag: 'The set',
  },
  {
    id: 7,
    name: 'The Everyday Straight Jean',
    category: 'Denim Pants',
    price: 88,
    color: 'Classic blue',
    colors: [{ name: 'Classic blue', value: '#536b83' }, { name: 'Washed black', value: '#343631' }],
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1000&q=85',
    tag: 'Bestseller',
  },
  {
    id: 8,
    name: 'Relaxed Vintage Jean',
    category: 'Denim Pants',
    price: 92,
    color: 'Light wash',
    colors: [{ name: 'Light wash', value: '#9aabb8' }, { name: 'Classic blue', value: '#536b83' }],
    image: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=1000&q=85',
    tag: 'New in',
  },
  {
    id: 9,
    name: 'The Wide-Leg Jean',
    category: 'Denim Pants',
    price: 96,
    color: 'Indigo',
    colors: [{ name: 'Indigo', value: '#394b68' }, { name: 'Light wash', value: '#9aabb8' }],
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=85',
    tag: '',
  },
  {
    id: 10,
    name: 'The Weekend Denim',
    category: 'Denim Pants',
    price: 90,
    color: 'Washed blue',
    colors: [{ name: 'Washed blue', value: '#71869a' }, { name: 'Indigo', value: '#394b68' }],
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=85',
    tag: '',
  },
];

const productGalleryImages = {
  Sweatshirts: [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=85&sat=-45',
  ],
  Sweatpants: [
    'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=85&crop=entropy',
    'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1000&q=85&sat=-45',
  ],
  'Denim Pants': [
    'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=1000&q=85',
  ],
};

const colorImageIndexes = {
  Sweatshirts: { Moss: 0, Oatmeal: 3, 'Washed black': 4 },
  Sweatpants: { Moss: 0, 'Vintage grey': 1, Oatmeal: 2 },
  'Denim Pants': { 'Classic blue': 0, 'Light wash': 1, Indigo: 2, 'Washed blue': 3, 'Washed black': 4 },
};

function getProductGallery(product, color) {
  const images = [...new Set(productGalleryImages[product.category] || [product.image])];
  const colorIndex = colorImageIndexes[product.category]?.[color] ?? 0;
  const colorImage = images[colorIndex] || product.image;
  return [colorImage, ...images.filter((image) => image !== colorImage), product.image].filter((image, index, list) => list.indexOf(image) === index).slice(0, 6);
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 12h15m-6-6 6 6-6 6" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8h14l1 13H4L5 8Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

function Header({ headerRef, scrolled, home, menuOpen, bagCount, onMenu, onSearch, onBag, onHome }) {
  return (
    <header ref={headerRef} className={`site-header ${home ? 'home-mode' : 'not-home'} ${scrolled ? 'is-visible' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <button className={`menu-trigger ${menuOpen ? 'is-open' : ''}`} onClick={onMenu} aria-label={menuOpen ? 'Close collections menu' : 'Open collections menu'} aria-expanded={menuOpen} aria-controls="category-drawer">
        <span />
        <span />
      </button>
      <button className="brand-mark" onClick={onHome} aria-label="MGZ home"><span className="brand-initial">M</span>GZ</button>
      <div className="header-actions">
        <button className="icon-button search-trigger" onClick={onSearch} aria-label="Search products">
          <SearchIcon />
        </button>
        <button className="icon-button bag-trigger" onClick={onBag} aria-label={`Open bag, ${bagCount} ${bagCount === 1 ? 'item' : 'items'}`}>
          <BagIcon />
          {bagCount > 0 && <span className="bag-count">{bagCount}</span>}
        </button>
      </div>
    </header>
  );
}

function CategoryDrawer({ onClose, onCategory }) {
  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="menu-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside id="category-drawer" className="category-drawer" role="dialog" aria-modal="true" aria-label="Shop collections">
        <div className="drawer-heading">
          <span className="eyebrow">FIND YOUR EVERYDAY</span>
          <button className="close-button drawer-close" onClick={onClose} aria-label="Close collections menu">×</button>
        </div>
        <nav className="drawer-links" aria-label="Collections">
          <button onClick={() => onCategory('Sweatshirts')}>Sweatshirts<span>01</span></button>
          <button onClick={() => onCategory('Sweatpants')}>Sweatpants<span>02</span></button>
          <button onClick={() => onCategory('Denim Pants')}>Denim Pants<span>03</span></button>
        </nav>
        <span className="drawer-note">Comfort, with a point of view.</span>
      </aside>
    </div>
  );
}

function BagDrawer({ items, onClose, onRemove, onCheckout }) {
  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const subtotal = items.reduce((total, item) => total + item.product.price, 0);

  return (
    <div className="bag-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside className="bag-drawer" role="dialog" aria-modal="true" aria-label="Your bag">
        <div className="bag-drawer-heading">
          <div><span className="eyebrow">YOUR MGZ EDIT</span><h2>Your bag<span className="period">.</span></h2></div>
          <button className="close-button" onClick={onClose} aria-label="Close bag">×</button>
        </div>
        {items.length === 0 ? (
          <div className="bag-empty"><BagIcon /><p>Your bag is taking it slow.</p><span>Good things are worth finding.</span></div>
        ) : (
          <>
            <div className="bag-items">
              {items.map(({ product, size, color }, index) => (
                <div className="bag-item" key={`${product.id}-${size}-${index}`}>
                  <img src={product.image} alt="" />
                  <div className="bag-item-info"><strong>{product.name}</strong><span>{color} · Size {size}</span><span>${product.price}.00</span></div>
                  <button onClick={() => onRemove(index)} aria-label={`Remove ${product.name} from bag`}>Remove</button>
                </div>
              ))}
            </div>
            <div className="bag-summary"><div><span>Subtotal</span><strong>${subtotal}.00</strong></div><p>Shipping and taxes calculated at checkout.</p><button onClick={onCheckout}>Checkout — ${subtotal}.00</button><button className="continue-shopping" onClick={onClose}>Continue shopping</button></div>
          </>
        )}
      </aside>
    </div>
  );
}

function ProductCard({ product, onSelect }) {
  return (
    <button className="product-card" onClick={() => onSelect(product)} aria-label={`View ${product.name}`}>
      <span className="product-image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <span className="quick-view">View piece <ArrowIcon /></span>
      </span>
      <span className="product-meta">
        <span><span className="product-name">{product.name}</span><span className="product-color">{product.color}</span></span>
        <span className="product-price">${product.price}</span>
      </span>
    </button>
  );
}

function ProductGrid({ items, onSelect }) {
  return (
    <div className="product-grid">
      {items.map((product) => <ProductCard key={product.id} product={product} onSelect={onSelect} />)}
    </div>
  );
}

function HomePage({ onCategory, onProduct }) {
  return (
    <main>
      <section className="hero" aria-label="MGZ — vintage everyday wear">
        <img className="hero-image" src={`${import.meta.env.BASE_URL}mgz-runway.gif`} alt="Fashion model walking on a runway" fetchPriority="high" />
        <div className="hero-shade" />
      </section>

      <section className="category-section" aria-label="Shop our collections">
        <div className="category-grid">
          <button className="category-tile pants-tile" onClick={() => onCategory('Sweatpants')}>
            <img src="https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1500&q=85" alt="Relaxed sweatpants" loading="lazy" />
            <img className="category-hover-image" src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1500&q=85" alt="" loading="lazy" />
            <span className="category-overlay" />
            <span className="category-copy"><span className="category-number">01 — THE BOTTOM HALF</span><span className="category-title">Sweatpants</span><span className="category-link">Explore collection <ArrowIcon /></span></span>
          </button>
          <button className="category-tile sweatshirt-tile" onClick={() => onCategory('Sweatshirts')}>
            <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1500&q=85" alt="A cozy vintage-inspired sweatshirt" loading="lazy" />
            <img className="category-hover-image" src="https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1500&q=85" alt="" loading="lazy" />
            <span className="category-overlay" />
            <span className="category-copy"><span className="category-number">02 — THE TOP HALF</span><span className="category-title">Sweatshirts</span><span className="category-link">Explore collection <ArrowIcon /></span></span>
          </button>
          <button className="category-tile denim-tile" onClick={() => onCategory('Denim Pants')}>
            <img src="https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1500&q=85" alt="Classic blue denim pants" loading="lazy" />
            <img className="category-hover-image" src="https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=1500&q=85" alt="" loading="lazy" />
            <span className="category-overlay" />
            <span className="category-copy"><span className="category-number">03 — THE DENIM EDIT</span><span className="category-title">Denim Pants</span><span className="category-link">Explore collection <ArrowIcon /></span></span>
          </button>
        </div>
      </section>

      <section className="manifesto" id="about">
        <img src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=2400&q=85" alt="Vintage clothing in warm afternoon light" loading="lazy" />
        <div className="manifesto-overlay" />
        <div className="manifesto-copy"><span className="eyebrow">A NOTE TO SELF</span><h2>Wear your<br /><em>own pace.</em></h2><p>Less rush. More real life.<br />The good stuff is already yours.</p><button className="light-link" onClick={() => onCategory('All')}>Find your everyday <ArrowIcon /></button></div>
        <span className="manifesto-mark">MGZ / 001</span>
      </section>

      <section className="newsletter">
        <span className="eyebrow">THE MGZ POSTCARD</span>
        <h2>Good things, occasionally.</h2>
        <p>New pieces, old stories, and a little something for your inbox.</p>
        <NewsletterForm />
      </section>
    </main>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  function submit(event) {
    event.preventDefault();
    if (email.trim()) setSubscribed(true);
  }
  return subscribed ? <p className="success-message">You're on the list. Talk soon ✳</p> : (
    <form className="newsletter-form" onSubmit={submit}>
      <label className="visually-hidden" htmlFor="newsletter-email">Your email address</label>
      <input id="newsletter-email" type="email" placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <button type="submit" aria-label="Subscribe"><ArrowIcon /></button>
    </form>
  );
}

function AboutPage({ onHome, onShop }) {
  return (
    <main className="about-page">
      <button className="back-link" onClick={onHome}>← Back to home</button>
      <section className="about-intro">
        <span className="eyebrow">A LITTLE ABOUT US / MGZ</span>
        <h1>Made for real life<span className="period">.</span></h1>
        <p>MGZ is a point of view on everyday dressing: easy layers, familiar favourites, and pieces that feel like you from the very first wear.</p>
        <button className="about-shop-button" onClick={onShop}>Find your everyday <ArrowIcon /></button>
      </section>
      <div className="about-image">
        <img src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=2200&q=85" alt="A thoughtful edit of everyday clothing" />
      </div>
      <section className="about-note">
        <span className="eyebrow">OUR KIND OF EVERYDAY</span>
        <h2>Less rush.<br /><em>More real life.</em></h2>
        <p>We believe getting dressed should feel simple. So we make considered essentials designed to be worn often, lived in, and loved for a long time.</p>
      </section>
    </main>
  );
}

function CollectionPage({ category, onProduct, onHome }) {
  const [filter, setFilter] = useState('Featured');
  const items = products.filter((product) => category === 'All' || product.category === category);
  const sorted = filter === 'Price: low to high' ? [...items].sort((a, b) => a.price - b.price) : items;
  return (
    <main className="collection-page">
      <div className="collection-intro">
        <button className="back-link" onClick={onHome}>← Back to home</button>
        <span className="eyebrow">MGZ / THE COLLECTION</span>
        <h1>{category === 'All' ? 'The whole lot' : category}<span className="period">.</span></h1>
        <p>Easy layers. Familiar favourites. Made to be worn on repeat.</p>
      </div>
      <div className="collection-toolbar"><span>{items.length} pieces to live in</span><label>Sort by <select value={filter} onChange={(event) => setFilter(event.target.value)}><option>Featured</option><option>Price: low to high</option></select></label></div>
      <ProductGrid items={sorted} onSelect={onProduct} />
    </main>
  );
}

function ProductPage({ product, onBack, onAdd, onProduct }) {
  const [size, setSize] = useState('');
  const [color, setColor] = useState(product.color);
  const [error, setError] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const galleryImages = getProductGallery(product, color);
  const relatedProducts = products
    .filter((item) => item.id !== product.id)
    .sort((first, second) => Number(second.category === product.category) - Number(first.category === product.category))
    .slice(0, 4);

  useEffect(() => {
    if (!sizeGuideOpen) return undefined;
    function handleKey(event) {
      if (event.key === 'Escape') setSizeGuideOpen(false);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [sizeGuideOpen]);

  function addToBag() {
    if (!size) {
      setError(true);
      return;
    }
    setError(false);
    onAdd(product, size, color);
  }
  return (
    <main className="product-page">
      <button className="back-link product-back" onClick={onBack}>← Back to pieces</button>
      <div className="product-detail">
        <div className="detail-image detail-main-image">
          <img src={galleryImages[0]} alt={`${product.name} in ${color}`} />
        </div>
        <div className="detail-info">
          <span className="eyebrow">{product.category} / MGZ ORIGINAL</span>
          <h1>{product.name}<span className="period">.</span></h1>
          <span className="detail-price">${product.price}.00</span>
          <p className="detail-description">Your new favourite, already broken in. A relaxed-fit essential with a soft, heavyweight feel — made for slow mornings and long way homes.</p>
          <div className="detail-color"><span>Choose a colour</span><span className="color-value">{color}</span></div>
          <div className="color-options" aria-label="Available colors">{product.colors.map((option) => <button key={option.name} className={`color-swatch ${color === option.name ? 'selected' : ''}`} style={{ '--swatch-color': option.value }} onClick={() => setColor(option.name)} aria-label={option.name} aria-pressed={color === option.name} title={option.name} />)}</div>
          <div className="size-label"><span>Choose your size</span><button className="size-guide-trigger" onClick={() => setSizeGuideOpen(true)}>Size guide ↗</button></div>
          <div className="size-options">{['XS', 'S', 'M', 'L', 'XL'].map((item) => <button key={item} className={size === item ? 'selected' : ''} onClick={() => { setSize(item); setError(false); }}>{item}</button>)}</div>
          {error && <p className="size-error">Pick your size first, please.</p>}
          <button className="add-button" onClick={addToBag}>Add to bag — ${product.price}</button>
          <p className="detail-note">Easy returns · Made for everyday · Free shipping over $120</p>
          <div className="product-story"><span>THE LITTLE DETAILS</span><p>Designed for the days that turn into nights. A timeless shape, thoughtful details, zero overthinking.</p></div>
        </div>
      </div>
      <div className="detail-gallery" aria-label={`${product.name} more photos`}>
        {galleryImages.slice(1).map((image, index) => (
          <div key={image} className="detail-image">
            <img src={image} alt={`${product.name}, photo ${index + 2}`} loading="lazy" />
          </div>
        ))}
      </div>
      <section className="interest-section product-recommendations">
        <div className="section-heading">
          <div><span className="eyebrow">A LITTLE SOMETHING</span><h2>May be interested in<span className="period">.</span></h2></div>
        </div>
        <ProductGrid items={relatedProducts} onSelect={onProduct} />
      </section>
      {sizeGuideOpen && (
        <div className="size-guide-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSizeGuideOpen(false); }}>
          <section className="size-guide-dialog" role="dialog" aria-modal="true" aria-labelledby="size-guide-title">
            <div className="size-guide-heading">
              <div><span className="eyebrow">MGZ / FIT NOTES</span><h2 id="size-guide-title">Size guide<span className="period">.</span></h2></div>
              <button className="close-button" onClick={() => setSizeGuideOpen(false)} aria-label="Close size guide">×</button>
            </div>
            <p>Relaxed fit. Choose your usual size, or select a size below to continue.</p>
            <div className="size-guide-options">
              {['XS', 'S', 'M', 'L', 'XL'].map((item) => (
                <button key={item} className={size === item ? 'selected' : ''} onClick={() => { setSize(item); setError(false); setSizeGuideOpen(false); }}>{item}</button>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function CheckoutPage({ items, onBack, onComplete }) {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const subtotal = items.reduce((total, item) => total + item.product.price, 0);

  function placeOrder(event) {
    event.preventDefault();
    setOrderPlaced(true);
    onComplete();
  }

  if (orderPlaced) {
    return (
      <main className="checkout-page checkout-success">
        <span className="eyebrow">THANK YOU FOR SHOPPING MGZ</span>
        <h1>Your order is in<span className="period">.</span></h1>
        <p>Your order has been placed. We’ll be in touch soon to confirm delivery details.</p>
        <button className="add-button" onClick={onBack}>Continue shopping</button>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <button className="back-link" onClick={onBack}>← Back to your bag</button>
      <div className="checkout-heading"><span className="eyebrow">A FEW LAST DETAILS</span><h1>Checkout<span className="period">.</span></h1></div>
      {items.length === 0 ? (
        <div className="checkout-empty"><p>Your bag is empty.</p><button className="add-button" onClick={onBack}>Continue shopping</button></div>
      ) : (
        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={placeOrder}>
            <h2>Delivery details</h2>
            <label>Full name<input name="name" autoComplete="name" required /></label>
            <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
            <label>Phone number<input name="phone" type="tel" autoComplete="tel" required /></label>
            <label>Address<input name="address" autoComplete="street-address" required /></label>
            <label>City<input name="city" autoComplete="address-level2" required /></label>
            <div className="payment-note"><strong>Payment</strong><span>Cash on delivery</span></div>
            <button className="add-button" type="submit">Place order — ${subtotal}.00</button>
            <p className="checkout-disclaimer">Demo checkout — no payment is collected on this site.</p>
          </form>
          <aside className="checkout-summary">
            <h2>Your order</h2>
            {items.map(({ product, size, color }, index) => (
              <div className="checkout-item" key={`${product.id}-${size}-${index}`}>
                <img src={product.image} alt="" />
                <div><strong>{product.name}</strong><span>{color} · Size {size}</span></div>
                <span>${product.price}.00</span>
              </div>
            ))}
            <div className="checkout-total"><span>Subtotal</span><strong>${subtotal}.00</strong></div>
            <p>Shipping and taxes are confirmed with your delivery.</p>
          </aside>
        </div>
      )}
    </main>
  );
}

function SearchPanel({ onClose, onProduct }) {
  const [query, setQuery] = useState('');
  const matches = query.trim() ? products.filter((product) => `${product.name} ${product.category} ${product.color}`.toLowerCase().includes(query.toLowerCase())) : [];
  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);
  return (
    <div className="search-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="search-panel" aria-label="Search products">
        <div className="search-panel-top"><span className="eyebrow">LOOKING FOR SOMETHING?</span><button className="close-button" onClick={onClose} aria-label="Close search">×</button></div>
        <div className="search-input-wrap"><SearchIcon /><input autoFocus placeholder="Try “Sunday sweatshirt”" value={query} onChange={(event) => setQuery(event.target.value)} /><button onClick={() => setQuery('')} aria-label="Clear search">×</button></div>
        {!query.trim() ? <p className="search-hint">A good place to start: <button onClick={() => setQuery('sweatshirt')}>sweatshirts</button> · <button onClick={() => setQuery('jogger')}>joggers</button></p> : (
          <div className="search-results"><span className="eyebrow">{matches.length ? `${matches.length} PIECES FOUND` : 'NO PIECES FOUND'}</span>{matches.map((product) => <button key={product.id} className="search-result" onClick={() => onProduct(product)}><img src={product.image} alt="" /><span>{product.name}<small>{product.category}</small></span><span>${product.price}</span></button>)}</div>
        )}
      </section>
    </div>
  );
}

function App() {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);
  const [page, setPage] = useState({ type: 'home' });
  const pageHistory = useRef([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [bag, setBag] = useState([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let frame = 0;
    function updateScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const scrollY = window.scrollY;
        const isScrolled = scrollY > 80;
        setScrolled((current) => current === isScrolled ? current : isScrolled);

        const header = headerRef.current;
        if (!header || !header.classList.contains('home-mode')) return;

        const hero = document.querySelector('.hero');
        const heroHeight = hero?.getBoundingClientRect().height || window.innerHeight;
        const progress = Math.min(1, Math.max(0, scrollY / heroHeight));
        const startTop = heroHeight * 0.5 - 8;
        const isMobile = window.innerWidth <= 760;
        const headerHeight = isMobile ? 50 : 58;
        const logoTop = startTop + (headerHeight / 2 - startTop) * progress;
        const logoBaseSize = parseFloat(getComputedStyle(header.querySelector('.brand-mark')).fontSize);
        const navbarLogoSize = isMobile ? 25 : 29;
        const logoScale = 1 - (1 - navbarLogoSize / logoBaseSize) * progress;
        const glassHeight = heroHeight + (headerHeight - heroHeight) * progress;
        const glassWidth = isScrolled ? 75 : 100;
        const navbarProgress = Math.min(1, Math.max(0, (progress - 0.94) / 0.06));

        header.style.setProperty('--glass-height', `${glassHeight}px`);
        header.style.setProperty('--glass-width', `${glassWidth}%`);
        header.style.setProperty('--glass-opacity', `${navbarProgress}`);
        header.style.setProperty('--nav-content-opacity', `${navbarProgress}`);
        header.style.setProperty('--nav-content-events', navbarProgress > 0 ? 'auto' : 'none');
        header.style.setProperty('--brand-color', navbarProgress === 1 ? 'var(--green)' : '#f5f2eb');
        header.style.setProperty('--glass-radius', `${isScrolled ? 30 : 0}px`);
        header.style.setProperty('--glass-edge-alpha', '0');
        header.style.setProperty('--logo-top', `${logoTop}px`);
        header.style.setProperty('--logo-scale', `${logoScale}`);
        header.style.setProperty('--logo-opacity', '1');
        header.style.setProperty('--logo-pointer-events', progress >= 1 ? 'none' : 'auto');
      });
    }

    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    updateScroll();
    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [page.type]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  function navigate(nextPage) {
    pageHistory.current.push(page);
    setPage(nextPage);
  }
  function goBack() { setPage(pageHistory.current.pop() || { type: 'home' }); }
  function goHome() { pageHistory.current = []; setPage({ type: 'home' }); setBagOpen(false); }
  function showProduct(product) { navigate({ type: 'product', product }); setSearchOpen(false); }
  function showCategory(category) { navigate({ type: 'collection', category }); setMenuOpen(false); }
  function showCheckout() { setBagOpen(false); navigate({ type: 'checkout' }); }
  function showAbout() {
    navigate({ type: 'about' });
  }
  function openBag() { setBagOpen(true); setMenuOpen(false); setSearchOpen(false); }
  function addToBag(product, size, color) {
    setBag((current) => [...current, { product, size, color }]);
    setNotice(`${product.name} · ${color} · ${size} added to your bag`);
    window.setTimeout(() => setNotice(''), 2800);
  }
  function completeOrder() { setBag([]); }

  return (
    <>
      <Header headerRef={headerRef} scrolled={scrolled} home={page.type === 'home'} menuOpen={menuOpen} bagCount={bag.length} onMenu={() => setMenuOpen((open) => !open)} onSearch={() => { setSearchOpen(true); setMenuOpen(false); setBagOpen(false); }} onBag={openBag} onHome={goHome} />
      {page.type === 'home' && <HomePage onCategory={showCategory} onProduct={showProduct} />}
      {page.type === 'collection' && <CollectionPage category={page.category} onProduct={showProduct} onHome={goBack} />}
      {page.type === 'product' && <ProductPage key={page.product.id} product={page.product} onBack={goBack} onAdd={addToBag} onProduct={showProduct} />}
      {page.type === 'about' && <AboutPage onHome={goBack} onShop={() => showCategory('All')} />}
      {page.type === 'checkout' && <CheckoutPage items={bag} onBack={goBack} onComplete={completeOrder} />}
      <footer className="site-footer">
        <div className="footer-brand"><button className="footer-logo" onClick={goHome}>MGZ</button><span>Comfort, with a point of view.</span></div>
        <nav className="footer-nav" aria-label="Footer navigation">
          <span className="footer-heading">EXPLORE</span>
          <button onClick={goHome}>Home</button>
          <button onClick={showAbout}>About</button>
          <button onClick={() => showCategory('All')}>Products</button>
        </nav>
        <nav className="footer-nav" aria-label="Collections">
          <span className="footer-heading">COLLECTIONS</span>
          <button onClick={() => showCategory('Sweatshirts')}>Sweatshirts</button>
          <button onClick={() => showCategory('Sweatpants')}>Sweatpants</button>
          <button onClick={() => showCategory('Denim Pants')}>Denim Pants</button>
          <button onClick={openBag}>Your bag ({bag.length})</button>
        </nav>
        <div className="footer-bottom"><span>© MGZ 2025 · MADE FOR REAL LIFE</span><button className="footer-bag" onClick={openBag}>BAG ({bag.length})</button></div>
      </footer>
      {menuOpen && <CategoryDrawer onClose={() => setMenuOpen(false)} onCategory={showCategory} />}
      {bagOpen && <BagDrawer items={bag} onClose={() => setBagOpen(false)} onCheckout={showCheckout} onRemove={(index) => setBag((current) => current.filter((_, itemIndex) => itemIndex !== index))} />}
      {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} onProduct={showProduct} />}
      {notice && <div className="toast" role="status">{notice}</div>}
    </>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
