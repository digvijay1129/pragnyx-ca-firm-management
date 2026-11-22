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

export function ServiceDetailPage() {
  const {slug}=useParams(); const [service,setService]=useState(SERVICES.find(s=>s.slug===slug)); const [loading,setLoading]=useState(true);
  useEffect(()=>{setLoading(true);api.get(`/services/${slug}`).then(({data})=>setService(data.service||null)).catch(err=>setService(err.response?.status===404?null:SERVICES.find(s=>s.slug===slug)||null)).finally(()=>setLoading(false));},[slug]);
  if(loading)return <div className="page-loader"><span className="spinner"/>Loading service…</div>;
  if(!service)return <>{pageTitle("SERVICE NOT FOUND","We couldn't find that service.","Explore our complete range of services.")}<div className="container section-pad"><Link className="text-link" to="/services">Back to services <ArrowRight size={16}/></Link></div></>;
  return <>{pageTitle("OUR SERVICES",service.name||service.title,service.description)}<section className="section-pad"><div className="container detail-grid"><div><span className="eyebrow">A CLEARER WAY FORWARD</span><h2>Practical expertise.<br/><em>Personal attention.</em></h2><p>Every engagement begins with understanding your circumstances. Tell us what you are working through, and our team can help identify the next steps and information required.</p><div className="benefit-list"><div><span><CheckCircle2 size={16}/></span><p><strong>Understand your requirements</strong><small>We begin by clarifying your situation and objectives.</small></p></div><div><span><CheckCircle2 size={16}/></span><p><strong>Agree on a clear process</strong><small>Know the documents, milestones and next steps.</small></p></div><div><span><CheckCircle2 size={16}/></span><p><strong>Stay informed</strong><small>Keep communication clear throughout the engagement.</small></p></div></div></div><aside className="detail-aside"><span className="eyebrow">TAKE THE NEXT STEP</span><h3>Let's discuss your needs.</h3><p>Share a few details and request a consultation with the team.</p><Link to={`/booking?service=${encodeURIComponent(service.name||service.title)}`} className="button button-gold button-full">Request a consultation <ArrowUpRight size={16}/></Link><Link to="/contact" className="text-link">Send an inquiry instead</Link></aside></div></section><div className="container detail-back"><Link to="/services" className="text-link"><ArrowLeft size={16}/> All services</Link></div></>;
}
