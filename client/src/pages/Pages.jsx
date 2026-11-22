import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, CheckCircle2, CircleAlert, ClipboardList, FileText, LogOut, Plus, RefreshCw, ShieldCheck, Users } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import SectionTitle from "../components/SectionTitle";
import ServiceCard from "../components/ServiceCard";
import ServiceRequestForm from "../components/ServiceRequestForm";
import ProfileForm from "../components/ProfileForm";

const SERVICES = [
  { name:"Income Tax Filing",slug:"income-tax-filing",shortDescription:"Accurate, timely tax returns for individuals and growing businesses.",description:"Get support with preparing and filing income tax returns, understanding tax obligations and keeping records organised." },
  { name:"GST Registration & Filing",slug:"gst-registration-filing",shortDescription:"Practical GST compliance, returns and registration support.",description:"Navigate GST registration, periodic returns, reconciliations and compliance with a careful, organised process." },
  { name:"Company Registration",slug:"company-registration",shortDescription:"Choose the right structure and start your business with confidence.",description:"Guidance through entity selection, incorporation documentation and the formalities involved in setting up a company." },
  { name:"Accounting & Bookkeeping",slug:"accounting-bookkeeping",shortDescription:"Reliable books and clear financial records for better decisions.",description:"Structured accounting support, bookkeeping, reconciliations and periodic reporting to keep your records dependable." },
  { name:"Tax Planning & Consultancy",slug:"tax-planning-consultancy",shortDescription:"Plan ahead with a considered view of your tax position.",description:"Understand your tax position and evaluate compliant planning choices in the context of your personal or business goals." },
  { name:"Auditing Services",slug:"auditing-services",shortDescription:"Independent review and a disciplined approach to assurance.",description:"Audit and assurance support focused on records, controls, evidence and clear communication of findings." },
  { name:"Financial Advisory",slug:"financial-advisory",shortDescription:"Make informed decisions with a clearer view of the numbers.",description:"Financial analysis and practical advisory support to help evaluate business performance and opportunities." },
  { name:"Business Compliance",slug:"business-compliance",shortDescription:"Stay organised with recurring statutory obligations.",description:"A structured approach to recurring statutory filings, documentation and compliance calendar management." },
];
const pageTitle = (eyebrow,title,copy) => <section className="page-banner"><div className="container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{copy && <p>{copy}</p>}</div></section>;
function Notice({message,error}) { if(!message) return null; return <div className={error ? "notice notice-error" : "notice"}>{error ? <CircleAlert size={17}/> : <CheckCircle2 size={17}/>} {message}</div>; }
function Field({label, ...props}) { return <label className="field"><span>{label}</span><input {...props}/></label>; }
function TextArea({label,...props}) { return <label className="field"><span>{label}</span><textarea rows="4" {...props}/></label>; }
function SelectField({label,children,...props}) { return <label className="field"><span>{label}</span><select {...props}>{children}</select></label>; }

export function AboutPage() {
  return <>{pageTitle("ABOUT PRAGNYX","A steady hand for every financial decision.","We combine technical discipline with thoughtful relationships, helping individuals and businesses move forward with greater clarity.")}<section className="section-pad"><div className="container about-story"><div className="about-image"><img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1100&q=85" alt="Professional team collaborating in a meeting"/></div><div><span className="eyebrow">OUR POINT OF VIEW</span><h2>Good advice begins<br/><em>with listening.</em></h2><p>Every individual and every business has a different story. Our first job is to understand yours — your priorities, your challenges and what you want to build.</p><p>From compliance essentials to bigger financial questions, we aim to make the complicated feel considered and the important feel manageable.</p><div className="about-note"><ShieldCheck/><span>Careful work. Clear communication. A relationship built over time.</span></div></div></div></section><section className="approach-section section-pad"><div className="container"><SectionTitle eyebrow="OUR COMMITMENTS" title="Principles behind the numbers."/><div className="values-grid"><article><span>01</span><h3>Integrity first</h3><p>Honest conversations and responsible professional practice guide every engagement.</p></article><article><span>02</span><h3>Clarity always</h3><p>We explain your options in straightforward language so you can make informed choices.</p></article><article><span>03</span><h3>Care in the details</h3><p>We approach documentation, deadlines and compliance with diligence and attention.</p></article></div></div></section></>;
}

