import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useAuth } from "../../features/auth/context/AuthContext";
import { firmContact, siteBrand } from "../lib/siteConfig";

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
      <div className="topline"><div className="container topline-inner"><span>{siteBrand.isDemo ? "DEMO WEBSITE · " : ""}{siteBrand.tagline}</span><span className="topline-right">{siteBrand.isDemo && <span className="demo-topline-label">SAMPLE DETAILS</span>}{firmContact.hours} <i />{firmContact.isDemo ? <span>{firmContact.email}</span> : <a href={`mailto:${firmContact.email}`}>{firmContact.email}</a>}</span></div></div>
      <header className="site-header">
        <div className="container nav-wrap">
          <Link to="/" className="brand" onClick={close} aria-label="PragnyX home"><span className="brand-mark">P<span>.</span></span><span className="brand-copy"><strong>{siteBrand.name.toUpperCase()}</strong><small>{siteBrand.descriptor}</small>{siteBrand.isDemo && <span className="brand-demo-label">{siteBrand.demoLabel}</span>}</span></Link>
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
          <div className="footer-brand"><Link to="/" className="brand brand-light"><span className="brand-mark">P<span>.</span></span><span className="brand-copy"><strong>{siteBrand.name.toUpperCase()}</strong><small>{siteBrand.descriptor}</small>{siteBrand.isDemo && <span className="brand-demo-label">{siteBrand.demoLabel}</span>}</span></Link><p>Thoughtful financial guidance for people building something that lasts.</p></div>
          <div><h4>Explore</h4><Link to="/about">About us</Link><Link to="/services">Our services</Link><Link to="/contact">Contact</Link></div>
          <div><h4>Client access</h4><Link to="/login">Sign in</Link><Link to="/register">Create account</Link><Link to="/booking">Book a consultation</Link></div>
          <div><h4>{siteBrand.isDemo ? "Sample contact details" : "Get in touch"}</h4>{firmContact.isDemo ? <><span>{firmContact.email}</span><span>{firmContact.phone}</span></> : <><a href={`mailto:${firmContact.email}`}>{firmContact.email}</a><a href={`tel:${firmContact.phoneHref}`}>{firmContact.phone}</a></>}<span>{firmContact.location}</span><div className="footer-social"><a href={import.meta.env.VITE_LINKEDIN_URL || "https://www.linkedin.com/"} target="_blank" rel="noreferrer">{siteBrand.isDemo ? "LinkedIn placeholder" : "LinkedIn"}</a><a href={import.meta.env.VITE_INSTAGRAM_URL || "https://www.instagram.com/"} target="_blank" rel="noreferrer">{siteBrand.isDemo ? "Instagram placeholder" : "Instagram"}</a></div></div>
        </div>
        <div className="container footer-bottom"><span>© {new Date().getFullYear()} {siteBrand.name}. {siteBrand.isDemo ? "Demo assignment website · Fictional firm · Sample contact details only." : "Clarity in every number."}</span><span>{siteBrand.isDemo ? "Not a real CA office" : "Privacy · Terms"}</span></div>
      </footer>
    </>
  );
}
