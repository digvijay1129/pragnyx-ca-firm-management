import { useEffect, useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import api from "../lib/api";

export default function ServiceRequestForm({ onCreated }) {
  const [services,setServices]=useState([]);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const [error,setError]=useState(false);

  useEffect(()=>{api.get("/services").then(({data})=>setServices(data.services||[])).catch(()=>{});},[]);

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
      {message&&<div className={error?"notice notice-error":"notice"}><CheckCircle2 size={15}/>{message}</div>}
      <select name="service" required defaultValue=""><option value="">Choose a service</option>{services.map(s=><option value={s.name} key={s._id}>{s.name}</option>)}</select>
      <textarea name="details" required minLength="10" maxLength="3000" rows="2" placeholder="Briefly describe what you need help with…"/>
      <button className="button button-dark button-small" disabled={busy}>{busy?"Submitting…":"Submit request"} <ArrowUpRight size={15}/></button>
    </form>
  </section>;
}
