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
  ChevronRight, Star, Leaf, Loader2
} from 'lucide-react';

const productsGroup1 = [
  { name: "Glacier 2200", image: "/productImages/2200.png" },
  { name: "Glacier 1800", image: "/productImages/1800.png" },
  { name: "Glacier LED", image: "/productImages/led.png" },
  { name: "Thunder", image: "/productImages/thunder.png" },
  { name: "Whitefilter", image: "/productImages/wf.png" },
  { name: "Glacier Mini", image: "/productImages/mini.png" },
  { name: "Breeze", image: "/productImages/breeze.png" },
  { name: "Blackseries", image: "/productImages/bs.png" },
];

const productsGroup2 = [
  { name: "Glacier 2200", image: "/productImages/2200.png" },
  { name: "Blackseries 60", image: "/productImages/bs60.png" },
];

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{name: string, image: string} | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const scrollPos = useRef({ left: 0, top: 0 });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    phoneNumber: '',
    city: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Replace with your Google Apps Script Web App URL
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbx80nlqFCOZLxQBhj0TOPCkE1HKHuzBg-NJzK6TW12VGKp5hwD3lHnIVDWaBNNXTCU/exec';
      
      const formBody = new URLSearchParams();
      Object.entries(formData).forEach(([key, value]) => {
        formBody.append(key, value);
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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageContainerRef.current) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
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
            {['Mission', 'Manufacturing', 'Products', 'Legacy', 'Partner'].map((item) => (
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

          <button className="md:hidden text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
            <div className="flex flex-col gap-6 text-lg font-medium">
              {['Mission', 'Manufacturing', 'Products', 'Legacy', 'Partner'].map((item) => (
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
            src="/productImages/ecoasiaEntry.jpg" 
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
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
              Building the Comfort <br className="hidden md:block" /> of Your Home
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-10 max-w-3xl mx-auto font-light">
              "Only with heart can we create quality, and only quality can attain trust."
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
                  src="https://picsum.photos/seed/manufacturing-quality/800/800" 
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
                    <div className="text-2xl font-black">40+ Years</div>
                    <div className="text-sm text-slate-500 font-medium">Manufacturing Legacy</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section 1 */}
      <section id="products" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold text-emerald-600 tracking-widest uppercase mb-3">Domestic Series</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Dessert Air Coolers</h3>
              <p className="text-lg text-slate-600">
                Beat the heat with our range of domestic high-performance air coolers, Designed for maximum airflow and energy efficiency.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
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
        </div>
      </section>

      {/* Products Section 2 */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold text-emerald-600 tracking-widest uppercase mb-3">Commercial Series</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Heavy Air Coolers</h3>
              <p className="text-lg text-slate-600">
                Industrial-grade performance for larger spaces. Built to deliver massive cooling capacity while maintaining whisper-quiet operation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
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
            <h3 className="text-3xl md:text-5xl font-bold mb-6">40-Year Foundation</h3>
            <p className="text-lg text-slate-300">
              <span className="font-protest font-normal tracking-wide">ECOASIA</span> is built on the strong foundation of Asha Fan Industries, a trusted name in manufacturing since 1982. We carry forward a legacy of reliability into a new era of modern home appliances.
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
                  "Association with a 40-year legacy of trust"
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
                Manufacturing home comfort appliances with integrity, responsibility, and innovation since 1982.
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
                  <span>+91 98960 97660</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>contact@ecoasia.in</span>
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
              
              <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900 pr-12">{selectedProduct.name}</h3>
                <div className="hidden sm:flex items-center gap-3 mr-8 bg-slate-100 px-4 py-2 rounded-full">
                  <span className="text-sm font-medium text-slate-500">Zoom</span>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    step="0.1" 
                    value={zoomLevel} 
                    onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                    className="w-24 accent-emerald-500 cursor-pointer"
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