export function ServicesPage() {
  const [services,setServices] = useState(SERVICES);
  useEffect(()=>{api.get("/services").then(({data})=>setServices(Array.isArray(data.services)?data.services:[])).catch(()=>{});},[]);
  return <>{pageTitle("OUR EXPERTISE","The right support for every step.","A considered range of accounting, tax, audit and advisory services — shaped around your needs.")}<section className="section-pad"><div className="container">{services.length ? <div className="service-grid service-grid-all">{services.map((s,i)=><ServiceCard key={s._id||s.slug} service={s} index={i}/>)}</div> : <p className="empty-state">No services are currently listed. Please contact us and our team will help you.</p>}</div></section><section className="cta-section"><div className="container cta-inner"><div><span className="eyebrow">NOT SURE WHERE TO START?</span><h2>Let's understand<br/><em>what you need.</em></h2></div><Link to="/booking" className="button button-gold">Book a consultation <ArrowUpRight size={16}/></Link></div></section></>;
}

export function ServiceDetailPage() {
  const {slug}=useParams(); const [service,setService]=useState(SERVICES.find(s=>s.slug===slug)); const [loading,setLoading]=useState(true);
  useEffect(()=>{setLoading(true);api.get(`/services/${slug}`).then(({data})=>setService(data.service||null)).catch(err=>setService(err.response?.status===404?null:SERVICES.find(s=>s.slug===slug)||null)).finally(()=>setLoading(false));},[slug]);
  if(loading)return <div className="page-loader"><span className="spinner"/>Loading service…</div>;
  if(!service)return <>{pageTitle("SERVICE NOT FOUND","We couldn't find that service.","Explore our complete range of services.")}<div className="container section-pad"><Link className="text-link" to="/services">Back to services <ArrowRight size={16}/></Link></div></>;
  return <>{pageTitle("OUR SERVICES",service.name||service.title,service.description)}<section className="section-pad"><div className="container detail-grid"><div><span className="eyebrow">A CLEARER WAY FORWARD</span><h2>Practical expertise.<br/><em>Personal attention.</em></h2><p>Every engagement begins with understanding your circumstances. Tell us what you are working through, and our team can help identify the next steps and information required.</p><div className="benefit-list"><div><span><CheckCircle2 size={16}/></span><p><strong>Understand your requirements</strong><small>We begin by clarifying your situation and objectives.</small></p></div><div><span><CheckCircle2 size={16}/></span><p><strong>Agree on a clear process</strong><small>Know the documents, milestones and next steps.</small></p></div><div><span><CheckCircle2 size={16}/></span><p><strong>Stay informed</strong><small>Keep communication clear throughout the engagement.</small></p></div></div></div><aside className="detail-aside"><span className="eyebrow">TAKE THE NEXT STEP</span><h3>Let's discuss your needs.</h3><p>Share a few details and request a consultation with the team.</p><Link to={`/booking?service=${encodeURIComponent(service.name||service.title)}`} className="button button-gold button-full">Request a consultation <ArrowUpRight size={16}/></Link><Link to="/contact" className="text-link">Send an inquiry instead</Link></aside></div></section><div className="container detail-back"><Link to="/services" className="text-link"><ArrowLeft size={16}/> All services</Link></div></>;
}

