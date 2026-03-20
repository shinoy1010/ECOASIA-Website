/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Wind, Zap, Award, Users, CheckCircle, 
  ArrowRight, Phone, Mail, MapPin, Menu, X, 
  ThermometerSun, Droplets, Factory, ThumbsUp,
  ChevronRight, ChevronDown, Star, Leaf, Loader2
} from 'lucide-react';
import { STATIC_IMAGES } from './constants';

const transformDriveUrl = (url: string) => {
  if (!url) return url;
  // Handle standard Google Drive sharing links
  const driveMatch = url.match(/\/(?:d|file\/d|open\?id=)([\w-]{25,})[\/\?]?/);
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }
  return url;
};

const LazyImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={`relative ${className} bg-slate-100`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError(true);
        }}
        referrerPolicy="no-referrer"
        loading="lazy"
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-400">
          <div className="text-center p-4">
            <Droplets className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
};

interface Product {
  name: string;
  image: string;
  category: string;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [mainImages, setMainImages] = useState<Record<string, string>>(STATIC_IMAGES);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{name: string, image: string} | null>(null);
  const [isKitchenCollectionExpanded, setIsKitchenCollectionExpanded] = useState(false);
  const [isSmartHomeExpanded, setIsSmartHomeExpanded] = useState(false);
  const [isDomesticSeriesExpanded, setIsDomesticSeriesExpanded] = useState(false);
  const [isLegacyVentilationExpanded, setIsLegacyVentilationExpanded] = useState(false);
  const [isCommercialSeriesExpanded, setIsCommercialSeriesExpanded] = useState(false);
  const [isProductsHovered, setIsProductsHovered] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const scrollPos = useRef({ left: 0, top: 0 });

