import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  useParams
} from 'react-router-dom';

import './styles.css';


import { getProducts, getCollections, createShopifyCheckout } from "./services/shopify";




const colorImageIndexes = {
  Sweatshirts: { Moss: 0, Oatmeal: 3, 'Washed black': 4 },
  Sweatpants: { Moss: 0, 'Vintage grey': 1, Oatmeal: 2 },
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



function Header({ headerRef, home, menuOpen, bagCount, onMenu, onSearch, onBag, onHome, onShop, onAbout }) {
  return (
    <header
      ref={headerRef}
      className={`site-header ${home ? 'home-mode' : 'not-home'} ${menuOpen ? 'menu-open' : ''}`}
    >
      <button
        className={`menu-trigger ${menuOpen ? 'is-open' : ''}`}
        onClick={onMenu}
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls="category-drawer"
      >
        <span />
        <span />
      </button>

      <button className="brand-mark" onClick={onHome} aria-label="MGZ home">
        <span
          className="brand-mark-image"
          style={{
            '--logo-mask': `url("${import.meta.env.BASE_URL}mgz-logo.png")`
          }}
          aria-hidden="true"
        />
      </button>

      <div className="right">
        <nav className="nav-center">
          <button onClick={onShop}>SHOP</button>
          <button onClick={onAbout}>OUR WORLD</button>
        </nav>

        <div className="nav-right">
          <button className="nav-text-button" onClick={onSearch}>
            SEARCH
          </button>

          <button className="nav-text-button" onClick={onBag}>
            BAG ({bagCount})
          </button>
        </div>
      </div>
    </header>
  );
}






function CategoryDrawer({
  onClose,
  onCategory,
  onShop,
  onAbout,
  onSearch,
  onBag,
  bagCount,
  collections
}) {
  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKey);

    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="menu-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        id="category-drawer"
        className="category-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
      >
        <div className="drawer-heading">
          <span className="eyebrow">MGZ. / MENU</span>

          <button
            className="close-button drawer-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <nav className="drawer-links" aria-label="Main navigation">

          <button onClick={onShop}>
            SHOP <span>01</span>
          </button>

          <button onClick={onAbout}>
            OUR WORLD <span>02</span>
          </button>

          <button onClick={onSearch}>
            SEARCH <span>03</span>
          </button>

          <button onClick={onBag}>
            BAG ({bagCount}) <span>04</span>
          </button>

        </nav>

        <div className="drawer-collections">
          <span className="eyebrow">COLLECTIONS</span>

          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => onCategory(collection.handle)}
            >
              {collection.title}
            </button>
          ))}
        </div>

        <span className="drawer-note">
          Comfort, with a point of view.
        </span>
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



  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);

      const checkoutItems = items.map((item) => {
        const selectedVariant = item.product.variants?.find((variant) =>
          variant.selectedOptions?.some(
            (option) =>
              option.name.toLowerCase() === "size" &&
              option.value === item.size
          )
        );

        if (!selectedVariant) {
          throw new Error(
            `Variant not found for ${item.product.name} - Size ${item.size}`
          );
        }

        return {
          variantId: selectedVariant.id,
          quantity: 1,
        };
      });

      const checkoutUrl = await createShopifyCheckout(checkoutItems);

      window.location.href = checkoutUrl;

    } catch (error) {
      console.error("Checkout Error:", error);
      alert(error.message || "Something went wrong");

    } finally {
      setCheckoutLoading(false);
    }
  };


  return (
    <div className="bag-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside className="bag-drawer" role="dialog" aria-modal="true" aria-label="Your bag">
        <div className="bag-drawer-heading">
          <div><span className="eyebrow">YOUR MGZ. EDIT</span><h2>Your bag<span className="period">.</span></h2></div>
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
                  <div className="bag-item-info"><strong>{product.name}</strong><span>{color} · Size {size}</span><span>{product.price}.00 {product.currency}</span></div>
                  <button onClick={() => onRemove(index)} aria-label={`Remove ${product.name} from bag`}>Remove</button>
                </div>
              ))}
            </div>
            <div className="bag-summary"><div><span>Subtotal</span><strong>${subtotal}.00</strong></div><p>Shipping and taxes calculated at checkout.</p><button
              onClick={handleCheckout}
              disabled={checkoutLoading || items.length === 0}
            >
              {checkoutLoading ? "Processing..." : `Checkout — $${subtotal}.00`}
            </button><button className="continue-shopping" onClick={onClose}>Continue shopping</button></div>
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
      </span>
      <span className="product-meta">
        <span><span className="product-name">{product.name}</span><span className="product-color">{product.color}</span></span>
        <span className="product-price">{product.price} EGP</span>
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