export function ContactPage() {
  const [busy,setBusy]=useState(false),[message,setMessage]=useState(""),[error,setError]=useState(false);
  async function submit(e){e.preventDefault();const form=e.currentTarget;setBusy(true);setMessage("");setError(false);const f=new FormData(form);try{await api.post("/inquiries",{name:f.get("name"),email:f.get("email"),phone:f.get("phone"),subject:f.get("subject"),message:f.get("message")});setMessage("Thank you. Your inquiry has been received.");form.reset();}catch(err){setError(true);setMessage(err.userMessage||"Unable to submit your inquiry.");}finally{setBusy(false);}}
  return <>{pageTitle("CONTACT","A good conversation can start here.","Tell us a little about what you need. Our team will be in touch.")}<section className="section-pad"><div className="container contact-grid"><div className="contact-copy"><span className="eyebrow">GET IN TOUCH</span><h2>Let's make things<br/><em>a little clearer.</em></h2><p>Whether you have a specific question or simply want to explore your options, we would be glad to hear from you.</p><div className="contact-method"><span>Email</span><a href="mailto:hello@pragnyx.example">hello@pragnyx.example</a></div><div className="contact-method"><span>Phone</span><a href="tel:+910000000000">+91 00000 00000</a></div><div className="contact-method"><span>Office hours</span><strong>Monday–Friday, 9:30 AM–6:30 PM</strong></div></div><form className="form-card" onSubmit={submit}><h3>Send us a message</h3><p>Fields marked with * are required.</p><Notice message={message} error={error}/><div className="form-grid"><Field label="Full name *" name="name" required maxLength="100" placeholder="Your name"/><Field label="Email address *" name="email" type="email" required maxLength="180" placeholder="you@example.com"/><Field label="Phone number *" name="phone" type="tel" required maxLength="30" pattern="[+]?[0-9][0-9 ().-]{6,28}" title="Enter a valid phone number" placeholder="+91"/><Field label="Subject *" name="subject" required maxLength="160" placeholder="How can we help?"/></div><TextArea label="Message *" name="message" required maxLength="4000" placeholder="Tell us a little about your requirements…"/><button className="button button-dark button-full" disabled={busy}>{busy?"Sending…":"Send inquiry"} <ArrowUpRight size={16}/></button></form></div></section></>;
}

export function LoginPage(){
  const {login,user}=useAuth(),navigate=useNavigate(),location=useLocation();const [busy,setBusy]=useState(false),[error,setError]=useState("");
  useEffect(()=>{if(user)navigate(user.role==="admin"?"/admin":"/dashboard",{replace:true});},[user,navigate]);
  async function submit(e){e.preventDefault();setBusy(true);setError("");const f=new FormData(e.currentTarget);try{const u=await login({email:f.get("email"),password:f.get("password")});navigate(location.state?.from?.pathname||(u.role==="admin"?"/admin":"/dashboard"),{replace:true});}catch(err){setError(err.userMessage||"Login failed.");}finally{setBusy(false);}}
  return <AuthShell eyebrow="WELCOME BACK" title={<>Good to see<br/><em>you again.</em></>} intro="Sign in to access your client workspace." footer={<>New here? <Link to="/register">Create an account</Link></>}><form onSubmit={submit}><Notice message={error} error/><Field label="Email address" name="email" type="email" required maxLength="180" autoComplete="email" placeholder="you@example.com"/><Field label="Password" name="password" type="password" required autoComplete="current-password" placeholder="Your password"/><button className="button button-dark button-full" disabled={busy}>{busy?"Signing in…":"Sign in"} <ArrowUpRight size={16}/></button></form></AuthShell>;
}

export function RegisterPage(){
  const {register,user}=useAuth(),navigate=useNavigate();const [busy,setBusy]=useState(false),[error,setError]=useState("");
  useEffect(()=>{if(user)navigate(user.role==="admin"?"/admin":"/dashboard",{replace:true});},[user,navigate]);
  async function submit(e){e.preventDefault();setBusy(true);setError("");const f=new FormData(e.currentTarget);const payload={name:f.get("name"),email:f.get("email"),phone:f.get("phone"),password:f.get("password")};if(payload.password!==f.get("confirmPassword")){setError("Passwords do not match.");setBusy(false);return;}try{await register(payload);navigate("/dashboard",{replace:true});}catch(err){setError(err.userMessage||"Registration failed.");}finally{setBusy(false);}}
  return <AuthShell eyebrow="CREATE YOUR ACCOUNT" title={<>A clearer view<br/><em>starts here.</em></>} intro="Create your client account to request services and manage consultations." footer={<>Already registered? <Link to="/login">Sign in</Link></>}><form onSubmit={submit}><Notice message={error} error/><Field label="Full name" name="name" required maxLength="100" autoComplete="name" placeholder="Your full name"/><Field label="Email address" name="email" type="email" required autoComplete="email" placeholder="you@example.com"/><Field label="Phone number" name="phone" type="tel" maxLength="30" pattern="[+]?[0-9][0-9 ().-]{6,28}" title="Enter a valid phone number" placeholder="+91"/><div className="form-grid"><Field label="Password" name="password" type="password" required minLength="8" maxLength="72" autoComplete="new-password" placeholder="8–72 characters"/><Field label="Confirm password" name="confirmPassword" type="password" required minLength="8" maxLength="72" autoComplete="new-password" placeholder="Repeat password"/></div><button className="button button-dark button-full" disabled={busy}>{busy?"Creating account…":"Create account"} <ArrowUpRight size={16}/></button></form></AuthShell>;
}

