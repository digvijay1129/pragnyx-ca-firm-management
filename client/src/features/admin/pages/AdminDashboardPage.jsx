import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, FileText, Plus, RefreshCw, ShieldCheck, Users } from "lucide-react";
import api from "../../../shared/lib/api";
import { Notice } from "../../../shared/components/feedback/Notice";
import { Status } from "../../../shared/components/feedback/Status";
import { Stat } from "../../../shared/components/data/StatCard";
import { DataTable } from "../components/DataTable";

export function AdminDashboardPage(){
  const [stats,setStats]=useState(null),[clients,setClients]=useState([]),[bookings,setBookings]=useState([]),[inquiries,setInquiries]=useState([]),[services,setServices]=useState([]),[serviceRequests,setServiceRequests]=useState([]);
  const [tab,setTab]=useState("bookings"),[loading,setLoading]=useState(true),[error,setError]=useState(""),[notice,setNotice]=useState("");
  const [busyAction,setBusyAction]=useState(""),[serviceBusy,setServiceBusy]=useState(false),[editingService,setEditingService]=useState(null);

  async function load(silent=false){
    if(!silent)setLoading(true);
    setError("");
    const results=await Promise.allSettled([
      api.get("/admin/stats"),
      api.get("/admin/clients"),
      api.get("/bookings"),
      api.get("/inquiries"),
      api.get("/services"),
      api.get("/service-requests"),
    ]);
    const [statsResult,clientsResult,bookingsResult,inquiriesResult,servicesResult,requestsResult]=results;
    const failed=[];
    if(statsResult.status==="fulfilled")setStats(statsResult.value.data.stats||null);else failed.push("statistics");
    if(clientsResult.status==="fulfilled")setClients(clientsResult.value.data.clients||[]);else failed.push("clients");
    if(bookingsResult.status==="fulfilled")setBookings(bookingsResult.value.data.bookings||[]);else failed.push("bookings");
    if(inquiriesResult.status==="fulfilled")setInquiries(inquiriesResult.value.data.inquiries||[]);else failed.push("inquiries");
    if(servicesResult.status==="fulfilled")setServices(servicesResult.value.data.services||[]);else failed.push("services");
    if(requestsResult.status==="fulfilled")setServiceRequests(requestsResult.value.data.requests||[]);else failed.push("service requests");
    if(failed.length){
      const firstFailure=results.find(result=>result.status==="rejected");
      setError(`Some admin data could not be loaded (${failed.join(", ")}). ${firstFailure?.reason?.userMessage||"Please refresh to retry."}`);
    }
    setLoading(false);
  }

  useEffect(()=>{load();},[]);

  async function updateRecord(kind,id,status){
    const key=`${kind}:${id}`;
    const endpoint=kind==="booking"?"/bookings":kind==="inquiry"?"/inquiries":"/service-requests";
    setBusyAction(key);setError("");setNotice("");
    try{
      await api.patch(`${endpoint}/${id}/status`,{status});
      setNotice(kind==="booking"?"Booking status updated.":kind==="inquiry"?"Inquiry status updated.":"Service request status updated.");
      await load(true);
    }catch(err){
      setError(err.userMessage||"The status could not be updated.");
    }finally{setBusyAction("");}
  }

  async function archiveService(id){
    if(!window.confirm("Delete this service from the public catalogue? Existing bookings and service requests will be retained. The record will be archived rather than permanently erased."))return;
    setBusyAction(`service:${id}`);setError("");setNotice("");
    try{
      await api.delete(`/services/${id}`);
      setNotice("Service deleted from the public catalogue. Existing bookings and requests are retained.");
      await load(true);
    }catch(err){setError(err.userMessage||"Could not archive service.");}
    finally{setBusyAction("");}
  }

  function editService(service){
    setEditingService({
      _id:service._id,
      name:service.name||"",
      slug:service.slug||"",
      shortDescription:service.shortDescription||"",
      description:service.description||"",
    });
    setError("");setNotice("");
  }

  function updateEditingService(field,value){
    setEditingService(current=>current?{...current,[field]:value}:current);
  }

  async function saveService(event){
    event.preventDefault();
    if(!editingService)return;
    setBusyAction("service:"+editingService._id);setError("");setNotice("");
    try{
      await api.patch("/services/"+editingService._id,{
        name:editingService.name,
        slug:editingService.slug,
        shortDescription:editingService.shortDescription,
        description:editingService.description,
      });
      setNotice("Service updated.");
      setEditingService(null);
      await load(true);
    }catch(err){setError(err.userMessage||"Could not update service.");}
    finally{setBusyAction("");}
  }

  async function addService(event){
    event.preventDefault();
    const form=event.currentTarget;
    const data=new FormData(form);
    setServiceBusy(true);setError("");setNotice("");
    try{
      await api.post("/services",{
        name:data.get("name"),
        slug:data.get("slug"),
        shortDescription:data.get("shortDescription"),
        description:data.get("description"),
      });
      setNotice("Service created.");
      form.reset();
      await load(true);
    }catch(err){setError(err.userMessage||"Could not create service.");}
    finally{setServiceBusy(false);}
  }

  return <section className="portal-section"><div className="container">
    <div className="portal-heading"><div><span className="eyebrow">ADMINISTRATION</span><h1>Firm overview.</h1><p>Manage client activity and keep service operations moving.</p></div><button className="button button-outline" onClick={()=>load()} disabled={loading}><RefreshCw size={15}/> {loading?"Refreshing…":"Refresh"}</button></div>
    <Notice message={error} error/><Notice message={notice}/>
    {loading&&!stats?<div className="empty-state">Loading administration data…</div>:<>
      <div className="portal-stats">
        <Stat icon={<Users/>} label="Registered clients" value={stats?.clients??clients.length}/>
        <Stat icon={<FileText/>} label="Total inquiries" value={stats?.inquiries??inquiries.length}/>
        <Stat icon={<CalendarDays/>} label="Consultation bookings" value={stats?.bookings??bookings.length}/>
        <Stat icon={<ShieldCheck/>} label="Active services" value={stats?.services??services.length}/>
      </div>
      <div className="admin-tabs" role="tablist" aria-label="Admin management sections">
        {[[ "bookings","Bookings" ],[ "inquiries","Inquiries" ],[ "requests","Service requests" ],[ "clients","Clients" ],[ "services","Services" ]].map(([id,label])=><button type="button" role="tab" aria-selected={tab===id} key={id} className={tab===id?"selected":""} onClick={()=>setTab(id)}>{label}</button>)}
      </div>
      <section className="portal-panel admin-table-panel">
        {tab==="bookings"&&<><div className="panel-heading"><h2>Consultation bookings</h2></div><DataTable headers={["Client","Service","Preferred slot","Status","Update"]} rows={bookings.map(b=>{const key=`booking:${b._id}`;return [<><strong>{b.name}</strong><small>{b.email}</small></>,b.service,<>{new Date(b.preferredDate).toLocaleDateString("en-GB",{timeZone:"UTC"})}<small>{b.preferredTime}</small></>,<Status value={b.status}/>,<select className="table-select" aria-label={`Update booking for ${b.name}`} value={b.status} disabled={busyAction===key} onChange={event=>updateRecord("booking",b._id,event.target.value)}><option value="pending">Pending</option><option value="approved">Approve</option><option value="rejected">Reject</option><option value="completed">Complete</option></select>];})}/></>}
        {tab==="inquiries"&&<><div className="panel-heading"><h2>Client inquiries</h2></div><DataTable headers={["Contact","Subject","Message","Date","Status"]} rows={inquiries.map(item=>{const key=`inquiry:${item._id}`;return [<><strong>{item.name}</strong><small>{item.email} · {item.phone||"No phone"}</small></>,item.subject,<span className="table-message" title={item.message}>{item.message}</span>,new Date(item.createdAt).toLocaleDateString(),<select className="table-select" aria-label={`Update inquiry from ${item.name}`} value={item.status} disabled={busyAction===key} onChange={event=>updateRecord("inquiry",item._id,event.target.value)}><option value="new">New</option><option value="in-progress">In progress</option><option value="resolved">Resolved</option></select>];})}/></>}
        {tab==="requests"&&<><div className="panel-heading"><h2>Client service requests</h2></div><DataTable headers={["Client","Service","Details","Date","Status"]} rows={serviceRequests.map(item=>{const key=`request:${item._id}`;return [<><strong>{item.user?.name||"Client"}</strong><small>{item.user?.email||""}</small></>,item.service,<span className="table-message" title={item.details}>{item.details}</span>,new Date(item.createdAt).toLocaleDateString(),<select className="table-select" aria-label={`Update service request for ${item.user?.name||"client"}`} value={item.status} disabled={busyAction===key} onChange={event=>updateRecord("request",item._id,event.target.value)}><option value="pending">Pending</option><option value="in-progress">In progress</option><option value="approved">Approve</option><option value="rejected">Reject</option><option value="completed">Complete</option></select>];})}/></>}
        {tab==="clients"&&<><div className="panel-heading"><h2>Registered clients</h2></div><DataTable headers={["Name","Email","Phone","Joined","Account"]} rows={clients.map(client=>[<strong>{client.name}</strong>,client.email,client.phone||"—",new Date(client.createdAt).toLocaleDateString(),<Status value={client.isActive?"active":"inactive"}/>])}/></>}
        {tab==="services"&&<>
          <div className="panel-heading"><h2>Manage services</h2></div>
          <form className="inline-add-form" onSubmit={addService}>
            <input name="name" required maxLength="120" placeholder="Service name"/>
            <input name="slug" required maxLength="120" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" title="Use lowercase letters, numbers and hyphens" placeholder="url-friendly-slug"/>
            <input name="shortDescription" required maxLength="240" placeholder="Short description"/>
            <input name="description" required maxLength="3000" placeholder="Full description"/>
            <button className="button button-dark button-small" disabled={serviceBusy}>{serviceBusy?"Adding…":<><Plus size={15}/> Add</>}</button>
          </form>
          {editingService&&<form className="service-edit-form" onSubmit={saveService}>
            <div className="service-edit-heading"><strong>Edit service</strong><button type="button" className="table-edit" onClick={()=>setEditingService(null)}>Cancel</button></div>
            <input aria-label="Service name" required maxLength="120" value={editingService.name} onChange={event=>updateEditingService("name",event.target.value)}/>
            <input aria-label="Service URL slug" required maxLength="120" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" title="Use lowercase letters, numbers and hyphens" value={editingService.slug} onChange={event=>updateEditingService("slug",event.target.value)}/>
            <input aria-label="Short description" required maxLength="240" value={editingService.shortDescription} onChange={event=>updateEditingService("shortDescription",event.target.value)}/>
            <textarea aria-label="Full description" required maxLength="3000" rows="3" value={editingService.description} onChange={event=>updateEditingService("description",event.target.value)}/>
            <button className="button button-dark button-small" disabled={busyAction==="service:"+editingService._id}>{busyAction==="service:"+editingService._id?"Saving…":"Save changes"}</button>
          </form>}
          <DataTable headers={["Service","Slug","Description","Action"]} rows={services.map(service=>{
            const key="service:"+service._id;
            return [<strong>{service.name}</strong>,service.slug,<span className="table-message" title={service.shortDescription||service.description}>{service.shortDescription||service.description}</span>,<div className="table-actions"><button type="button" className="table-edit" disabled={Boolean(busyAction)||Boolean(editingService)} onClick={()=>editService(service)}>Edit</button><button type="button" className="table-delete" disabled={Boolean(busyAction)||Boolean(editingService)} onClick={()=>archiveService(service._id)}>Delete</button></div>];
          })}/>
        </>}
      </section>
    </>}
  </div></section>;
}
