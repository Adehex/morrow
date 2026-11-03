'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  Check,
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Star,
  Trash2,
  X,
} from 'lucide-react'

type Product = {
  id: number
  name: string
  category: string
  price: number
  oldPrice: number
  image: string
  tag: string
}

type CartItem = {
  product: Product
  quantity: number
}

const FREE_DELIVERY_THRESHOLD = 75000
const STANDARD_DELIVERY_FEE = 3500

const products: Product[] = [
  { id: 1, name: 'Satin Bias Midi Dress', category: 'Women', price: 18500, oldPrice: 26000, image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=85', tag: 'Rare find' },
  { id: 2, name: 'Relaxed Linen Shirt', category: 'Men', price: 12500, oldPrice: 18000, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85', tag: 'New in' },
  { id: 3, name: '90s Leather Shoulder Bag', category: 'Accessories', price: 22000, oldPrice: 30000, image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85', tag: 'One only' },
  { id: 4, name: 'Textured Knit Co-ord', category: 'Women', price: 24000, oldPrice: 36000, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85', tag: 'Best seller' },
]

const categories = [
  { title: 'Women', count: '118 pieces', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85' },
  { title: 'Men', count: '74 pieces', image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=85' },
  { title: 'Shoes', count: '42 pieces', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85' },
  { title: 'Bags & more', count: '63 pieces', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85' },
]

const searchFilters = ['All', 'Women', 'Men', 'Accessories'] as const

const naira = (value: number) => `₦${value.toLocaleString('en-NG')}`

export default function StorefrontHome() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [hydrated, setHydrated] = useState(false)

  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchCategory, setSearchCategory] = useState<string>('All')
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [checkoutStep, setCheckoutStep] = useState<'bag' | 'details' | 'confirmed'>('bag')
  const [orderRef, setOrderRef] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('morrow:cart')
      const savedWishlist = localStorage.getItem('morrow:wishlist')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) setCart(parsedCart)
      }
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist)
        if (Array.isArray(parsedWishlist)) setWishlist(parsedWishlist)
      }
    } catch {
      // Ignore storage access errors in restricted browsing modes
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem('morrow:cart', JSON.stringify(cart))
      localStorage.setItem('morrow:wishlist', JSON.stringify(wishlist))
    } catch {
      // Ignore storage write errors
    }
  }, [cart, wishlist, hydrated])

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [searchOpen])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setWishlistOpen(false)
        setCartOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const openSearch = () => {
    setMenuOpen(false)
    setWishlistOpen(false)
    setCartOpen(false)
    setSearchOpen(true)
  }

  const openWishlist = () => {
    setMenuOpen(false)
    setSearchOpen(false)
    setCartOpen(false)
    setWishlistOpen(true)
  }

  const openCart = () => {
    setMenuOpen(false)
    setSearchOpen(false)
    setWishlistOpen(false)
    if (checkoutStep === 'confirmed') setCheckoutStep('bag')
    setCartOpen(true)
  }

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  )

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  )

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : STANDARD_DELIVERY_FEE
  const orderTotal = subtotal + deliveryFee

  const wishlistProducts = useMemo(
    () => products.filter((product) => wishlist.includes(product.id)),
    [wishlist]
  )

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return products.filter((product) => {
      const matchesCategory =
        searchCategory === 'All' || product.category.toLowerCase() === searchCategory.toLowerCase()
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.tag.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [searchQuery, searchCategory])

  const toggleWishlist = (id: number) => {
    setWishlist((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id]
    )
  }

  const addToCart = (product: Product, shouldOpenCart = true) => {
    setCart((items) => {
      const existing = items.find((item) => item.product.id === product.id)
      if (existing) {
        return items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...items, { product, quantity: 1 }]
    })
    if (checkoutStep === 'confirmed') setCheckoutStep('bag')
    if (shouldOpenCart) openCart()
  }

  const updateCartQuantity = (productId: number, delta: number) => {
    setCart((items) =>
      items
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (productId: number) => {
    setCart((items) => items.filter((item) => item.product.id !== productId))
  }

  const moveAllWishlistToCart = () => {
    wishlistProducts.forEach((product) => addToCart(product, false))
    openCart()
  }

  const handleCheckoutSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const code = `MRW-${Math.floor(100000 + Math.random() * 900000)}`
    setOrderRef(code)
    setCart([])
    setCheckoutStep('confirmed')
  }

  return (
    <main className="min-h-screen bg-[#f8f7f3] text-[#171715]">
      <div className="bg-[#171715] px-5 py-2 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-[#f8f7f3]">
        Complimentary delivery on orders over ₦75,000
      </div>

      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f8f7f3]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
          <button
            type="button"
            aria-label="Open menu"
            className="cursor-pointer lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <a href="#top" className="font-serif text-2xl tracking-[-0.06em] lg:text-3xl">
            Morrow<span className="text-[#9a7656]">.</span>
          </a>

          <nav
            className={`${
              menuOpen ? 'flex' : 'hidden'
            } absolute left-0 top-[76px] w-full flex-col gap-5 border-b border-black/10 bg-[#f8f7f3] px-5 py-6 text-xs uppercase tracking-[0.16em] lg:static lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-7 lg:border-0 lg:bg-transparent lg:p-0`}
          >
            <a className="hover:text-[#9a7656]" href="#shop" onClick={() => setMenuOpen(false)}>Shop all</a>
            <a className="hover:text-[#9a7656]" href="#categories" onClick={() => setMenuOpen(false)}>Women</a>
            <a className="hover:text-[#9a7656]" href="#categories" onClick={() => setMenuOpen(false)}>Men</a>
            <a className="hover:text-[#9a7656]" href="#categories" onClick={() => setMenuOpen(false)}>Accessories</a>
            <a className="hover:text-[#9a7656]" href="#story" onClick={() => setMenuOpen(false)}>Our story</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Search"
              onClick={openSearch}
              className="cursor-pointer p-1 transition hover:text-[#9a7656]"
            >
              <Search strokeWidth={1.5} />
            </button>

            <button
              type="button"
              aria-label="Wishlist"
              onClick={openWishlist}
              className="relative cursor-pointer p-1 transition hover:text-[#9a7656]"
            >
              <Heart
                strokeWidth={1.5}
                fill={wishlist.length > 0 ? '#9a7656' : 'none'}
                className={wishlist.length > 0 ? 'text-[#9a7656]' : ''}
              />
              {wishlist.length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-[#9a7656] text-[9px] text-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              type="button"
              aria-label="Shopping bag"
              onClick={openCart}
              className="relative cursor-pointer p-1 transition hover:text-[#9a7656]"
            >
              <ShoppingBag strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-[#171715] text-[9px] text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <section id="top" className="mx-auto grid max-w-[1440px] grid-cols-1 gap-4 px-5 pb-6 pt-5 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pt-8">
        <div className="flex min-h-[510px] flex-col justify-between bg-[#e8e0d5] p-7 sm:p-12 lg:min-h-[650px] lg:p-16">
          <div>
            <p className="mb-10 text-[10px] uppercase tracking-[0.2em] text-[#796b5d]">Curated second life / Lagos & beyond</p>
            <h1 className="max-w-xl font-serif text-[clamp(3.5rem,7vw,7.5rem)] leading-[0.84] tracking-[-0.07em]">
              Style that speaks<span className="text-[#9a7656]">.</span><br />
              <em className="font-normal">Prices that make sense.</em>
            </h1>
          </div>
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <a href="#shop" className="inline-flex items-center gap-3 bg-[#171715] px-6 py-4 text-xs uppercase tracking-[0.16em] text-white transition hover:bg-[#9a7656]">
              Shop collection <ArrowRight size={16} />
            </a>
            <a href="#shop" className="text-xs uppercase tracking-[0.16em] underline underline-offset-4 hover:text-[#9a7656]">
              Explore new arrivals
            </a>
          </div>
        </div>
        <div className="relative min-h-[510px] overflow-hidden bg-[#c7b9aa] lg:min-h-[650px]">
          <img className="absolute inset-0 size-full object-cover" src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=90" alt="Model wearing a neutral-toned fashion look" />
          <div className="absolute bottom-6 left-6 bg-[#f8f7f3]/90 px-4 py-3 backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-[0.15em]">The edit / 01</p>
            <p className="mt-1 font-serif text-lg italic">Quiet confidence</p>
          </div>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
        <div className="mb-9 flex items-end justify-between">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#9a7656]">Shop by edit</p>
            <h2 className="font-serif text-4xl tracking-[-0.05em] lg:text-6xl">Find your next favourite.</h2>
          </div>
          <a className="hidden text-xs uppercase tracking-[0.15em] underline underline-offset-4 sm:block" href="#shop">View all pieces</a>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          {categories.map((category) => (
            <a href="#shop" key={category.title} className="group relative aspect-[0.78] overflow-hidden bg-[#ded7cc]">
              <img className="size-full object-cover transition duration-700 group-hover:scale-105" src={category.image} alt={category.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-transparent" />
              <div className="absolute bottom-5 left-5 text-white">
                <p className="font-serif text-2xl italic">{category.title}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/75">{category.count}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="shop" className="bg-[#eeece6] px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#9a7656]">Just dropped</p>
              <h2 className="font-serif text-4xl tracking-[-0.05em] lg:text-6xl">
                New arrivals<span className="text-[#9a7656]">.</span>
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchCategory('All')
                setSearchQuery('')
                openSearch()
              }}
              className="flex cursor-pointer items-center gap-2 self-start text-xs uppercase tracking-[0.15em] underline underline-offset-4 hover:text-[#9a7656]"
            >
              Shop all <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4 lg:gap-5">
            {products.map((product) => (
              <article key={product.id} className="group">
                <div className="relative aspect-[0.78] overflow-hidden bg-[#ddd7ce]">
                  <img className="size-full object-cover transition duration-700 group-hover:scale-105" src={product.image} alt={product.name} />
                  <span className="absolute left-3 top-3 bg-[#f8f7f3] px-2 py-1 text-[9px] uppercase tracking-[0.15em]">
                    {product.tag}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    aria-label={wishlist.includes(product.id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                    className={`absolute right-3 top-3 cursor-pointer rounded-full p-2 transition ${
                      wishlist.includes(product.id) ? 'bg-[#171715] text-white' : 'bg-[#f8f7f3]/90 hover:bg-[#f8f7f3]'
                    }`}
                  >
                    <Heart size={15} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="absolute bottom-3 left-3 right-3 cursor-pointer bg-[#171715]/95 py-3 text-[10px] uppercase tracking-[0.16em] text-white transition hover:bg-[#9a7656] sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                  >
                    Quick add to bag
                  </button>
                </div>
                <div className="pt-4">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.14em] text-[#8b8177]">{product.category}</p>
                      <h3 className="mt-1 text-sm">{product.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{naira(product.price)}</p>
                      <p className="text-[10px] text-[#9a7656] line-through">{naira(product.oldPrice)}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="story" className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-28">
        <div className="relative aspect-[0.9] overflow-hidden bg-[#d8cfc4]">
          <img className="size-full object-cover" src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85" alt="Woman in a considered vintage fashion look" />
          <div className="absolute bottom-5 left-5 bg-[#f8f7f3] px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.15em]">Since 2021</p>
          </div>
        </div>
        <div className="max-w-lg">
          <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-[#9a7656]">Why Morrow</p>
          <h2 className="font-serif text-5xl leading-[0.95] tracking-[-0.06em] lg:text-7xl">Good style deserves a second life.</h2>
          <p className="mt-7 text-sm leading-7 text-[#655f58]">
            We believe the best wardrobes are built slowly. Every piece at Morrow is hand-selected, quality-checked and ready to become part of your story — without the premium price tag or the environmental cost.
          </p>
          <div className="mt-9 grid grid-cols-2 gap-x-5 gap-y-7 border-t border-black/15 pt-7">
            <div>
              <p className="font-serif text-2xl">01</p>
              <p className="mt-2 text-xs leading-5 text-[#655f58]">One-of-a-kind finds, curated with intention.</p>
            </div>
            <div>
              <p className="font-serif text-2xl">02</p>
              <p className="mt-2 text-xs leading-5 text-[#655f58]">Quality you can feel, prices you can love.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#a8917b] px-5 py-16 text-center text-[#f8f7f3] lg:px-10 lg:py-24">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/65">The Morrow promise</p>
        <h2 className="mx-auto mt-5 max-w-3xl font-serif text-5xl leading-[0.9] tracking-[-0.06em] lg:text-8xl">
          Good style doesn&apos;t have to cost a fortune.
        </h2>
        <a href="#shop" className="mt-9 inline-flex items-center gap-3 border border-white/50 px-6 py-4 text-xs uppercase tracking-[0.16em] transition hover:bg-white hover:text-[#171715]">
          Shop now <ArrowRight size={16} />
        </a>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#9a7656]">Notes from the community</p>
            <h2 className="font-serif text-5xl tracking-[-0.06em]">
              Loved in real life<span className="text-[#9a7656]">.</span>
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <figure className="border-t border-black/15 pt-5">
              <div className="mb-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={13} fill="currentColor" />
                ))}
              </div>
              <blockquote className="font-serif text-2xl leading-tight">
                “My favourite thing about Morrow is that every piece feels like it was waiting for me.”
              </blockquote>
              <figcaption className="mt-5 text-[10px] uppercase tracking-[0.15em] text-[#8b8177]">— Amaka, Lagos</figcaption>
            </figure>
            <figure className="border-t border-black/15 pt-5">
              <div className="mb-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={13} fill="currentColor" />
                ))}
              </div>
              <blockquote className="font-serif text-2xl leading-tight">
                “The quality check is real. My shirt arrived better than I imagined.”
              </blockquote>
              <figcaption className="mt-5 text-[10px] uppercase tracking-[0.15em] text-[#8b8177]">— Tolu, Abuja</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#e8e0d5] px-5 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#796b5d]">A little something for your inbox</p>
          <h2 className="mt-4 font-serif text-4xl tracking-[-0.05em] lg:text-6xl">First dibs, always.</h2>
          {subscribed ? (
            <p className="mt-5 text-sm">You&apos;re on the list. Watch your inbox for the good stuff.</p>
          ) : (
            <form
              className="mt-8 flex w-full max-w-md border-b border-black/40 pb-2"
              onSubmit={(event) => {
                event.preventDefault()
                setSubscribed(true)
              }}
            >
              <input
                required
                type="email"
                aria-label="Email address"
                placeholder="Your email address"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#796b5d]"
              />
              <button className="cursor-pointer text-[10px] uppercase tracking-[0.16em] hover:text-[#9a7656]" type="submit">
                Subscribe <ArrowRight className="ml-2 inline" size={14} />
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="bg-[#171715] px-5 py-12 text-[#f8f7f3] lg:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-10 lg:flex-row">
          <div>
            <a href="#top" className="font-serif text-3xl tracking-[-0.06em]">
              Morrow<span className="text-[#a8917b]">.</span>
            </a>
            <p className="mt-4 max-w-xs text-xs leading-6 text-white/55">
              Thoughtful secondhand fashion for wardrobes with a point of view.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-14 gap-y-3 text-[10px] uppercase tracking-[0.16em] text-white/70">
            <a href="#shop">Shop all</a>
            <a href="#story">Our story</a>
            <a href="#categories">Delivery</a>
            <a href="#categories">Returns</a>
            <a href="#categories">Contact</a>
            <a href="#categories">Instagram</a>
          </div>
        </div>
        <div className="mx-auto mt-14 max-w-[1440px] border-t border-white/15 pt-5 text-[10px] uppercase tracking-[0.15em] text-white/35">
          © 2024 Morrow Studio · Lagos, Nigeria
        </div>
      </footer>

      <button
        type="button"
        onClick={openCart}
        aria-label="Open shopping bag"
        className="fixed bottom-5 right-5 z-30 flex size-14 cursor-pointer items-center justify-center rounded-full bg-[#171715] text-white shadow-xl transition hover:bg-[#9a7656]"
      >
        <ShoppingBag size={20} />
        <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-[#a8917b] text-[10px]">
          {cartCount}
        </span>
      </button>

      {/* Search Modal */}
      {searchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search pieces"
          className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px]"
          onClick={() => setSearchOpen(false)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="mx-auto max-h-[88vh] w-full max-w-3xl overflow-y-auto border-b border-black/10 bg-[#f8f7f3] p-6 shadow-2xl sm:mt-12 sm:border"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#9a7656]">Search the archive</p>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="cursor-pointer p-1 hover:text-[#9a7656]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3 border-b border-black/25 pb-3">
              <Search size={18} strokeWidth={1.5} className="text-[#8b8177]" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search pieces, categories, or tags (e.g. Linen, Dress, Rare find)..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#8b8177]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="cursor-pointer text-[10px] uppercase tracking-[0.15em] text-[#8b8177] hover:text-[#171715]"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {searchFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSearchCategory(filter)}
                  className={`cursor-pointer px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] transition ${
                    searchCategory === filter
                      ? 'bg-[#171715] text-white'
                      : 'bg-[#e8e0d5] text-[#171715] hover:bg-[#ddd3c5]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="mt-6">
              {filteredProducts.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="font-serif text-2xl">No pieces found.</p>
                  <p className="mt-2 text-xs text-[#8b8177]">
                    Try another keyword or reset your filters to browse all arrivals.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setSearchCategory('All')
                    }}
                    className="mt-5 cursor-pointer text-[10px] uppercase tracking-[0.16em] underline underline-offset-4 hover:text-[#9a7656]"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {filteredProducts.map((product) => {
                    const isSaved = wishlist.includes(product.id)
                    return (
                      <div
                        key={product.id}
                        className="flex gap-4 border border-black/10 bg-[#eeece6]/60 p-3"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-24 w-20 shrink-0 object-cover"
                        />
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-[10px] uppercase tracking-[0.14em] text-[#8b8177]">
                                {product.category} · {product.tag}
                              </p>
                              <button
                                type="button"
                                onClick={() => toggleWishlist(product.id)}
                                aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
                                className="cursor-pointer text-[#171715] hover:text-[#9a7656]"
                              >
                                <Heart
                                  size={15}
                                  fill={isSaved ? '#9a7656' : 'none'}
                                  className={isSaved ? 'text-[#9a7656]' : ''}
                                />
                              </button>
                            </div>
                            <p className="mt-1 text-sm font-medium">{product.name}</p>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-sm">{naira(product.price)}</span>
                              <span className="text-[10px] text-[#9a7656] line-through">
                                {naira(product.oldPrice)}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => addToCart(product)}
                            className="mt-2 self-start cursor-pointer bg-[#171715] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white transition hover:bg-[#9a7656]"
                          >
                            Add to bag
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Drawer */}
      {wishlistOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Wishlist"
          className="fixed inset-0 z-50 bg-black/30"
          onClick={() => setWishlistOpen(false)}
        >
          <aside
            onClick={(event) => event.stopPropagation()}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#f8f7f3] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-black/10 pb-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#9a7656]">
                  Saved pieces ({wishlistProducts.length})
                </p>
                <h2 className="mt-1 font-serif text-3xl">Wishlist</h2>
              </div>
              <button
                type="button"
                onClick={() => setWishlistOpen(false)}
                aria-label="Close wishlist"
                className="cursor-pointer p-1 hover:text-[#9a7656]"
              >
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-5">
              {wishlistProducts.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Heart className="mb-4 text-[#a8917b]" size={30} strokeWidth={1.2} />
                  <p className="font-serif text-2xl">Your wishlist is empty.</p>
                  <p className="mt-2 max-w-xs text-xs text-[#8b8177]">
                    Tap the heart icon on any piece to save your favourites for later.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setWishlistOpen(false)
                      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="mt-5 cursor-pointer text-[10px] uppercase tracking-[0.16em] underline underline-offset-4 hover:text-[#9a7656]"
                  >
                    Explore new arrivals
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {wishlistProducts.map((product) => (
                    <div key={product.id} className="flex gap-4 border-b border-black/10 pb-5 last:border-0">
                      <img className="h-24 w-20 shrink-0 object-cover" src={product.image} alt={product.name} />
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between gap-3">
                            <p className="text-sm font-medium">{product.name}</p>
                            <button
                              type="button"
                              onClick={() => toggleWishlist(product.id)}
                              aria-label={`Remove ${product.name} from wishlist`}
                              className="cursor-pointer text-[#8b8177] hover:text-[#171715]"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#8b8177]">
                            {product.category} · {product.tag}
                          </p>
                          <p className="mt-1 text-sm text-[#9a7656]">{naira(product.price)}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          className="mt-3 self-start cursor-pointer bg-[#171715] px-3.5 py-2 text-[10px] uppercase tracking-[0.16em] text-white transition hover:bg-[#9a7656]"
                        >
                          Move to bag
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {wishlistProducts.length > 0 && (
              <div className="border-t border-black/10 pt-5">
                <button
                  type="button"
                  onClick={moveAllWishlistToCart}
                  className="flex w-full cursor-pointer items-center justify-center gap-3 bg-[#171715] py-4 text-xs uppercase tracking-[0.16em] text-white transition hover:bg-[#9a7656]"
                >
                  Add all to bag <ArrowRight size={15} />
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Shopping Bag & Checkout Drawer */}
      {cartOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Shopping bag"
          className="fixed inset-0 z-50 bg-black/30"
          onClick={() => setCartOpen(false)}
        >
          <aside
            onClick={(event) => event.stopPropagation()}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#f8f7f3] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-black/10 pb-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#9a7656]">
                  {checkoutStep === 'bag'
                    ? `Your edit (${cartCount})`
                    : checkoutStep === 'details'
                      ? 'Checkout'
                      : 'Order confirmed'}
                </p>
                <h2 className="mt-1 font-serif text-3xl">
                  {checkoutStep === 'bag'
                    ? 'Shopping bag'
                    : checkoutStep === 'details'
                      ? 'Delivery details'
                      : 'Thank you'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close shopping bag"
                className="cursor-pointer p-1 hover:text-[#9a7656]"
              >
                <X />
              </button>
            </div>

            {checkoutStep === 'confirmed' ? (
              <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#171715] text-white">
                  <Check size={20} />
                </div>
                <p className="font-serif text-3xl">Order received.</p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#9a7656]">
                  Reference · {orderRef}
                </p>
                <p className="mt-4 max-w-xs text-xs leading-6 text-[#655f58]">
                  Thank you{customerName ? `, ${customerName}` : ''}. We&apos;ve reserved your pieces and sent confirmation details
                  {customerEmail ? ` to ${customerEmail}` : ''}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCheckoutStep('bag')
                    setCartOpen(false)
                  }}
                  className="mt-7 cursor-pointer bg-[#171715] px-6 py-3.5 text-xs uppercase tracking-[0.16em] text-white transition hover:bg-[#9a7656]"
                >
                  Continue shopping
                </button>
              </div>
            ) : checkoutStep === 'details' ? (
              <form onSubmit={handleCheckoutSubmit} className="flex flex-1 flex-col justify-between overflow-y-auto pt-5">
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.16em] text-[#796b5d]">
                      Full name
                    </label>
                    <input
                      required
                      type="text"
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                      placeholder="Amaka Okafor"
                      className="mt-1.5 w-full border border-black/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#171715]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.16em] text-[#796b5d]">
                      Email address
                    </label>
                    <input
                      required
                      type="email"
                      value={customerEmail}
                      onChange={(event) => setCustomerEmail(event.target.value)}
                      placeholder="amaka@example.com"
                      className="mt-1.5 w-full border border-black/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#171715]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.16em] text-[#796b5d]">
                      Phone number
                    </label>
                    <input
                      required
                      type="tel"
                      value={customerPhone}
                      onChange={(event) => setCustomerPhone(event.target.value)}
                      placeholder="+234 800 000 0000"
                      className="mt-1.5 w-full border border-black/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#171715]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.16em] text-[#796b5d]">
                      Delivery address (Lagos & nationwide)
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={customerAddress}
                      onChange={(event) => setCustomerAddress(event.target.value)}
                      placeholder="Street address, area, and city"
                      className="mt-1.5 w-full resize-none border border-black/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#171715]"
                    />
                  </div>

                  <div className="mt-2 space-y-2 border-t border-black/10 pt-4 text-xs">
                    <div className="flex justify-between text-[#655f58]">
                      <span>Subtotal ({cartCount} {cartCount === 1 ? 'piece' : 'pieces'})</span>
                      <span>{naira(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[#655f58]">
                      <span>Delivery</span>
                      <span>{deliveryFee === 0 ? 'Complimentary' : naira(deliveryFee)}</span>
                    </div>
                    <div className="flex justify-between border-t border-black/10 pt-2 text-sm font-medium text-[#171715]">
                      <span>Total</span>
                      <span>{naira(orderTotal)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3 border-t border-black/10 pt-4">
                  <button
                    type="submit"
                    className="flex w-full cursor-pointer items-center justify-center gap-3 bg-[#171715] py-4 text-xs uppercase tracking-[0.16em] text-white transition hover:bg-[#9a7656]"
                  >
                    Place order · {naira(orderTotal)} <ArrowRight size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('bag')}
                    className="w-full cursor-pointer py-1 text-center text-[10px] uppercase tracking-[0.16em] text-[#655f58] underline underline-offset-4 hover:text-[#171715]"
                  >
                    Back to bag
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto py-5">
                  {cart.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <ShoppingBag className="mb-4 text-[#a8917b]" size={30} strokeWidth={1} />
                      <p className="font-serif text-2xl">Your bag is empty.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setCartOpen(false)
                          document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className="mt-5 cursor-pointer text-[10px] uppercase tracking-[0.16em] underline underline-offset-4 hover:text-[#9a7656]"
                      >
                        Continue shopping
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5">
                      {cart.map(({ product, quantity }) => (
                        <div key={product.id} className="flex gap-4 border-b border-black/10 pb-5 last:border-0">
                          <img className="h-24 w-20 shrink-0 object-cover" src={product.image} alt={product.name} />
                          <div className="flex-1">
                            <div className="flex justify-between gap-3">
                              <p className="text-sm font-medium">{product.name}</p>
                              <button
                                type="button"
                                onClick={() => removeFromCart(product.id)}
                                aria-label={`Remove ${product.name}`}
                                className="cursor-pointer text-[#8b8177] hover:text-[#171715]"
                              >
                                <X size={14} />
                              </button>
                            </div>
                            <p className="mt-1 text-sm text-[#9a7656]">{naira(product.price * quantity)}</p>
                            <div className="mt-3 inline-flex items-center gap-3 border border-black/15 px-2.5 py-1 text-xs">
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(product.id, -1)}
                                aria-label={`Decrease ${product.name} quantity`}
                                className="cursor-pointer p-0.5 hover:text-[#9a7656]"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="min-w-4 text-center">{quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(product.id, 1)}
                                aria-label={`Increase ${product.name} quantity`}
                                className="cursor-pointer p-0.5 hover:text-[#9a7656]"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="border-t border-black/10 pt-5">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{naira(subtotal)}</span>
                    </div>
                    <p className="mt-2 text-xs text-[#8b8177]">
                      {subtotal >= FREE_DELIVERY_THRESHOLD
                        ? 'Complimentary delivery unlocked on your order.'
                        : `Add ${naira(FREE_DELIVERY_THRESHOLD - subtotal)} more for complimentary delivery.`}
                    </p>
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('details')}
                      className="mt-5 flex w-full cursor-pointer items-center justify-center gap-3 bg-[#171715] py-4 text-xs uppercase tracking-[0.16em] text-white transition hover:bg-[#9a7656]"
                    >
                      Checkout <ArrowRight size={15} />
                    </button>
                  </div>
                )}
              </>
            )}
          </aside>
        </div>
      )}
    </main>
  )
}