function AuthShell({eyebrow,title,intro,footer,children}){return <section className="auth-section"><div className="auth-side"><Link to="/" className="brand brand-light"><span className="brand-mark">P<span>.</span></span><span className="brand-copy"><strong>PRAGNYX</strong><small>CHARTERED ACCOUNTANTS</small></span></Link><div className="auth-side-copy"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></div><span className="auth-side-foot">CLARITY IN EVERY NUMBER.</span></div><div className="auth-form-side"><div className="auth-form-wrap">{children}<p className="auth-footer">{footer}</p></div></div></section>}

export function BookingPage(){
  const {user}=useAuth(),navigate=useNavigate(),location=useLocation();
  const qs=new URLSearchParams(location.search);
  const [services,setServices]=useState([]);
  const [servicesLoading,setServicesLoading]=useState(true);
  const [servicesError,setServicesError]=useState("");
  const [busy,setBusy]=useState(false),[message,setMessage]=useState(""),[error,setError]=useState(false);

  async function loadServices(){
    setServicesLoading(true);
    setServicesError("");
    try{
      const {data}=await api.get("/services");
      setServices(Array.isArray(data.services)?data.services:[]);
    }catch(err){
      setServicesError(err.userMessage||"Unable to load available services. Please retry.");
    }finally{
      setServicesLoading(false);
    }
  }

  useEffect(()=>{loadServices();},[]);

  async function submit(e){
    e.preventDefault();
    if(!user){
      navigate("/login",{state:{from:location}});
      return;
    }
    const form=e.currentTarget;
    setBusy(true);setMessage("");setError(false);
    const f=new FormData(form);
    try{
      await api.post("/bookings",{
        name:f.get("name"),
        email:f.get("email"),
        phone:f.get("phone"),
        service:f.get("service"),
        preferredDate:f.get("date"),
        preferredTime:f.get("time"),
        message:f.get("message"),
      });
      setMessage("Your consultation request has been submitted. You can follow its status in your dashboard.");
      form.reset();
    }catch(err){
      setError(true);
      setMessage(err.userMessage||"Unable to submit booking.");
    }finally{
      setBusy(false);
    }
  }

  const minDate=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);
  return <>{pageTitle("CONSULTATION","Let's find a time to talk.","Share your requirements and your preferred time. Consultation requests are reviewed by our team.")}<section className="section-pad"><div className="container booking-grid"><div><span className="eyebrow">A FIRST CONVERSATION</span><h2>Start with what<br/><em>matters to you.</em></h2><p>Choose a service and a preferred time. Our team will review your request and update its status in your client dashboard.</p><div className="booking-assurance"><CalendarDays/><span>Choose a future date. Your booking remains pending until confirmed by the team.</span></div><p className="muted-small">{user?"You are signed in as "+user.email:"You'll be asked to sign in before submitting the request."}</p></div><form className="form-card" onSubmit={submit}><h3>Request a consultation</h3><Notice message={message} error={error}/>{servicesError&&<div className="notice notice-error" role="alert">{servicesError} <button type="button" className="text-link" onClick={loadServices}>Retry</button></div>}{!servicesLoading&&!servicesError&&services.length===0&&<Notice message="No services are currently available for booking. Please contact the firm." error/>}<div className="form-grid"><Field label="Client name *" name="name" required maxLength="100" defaultValue={user?.name||""} placeholder="Your name"/><Field label="Email address *" name="email" type="email" required maxLength="180" defaultValue={user?.email||""} placeholder="you@example.com"/><Field label="Phone number *" name="phone" type="tel" required maxLength="30" pattern="[+]?[0-9][0-9 ().-]{6,28}" title="Enter a valid phone number" defaultValue={user?.phone||""} placeholder="+91"/><SelectField label="Required service *" name="service" required disabled={servicesLoading||services.length===0} defaultValue={qs.get("service")||""}><option value="">{servicesLoading?"Loading services…":services.length?"Select a service":"No services available"}</option>{services.map(s=><option key={s._id||s.slug} value={s.name||s.title}>{s.name||s.title}</option>)}</SelectField><Field label="Preferred date *" name="date" type="date" required min={minDate}/><SelectField label="Preferred time *" name="time" required defaultValue=""><option value="">Select a time</option>{["09:30","10:30","11:30","12:30","14:00","15:00","16:00","17:00"].map(t=><option key={t} value={t}>{t}</option>)}</SelectField></div><TextArea label="Additional message" name="message" maxLength="2000" placeholder="Anything we should know before we speak?"/><button className="button button-dark button-full" disabled={busy||servicesLoading||services.length===0}>{busy?"Submitting…":"Submit booking request"} <ArrowUpRight size={16}/></button><small className="form-privacy">Your details are used to respond to this consultation request.</small></form></div></section></>;
}

