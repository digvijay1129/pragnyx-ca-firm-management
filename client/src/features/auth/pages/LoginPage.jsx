import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, CheckCircle2, CircleAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { AuthShell } from "../components/AuthShell";
import { Notice } from "../../../shared/components/feedback/Notice";
import { Field } from "../../../shared/components/forms/FormFields";

export function LoginPage(){
  const {login,user}=useAuth(),navigate=useNavigate(),location=useLocation();const [busy,setBusy]=useState(false),[error,setError]=useState("");
  useEffect(()=>{if(user)navigate(user.role==="admin"?"/admin":"/dashboard",{replace:true});},[user,navigate]);
  async function submit(e){e.preventDefault();setBusy(true);setError("");const f=new FormData(e.currentTarget);try{const u=await login({email:f.get("email"),password:f.get("password")});navigate(location.state?.from?.pathname||(u.role==="admin"?"/admin":"/dashboard"),{replace:true});}catch(err){setError(err.userMessage||"Login failed.");}finally{setBusy(false);}}
  return <AuthShell eyebrow="WELCOME BACK" title={<>Good to see<br/><em>you again.</em></>} intro="Sign in to access your client workspace." footer={<>New here? <Link to="/register">Create an account</Link></>}><form onSubmit={submit}><Notice message={error} error/><Field label="Email address" name="email" type="email" required maxLength="180" autoComplete="email" placeholder="you@example.com"/><Field label="Password" name="password" type="password" required autoComplete="current-password" placeholder="Your password"/><button className="button button-dark button-full" disabled={busy}>{busy?"Signing in…":"Sign in"} <ArrowUpRight size={16}/></button></form></AuthShell>;
}
