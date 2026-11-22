import { ArrowUpRight, BadgeIndianRupee, Building2, Calculator, FileCheck2, Landmark, Scale, ShieldCheck, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const icons = [Calculator, FileCheck2, Building2, BadgeIndianRupee, TrendingUp, ShieldCheck, Landmark, Scale];
export default function ServiceCard({ service, index = 0 }) {
  const Icon = icons[index % icons.length];
  return <article className="service-card"><div className="service-icon"><Icon size={22} strokeWidth={1.6} /></div><span className="service-number">0{index + 1}</span><h3>{service.name || service.title}</h3><p>{service.shortDescription || service.description}</p><Link to={`/services/${service.slug}`} className="text-link">Explore service <ArrowUpRight size={16} /></Link></article>;
}