export function ClientDashboardPage(){
  const {user,logout}=useAuth(),navigate=useNavigate();
  const [bookings,setBookings]=useState([]),[requests,setRequests]=useState([]),[inquiries,setInquiries]=useState([]);
  const [loading,setLoading]=useState(true),[error,setError]=useState("");

  async function reload(){
    setLoading(true);
    setError("");
    const results=await Promise.allSettled([
      api.get("/bookings/mine"),
      api.get("/service-requests/mine"),
      api.get("/inquiries/mine"),
    ]);
    const [bookingResult,requestResult,inquiryResult]=results;
    const failures=[];
    if(bookingResult.status==="fulfilled") setBookings(bookingResult.value.data.bookings||[]);
    else failures.push("consultation bookings");
    if(requestResult.status==="fulfilled") setRequests(requestResult.value.data.requests||[]);
    else failures.push("service requests");
    if(inquiryResult.status==="fulfilled") setInquiries(inquiryResult.value.data.inquiries||[]);
    else failures.push("contact inquiries");
    if(failures.length){
      const firstFailure=results.find(result=>result.status==="rejected");
      const detail=firstFailure?.reason?.userMessage||"Please try refreshing.";
      setError(`Unable to load ${failures.join(", ")}. ${detail}`);
    }
    setLoading(false);
  }

  useEffect(()=>{reload();},[]);

  return <section className="portal-section"><div className="container">
    <div className="portal-heading"><div><span className="eyebrow">CLIENT WORKSPACE</span><h1>Welcome back, {user?.name?.split(" ")[0]||"there"}.</h1><p>Here is an overview of your requests and consultations.</p></div><button className="button button-outline" onClick={()=>{logout();navigate("/")}}><LogOut size={16}/> Sign out</button></div>
    <Notice message={error} error/>
    <ServiceRequestForm onCreated={reload}/>
    <div className="portal-stats"><Stat icon={<CalendarDays/>} label="Consultations" value={bookings.length}/><Stat icon={<ClipboardList/>} label="Service requests" value={requests.length}/><Stat icon={<CheckCircle2/>} label="Confirmed bookings" value={bookings.filter(b=>b.status==="approved").length}/></div>
    <div className="portal-columns">
      <section className="portal-panel"><div className="panel-heading"><div><span className="eyebrow">YOUR ACTIVITY</span><h2>Consultation bookings</h2></div><Link to="/booking" className="button button-dark button-small"><Plus size={15}/> New booking</Link></div>{loading?<p className="empty-state">Loading your bookings…</p>:bookings.length===0?<div className="empty-state"><CalendarDays/><strong>No consultations yet</strong><span>When you request a consultation, it will appear here.</span><Link to="/booking" className="text-link">Book a consultation <ArrowUpRight size={15}/></Link></div>:<div className="data-list">{bookings.map(b=><div className="data-row" key={b._id}><div><strong>{b.service}</strong><small>{new Date(b.preferredDate).toLocaleDateString("en-GB",{timeZone:"UTC"})} · {b.preferredTime}</small></div><Status value={b.status}/></div>)}</div>}</section>
      <section className="portal-panel"><div className="panel-heading"><div><span className="eyebrow">YOUR REQUESTS</span><h2>Service requests</h2></div></div>{loading?<p className="empty-state">Loading your requests…</p>:requests.length===0?<div className="empty-state"><FileText/><strong>No service requests yet</strong><span>Send a service request to start a conversation.</span><Link to="/services" className="text-link">Explore services <ArrowUpRight size={15}/></Link></div>:<div className="data-list">{requests.map(r=><div className="data-row" key={r._id}><div><strong>{r.service}</strong><small>{new Date(r.createdAt).toLocaleDateString()}</small></div><Status value={r.status}/></div>)}</div>}</section>
      <section className="portal-panel"><div className="panel-heading"><div><span className="eyebrow">CONTACT HISTORY</span><h2>Your inquiries</h2></div></div>{loading?<p className="empty-state">Loading your inquiries…</p>:inquiries.length===0?<div className="empty-state"><FileText/><strong>No inquiries yet</strong><span>Messages you send through Contact Us will appear here.</span><Link to="/contact" className="text-link">Send an inquiry <ArrowUpRight size={15}/></Link></div>:<div className="data-list">{inquiries.map(i=><div className="data-row" key={i._id}><div><strong>{i.subject}</strong><small>{new Date(i.createdAt).toLocaleDateString()}</small></div><Status value={i.status}/></div>)}</div>}</section>
    </div>
    <ProfileForm/>
    <button className="refresh-button" onClick={reload} disabled={loading}><RefreshCw size={14}/> {loading?"Refreshing…":"Refresh activity"}</button>
  </div></section>;
}