function HomePage({
  products,
  productsLoading,
  productsError,
  onCategory,
  onProduct
}) {

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getCollections();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);


  return (
    <main>
      <section className="hero" aria-label="MGZ. — vintage everyday wear">
        {/* <img className="hero-image" src={`${import.meta.env.BASE_URL}home.jpg`} alt="Fashion model walking on a runway" fetchPriority="high" />   */}
        <div className="hero-shade" />
      </section>

      <section className="interest-section">
        <div className="cover">
          <div className="cover-copy">

            <p>There's always more than one way to see things. <br />


              Born and based in Egypt, MGZ. is an independent streetwear brand built on individuality, simplicity, and a different way of seeing the world. <br />
              {/* What began as eyewear has evolved into a universe shaped by Japanese precision, 90s attitude, and architectural clarity. A world where design is discipline, and non conformity is instinct... */}
              Between past and future. Between structure and instinct. <br />
            </p>
            <div className="interest-brand">
              <img
                className="interestLogo"
                src={`${import.meta.env.BASE_URL}mgz-logo.png`}
                alt="MGZ."
              />
              <span className="interest-title">— EGYPT</span>
            </div>

          </div>
          <img className='interestImg' src={`${import.meta.env.BASE_URL}interest.png`} alt="" />

        </div>
      </section>
      {/* 
      <section className="category-section" aria-label="Shop our collections">
        <div className="category-grid">
          <button className="category-tile sweatshirt-tile" onClick={() => onCategory('Sweatshirts')}>
            <img src={`${import.meta.env.BASE_URL}sweatshirt.png`} alt="A cozy vintage-inspired sweatshirt" loading="lazy" />
            <img className="category-hover-image" src={`${import.meta.env.BASE_URL}sweatshirt2.png`} alt="" loading="lazy" />
            <span className="category-overlay" />
            <span className="category-copy"><span className="category-title">The Sweatshirts</span><span className="category-link">Shop Now</span></span>
          </button>
          <button className="category-tile pants-tile" onClick={() => onCategory('Sweatpants')}>
            <img src={`${import.meta.env.BASE_URL}sweatpants.png`} alt="Relaxed sweatpants" loading="lazy" />
            <img className="category-hover-image" src={`${import.meta.env.BASE_URL}sweatpants2.png`} alt="" loading="lazy" />
            <span className="category-overlay" />
            <span className="category-copy"><span className="category-title">The Sweatpants</span><span className="category-link">Shop Now</span></span>
          </button>
        </div>
      </section> */}



      <section className="category-section" aria-label="Shop our collections">
        <div className="category-grid">
          {collections.map((collection) => {
            const isSweatshirt = collection.handle.toLowerCase().includes('sweatshirt');
            const categoryProducts = products.filter((product) =>
              collection.productIds.includes(product.id)
            );
            const categoryImage = isSweatshirt ? 'sweatshirt.png' : 'sweatpants.png';
            const hoverImage = isSweatshirt
              ? 'sweatshirt2.png'
              : 'sweatpants2.png';

            return (
              <article className="category-collection" key={collection.id}>
                <button
                  className={`category-tile ${isSweatshirt ? 'sweatshirt-tile' : 'pants-tile'}`}
                  onClick={() => onCategory(collection.handle)}
                >
                  <img
                    src={collection.image || `${import.meta.env.BASE_URL}${categoryImage}`}
                    alt={collection.title}
                    loading="lazy"
                  />

                  <img
                    className="category-hover-image"
                    src={`${import.meta.env.BASE_URL}${hoverImage}`}
                    alt=""
                    loading="lazy"
                  />

                  <span className="category-overlay" />

                  <span className="category-copy">
                    <span className="category-title">{collection.title}</span>
                    <span className="category-link">Shop Now</span>
                  </span>
                </button>
   
              </article>
            );
          })}
        </div>
      </section>




      <section className="manifesto" id="about">
        <img src={`${import.meta.env.BASE_URL}manifesto.png`} alt="Vintage clothing in warm afternoon light" loading="lazy" />
        <div className="manifesto-overlay" />
        <div className="manifesto-copy"><span className="eyebrow">A DIFFERENT POINT OF VIEW</span><h2>Dress beyond<br /><em>the ordinary.</em></h2><p>Not made to follow trends.<br />Made to create your own.</p><button className="light-link" onClick={() => onCategory('All')}>Discover MGZ. <ArrowIcon /></button></div>
      </section>

      <section className="newsletter">
        <span className="eyebrow">THE MGZ. POSTCARD</span>
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
        <div className="about-info">
          <span className="eyebrow">A LITTLE ABOUT US / MGZ.</span>
          <h1>Made for real life<span className="period">.</span></h1>
          <p>More than clothing. A different point of view.

            MGZ. is an independent streetwear brand born in Egypt, inspired by the balance between timeless vintage aesthetics and modern street culture.

            We believe style isn't about following trends or trying to fit in. It's about individuality, confidence, and feeling comfortable in your own skin.

            Our approach is simple: clean silhouettes, thoughtful details, and effortless comfort. Every piece is designed to become part of your everyday life — easy to wear, easy to style, and made to feel like you.

            We don't believe in dressing for the moment. We believe in creating pieces that stay relevant beyond it.

            MGZ. Made for real life. Worn your way.</p>
        </div>


        <div className="about-image">
          <div className="phone-frame">
            <div className="phone-screen">
              <img
                src={`${import.meta.env.BASE_URL}mgz-about.gif`}
                alt="MGZ collection"
              />
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}

