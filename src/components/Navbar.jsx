import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Users, LayoutDashboard, User, Home as HomeIcon, LogOut, MoreVertical, Shield, Bell, Rocket, Wallet, Info, Zap, MessageSquare, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_STYLES = {
  nav: (scrolled) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: scrolled ? '12px 24px' : '16px 24px',
    transition: 'all 0.3s ease',
  }),
  inner: (scrolled) => ({
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 24px',
    borderRadius: '999px',
    background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: scrolled ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(0,0,0,0.04)',
    boxShadow: scrolled ? '0 10px 40px rgba(0,0,0,0.06)' : '0 4px 20px rgba(0,0,0,0.02)',
    transition: 'all 0.3s ease',
  }),
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'rotate(6deg)',
    boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
    transition: 'transform 0.3s ease',
    flexShrink: 0,
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 900,
    letterSpacing: '-0.04em',
    color: '#0f172a',
    textTransform: 'uppercase',
  },
  logoAccent: {
    color: '#7c3aed',
    fontWeight: 800,
    fontSize: '14px',
    marginLeft: '4px',
    fontStyle: 'italic',
    letterSpacing: '0.1em',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    borderLeft: '1px solid rgba(0,0,0,0.08)',
    paddingLeft: '20px',
    marginLeft: '12px',
  },
  navBtn: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '999px',
    border: 'none',
    background: 'transparent',
    fontSize: '10px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    cursor: 'pointer',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'color 0.2s ease',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  iconBtn: {
    position: 'relative',
    background: 'transparent',
    border: 'none',
    padding: '8px',
    borderRadius: '10px',
    color: '#475569',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  notifDot: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '7px',
    height: '7px',
    background: '#ef4444',
    borderRadius: '50%',
    border: '1.5px solid #ffffff',
  },
  divider: {
    width: '1px',
    height: '24px',
    background: 'rgba(0,0,0,0.08)',
    margin: '0 4px',
  },
  profileBtn: {
    width: '38px',
    height: '38px',
    background: 'rgba(124,58,237,0.1)',
    border: 'none',
    borderRadius: '10px',
    color: '#7c3aed',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  loginLink: {
    color: '#475569',
    textDecoration: 'none',
    fontSize: '10px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    padding: '8px 12px',
    transition: 'color 0.2s',
  },
  signupLink: {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '10px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    borderRadius: '999px',
    boxShadow: '0 4px 15px rgba(124,58,237,0.3)',
    transition: 'all 0.2s ease',
  },
  hamburgerBtn: {
    background: 'rgba(0,0,0,0.04)',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: '10px',
    padding: '8px',
    color: '#475569',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 12px)',
    right: 0,
    background: 'rgba(255,255,255,0.98)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '16px',
    padding: '16px',
    zIndex: 200,
    boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
  },
  dropdownLabel: {
    fontSize: '9px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: '#64748b',
    marginBottom: '12px',
    padding: '0 8px',
  },
  dropdownItem: (danger) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '10px 12px',
    borderRadius: '10px',
    background: 'transparent',
    border: 'none',
    color: danger ? '#ef4444' : '#334155',
    fontSize: '10px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'left',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
  }),
  notifItem: {
    padding: '10px 12px',
    background: '#f8fafc',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    marginBottom: '8px',
    cursor: 'pointer',
  },
  notifText: {
    fontSize: '10px',
    fontWeight: 700,
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '2px',
  },
  notifTime: {
    fontSize: '8px',
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  // Mobile panel
  mobileOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(4px)',
    zIndex: 90,
  },
  mobilePanel: {
    position: 'fixed',
    top: 0,
    right: 0,
    height: '100vh',
    width: '85%',
    maxWidth: '360px',
    background: '#ffffff',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    borderLeft: '1px solid #e2e8f0',
    padding: '32px 24px',
    zIndex: 100,
    boxShadow: '-20px 0 60px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  mobilePanelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '40px',
  },
  mobilePanelTitle: {
    fontSize: '18px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '-0.03em',
    fontStyle: 'italic',
    color: '#0f172a',
  },
  mobilePanelLinks: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  mobileSeparator: {
    height: '1px',
    background: '#e2e8f0',
    margin: '12px 0',
  },
  mobileNavBtn: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '12px',
    border: 'none',
    background: 'transparent',
    fontSize: '10px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    cursor: 'pointer',
    textDecoration: 'none',
    width: '100%',
    textAlign: 'left',
    boxSizing: 'border-box',
    transition: 'color 0.2s ease',
  },
  logoutBtn: {
    marginTop: '20px',
    width: '100%',
    padding: '14px',
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.15)',
    borderRadius: '14px',
    color: '#ef4444',
    fontSize: '10px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  mobileFooter: {
    paddingTop: '24px',
    textAlign: 'center',
    fontSize: '9px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: '#64748b',
  },
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const isLoggedIn = !!token && !!user;

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const isClickScrolling = useRef(false);
  const scrollTimeout = useRef(null);

  const notifications = [
    { id: 1, text: 'New buddy request from Sarah', time: '2 min ago' },
    { id: 2, text: 'Course lab material updated', time: '1 hour ago' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Skip scroll-position section calculation while a tab click scroll animation is active
      if (isClickScrolling.current) return;

      if (location.pathname === '/') {
        // If near bottom of page, force active section to contact
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80) {
          setActiveSection('contact');
          return;
        }

        const sections = [
          { id: 'contact', el: document.getElementById('contact') },
          { id: 'how-it-works', el: document.getElementById('how-it-works') },
          { id: 'about', el: document.getElementById('about') },
        ];

        let current = 'home';
        const triggerPoint = window.innerHeight * 0.35; // Upper-third threshold

        for (const sec of sections) {
          if (sec.el) {
            const rect = sec.el.getBoundingClientRect();
            if (rect.top <= triggerPoint && rect.bottom > 100) {
              current = sec.id;
              break;
            }
          }
        }
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [location.pathname]);

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    setActiveSection(id);

    // Prevent scroll events from overriding active section while smooth scrolling
    isClickScrolling.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 1200);

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        if (id === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Reusable nav link for desktop with smooth gliding pill transition
  const DesktopNavBtn = ({ to, sectionId, onClick, icon: Icon, children }) => {
    let isActive = false;
    if (sectionId) {
      isActive = location.pathname === '/' && activeSection === sectionId;
    } else if (to) {
      if (to === '/') {
        isActive = location.pathname === '/' && activeSection === 'home';
      } else {
        isActive = location.pathname === to;
      }
    }

    const style = {
      ...NAV_STYLES.navBtn,
      background: isActive ? '#7c3aed' : 'transparent',
      boxShadow: isActive ? '0 4px 20px rgba(124,58,237,0.3)' : 'none',
      color: isActive ? '#ffffff' : '#475569',
      transition: 'background 0.3s ease, color 0.2s ease, box-shadow 0.3s ease',
    };

    const handleMouseEnter = (e) => {
      if (!isActive) { e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }
    };
    const handleMouseLeave = (e) => {
      if (!isActive) { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }
    };

    const content = (
      <>
        {isActive && (
          <motion.div
            layoutId="activeDesktopNavPill"
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: '#7c3aed',
              borderRadius: '999px',
              boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
              zIndex: 0,
            }}
          />
        )}
        <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
          {Icon && <Icon size={14} />}
          {children}
        </span>
      </>
    );

    if (onClick) {
      return (
        <button style={style} onClick={onClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {content}
        </button>
      );
    }
    return (
      <Link to={to} style={style} onClick={() => setIsMenuOpen(false)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {content}
      </Link>
    );
  };

  // Reusable nav link for mobile panel with smooth gliding pill transition
  const MobileNavBtn = ({ to, sectionId, onClick, icon: Icon, children }) => {
    let isActive = false;
    if (sectionId) {
      isActive = location.pathname === '/' && activeSection === sectionId;
    } else if (to) {
      if (to === '/') {
        isActive = location.pathname === '/' && activeSection === 'home';
      } else {
        isActive = location.pathname === to;
      }
    }

    const style = {
      ...NAV_STYLES.mobileNavBtn,
      background: isActive ? 'rgba(124,58,237,0.2)' : 'transparent',
      border: isActive ? '1px solid rgba(124,58,237,0.35)' : '1px solid transparent',
      color: isActive ? '#a78bfa' : '#9ca3af',
      transition: 'all 0.3s ease',
    };

    const content = (
      <>
        {isActive && (
          <motion.div
            layoutId="activeMobileNavPill"
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(124,58,237,0.2)',
              border: '1px solid rgba(124,58,237,0.35)',
              borderRadius: '12px',
              zIndex: 0,
            }}
          />
        )}
        <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
          {Icon && <Icon size={15} />}
          {children}
        </span>
      </>
    );

    if (onClick) {
      return (
        <button style={style} onClick={onClick}>
          {content}
        </button>
      );
    }
    return (
      <Link to={to} style={style} onClick={() => setIsMenuOpen(false)}>
        {content}
      </Link>
    );
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={NAV_STYLES.nav(scrolled)}
    >
      <div style={NAV_STYLES.inner(scrolled)}>
        {/* Left: Logo + Desktop Nav Links */}
        <div style={NAV_STYLES.leftSection}>
          <Link to="/" style={NAV_STYLES.logoLink}>
            <div style={NAV_STYLES.logoIcon}>
              <span style={{ color: '#ffffff', fontWeight: 900, fontSize: '20px' }}>B</span>
            </div>
            <span style={{ ...NAV_STYLES.logoText, display: window.innerWidth >= 1024 ? 'inline' : 'none' }}>
              Buddy<span style={NAV_STYLES.logoAccent}>Up</span>
            </span>
          </Link>

          {/* Desktop nav links wrapped in LayoutGroup */}
          <LayoutGroup id="desktop-nav-group">
            <div className="hidden lg:flex" style={NAV_STYLES.navLinks}>
              <DesktopNavBtn onClick={() => scrollToSection('home')} sectionId="home" icon={HomeIcon}>Home</DesktopNavBtn>
              <DesktopNavBtn onClick={() => scrollToSection('about')} sectionId="about" icon={Info}>About</DesktopNavBtn>
              <DesktopNavBtn onClick={() => scrollToSection('how-it-works')} sectionId="how-it-works" icon={Zap}>Process</DesktopNavBtn>
              <DesktopNavBtn onClick={() => scrollToSection('contact')} sectionId="contact" icon={MessageSquare}>Contact</DesktopNavBtn>
            </div>
          </LayoutGroup>
        </div>

        {/* Right: Auth buttons / Logged-in links */}
        <div className="hidden lg:flex" style={NAV_STYLES.rightSection}>
          {isLoggedIn ? (
            <>
              {/* Notifications */}
              <div style={{ position: 'relative' }} ref={notifRef}>
                <button
                  style={NAV_STYLES.iconBtn}
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  onMouseEnter={e => { e.currentTarget.style.color = '#a78bfa'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <Bell size={19} />
                  <span style={NAV_STYLES.notifDot} />
                </button>
                <AnimatePresence>
                  {isNotifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      style={{ ...NAV_STYLES.dropdown, width: '280px' }}
                    >
                      <p style={NAV_STYLES.dropdownLabel}>Recent Notifications</p>
                      {notifications.map(n => (
                        <div key={n.id} style={NAV_STYLES.notifItem}>
                          <p style={NAV_STYLES.notifText}>{n.text}</p>
                          <span style={NAV_STYLES.notifTime}>{n.time}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <DesktopNavBtn to="/find-buddies" icon={Search}>Find Buddies</DesktopNavBtn>
              <DesktopNavBtn to="/dashboard" icon={LayoutDashboard}>Dashboard</DesktopNavBtn>
              <DesktopNavBtn to="/messages" icon={MessageSquare}>Messages</DesktopNavBtn>
              <DesktopNavBtn to="/wallet" icon={Wallet}>Wallet</DesktopNavBtn>

              <div style={NAV_STYLES.divider} />

              {/* Profile dropdown */}
              <div style={{ position: 'relative' }} ref={profileRef}>
                <button
                  style={NAV_STYLES.profileBtn}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  onMouseEnter={e => { e.currentTarget.style.background = '#7c3aed'; e.currentTarget.style.color = '#ffffff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.15)'; e.currentTarget.style.color = '#a78bfa'; }}
                >
                  <User size={18} />
                </button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      style={{ ...NAV_STYLES.dropdown, width: '200px' }}
                    >
                      <p style={NAV_STYLES.dropdownLabel}>Account</p>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        style={NAV_STYLES.dropdownItem(false)}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#ffffff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9ca3af'; }}
                      >
                        <User size={13} /> My Profile
                      </Link>
                      <button
                        onClick={() => { setIsProfileOpen(false); logout(); }}
                        style={NAV_STYLES.dropdownItem(true)}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <LogOut size={13} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link
                to="/login"
                style={NAV_STYLES.loginLink}
                onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; }}
              >
                Login Access
              </Link>
              <Link to="/signup" style={NAV_STYLES.signupLink}>
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden"
          style={NAV_STYLES.hamburgerBtn}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Mobile Menu Overlay + Slide Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={NAV_STYLES.mobileOverlay}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              style={NAV_STYLES.mobilePanel}
            >
              <div style={NAV_STYLES.mobilePanelHeader}>
                <span style={NAV_STYLES.mobilePanelTitle}>
                  Buddy<span style={{ color: '#a78bfa' }}>Up</span>
                </span>
                <button
                  style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogOut size={20} style={{ transform: 'rotate(180deg)' }} />
                </button>
              </div>

              <div style={NAV_STYLES.mobilePanelLinks}>
                <MobileNavBtn onClick={() => scrollToSection('home')} sectionId="home" icon={HomeIcon}>Home Overview</MobileNavBtn>
                <MobileNavBtn onClick={() => scrollToSection('about')} sectionId="about" icon={Info}>Our Mission</MobileNavBtn>
                <MobileNavBtn onClick={() => scrollToSection('how-it-works')} sectionId="how-it-works" icon={Zap}>Success Process</MobileNavBtn>
                <MobileNavBtn onClick={() => scrollToSection('contact')} sectionId="contact" icon={MessageSquare}>Help Desk</MobileNavBtn>

                <div style={NAV_STYLES.mobileSeparator} />

                {isLoggedIn ? (
                  <>
                    <MobileNavBtn
                      onClick={() => { setIsMenuOpen(false); alert('Notifications:\n' + notifications.map(n => '- ' + n.text).join('\n')); }}
                      icon={Bell}
                    >
                      Notifications
                    </MobileNavBtn>
                    <MobileNavBtn to="/find-buddies" icon={Search}>Find Buddies</MobileNavBtn>
                    <MobileNavBtn to="/dashboard" icon={LayoutDashboard}>My Dashboard</MobileNavBtn>
                    <MobileNavBtn to="/messages" icon={MessageSquare}>My Messages</MobileNavBtn>
                    <MobileNavBtn to="/wallet" icon={Wallet}>My Wallet</MobileNavBtn>
                    <MobileNavBtn to="/profile" icon={User}>My Profile</MobileNavBtn>
                    <button onClick={logout} style={NAV_STYLES.logoutBtn}>
                      Terminate Session
                    </button>
                  </>
                ) : (
                  <>
                    <MobileNavBtn to="/login" icon={Shield}>Account Login</MobileNavBtn>
                    <MobileNavBtn to="/signup" icon={Rocket}>Join Community</MobileNavBtn>
                  </>
                )}
              </div>

              <div style={NAV_STYLES.mobileFooter}>© 2025 BuddyUp Platform</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
