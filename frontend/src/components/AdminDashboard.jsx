import React, { useEffect, useMemo, useState } from 'react';

import {
  ShieldCheck,
  Users,
  Building2,
  CalendarDays,
  Wallet,
  Check,
  X,
  Search,
  LogOut,
  RefreshCw,
  MapPin,
  ArrowUpRight,
  LayoutDashboard,
  TrendingUp,
  Clock3
} from 'lucide-react';

import api from '../api/axios';
import './dashboards.css';

const money=(value)=>`LKR ${Number(value||0).toLocaleString('en-LK')}`;
const fallback='https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80';

export default function AdminDashboard({onLogout,onNavigateHome}) {
  const [tab,setTab]=useState('overview');
  const [overview,setOverview]=useState(null);
  const [users,setUsers]=useState([]);
  const [listings,setListings]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [search,setSearch]=useState('');
  const [role,setRole]=useState('all');
  const [busyId,setBusyId]=useState('');
  const user=useMemo(()=>{try{return JSON.parse(localStorage.getItem('user')||'null')}catch{return null}},[]);

  const loadData=async()=>{
    setLoading(true);setError('');
    try{
      const [overviewRes,userRes,listingRes]=await Promise.all([
        api.get('/admin/overview'),
        api.get('/admin/users'),
        api.get('/listings/pending')
      ]);
      setOverview(overviewRes.data);
      setUsers(Array.isArray(userRes.data)?userRes.data:[]);
      setListings(Array.isArray(listingRes.data)?listingRes.data:[]);
    }catch(err){setError(err.response?.data?.message||'Could not load administrator data. Make sure you are signed in with an admin account and restart the backend.')}
    finally{setLoading(false)}
  };
  useEffect(()=>{loadData()},[]);

  const decideListing=async(id,status)=>{
    setBusyId(id);setError('');
    try{
      await api.put(`/listings/${id}`,{status});
      setListings(items=>items.filter(item=>item._id!==id));
      setOverview(current=>current?{...current,pendingListings:Math.max(0,(current.pendingListings||0)-1),activeListings:status==='Active'?(current.activeListings||0)+1:current.activeListings}:current);
    }catch(err){setError(err.response?.data?.message||'Unable to update this property.')}
    finally{setBusyId('')}
  };

  const filteredUsers=users.filter(item=>{
    const matchesRole=role==='all'||item.role===role;
    const matchesSearch=`${item.fullName} ${item.email}`.toLowerCase().includes(search.toLowerCase());
    return matchesRole&&matchesSearch;
  });
  const tabs=[{id:'overview',label:'Overview',icon:LayoutDashboard},{id:'properties',label:'Property approvals',icon:Building2,count:listings.length},{id:'users',label:'Users',icon:Users,count:users.length},{id:'analytics',label:'Platform insights',icon:TrendingUp}];

  return <div className="sa-dashboard sa-admin-dashboard">
    <header className="sa-dash-nav sa-admin-nav">
      <button className="sa-brand" onClick={onNavigateHome}><span className="sa-brand-mark"><ShieldCheck size={19}/></span><span><strong>Suba-Arana</strong><small>ADMINISTRATION</small></span></button>
      <div className="sa-nav-right"><span className="sa-admin-pill"><span/> SYSTEM ADMIN</span><span className="sa-avatar">{(user?.name||'A').slice(0,1).toUpperCase()}</span><span className="sa-nav-user">{user?.name||'Administrator'}</span><button className="sa-icon-button" onClick={onLogout} title="Sign out"><LogOut size={18}/></button></div>
    </header>
    <main className="sa-dash-main">
      <div className="sa-dash-welcome"><div><span className="sa-kicker">PLATFORM CONTROL CENTER</span><h1>Good day, {user?.name?.split(' ')[0]||'Administrator'}.</h1><p>Oversee local listings, support the host community and keep Suba-Arana running smoothly.</p></div><button className="sa-outline-btn" onClick={loadData}><RefreshCw size={15}/> Refresh data</button></div>
      <nav className="sa-dash-tabs">{tabs.map(({id,label,icon:Icon,count})=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}><Icon size={17}/>{label}{count>0&&<span className="sa-tab-count">{count}</span>}</button>)}</nav>
      {error&&<div className="sa-alert"><span>{error}</span><button onClick={loadData}><RefreshCw size={15}/> Retry</button></div>}
      {loading?<div className="sa-empty"><span className="sa-spinner"/><p>Loading platform information…</p></div>:<>
        {tab==='overview'&&<>
          <section className="sa-stat-grid">
            <AdminStat icon={Users} label="REGISTERED USERS" value={overview?.totalUsers??users.length} detail="Guest and host accounts"/>
            <AdminStat icon={Building2} label="ACTIVE PROPERTIES" value={overview?.activeListings??'—'} detail={`${overview?.pendingListings??listings.length} awaiting review`} tone="green"/>
            <AdminStat icon={CalendarDays} label="TOTAL BOOKINGS" value={overview?.totalBookings??'—'} detail="All booking requests" tone="blue"/>
            <AdminStat icon={Wallet} label="CONFIRMED BOOKING VALUE" value={money(overview?.confirmedBookingValue)} detail="Value of confirmed reservations" tone="gold"/>
          </section>
          <div className="sa-admin-overview-grid">
            <section className="sa-panel"><div className="sa-panel-heading"><div><span className="sa-kicker">REVIEW QUEUE</span><h2>Properties awaiting approval</h2></div><button className="sa-text-btn" onClick={()=>setTab('properties')}>Review all <ArrowUpRight size={15}/></button></div>
              {listings.length?listings.slice(0,4).map(item=><AdminListingRow key={item._id} listing={item} onDecision={decideListing} busy={busyId===item._id}/>):<div className="sa-inline-empty"><Check size={18}/> All property submissions have been reviewed.</div>}
            </section>
            <section className="sa-panel sa-admin-side"><span className="sa-kicker">PLATFORM HEALTH</span><h2>Community at a glance</h2><div className="sa-host-side-stat"><span><Users size={16}/> Guests</span><strong>{overview?.guestUsers??'—'}</strong></div><div className="sa-host-side-stat"><span><Building2 size={16}/> Hosts</span><strong>{overview?.hostUsers??'—'}</strong></div><div className="sa-host-side-stat"><span><Clock3 size={16}/> Pending review</span><strong>{listings.length}</strong></div><button className="sa-dark-wide" onClick={()=>setTab('users')}>Manage community <ArrowUpRight size={15}/></button></section>
          </div>
        </>}
        {tab==='properties'&&<section className="sa-panel"><div className="sa-panel-heading"><div><span className="sa-kicker">LISTING GOVERNANCE</span><h2>Property approval queue</h2></div><span className="sa-muted">{listings.length} waiting for review</span></div>
          {listings.length?<div className="sa-admin-listing-grid">{listings.map(item=><AdminListingCard key={item._id} listing={item} onDecision={decideListing} busy={busyId===item._id}/>)}</div>:<div className="sa-empty-state"><span><Check size={25}/></span><h3>Review queue is clear</h3><p>New host submissions will appear here for approval.</p></div>}
        </section>}
        {tab==='users'&&<section className="sa-panel"><div className="sa-panel-heading"><div><span className="sa-kicker">COMMUNITY DIRECTORY</span><h2>Registered users</h2></div><span className="sa-muted">{users.length} accounts</span></div>
          <div className="sa-user-filters"><label className="sa-search"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or email"/></label><select value={role} onChange={e=>setRole(e.target.value)}><option value="all">All roles</option><option value="guest">Guests</option><option value="host">Hosts</option><option value="admin">Admins</option></select></div>
          <div className="sa-table-wrap"><table className="sa-table"><thead><tr><th>USER</th><th>EMAIL</th><th>ROLE</th><th>JOINED</th></tr></thead><tbody>{filteredUsers.map(item=><tr key={item._id}><td><span className="sa-table-user"><span className="sa-avatar">{(item.fullName||'U').slice(0,1).toUpperCase()}</span><strong>{item.fullName}</strong></span></td><td>{item.email}</td><td><span className={`sa-role-pill ${item.role}`}>{item.role}</span></td><td>{item.createdAt?new Date(item.createdAt).toLocaleDateString():'—'}</td></tr>)}</tbody></table></div>
          {!filteredUsers.length&&<p className="sa-muted sa-table-empty">No accounts match this search.</p>}
          <p className="sa-disclaimer">User access controls are not part of the current backend. This screen provides a live directory; it does not deactivate or modify accounts.</p>
        </section>}
        {tab==='analytics'&&<section className="sa-panel"><div className="sa-panel-heading"><div><span className="sa-kicker">LIVE PLATFORM METRICS</span><h2>Platform insights</h2></div></div><div className="sa-insight-grid"><div><small>ALL USERS</small><strong>{overview?.totalUsers??0}</strong><p>{overview?.guestUsers??0} guests · {overview?.hostUsers??0} hosts</p></div><div><small>LISTINGS</small><strong>{(overview?.activeListings||0)+(overview?.pendingListings||0)}</strong><p>{overview?.activeListings||0} active · {overview?.pendingListings||0} pending</p></div><div><small>BOOKINGS</small><strong>{overview?.totalBookings??0}</strong><p>{overview?.confirmedBookings??0} confirmed reservations</p></div><div><small>CONFIRMED BOOKING VALUE</small><strong>{money(overview?.confirmedBookingValue)}</strong><p>Gross reservation value, not platform revenue</p></div></div><p className="sa-disclaimer">These metrics are calculated from current MongoDB records. Traffic analytics, commission tracking and payout processing are not implemented in the current API.</p></section>}
      </>}
    </main>
    <footer className="sa-dash-footer"><span>© {new Date().getFullYear()} Suba-Arana · Administration</span><span>Protecting authentic local hospitality</span></footer>
  </div>;
}