export function AdminDashboardPage(){
  const [stats,setStats]=useState(null),[clients,setClients]=useState([]),[bookings,setBookings]=useState([]),[inquiries,setInquiries]=useState([]),[services,setServices]=useState([]),[serviceRequests,setServiceRequests]=useState([]);
  const [tab,setTab]=useState("bookings"),[loading,setLoading]=useState(true),[error,setError]=useState(""),[notice,setNotice]=useState("");
  const [busyAction,setBusyAction]=useState(""),[serviceBusy,setServiceBusy]=useState(false),[editingService,setEditingService]=useState(null);

  async function load(silent=false){
    if(!silent)setLoading(true);
    setError("");
    const results=await Promise.allSettled([
      api.get("/admin/stats"),
      api.get("/admin/clients"),
      api.get("/bookings"),
      api.get("/inquiries"),
      api.get("/services"),
      api.get("/service-requests"),
    ]);
    const [statsResult,clientsResult,bookingsResult,inquiriesResult,servicesResult,requestsResult]=results;
    const failed=[];
    if(statsResult.status==="fulfilled")setStats(statsResult.value.data.stats||null);else failed.push("statistics");
    if(clientsResult.status==="fulfilled")setClients(clientsResult.value.data.clients||[]);else failed.push("clients");
    if(bookingsResult.status==="fulfilled")setBookings(bookingsResult.value.data.bookings||[]);else failed.push("bookings");
    if(inquiriesResult.status==="fulfilled")setInquiries(inquiriesResult.value.data.inquiries||[]);else failed.push("inquiries");
    if(servicesResult.status==="fulfilled")setServices(servicesResult.value.data.services||[]);else failed.push("services");
    if(requestsResult.status==="fulfilled")setServiceRequests(requestsResult.value.data.requests||[]);else failed.push("service requests");
    if(failed.length){
      const firstFailure=results.find(result=>result.status==="rejected");
      setError(`Some admin data could not be loaded (${failed.join(", ")}). ${firstFailure?.reason?.userMessage||"Please refresh to retry."}`);
    }
    setLoading(false);
  }

  useEffect(()=>{load();},[]);

  async function updateRecord(kind,id,status){
    const key=`${kind}:${id}`;
    const endpoint=kind==="booking"?"/bookings":kind==="inquiry"?"/inquiries":"/service-requests";
    setBusyAction(key);setError("");setNotice("");
    try{
      await api.patch(`${endpoint}/${id}/status`,{status});
      setNotice(kind==="booking"?"Booking status updated.":kind==="inquiry"?"Inquiry status updated.":"Service request status updated.");
      await load(true);
    }catch(err){
      setError(err.userMessage||"The status could not be updated.");
    }finally{setBusyAction("");}
  }

  async function archiveService(id){
    if(!window.confirm("Archive this service? It will no longer appear in the public service list."))return;
    setBusyAction(`service:${id}`);setError("");setNotice("");
    try{
      await api.delete(`/services/${id}`);
      setNotice("Service archived. Existing bookings and requests are retained.");
      await load(true);
    }catch(err){setError(err.userMessage||"Could not archive service.");}
    finally{setBusyAction("");}
  }

  function editService(service){
    setEditingService({
      _id:service._id,
      name:service.name||"",
      slug:service.slug||"",
      shortDescription:service.shortDescription||"",
      description:service.description||"",
    });
    setError("");setNotice("");
  }

  function updateEditingService(field,value){
    setEditingService(current=>current?{...current,[field]:value}:current);
  }

  async function saveService(event){
    event.preventDefault();
    if(!editingService)return;
    setBusyAction("service:"+editingService._id);setError("");setNotice("");
    try{
      await api.patch("/services/"+editingService._id,{
        name:editingService.name,
        slug:editingService.slug,
        shortDescription:editingService.shortDescription,
        description:editingService.description,
      });
      setNotice("Service updated.");
      setEditingService(null);
      await load(true);
    }catch(err){setError(err.userMessage||"Could not update service.");}
    finally{setBusyAction("");}
  }

  async function addService(event){
    event.preventDefault();
    const form=event.currentTarget;
    const data=new FormData(form);
    setServiceBusy(true);setError("");setNotice("");
    try{
      await api.post("/services",{
        name:data.get("name"),
        slug:data.get("slug"),
        shortDescription:data.get("shortDescription"),
        description:data.get("description"),
      });
      setNotice("Service created.");
      form.reset();
      await load(true);
    }catch(err){setError(err.userMessage||"Could not create service.");}
    finally{setServiceBusy(false);}
  }

  return <section className="portal-section"><div className="container">
    <div className="portal-heading"><div><span className="eyebrow">ADMINISTRATION</span><h1>Firm overview.</h1><p>Manage client activity and keep service operations moving.</p></div><button className="button button-outline" onClick={()=>load()} disabled={loading}><RefreshCw size={15}/> {loading?"Refreshing…":"Refresh"}</button></div>
    <Notice message={error} error/><Notice message={notice}/>
    {loading&&!stats?<div className="empty-state">Loading administration data…</div>:<>
      <div className="portal-stats">
        <Stat icon={<Users/>} label="Registered clients" value={stats?.clients??clients.length}/>
        <Stat icon={<FileText/>} label="Total inquiries" value={stats?.inquiries??inquiries.length}/>
        <Stat icon={<CalendarDays/>} label="Consultation bookings" value={stats?.bookings??bookings.length}/>
        <Stat icon={<ShieldCheck/>} label="Active services" value={stats?.services??services.length}/>
      </div>
      <div className="admin-tabs" role="tablist" aria-label="Admin management sections">
        {[[ "bookings","Bookings" ],[ "inquiries","Inquiries" ],[ "requests","Service requests" ],[ "clients","Clients" ],[ "services","Services" ]].map(([id,label])=><button type="button" role="tab" aria-selected={tab===id} key={id} className={tab===id?"selected":""} onClick={()=>setTab(id)}>{label}</button>)}
      </div>
      <section className="portal-panel admin-table-panel">
        {tab==="bookings"&&<><div className="panel-heading"><h2>Consultation bookings</h2></div><DataTable headers={["Client","Service","Preferred slot","Status","Update"]} rows={bookings.map(b=>{const key=`booking:${b._id}`;return [<><strong>{b.name}</strong><small>{b.email}</small></>,b.service,<>{new Date(b.preferredDate).toLocaleDateString("en-GB",{timeZone:"UTC"})}<small>{b.preferredTime}</small></>,<Status value={b.status}/>,<select className="table-select" aria-label={`Update booking for ${b.name}`} value={b.status} disabled={busyAction===key} onChange={event=>updateRecord("booking",b._id,event.target.value)}><option value="pending">Pending</option><option value="approved">Approve</option><option value="rejected">Reject</option><option value="completed">Complete</option></select>];})}/></>}
        {tab==="inquiries"&&<><div className="panel-heading"><h2>Client inquiries</h2></div><DataTable headers={["Contact","Subject","Message","Date","Status"]} rows={inquiries.map(item=>{const key=`inquiry:${item._id}`;return [<><strong>{item.name}</strong><small>{item.email} · {item.phone||"No phone"}</small></>,item.subject,<span className="table-message" title={item.message}>{item.message}</span>,new Date(item.createdAt).toLocaleDateString(),<select className="table-select" aria-label={`Update inquiry from ${item.name}`} value={item.status} disabled={busyAction===key} onChange={event=>updateRecord("inquiry",item._id,event.target.value)}><option value="new">New</option><option value="in-progress">In progress</option><option value="resolved">Resolved</option></select>];})}/></>}
        {tab==="requests"&&<><div className="panel-heading"><h2>Client service requests</h2></div><DataTable headers={["Client","Service","Details","Date","Status"]} rows={serviceRequests.map(item=>{const key=`request:${item._id}`;return [<><strong>{item.user?.name||"Client"}</strong><small>{item.user?.email||""}</small></>,item.service,<span className="table-message" title={item.details}>{item.details}</span>,new Date(item.createdAt).toLocaleDateString(),<select className="table-select" aria-label={`Update service request for ${item.user?.name||"client"}`} value={item.status} disabled={busyAction===key} onChange={event=>updateRecord("request",item._id,event.target.value)}><option value="pending">Pending</option><option value="in-progress">In progress</option><option value="approved">Approve</option><option value="rejected">Reject</option><option value="completed">Complete</option></select>];})}/></>}
        {tab==="clients"&&<><div className="panel-heading"><h2>Registered clients</h2></div><DataTable headers={["Name","Email","Phone","Joined","Account"]} rows={clients.map(client=>[<strong>{client.name}</strong>,client.email,client.phone||"—",new Date(client.createdAt).toLocaleDateString(),<Status value={client.isActive?"active":"inactive"}/>])}/></>}
        {tab==="services"&&<>
          <div className="panel-heading"><h2>Manage services</h2></div>
          <form className="inline-add-form" onSubmit={addService}>
            <input name="name" required maxLength="120" placeholder="Service name"/>
            <input name="slug" required maxLength="120" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" title="Use lowercase letters, numbers and hyphens" placeholder="url-friendly-slug"/>
            <input name="shortDescription" required maxLength="240" placeholder="Short description"/>
            <input name="description" required maxLength="3000" placeholder="Full description"/>
            <button className="button button-dark button-small" disabled={serviceBusy}>{serviceBusy?"Adding…":<><Plus size={15}/> Add</>}</button>
          </form>
          {editingService&&<form className="service-edit-form" onSubmit={saveService}>
            <div className="service-edit-heading"><strong>Edit service</strong><button type="button" className="table-edit" onClick={()=>setEditingService(null)}>Cancel</button></div>
            <input aria-label="Service name" required maxLength="120" value={editingService.name} onChange={event=>updateEditingService("name",event.target.value)}/>
            <input aria-label="Service URL slug" required maxLength="120" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" title="Use lowercase letters, numbers and hyphens" value={editingService.slug} onChange={event=>updateEditingService("slug",event.target.value)}/>
            <input aria-label="Short description" required maxLength="240" value={editingService.shortDescription} onChange={event=>updateEditingService("shortDescription",event.target.value)}/>
            <textarea aria-label="Full description" required maxLength="3000" rows="3" value={editingService.description} onChange={event=>updateEditingService("description",event.target.value)}/>
            <button className="button button-dark button-small" disabled={busyAction==="service:"+editingService._id}>{busyAction==="service:"+editingService._id?"Saving…":"Save changes"}</button>
          </form>}
          <DataTable headers={["Service","Slug","Description","Action"]} rows={services.map(service=>{
            const key="service:"+service._id;
            return [<strong>{service.name}</strong>,service.slug,<span className="table-message" title={service.shortDescription||service.description}>{service.shortDescription||service.description}</span>,<div className="table-actions"><button type="button" className="table-edit" disabled={Boolean(busyAction)||Boolean(editingService)} onClick={()=>editService(service)}>Edit</button><button type="button" className="table-delete" disabled={Boolean(busyAction)||Boolean(editingService)} onClick={()=>archiveService(service._id)}>Archive</button></div>];
          })}/>
        </>}
      </section>
    </>}
  </div></section>;
}

function DataTable({headers,rows}){return <div className="table-scroll"><table className="data-table"><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.length?rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>):<tr><td colSpan={headers.length} className="table-empty">No records to display.</td></tr>}</tbody></table></div>}
function Stat({icon,label,value}){return <article className="stat-card"><span>{icon}</span><div><strong>{value}</strong><small>{label}</small></div></article>}
function Status({value}){return <span className={`status status-${value}`}>{(value||"pending").replace("-"," ")}</span>}
export function NotFoundPage(){return <div className="not-found"><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>That page seems<br/><em>out of the books.</em></h1><Link className="button button-dark" to="/">Back to home <ArrowUpRight size={16}/></Link></div>}
