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

export function AboutPage() {
  return <>{pageTitle("ABOUT PRAGNYX","A steady hand for every financial decision.","We combine technical discipline with thoughtful relationships, helping individuals and businesses move forward with greater clarity.")}<section className="section-pad"><div className="container about-story"><div className="about-image"><img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1100&q=85" alt="Professional team collaborating in a meeting"/></div><div><span className="eyebrow">OUR POINT OF VIEW</span><h2>Good advice begins<br/><em>with listening.</em></h2><p>Every individual and every business has a different story. Our first job is to understand yours — your priorities, your challenges and what you want to build.</p><p>From compliance essentials to bigger financial questions, we aim to make the complicated feel considered and the important feel manageable.</p><div className="about-note"><ShieldCheck/><span>Careful work. Clear communication. A relationship built over time.</span></div></div></div></section><section className="approach-section section-pad"><div className="container"><SectionTitle eyebrow="OUR COMMITMENTS" title="Principles behind the numbers."/><div className="values-grid"><article><span>01</span><h3>Integrity first</h3><p>Honest conversations and responsible professional practice guide every engagement.</p></article><article><span>02</span><h3>Clarity always</h3><p>We explain your options in straightforward language so you can make informed choices.</p></article><article><span>03</span><h3>Care in the details</h3><p>We approach documentation, deadlines and compliance with diligence and attention.</p></article></div></div></section></>;
}
