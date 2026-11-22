import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, CheckCircle2, CircleAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { AuthShell } from "../components/AuthShell";

export function RegisterPage(){
  const {register,user}=useAuth(),navigate=useNavigate();const [busy,setBusy]=useState(false),[error,setError]=useState("");
  useEffect(()=>{if(user)navigate(user.role==="admin"?"/admin":"/dashboard",{replace:true});},[user,navigate]);
  async function submit(e){e.preventDefault();setBusy(true);setError("");const f=new FormData(e.currentTarget);const payload={name:f.get("name"),email:f.get("email"),phone:f.get("phone"),password:f.get("password")};if(payload.password!==f.get("confirmPassword")){setError("Passwords do not match.");setBusy(false);return;}try{await register(payload);navigate("/dashboard",{replace:true});}catch(err){setError(err.userMessage||"Registration failed.");}finally{setBusy(false);}}
  return <AuthShell eyebrow="CREATE YOUR ACCOUNT" title={<>A clearer view<br/><em>starts here.</em></>} intro="Create your client account to request services and manage consultations." footer={<>Already registered? <Link to="/login">Sign in</Link></>}><form onSubmit={submit}><Notice message={error} error/><Field label="Full name" name="name" required maxLength="100" autoComplete="name" placeholder="Your full name"/><Field label="Email address" name="email" type="email" required autoComplete="email" placeholder="you@example.com"/><Field label="Phone number" name="phone" type="tel" maxLength="30" pattern="[+]?[0-9][0-9 ().-]{6,28}" title="Enter a valid phone number" placeholder="+91"/><div className="form-grid"><Field label="Password" name="password" type="password" required minLength="8" maxLength="72" autoComplete="new-password" placeholder="8–72 characters"/><Field label="Confirm password" name="confirmPassword" type="password" required minLength="8" maxLength="72" autoComplete="new-password" placeholder="Repeat password"/></div><button className="button button-dark button-full" disabled={busy}>{busy?"Creating account…":"Create account"} <ArrowUpRight size={16}/></button></form></AuthShell>;
}
