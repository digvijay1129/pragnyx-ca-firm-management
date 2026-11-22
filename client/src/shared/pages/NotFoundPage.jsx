import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
export default function NotFoundPage(){return <div className="not-found"><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>That page seems<br/><em>out of the books.</em></h1><Link className="button button-dark" to="/">Back to home <ArrowUpRight size={16}/></Link></div>}
