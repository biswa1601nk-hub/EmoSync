import { Link, useLocation } from 'react-router-dom';
import { Menu, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export const Navbar = () => {
  // Call useLocation to ensure Navbar re-renders when routes change (e.g., after login)
  useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 transition-all duration-200 pointer-events-none">
      <div className={`mx-auto flex items-center justify-between transition-all duration-200 pointer-events-auto ${
        scrolled 
          ? 'max-w-5xl bg-[#111318]/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 rounded-full px-6 py-3 mt-4' 
          : 'max-w-7xl pt-6 pb-4 px-4'
      }`}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full border-2 border-white/80 group-hover:border-white flex items-center justify-center transition-colors">
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
          </div>
          <span className="text-white font-semibold tracking-wide text-lg">EmoSync</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6 px-6 py-2 rounded-full border border-gray-700 bg-black/50 backdrop-blur-md">
          {localStorage.getItem('role') && (
            <>
              <Link to="/" className="text-sm text-white/80 hover:text-white transition-colors">Home</Link>
              <Link to="/dashboard" className="text-sm text-white/80 hover:text-white transition-colors">Dashboard</Link>
            </>
          )}
          
          {localStorage.getItem('role') === 'admin' && (
             <Link to="/admin" className="text-sm text-white/80 hover:text-white transition-colors">Analytics</Link>
          )}

          {localStorage.getItem('role') ? (
            <div className="flex items-center gap-4">
              {localStorage.getItem('userName') && (
                <span className="text-sm font-medium text-blue-400 border border-blue-500/30 bg-blue-500/10 px-3 py-1 rounded-full">
                  {localStorage.getItem('userName')}
                </span>
              )}
              <button 
                onClick={() => { localStorage.removeItem('role'); localStorage.removeItem('userName'); window.location.href = '/'; }} 
                className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 font-medium"
              >
                Logout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm text-white/80 hover:text-white transition-colors flex items-center gap-1">
              Login <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Mobile Nav Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-white p-2 rounded-lg bg-white/5 border border-white/10"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-4 right-4 mt-2 bg-[#111318]/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col gap-4 pointer-events-auto">
          {localStorage.getItem('role') && (
            <>
              <Link to="/" className="text-base text-white/80 hover:text-white transition-colors py-2 border-b border-white/5">Home</Link>
              <Link to="/dashboard" className="text-base text-white/80 hover:text-white transition-colors py-2 border-b border-white/5">Dashboard</Link>
            </>
          )}
          
          {localStorage.getItem('role') === 'admin' && (
             <Link to="/admin" className="text-base text-white/80 hover:text-white transition-colors py-2 border-b border-white/5">Analytics</Link>
          )}

          {localStorage.getItem('role') ? (
            <div className="flex flex-col gap-4 mt-2">
              {localStorage.getItem('userName') && (
                <span className="text-sm font-medium text-blue-400">
                  Logged in as: {localStorage.getItem('userName')}
                </span>
              )}
              <button 
                onClick={() => { localStorage.removeItem('role'); localStorage.removeItem('userName'); window.location.href = '/'; }} 
                className="w-full bg-red-500/10 text-red-400 hover:bg-red-500/20 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 font-bold"
              >
                Logout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2 font-bold mt-2">
              Login to Account <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};