  const scriptUrl = 'https://script.google.com/macros/s/AKfycby--yVfmoiDv64CZYtz1xlYg8aubLtILeXuj3MlQJE4Jpwpan9JwJpFO4sbMPruYotFkA/exec';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(scriptUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (Array.isArray(data)) {
          const fetchedMainImages: Record<string, string> = {};
          const fetchedProducts: any[] = [];

          data.forEach((p: any) => {
            const rawName = p["Product Name"] || p.name;
            const rawImage = p["Image Link"] || p.image;
            const rawCategory = p["Category"] || p.category || "Domestic";
            
            // Normalize category (e.g., "heating" -> "Heating")
            const category = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1).toLowerCase();

            // Skip if both name and image are missing or empty
            if (!rawName && !rawImage) return;

            const name = rawName || "Unnamed Product";
            const image = transformDriveUrl(rawImage || "https://picsum.photos/seed/placeholder/800/1000");

            if (name.toLowerCase() === "main") {
              // Skip Hero and Safety categories as they are now static
              if (category === "Hero" || category === "Safety") return;
              fetchedMainImages[category] = image;
            } else {
              fetchedProducts.push({ name, image, category });
            }
          });

          if (Object.keys(fetchedMainImages).length > 0) {
            setMainImages(prev => ({ ...prev, ...fetchedMainImages }));
          }
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to empty array or some default products if needed
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const productsGroup1 = products.filter(p => p.category === "Domestic");
  const productsGroup2 = products.filter(p => p.category === "Commercial");
  const productsGroup3 = products.filter(p => p.category === "Fans");
  const productsGroup4 = products.filter(p => p.category === "Kitchen");
  const productsGroup5 = products.filter(p => p.category === "Heating");


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    phoneNumber: '',
    city: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const foundationYear = 1980;
  const currentYear = new Date().getFullYear();
  const yearsOfLegacy = currentYear - foundationYear;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Replace with your Google Apps Script Web App URL
      const scriptUrl = 'https://script.google.com/macros/s/AKfycby--yVfmoiDv64CZYtz1xlYg8aubLtILeXuj3MlQJE4Jpwpan9JwJpFO4sbMPruYotFkA/exec';
      
      const formBody = new URLSearchParams();
      Object.entries(formData).forEach(([key, value]) => {
        formBody.append(key, value as string);
      });

      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.toString(),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({
          firstName: '',
          lastName: '',
          businessName: '',
          phoneNumber: '',
          city: ''
        });
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setTimeout(() => setZoomLevel(1), 300);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageContainerRef.current || zoomLevel === 1) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    scrollPos.current = { 
      left: imageContainerRef.current.scrollLeft, 
      top: imageContainerRef.current.scrollTop 
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!imageContainerRef.current || zoomLevel === 1) return;
    setIsDragging(true);
    startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    scrollPos.current = { 
      left: imageContainerRef.current.scrollLeft, 
      top: imageContainerRef.current.scrollTop 
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageContainerRef.current) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    imageContainerRef.current.scrollLeft = scrollPos.current.left - dx;
    imageContainerRef.current.scrollTop = scrollPos.current.top - dy;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !imageContainerRef.current) return;
    const dx = e.touches[0].clientX - startPos.current.x;
    const dy = e.touches[0].clientY - startPos.current.y;
    imageContainerRef.current.scrollLeft = scrollPos.current.left - dx;
    imageContainerRef.current.scrollTop = scrollPos.current.top - dy;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const container = imageContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoomLevel(prev => {
        const zoomChange = e.deltaY < 0 ? 0.15 : -0.15;
        return Math.min(Math.max(1, prev + zoomChange), 5);
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [selectedProduct]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-200 selection:text-emerald-900">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('home')}>
            <div 
              className={`w-[38px] h-[38px] ${isScrolled ? 'bg-emerald-600' : 'bg-emerald-500'}`}
              style={{
                maskImage: 'url(/ecoasia/EAlogo.png)',
                WebkitMaskImage: 'url(/ecoasia/EAlogo.png)',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center'
              }}
            />
            <span className={`text-2xl font-protest font-normal tracking-wide ${isScrolled ? 'text-slate-900' : 'text-white'}`}>ECOASIA</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {['Mission', 'Manufacturing'].map((item) => (
              <button 
                key={item} 
                onClick={() => scrollTo(item.toLowerCase())}
                className={`text-sm font-medium transition-colors hover:text-emerald-500 ${isScrolled ? 'text-slate-600' : 'text-slate-200'}`}
              >
                {item}
              </button>
            ))}
            
            {/* Products Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsProductsHovered(true)}
              onMouseLeave={() => setIsProductsHovered(false)}
            >
              <button 
                onClick={() => scrollTo('products')}
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-emerald-500 ${isScrolled ? 'text-slate-600' : 'text-slate-200'}`}
              >
                Products
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProductsHovered ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isProductsHovered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-2"
                  >
                    {[
                      { label: "Domestic Air Coolers", id: "products" },
                      { label: "Commercial Air Coolers", id: "commercial-coolers" },
                      { label: "Pedestal and Ceiling Fan", id: "legacy-ventilation" },
                      { label: "Curd Percolator", id: "kitchen-collection" },
                      { label: "Smart Heating Essentials", id: "smart-home" }
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          scrollTo(option.id);
                          setIsProductsHovered(false);
                        }}
                        className="w-full text-left px-6 py-3 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {['Legacy', 'Partner'].map((item) => (
              <button 
                key={item} 
                onClick={() => scrollTo(item.toLowerCase())}
                className={`text-sm font-medium transition-colors hover:text-emerald-500 ${isScrolled ? 'text-slate-600' : 'text-slate-200'}`}
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => scrollTo('partner')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${isScrolled ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-white text-slate-900 hover:bg-slate-100'}`}
            >
              Contact Us
            </button>
          </div>

          <button className="md:hidden text-slate-900" onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen);
            setMobileProductsOpen(false);
          }}>
            {mobileMenuOpen ? <X className={isScrolled ? 'text-slate-900' : 'text-white'} /> : <Menu className={isScrolled ? 'text-slate-900' : 'text-white'} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-4"
          >
            <div className="flex flex-col gap-4 text-lg font-medium overflow-y-auto max-h-[80vh] pb-10">
              {['Mission', 'Manufacturing'].map((item) => (
                <button 
                  key={item} 
                  onClick={() => scrollTo(item.toLowerCase())}
                  className="text-left text-slate-600 hover:text-emerald-600 border-b border-slate-100 pb-4"
                >
                  {item}
                </button>
              ))}

              {/* Expandable Products Item */}
              <div className="border-b border-slate-100 pb-4">
                <button 
                  onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                  className="flex items-center justify-between w-full text-left text-slate-600 hover:text-emerald-600"
                >
                  Products
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileProductsOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {mobileProductsOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-4 pl-4 pt-4">
                        {[
                          { label: "Domestic Air Coolers", id: "products" },
                          { label: "Commercial Air Coolers", id: "commercial-coolers" },
                          { label: "Pedestal and Ceiling Fan", id: "legacy-ventilation" },
                          { label: "Curd Percolator", id: "kitchen-collection" },
                          { label: "Smart Heating Essentials", id: "smart-home" }
                        ].map((option) => (
                          <button
                            key={option.id}
                            onClick={() => {
                              scrollTo(option.id);
                              setMobileMenuOpen(false);
                            }}
                            className="text-left text-base text-slate-500 hover:text-emerald-600 py-1"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {['Legacy', 'Partner'].map((item) => (
                <button 
                  key={item} 
                  onClick={() => scrollTo(item.toLowerCase())}
                  className="text-left text-slate-600 hover:text-emerald-600 border-b border-slate-100 pb-4"
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={mainImages.Hero} 
            alt="Ecoasia Facility" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-slate-200 text-sm font-medium tracking-wider uppercase mb-6 border border-white/20 backdrop-blur-sm">
              Ecoasia Private Limited
            </span>
            <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-6 leading-tight">
              Empowering Your <br className="hidden md:block" /> Tomorrow, Today!
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-3xl mx-auto font-light italic">
              "Only with heart do we craft quality, and only quality can attain trust."
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => scrollTo('products')}
                className="px-8 py-4 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Explore Products <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => scrollTo('legacy')}
                className="px-8 py-4 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 backdrop-blur-sm transition-all w-full sm:w-auto justify-center"
              >
                Our Legacy
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-emerald-600 tracking-widest uppercase mb-3">Core Philosophy</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">The <span className="font-protest font-normal tracking-wide">ECOASIA</span> Promise</h3>
            <p className="text-lg text-slate-600">
              We believe that a comfortable home is the foundation of a happy life. Our mission is to deliver appliances that combine robust engineering with everyday practicality.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Integrity in Engineering",
                desc: "We don't cut corners. Every product is built with durable materials designed to withstand Indian conditions."
              },
              {
                icon: ThumbsUp,
                title: "Responsibility",
                desc: "We stand by what we make. Our after-sales support and warranties reflect our confidence in our manufacturing."
              },
              {
                icon: Zap,
                title: "Innovation for India",
                desc: "We understand local needs—from voltage fluctuations to extreme summers—and design our products accordingly."
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
                  <item.icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing Section */}
      <section id="manufacturing" className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-sm font-bold text-emerald-400 tracking-widest uppercase mb-3">Manufacturing Excellence</h2>
              <h3 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Quality Control is Our Signature</h3>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Our state-of-the-art facility ensures that every <span className="font-protest font-normal tracking-wide">ECOASIA</span> product meets stringent quality standards before it reaches your home. We combine modern technology with decades of manufacturing expertise.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "Material Inspection", desc: "Rigorous checks on all raw materials, from motor windings to plastic polymers." },
                  { title: "Performance Testing", desc: "Every unit undergoes simulated extreme-condition testing." },
                  { title: "Safety First", desc: "Strict adherence to electrical safety standards to protect your family." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1">
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden relative">
                <img 
                  src={mainImages.Safety} 
                  alt="Manufacturing Process" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/80 to-transparent"></div>
              </div>
              
              {/* Floating Stat Card */}
              <div className="absolute -bottom-8 -left-8 bg-white text-slate-900 p-6 rounded-2xl shadow-xl max-w-xs">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <Factory className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-black">{yearsOfLegacy}+ Years</div>
                    <div className="text-sm text-slate-500 font-medium">Manufacturing Legacy</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section 1 */}
      <section id="products" className="pt-12 pb-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoadingProducts ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Loading products from legacy database...</p>
            </div>
          ) : (
            <>
          <div className={`flex flex-col items-center text-center gap-6 ${isDomesticSeriesExpanded ? 'mb-12' : 'mb-0'}`}>
            <div className="max-w-3xl">
              <h2 className="text-sm font-bold text-emerald-600 tracking-widest uppercase mb-3">The Advanced Cooling Collection</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">High-Performance Domestic Air Coolers</h3>
              <p className="text-lg text-slate-600 mb-6">
                Engineered for ultimate relief during the peak of summer, our range of Domestic Air Coolers provides powerful, refreshing airflow with maximum cooling efficiency. Featuring high-density honeycomb pads and heavy-duty blowers, these coolers are designed for superior air throw and rapid temperature reduction.
              </p>
              <div className="mb-8 rounded-2xl overflow-hidden shadow-md border border-slate-100">
                <img 
                  src={mainImages.Domestic} 
                  alt="High-Performance Domestic Air Coolers" 
                  className="w-full h-auto object-cover max-h-[400px]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button 
                onClick={() => setIsDomesticSeriesExpanded(!isDomesticSeriesExpanded)}
                className="inline-flex items-center px-6 py-3 bg-emerald-50 text-emerald-700 font-semibold rounded-full hover:bg-emerald-100 transition-colors mx-auto"
              >
                {isDomesticSeriesExpanded ? 'Hide Products' : 'View Products'}
                <ChevronDown className={`ml-2 w-5 h-5 transition-transform duration-300 ${isDomesticSeriesExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isDomesticSeriesExpanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4 pb-8">
                  {productsGroup1.map((product, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all"
                    >
                      <div className="aspect-[4/5] overflow-hidden bg-slate-100 relative">
                        <LazyImage 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="p-6">
                        <h4 className="text-xl font-bold text-slate-900 mb-1">{product.name}</h4>
                        <button 
                          onClick={() => setSelectedProduct(product)}
                          className="flex items-center text-emerald-600 text-sm font-medium hover:text-emerald-700 transition-colors"
                        >
                          View Details <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </>
          )}
        </div>
      </section>

      {/* Products Section 2 */}
      <section id="commercial-coolers" className="pt-12 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex flex-col items-center text-center gap-6 ${isCommercialSeriesExpanded ? 'mb-12' : 'mb-0'}`}>
            <div className="max-w-3xl">
              <h2 className="text-sm font-bold text-emerald-600 tracking-widest uppercase mb-3">Commercial Series</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Heavy Air Coolers</h3>
              <p className="text-lg text-slate-600 mb-6">
                Industrial-grade performance for larger spaces. Built to deliver massive cooling capacity while maintaining whisper-quiet operation.
              </p>
              <div className="mb-8 rounded-2xl overflow-hidden shadow-md border border-slate-100">
                <img 
                  src={mainImages.Commercial} 
                  alt="Heavy Air Coolers Commercial Series" 
                  className="w-full h-auto object-cover max-h-[400px]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button 
                onClick={() => setIsCommercialSeriesExpanded(!isCommercialSeriesExpanded)}
                className="inline-flex items-center px-6 py-3 bg-emerald-50 text-emerald-700 font-semibold rounded-full hover:bg-emerald-100 transition-colors mx-auto"
              >
                {isCommercialSeriesExpanded ? 'Hide Products' : 'View Products'}
                <ChevronDown className={`ml-2 w-5 h-5 transition-transform duration-300 ${isCommercialSeriesExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isCommercialSeriesExpanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4 pb-8">
                  {productsGroup2.map((product, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="group bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all"
                    >
                      <div className="aspect-[4/5] overflow-hidden bg-slate-200 relative">
                        <LazyImage 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="p-6">
                        <h4 className="text-xl font-bold text-slate-900 mb-1">{product.name}</h4>
                        <button 
                          onClick={() => setSelectedProduct(product)}
                          className="flex items-center text-emerald-600 text-sm font-medium hover:text-emerald-700 transition-colors"
                        >
                          View Details <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Products Section 3 - The Legacy Ventilation Collection */}
      <section id="legacy-ventilation" className="pt-12 pb-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex flex-col items-center text-center gap-6 ${isLegacyVentilationExpanded ? 'mb-12' : 'mb-0'}`}>
            <div className="max-w-3xl">
              <h2 className="text-sm font-bold text-emerald-600 tracking-widest uppercase mb-3">The Legacy Ventilation Collection</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">High-Speed Ceiling & Pedestal Fans</h3>
              <p className="text-lg text-slate-600 mb-6">
                Precision-engineered for maximum air delivery, Ceiling and Pedestal fans are designed to keep you cool in the toughest summers. Featuring heavy-duty motors and aerodynamically balanced blades, our fans provide consistent, high-speed airflow while maintaining world-class energy efficiency.
              </p>
              <div className="mb-8 rounded-2xl overflow-hidden shadow-md border border-slate-100">
                <img 
                  src={mainImages.Fans} 
                  alt="High-Speed Ceiling & Pedestal Fans" 
                  className="w-full h-auto object-cover max-h-[400px]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button 
                onClick={() => setIsLegacyVentilationExpanded(!isLegacyVentilationExpanded)}
                className="inline-flex items-center px-6 py-3 bg-emerald-50 text-emerald-700 font-semibold rounded-full hover:bg-emerald-100 transition-colors mx-auto"
              >
                {isLegacyVentilationExpanded ? 'Hide Products' : 'View Products'}
                <ChevronDown className={`ml-2 w-5 h-5 transition-transform duration-300 ${isLegacyVentilationExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isLegacyVentilationExpanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4 pb-8">
                  {productsGroup3.map((product, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all"
                    >
                      <div className="aspect-[4/5] overflow-hidden bg-slate-200 relative">
                        <LazyImage 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="p-6">
                        <h4 className="text-xl font-bold text-slate-900 mb-1">{product.name}</h4>
                        <button 
                          onClick={() => setSelectedProduct(product)}
                          className="flex items-center text-emerald-600 text-sm font-medium hover:text-emerald-700 transition-colors"
                        >
                          View Details <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Products Section 4 - The Traditional Kitchen Collection */}
      <section id="kitchen-collection" className="pt-12 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex flex-col items-center text-center gap-6 ${isKitchenCollectionExpanded ? 'mb-12' : 'mb-0'}`}>
            <div className="max-w-3xl">
              <h2 className="text-sm font-bold text-emerald-600 tracking-widest uppercase mb-3">The Traditional Kitchen Collection</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">High-Torque Premium Madhani (Curd Percolators)</h3>
              <p className="text-lg text-slate-600 mb-6">
                Built to honor the authentic tradition of Indian kitchens, our Madhanis combine high-torque motor technology with rugged durability. Designed for effortless churning, they feature heavy-duty bodies and precision-engineered blades that ensure consistent performance even during heavy use.
              </p>
              <div className="mb-8 rounded-2xl overflow-hidden shadow-md border border-slate-100">
                <img 
                  src={mainImages.Kitchen} 
                  alt="Traditional Kitchen Collection Madhani" 
                  className="w-full h-auto object-cover max-h-[400px]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button 
                onClick={() => setIsKitchenCollectionExpanded(!isKitchenCollectionExpanded)}
                className="inline-flex items-center px-6 py-3 bg-emerald-50 text-emerald-700 font-semibold rounded-full hover:bg-emerald-100 transition-colors mx-auto"
              >
                {isKitchenCollectionExpanded ? 'Hide Products' : 'View Products'}
                <ChevronDown className={`ml-2 w-5 h-5 transition-transform duration-300 ${isKitchenCollectionExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isKitchenCollectionExpanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4 pb-8">
                  {productsGroup4.map((product, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="group bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all"
                    >
                      <div className="aspect-[4/5] overflow-hidden bg-slate-200 relative">
                        <LazyImage 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="p-6">
                        <h4 className="text-xl font-bold text-slate-900 mb-1">{product.name}</h4>
                        <button 
                          onClick={() => setSelectedProduct(product)}
                          className="flex items-center text-emerald-600 text-sm font-medium hover:text-emerald-700 transition-colors"
                        >
                          View Details <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Products Section 5 - The Smart Heating Essentials */}
      <section id="smart-home" className="pt-12 pb-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex flex-col items-center text-center gap-6 ${isSmartHomeExpanded ? 'mb-12' : 'mb-0'}`}>
            <div className="max-w-3xl">
              <h2 className="text-sm font-bold text-emerald-600 tracking-widest uppercase mb-3">The Smart Heating Essentials</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Advanced Heating & Smart Cooking Solutions</h3>
              <p className="text-lg text-slate-600 mb-6">
                Experience the perfect blend of safety and innovation with our seasonal essentials. Our Premium Room Heaters provide instant, uniform warmth with built-in safety features for a cozy winter, while our Infra-Red Cooktops bring high-efficiency, flameless cooking to the modern kitchen.
              </p>
              <div className="mb-8 rounded-2xl overflow-hidden shadow-md border border-slate-100">
                <img 
                  src={mainImages.Heating} 
                  alt="Smart Heating Essentials - Heaters and Cooktops" 
                  className="w-full h-auto object-cover max-h-[400px]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button 
                onClick={() => setIsSmartHomeExpanded(!isSmartHomeExpanded)}
                className="inline-flex items-center px-6 py-3 bg-emerald-50 text-emerald-700 font-semibold rounded-full hover:bg-emerald-100 transition-colors mx-auto"
              >
                {isSmartHomeExpanded ? 'Hide Products' : 'View Products'}
                <ChevronDown className={`ml-2 w-5 h-5 transition-transform duration-300 ${isSmartHomeExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isSmartHomeExpanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4 pb-8">
                  {productsGroup5.map((product, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all"
                    >
                      <div className="aspect-[4/5] overflow-hidden bg-slate-200 relative">
                        <LazyImage 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="p-6">
                        <h4 className="text-xl font-bold text-slate-900 mb-1">{product.name}</h4>
                        <button 
                          onClick={() => setSelectedProduct(product)}
                          className="flex items-center text-emerald-600 text-sm font-medium hover:text-emerald-700 transition-colors"
                        >
                          View Details <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Legacy Section */}
      <section id="legacy" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-emerald-400 tracking-widest uppercase mb-3">Our Legacy</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-6">{yearsOfLegacy}-Year Foundation</h3>
            <p className="text-lg text-slate-300">
              <span className="font-protest font-normal tracking-wide">ECOASIA</span> is built on the strong foundation of Asha Fan Industries, a trusted name in manufacturing since {foundationYear}. We carry forward a legacy of reliability into a new era of modern home appliances.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl"
            >
              <Award className="w-10 h-10 text-emerald-400 mb-6" />
              <h4 className="text-2xl font-bold mb-3">Award-Winning Standards</h4>
              <p className="text-slate-300">
                Proud nominee for the prestigious India 5000 MSME Awards, recognizing our commitment to quality and business excellence.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl"
            >
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <h4 className="text-2xl font-bold mb-3">Customer Verified</h4>
              <p className="text-slate-300">
                Maintaining a 5-Star Rating on Justdial, a testament to our unwavering focus on customer satisfaction and product reliability.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section id="partner" className="py-24 bg-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold text-emerald-200 tracking-widest uppercase mb-3">B2B / Dealerships</h2>
              <h3 className="text-3xl md:text-5xl font-bold mb-6">Partner with <span className="font-protest font-normal tracking-wide">ECOASIA</span></h3>
              <p className="text-lg text-emerald-100 mb-8">
                Join our growing network of successful dealers and distributors. We offer a partnership built on mutual growth, transparent policies, and exceptional products.
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  "Competitive dealer pricing structures",
                  "Reliable after-sales support network",
                  "Comprehensive marketing and branding materials",
                  `Association with a ${yearsOfLegacy}-year legacy of trust`
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-emerald-50 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-2xl text-slate-900">
              <h4 className="text-2xl font-bold mb-6">Request Dealership Info</h4>
              <form className="space-y-4" onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">First Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" 
                      placeholder="John" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Last Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" 
                      placeholder="Doe" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Business Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" 
                    placeholder="Your Company Ltd." 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" 
                    placeholder="+91 98765 43210" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">City / Region</label>
                  <input 
                    type="text" 
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" 
                    placeholder="Mumbai, Maharashtra" 
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : submitSuccess ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      Request Sent!
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div 
                  className="w-[38px] h-[38px] bg-emerald-500"
                  style={{
                    maskImage: 'url(/ecoasia/EAlogo.png)',
                    WebkitMaskImage: 'url(/ecoasia/EAlogo.png)',
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center'
                  }}
                />
                <span className="text-2xl font-protest font-normal text-white tracking-wide">ECOASIA</span>
              </div>
              <p className="text-slate-400 max-w-sm mb-8">
                Empowering Your Tomorrow, Today! Manufacturing home comfort appliances with integrity, responsibility, and innovation since {foundationYear}.
              </p>
              <div className="flex gap-4">
                {/* Social Links could go here */}
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
              <ul className="space-y-3">
                {['Mission', 'Manufacturing', 'Products', 'Legacy', 'Partner'].map((item) => (
                  <li key={item}>
                    <button onClick={() => scrollTo(item.toLowerCase())} className="hover:text-emerald-400 transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>ECOASIA PRIVATE LIMITED, Railway Road<br/>Gharaunda, Karnal, Haryana 132114 | INDIA</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <a href="tel:+919896097660" className="hover:text-emerald-400 transition-colors">
                    +91 98960 97660
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <a href="mailto:contact@ecoasia.in" className="hover:text-emerald-400 transition-colors">
                    contact@ecoasia.in
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} ECOASIA PRIVATE LIMITED. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Image Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 sm:p-6"
            onClick={handleCloseModal}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-slate-100 rounded-full transition-colors z-10 text-slate-900"
                onClick={handleCloseModal}
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 text-center">{selectedProduct.name}</h3>
                <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-full">
                  <span className="text-xs sm:text-sm font-medium text-slate-500">Zoom</span>
                  <input 
                    type="range" 
                    min="1" 
                    max="3" 
                    step="0.1" 
                    value={zoomLevel} 
                    onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                    className="w-32 sm:w-24 accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
              
              <div 
                className="flex-1 overflow-auto bg-slate-50/50 relative select-none"
                ref={imageContainerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
                style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
              >
                <div 
                  className="min-h-full min-w-full flex items-center justify-center"
                  style={{ 
                    width: zoomLevel === 1 ? '100%' : `${zoomLevel * 100}%`,
                    height: zoomLevel === 1 ? '100%' : `${zoomLevel * 100}%`,
                    padding: '1.5rem'
                  }}
                >
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="object-contain rounded-lg shadow-sm pointer-events-none"
                    style={{ 
                      width: '100%',
                      height: '100%',
                      maxHeight: zoomLevel === 1 ? '65vh' : 'none'
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
