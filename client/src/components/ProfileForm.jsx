import { useState } from "react";
import { CheckCircle2, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

export default function ProfileForm() {
  const {user,refreshUser}=useAuth();
  const [busy,setBusy]=useState(false),[message,setMessage]=useState(""),[error,setError]=useState(false);
  async function submit(event){
    event.preventDefault();
    const form=event.currentTarget;
    const data=new FormData(form);
    setBusy(true);setMessage("");setError(false);
    try{
      await api.patch("/auth/profile",{name:data.get("name"),phone:data.get("phone")});
      await refreshUser();
      setMessage("Your profile has been updated.");
    }catch(err){setError(true);setMessage(err.userMessage||"Unable to update your profile.");}
    finally{setBusy(false);}
  }
  return <section className="profile-edit-panel"><div><span className="eyebrow">ACCOUNT PROFILE</span><h3>Your details</h3><p>Your account information is used when you request a consultation.</p></div><form onSubmit={submit}><label className="field"><span>Full name</span><input name="name" required maxLength="100" defaultValue={user?.name||""}/></label><label className="field"><span>Email address</span><input value={user?.email||""} disabled readOnly/></label><label className="field"><span>Phone number</span><input name="phone" maxLength="30" defaultValue={user?.phone||""}/></label><button className="button button-dark button-small" disabled={busy}>{busy?"Saving…":"Save profile"} <Save size={14}/></button>{message&&<span className={error?"profile-message error":"profile-message"}><CheckCircle2 size={13}/>{message}</span>}</form></section>;
}
