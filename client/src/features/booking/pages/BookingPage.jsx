import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import api from "../../../shared/lib/api";
import { useAuth } from "../../auth/context/AuthContext";
import { pageTitle } from "../../../shared/components/PageBanner";
import { Notice } from "../../../shared/components/feedback/Notice";
import { Field, TextArea, SelectField } from "../../../shared/components/forms/FormFields";
import { firmContact } from "../../../shared/lib/siteConfig";

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

  const minDate=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata"}).format(new Date());
  return <>{pageTitle("CONSULTATION","Let's find a time to talk.","Share your requirements and your preferred time. Consultation requests are reviewed by our team.")}<section className="section-pad"><div className="container booking-grid"><div><span className="eyebrow">A FIRST CONVERSATION</span><h2>Start with what<br/><em>matters to you.</em></h2><p>Choose a service and a preferred time. Our team will review your request and update its status in your client dashboard.</p><div className="booking-assurance"><CalendarDays/><span>Choose a future date. Your booking remains pending until confirmed by the team.</span></div><p className="muted-small">{user?"You are signed in as "+user.email:"You'll be asked to sign in before submitting the request."}</p></div><form className="form-card" onSubmit={submit}><h3>Request a consultation</h3>{firmContact.isDemo && <div className="demo-form-note" role="note">{firmContact.demoFormNotice}</div>}<Notice message={message} error={error}/>{servicesError&&<div className="notice notice-error" role="alert">{servicesError} <button type="button" className="text-link" onClick={loadServices}>Retry</button></div>}{!servicesLoading&&!servicesError&&services.length===0&&<Notice message="No services are currently available for booking. Please contact the firm." error/>}<div className="form-grid"><Field label="Client name *" name="name" required maxLength="100" defaultValue={user?.name||""} placeholder="Your name"/><Field label="Email address *" name="email" type="email" required maxLength="180" defaultValue={user?.email||""} placeholder="you@example.com"/><Field label="Phone number *" name="phone" type="tel" required maxLength="30" pattern="[+]?[0-9][0-9 ().-]{6,28}" title="Enter a valid phone number" defaultValue={user?.phone||""} placeholder="+91"/><SelectField label="Required service *" name="service" required disabled={servicesLoading||services.length===0} defaultValue={qs.get("service")||""}><option value="">{servicesLoading?"Loading services…":services.length?"Select a service":"No services available"}</option>{services.map(s=><option key={s._id||s.slug} value={s.name||s.title}>{s.name||s.title}</option>)}</SelectField><Field label="Preferred date *" name="date" type="date" required min={minDate}/><SelectField label="Preferred time *" name="time" required defaultValue=""><option value="">Select a time</option>{["09:30","10:30","11:30","12:30","14:00","15:00","16:00","17:00"].map(t=><option key={t} value={t}>{t}</option>)}</SelectField></div><TextArea label="Additional message" name="message" maxLength="2000" placeholder="Anything we should know before we speak?"/><button className="button button-dark button-full" disabled={busy||servicesLoading||services.length===0}>{busy?"Submitting…":"Submit booking request"} <ArrowUpRight size={16}/></button><small className="form-privacy">Your details are used to respond to this consultation request.</small></form></div></section></>;
}
