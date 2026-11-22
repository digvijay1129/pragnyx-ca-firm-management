import { useEffect, useState } from "react";
import { ArrowUpRight, CheckCircle2, CircleAlert } from "lucide-react";
import api from "../lib/api";

export default function ServiceRequestForm({ onCreated }) {
  const [services,setServices]=useState([]);
  const [servicesLoading,setServicesLoading]=useState(true);
  const [servicesError,setServicesError]=useState("");
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const [error,setError]=useState(false);

  async function loadServices(){
    setServicesLoading(true);
    setServicesError("");
    try {
      const {data}=await api.get("/services");
      setServices(data.services||[]);
    } catch (err) {
      setServicesError(err.userMessage||"Unable to load available services. Please retry.");
    } finally {
      setServicesLoading(false);
    }
  }

  useEffect(()=>{loadServices();},[]);

  async function submit(event) {
    event.preventDefault();
    const formElement=event.currentTarget;
    setBusy(true);setMessage("");setError(false);
    const form=new FormData(formElement);
    try {
      await api.post("/service-requests",{service:form.get("service"),details:form.get("details")});
      setMessage("Your service request has been submitted.");
      formElement.reset();
      onCreated?.();
    } catch (err) {
      setError(true);
      setMessage(err.userMessage||"Unable to submit the service request.");
    } finally { setBusy(false); }
  }

  return <section className="request-form-panel">
    <div><span className="eyebrow">NEED PROFESSIONAL SUPPORT?</span><h2>Request a service</h2><p>Tell us what you need help with. Your request and its status will appear below.</p></div>
    <form onSubmit={submit} className="request-form">
      {message&&<div className={error?"notice notice-error":"notice"} role="status"><CheckCircle2 size={15}/>{message}</div>}
      {servicesError&&<div className="notice notice-error" role="alert"><CircleAlert size={15}/>{servicesError} <button type="button" className="text-link" onClick={loadServices}>Retry</button></div>}
      <select name="service" required defaultValue="" disabled={servicesLoading||services.length===0}>
        <option value="">{servicesLoading?"Loading services…":services.length?"Choose a service":"No services available"}</option>
        {services.map(s=><option value={s.name} key={s._id}>{s.name}</option>)}
      </select>
      <textarea name="details" required minLength="10" maxLength="3000" rows="2" placeholder="Briefly describe what you need help with…"/>
      <button className="button button-dark button-small" disabled={busy||servicesLoading||services.length===0}>{busy?"Submitting…":"Submit request"} <ArrowUpRight size={15}/></button>
    </form>
  </section>;
}
