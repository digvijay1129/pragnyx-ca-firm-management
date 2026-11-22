import { CheckCircle2, CircleAlert } from "lucide-react";
export function Notice({message,error}) { if(!message) return null; return <div className={error ? "notice notice-error" : "notice"}>{error ? <CircleAlert size={17}/> : <CheckCircle2 size={17}/>} {message}</div>; }