function AdminStat({icon:Icon,label,value,detail,tone=''}){return <article className="sa-stat-card"><span className={`sa-stat-icon ${tone}`}><Icon size={19}/></span><small>{label}</small><strong>{value}</strong><p>{detail}</p></article>}
function AdminListingRow({listing,onDecision,busy}){return <div className="sa-admin-row"><img src={listing.image||fallback} alt={listing.name}/><div><strong>{listing.name}</strong><p><MapPin size={13}/>{listing.location} · {listing.hostId?.fullName||'Host'}</p></div><div className="sa-admin-row-actions"><button disabled={busy} onClick={()=>onDecision(listing._id,'Active')}><Check size={14}/> Approve</button><button disabled={busy} onClick={()=>onDecision(listing._id,'Rejected')}><X size={14}/> Reject</button></div></div>}
function AdminListingCard({listing,onDecision,busy}){return <article className="sa-admin-listing-card"><img src={listing.image||fallback} alt={listing.name}/><div className="sa-admin-listing-body"><span className="sa-kicker">{listing.type||'HOMESTAY'}</span><h3>{listing.name}</h3><p><MapPin size={14}/>{listing.location}</p><p className="sa-admin-host">Host: {listing.hostId?.fullName||'Unknown host'} · {listing.hostId?.email||''}</p><strong>{money(listing.basePrice)} <small>/ night</small></strong><div className="sa-admin-card-actions"><button disabled={busy} onClick={()=>onDecision(listing._id,'Active')}><Check size={15}/> Approve</button><button disabled={busy} onClick={()=>onDecision(listing._id,'Rejected')}><X size={15}/> Reject</button></div></div></article>}