function CollectionPage({ products, category, onProduct, onHome }) {
  const [filter, setFilter] = useState('Featured');
  const items = products;
  const sorted = filter === 'Price: low to high' ? [...items].sort((a, b) => a.price - b.price) : items;
  return (
    <main className="collection-page">
      <div className="collection-intro">
        <button className="back-link" onClick={onHome}>← Back to home</button>
        <span className="eyebrow">MGZ. / THE COLLECTION</span>
        <h1>{category === 'All' ? 'The whole lot' : category}<span className="period">.</span></h1>
        <p>Easy layers. Familiar favourites. Made to be worn on repeat.</p>
      </div>
      <div className="collection-toolbar"><span>{items.length} pieces to live in</span><label>Sort by <select value={filter} onChange={(event) => setFilter(event.target.value)}><option>Featured</option><option>Price: low to high</option></select></label></div>
      <ProductGrid items={sorted} onSelect={onProduct} />
    </main>
  );
}

function ProductPage({ product, products, onBack, onAdd, onProduct }) {
  const [size, setSize] = useState('');
  const [color, setColor] = useState(product.color);
  const [error, setError] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const galleryImages =
    product.images?.length > 0
      ? product.images
      : [product.image];
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
  console.log(product);


  const sizeOptions = [
    ...new Set(
      (product.variants || []).flatMap((variant) =>
        variant.selectedOptions
          .filter((option) => option.name.toLowerCase() === "size")
          .map((option) => option.value)
      )
    ),
  ];

  return (
    <main className="product-page">
      <button className="back-link product-back" onClick={onBack}>← Back to pieces</button>
      <div className="product-detail">
        <div className="detail-image detail-main-image">
          <img src={galleryImages[0]} alt={`${product.name} in ${color}`} />
        </div>
        <div className="detail-info">
          <span className="eyebrow">{product.category} / MGZ. ORIGINAL</span>
          <h1>{product.name}<span className="period">.</span></h1>
          <span className="detail-price">{product.price}.00 {product.currency} </span>
          <p className="detail-description">{product.description}</p>
          {/* <div className="detail-color"><span>Choose a colour</span><span className="color-value">{color}</span></div> */}
          {/* <div className="color-options" aria-label="Available colors">{product.colors.map((option) => <button key={option.name} className={`color-swatch ${color === option.name ? 'selected' : ''}`} style={{ '--swatch-color': option.value }} onClick={() => setColor(option.name)} aria-label={option.name} aria-pressed={color === option.name} title={option.name} />)}</div> */}
          <div className="size-label"><span>Choose your size</span><button className="size-guide-trigger" onClick={() => setSizeGuideOpen(true)}>Size guide ↗</button></div>
          <div className="size-options">
            {sizeOptions.map((item) => {
              const available = product.variants.some(
                (variant) =>
                  variant.availableForSale &&
                  variant.selectedOptions.some(
                    (option) =>
                      option.name.toLowerCase() === "size" &&
                      option.value === item
                  )
              );

              return (
                <button
                  key={item}
                  disabled={!available}
                  className={`${size === item ? "selected" : ""} ${!available ? "unavailable" : ""
                    }`}
                  onClick={() => {
                    setSize(item);
                    setError(false);
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
          {error && <p className="size-error">Pick your size first, please.</p>}
          <button className="add-button" onClick={addToBag}>Add to bag — {product.price}   {product.currency}</button>
          <p className="detail-note">Easy returns · Made for everyday · Free shipping over 1000 EGP</p>
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

      {sizeGuideOpen && (
        <div className="size-guide-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSizeGuideOpen(false); }}>
          <section className="size-guide-dialog" role="dialog" aria-modal="true" aria-labelledby="size-guide-title">
            <div className="size-guide-heading">
              <div><span className="eyebrow">MGZ. / FIT NOTES</span><h2 id="size-guide-title">Size guide<span className="period">.</span></h2></div>
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
        <span className="eyebrow">THANK YOU FOR SHOPPING MGZ.</span>
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





function CollectionRoute({ products, collections, onProduct, onHome }) {
  const { category } = useParams();

  const isAll = category?.toLowerCase() === "all";

  const collection = collections.find(
    (item) => item.handle === category?.toLowerCase()
  );

  if (!isAll && !collection) {
    return <Navigate to="/shop/all" replace />;
  }

  const collectionProducts = isAll
    ? products
    : products.filter((product) =>
      collection.productIds.includes(product.id)
    );

  return (
    <CollectionPage
      products={collectionProducts}
      category={isAll ? "All" : collection.title}
      onProduct={onProduct}
      onHome={onHome}
    />
  );
}




function ProductRoute({ products, onBack, onAdd, onProduct }) {
  const { id } = useParams();

  const product = products.find(
    (item) => item.handle === id
  );

  if (!product) {
    return <Navigate to="/shop/all" replace />;
  }

  return (
    <ProductPage
      key={product.id}
      product={product}
      products={products}
      onBack={() => onBack(product.category)}
      onAdd={onAdd}
      onProduct={onProduct}
    />
  );
}






function SearchPanel({ products, onClose, onProduct }) {
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
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [bag, setBag] = useState([]);
  const [notice, setNotice] = useState('');


  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);



  const [collections, setCollections] = useState([]);

  useEffect(() => {
    async function loadStoreData() {
      try {
        const [productsData, collectionsData] = await Promise.all([
          getProducts(),
          getCollections(),
        ]);

        setProducts(productsData);
        setCollections(collectionsData);

        console.log("Shopify Products:", productsData);
        console.log("Shopify Collections:", collectionsData);

      } catch (error) {
        console.error("Shopify Error:", error);
        setProductsError(error.message);
      } finally {
        setProductsLoading(false);
      }
    }

    loadStoreData();
  }, []);

  // Scroll effect for the Home navbar
  useEffect(() => {
    let frame = 0;

    function updateScroll() {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = 0;

        const scrollY = window.scrollY;
        const isScrolled = scrollY > 80;

        setScrolled((current) =>
          current === isScrolled ? current : isScrolled
        );

        const header = headerRef.current;

        if (!header || !header.classList.contains('home-mode')) return;

        const hero = document.querySelector('.hero');
        const heroHeight =
          hero?.getBoundingClientRect().height || window.innerHeight;

        const progress = Math.min(1, Math.max(0, scrollY / heroHeight));
        const startTop = heroHeight * 0.5 - 8;
        const isMobile = window.innerWidth <= 760;
        const headerHeight = isMobile ? 50 : 58;

        const logoTop =
          startTop + (headerHeight / 2 - startTop) * progress;

        const logoBaseSize = parseFloat(
          getComputedStyle(header.querySelector('.brand-mark')).fontSize
        );

        const navbarLogoSize = isMobile ? 55 : 64;
        const logoScale =
          1 - (1 - navbarLogoSize / logoBaseSize) * progress;

        const glassHeight =
          heroHeight + (headerHeight - heroHeight) * progress;

        const navbarProgress = Math.min(
          1,
          Math.max(0, (progress - 0.94) / 0.06)
        );

        const logoColor = [245, 242, 235].map((start) =>
          Math.round(start + (20 - start) * navbarProgress)
        );

        header.style.setProperty('--glass-height', `${glassHeight}px`);
        header.style.setProperty('--glass-width', '100%');
        header.style.setProperty('--glass-opacity', `${navbarProgress}`);
        header.style.setProperty('--nav-content-opacity', `${navbarProgress}`);
        header.style.setProperty(
          '--nav-content-events',
          navbarProgress > 0 ? 'auto' : 'none'
        );
        header.style.setProperty(
          '--brand-color',
          `rgb(${logoColor.join(', ')})`
        );
        header.style.setProperty(
          '--nav-text-color',
          `rgb(${logoColor.join(', ')})`
        );
        header.style.setProperty('--glass-radius', '0px');
        header.style.setProperty('--glass-edge-alpha', '0');
        header.style.setProperty('--logo-top', `${logoTop}px`);
        header.style.setProperty('--logo-scale', `${logoScale}`);
        header.style.setProperty('--logo-opacity', '1');
        header.style.setProperty(
          '--logo-pointer-events',
          progress >= 1 ? 'none' : 'auto'
        );
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
  }, [isHome]);

  // Scroll to top when the route changes

  // Navbar scroll effect
  useEffect(() => {
    let frame = 0;

    function updateScroll() {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = 0;

        const scrollY = window.scrollY;
        const isScrolled = scrollY > 80;

        setScrolled((current) =>
          current === isScrolled ? current : isScrolled
        );

        const header = headerRef.current;
        if (!header) return;

        const isMobile = window.innerWidth <= 760;
        const headerHeight = isMobile ? 50 : 58;

        const logoBaseSize = parseFloat(
          getComputedStyle(
            header.querySelector('.brand-mark')
          ).fontSize
        );

        const navbarLogoSize = isMobile ? 55 : 64;

        // INNER PAGES NAVBAR
        if (!header.classList.contains('home-mode')) {
          header.style.setProperty('--glass-height', `${headerHeight}px`);
          header.style.setProperty('--glass-width', '100%');
          header.style.setProperty('--glass-opacity', '1');

          header.style.setProperty('--nav-content-opacity', '1');
          header.style.setProperty('--nav-content-events', 'auto');

          header.style.setProperty('--brand-color', 'rgb(20, 20, 20)');
          header.style.setProperty('--nav-text-color', 'rgb(20, 20, 20)');

          header.style.setProperty('--glass-radius', '0px');
          header.style.setProperty('--glass-edge-alpha', '0');

          header.style.setProperty(
            '--logo-top',
            `${headerHeight / 2}px`
          );

          header.style.setProperty(
            '--logo-scale',
            `${navbarLogoSize / logoBaseSize}`
          );

          header.style.setProperty('--logo-opacity', '1');
          header.style.setProperty('--logo-pointer-events', 'auto');

          return;
        }

        // HOME PAGE NAVBAR ANIMATION (UNCHANGED)

        const hero = document.querySelector('.hero');
        const heroHeight =
          hero?.getBoundingClientRect().height || window.innerHeight;

        const progress = Math.min(
          1,
          Math.max(0, scrollY / heroHeight)
        );

        const startTop = heroHeight * 0.5 - 8;

        const logoTop =
          startTop + (headerHeight / 2 - startTop) * progress;

        const logoScale =
          1 - (1 - navbarLogoSize / logoBaseSize) * progress;

        const glassHeight =
          heroHeight + (headerHeight - heroHeight) * progress;

        const navbarProgress = Math.min(
          1,
          Math.max(0, (progress - 0.94) / 0.06)
        );

        const logoColor = [245, 242, 235].map((start) =>
          Math.round(start + (20 - start) * navbarProgress)
        );

        header.style.setProperty('--glass-height', `${glassHeight}px`);
        header.style.setProperty('--glass-width', '100%');
        header.style.setProperty('--glass-opacity', `${navbarProgress}`);

        header.style.setProperty(
          '--nav-content-opacity',
          `${navbarProgress}`
        );

        header.style.setProperty(
          '--nav-content-events',
          navbarProgress > 0 ? 'auto' : 'none'
        );

        header.style.setProperty(
          '--brand-color',
          `rgb(${logoColor.join(', ')})`
        );

        header.style.setProperty(
          '--nav-text-color',
          `rgb(${logoColor.join(', ')})`
        );

        header.style.setProperty('--glass-radius', '0px');
        header.style.setProperty('--glass-edge-alpha', '0');
        header.style.setProperty('--logo-top', `${logoTop}px`);
        header.style.setProperty('--logo-scale', `${logoScale}`);
        header.style.setProperty('--logo-opacity', '1');

        header.style.setProperty(
          '--logo-pointer-events',
          progress >= 1 ? 'none' : 'auto'
        );
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
  }, [isHome]);


  function goHome() {
    navigate('/');
    setBagOpen(false);
    setMenuOpen(false);
  }

  function showProduct(product) {
    navigate(`/product/${product.handle}`);
    setSearchOpen(false);
    setMenuOpen(false);
  }

  function showCategory(category) {
    navigate(`/shop/${category.toLowerCase()}`);
    setMenuOpen(false);
  }

  function showCheckout() {
    setBagOpen(false);
    navigate('/checkout');
  }

  function showAbout() {
    navigate('/about');
    setMenuOpen(false);
  }

  function openBag() {
    setBagOpen(true);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  function addToBag(product, size, color) {
    setBag((current) => [...current, { product, size, color }]);

    setNotice(`${product.name} · ${color} · ${size} added to your bag`);

    window.setTimeout(() => setNotice(''), 2800);
  }

  function completeOrder() {
    setBag([]);
  }

  return (
    <>
      <Header
        headerRef={headerRef}
        scrolled={scrolled}
        home={isHome}
        menuOpen={menuOpen}
        bagCount={bag.length}
        onMenu={() => setMenuOpen((open) => !open)}
        onSearch={() => {
          setSearchOpen(true);
          setMenuOpen(false);
          setBagOpen(false);
        }}
        onBag={openBag}
        onHome={goHome}
        onShop={() => showCategory('All')}
        onAbout={showAbout}
      />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              products={products}
              productsLoading={productsLoading}
              productsError={productsError}
              onCategory={showCategory}
              onProduct={showProduct}
            />
          }
        />

        <Route
          path="/shop/:category"
          element={
            <CollectionRoute
              products={products}
              collections={collections}
              onProduct={showProduct}
              onHome={goHome}
            />
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProductRoute
              products={products}
              onBack={(category) => showCategory(category)}
              onAdd={addToBag}
              onProduct={showProduct}
            />
          }
        />

        <Route
          path="/about"
          element={
            <AboutPage
              onHome={goHome}
              onShop={() => showCategory('All')}
            />
          }
        />

        <Route
          path="/checkout"
          element={
            <CheckoutPage
              items={bag}
              onBack={() => showCategory('All')}
              onComplete={completeOrder}
            />
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="site-footer">
        <div className="footer-brand">
          <button className="footer-logo" onClick={goHome} aria-label="MGZ home">
            <img src={`${import.meta.env.BASE_URL}mgz-logo.png`} alt="" />
          </button>
          <span>There's always more than one way to see things.</span>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <span className="footer-heading">EXPLORE</span>
          <button onClick={goHome}>Home</button>
          <button onClick={showAbout}>Our World</button>
          <button onClick={() => showCategory('All')}>Products</button>
        </nav>

        <nav className="footer-nav" aria-label="Collections">
          <span className="footer-heading">COLLECTIONS</span>
          <button onClick={() => showCategory('Sweatshirts')}>Sweatshirts</button>
          <button onClick={() => showCategory('Sweatpants')}>Sweatpants</button>
        </nav>

        <div className="footer-bottom">
          <span>© MGZ. 2025 · MADE FOR REAL LIFE</span>
        </div>
      </footer>

      {menuOpen && (
        <CategoryDrawer
          onClose={() => setMenuOpen(false)}
          onCategory={showCategory}
          onShop={() => showCategory('All')}
          onAbout={showAbout}
          onSearch={() => {
            setMenuOpen(false);
            setSearchOpen(true);
            setBagOpen(false);
          }}
          onBag={openBag}
          bagCount={bag.length}
          collections={collections}
        />
      )}

      {bagOpen && (
        <BagDrawer
          items={bag}
          onClose={() => setBagOpen(false)}
          onCheckout={showCheckout}
          onRemove={(index) =>
            setBag((current) =>
              current.filter((_, itemIndex) => itemIndex !== index)
            )
          }
        />
      )}

      {searchOpen && (
        <SearchPanel
          products={products}
          onClose={() => setSearchOpen(false)}
          onProduct={showProduct}
        />
      )}

      {notice && <div className="toast" role="status">{notice}</div>}
    </>
  );
}


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
