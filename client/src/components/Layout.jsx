import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { firmContact } from "../lib/siteConfig";

const navItems = [
  ["About", "/about"],
  ["Services", "/services"],
  ["Contact", "/contact"],
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const close = () => setOpen(false);

  const signOut = () => {
    logout();
    close();
    navigate("/");
  };

  return (
    <>
      <div className="topline"><div className="container topline-inner"><span>Clarity in every number. Confidence in every decision.</span><span className="topline-right">{firmContact.hours} <i /> <a href={`mailto:${firmContact.email}`}>{firmContact.email}</a></span></div></div>
      <header className="site-header">
        <div className="container nav-wrap">
          <Link to="/" className="brand" onClick={close} aria-label="PragnyX home"><span className="brand-mark">P<span>.</span></span><span className="brand-copy"><strong>PRAGNYX</strong><small>CHARTERED ACCOUNTANTS</small></span></Link>
          <button className="mobile-menu" type="button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="primary-navigation">{open ? <X /> : <Menu />}</button>
          <nav id="primary-navigation" aria-label="Primary navigation" className={open ? "main-nav open" : "main-nav"}>
            {navItems.map(([label, path]) => <NavLink key={path} to={path} onClick={close} className={({isActive}) => isActive ? "active" : ""}>{label}</NavLink>)}
            {user ? <>
              <NavLink to={user.role === "admin" ? "/admin" : "/dashboard"} onClick={close}>My portal</NavLink>
              <button className="nav-login" onClick={signOut}>Sign out</button>
            </> : <>
              <NavLink to="/login" onClick={close}>Log in</NavLink>
              <Link to="/register" className="nav-cta" onClick={close}>Get started <ArrowUpRight size={15} /></Link>
            </>}
          </nav>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand"><Link to="/" className="brand brand-light"><span className="brand-mark">P<span>.</span></span><span className="brand-copy"><strong>PRAGNYX</strong><small>CHARTERED ACCOUNTANTS</small></span></Link><p>Thoughtful financial guidance for people building something that lasts.</p></div>
          <div><h4>Explore</h4><Link to="/about">About us</Link><Link to="/services">Our services</Link><Link to="/contact">Contact</Link></div>
          <div><h4>Client access</h4><Link to="/login">Sign in</Link><Link to="/register">Create account</Link><Link to="/booking">Book a consultation</Link></div>
          <div><h4>Get in touch</h4><a href={`mailto:${firmContact.email}`}>{firmContact.email}</a><a href={`tel:${firmContact.phoneHref}`}>{firmContact.phone}</a><span>{firmContact.location}</span><div className="footer-social"><a href={import.meta.env.VITE_LINKEDIN_URL || "https://www.linkedin.com/"} target="_blank" rel="noreferrer">LinkedIn</a><a href={import.meta.env.VITE_INSTAGRAM_URL || "https://www.instagram.com/"} target="_blank" rel="noreferrer">Instagram</a></div></div>
        </div>
        <div className="container footer-bottom"><span>© {new Date().getFullYear()} PragnyX. Demonstration website for the technical assignment.</span><span>Privacy · Terms</span></div>
      </footer>
    </>
  );
}
