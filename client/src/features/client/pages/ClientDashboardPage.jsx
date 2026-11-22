import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, CalendarDays, CheckCircle2, ClipboardList, FileText, LogOut, Plus, RefreshCw } from "lucide-react";
import api from "../../../shared/lib/api";
import { useAuth } from "../../auth/context/AuthContext";
import { Notice } from "../../../shared/components/feedback/Notice";
import { Status } from "../../../shared/components/feedback/Status";
import { Stat } from "../../../shared/components/data/StatCard";
import ServiceRequestForm from "../components/ServiceRequestForm";
import ProfileForm from "../components/ProfileForm";

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
