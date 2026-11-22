import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, ShieldCheck } from "lucide-react";
import api from "../../../shared/lib/api";
import SectionTitle from "../../../shared/components/SectionTitle";
import ServiceCard from "../components/ServiceCard";
import { firmContact } from "../../../shared/lib/siteConfig";
import { SERVICES } from "../../../data/services";
import { pageTitle } from "../../../shared/components/PageBanner";
import { Notice } from "../../../shared/components/feedback/Notice";
import { Field, TextArea } from "../../../shared/components/forms/FormFields";

export function ServicesPage() {
  const [services,setServices] = useState(SERVICES);
  useEffect(()=>{api.get("/services").then(({data})=>setServices(Array.isArray(data.services)?data.services:[])).catch(()=>{});},[]);
  return <>{pageTitle("OUR EXPERTISE","The right support for every step.","A considered range of accounting, tax, audit and advisory services — shaped around your needs.")}<section className="section-pad"><div className="container">{services.length ? <div className="service-grid service-grid-all">{services.map((s,i)=><ServiceCard key={s._id||s.slug} service={s} index={i}/>)}</div> : <p className="empty-state">No services are currently listed. Please contact us and our team will help you.</p>}</div></section><section className="cta-section"><div className="container cta-inner"><div><span className="eyebrow">NOT SURE WHERE TO START?</span><h2>Let's understand<br/><em>what you need.</em></h2></div><Link to="/booking" className="button button-gold">Book a consultation <ArrowUpRight size={16}/></Link></div></section></>;
}
