import React, { useEffect, useMemo, useState } from 'react';
import {
  Home, Building2, CalendarDays, Clock3, Plus, LogOut, MapPin, Check, X,
  Wallet, TrendingUp, ArrowRight, RefreshCw, ChevronRight
} from 'lucide-react';
import api from '../api/axios';
import './dashboards.css';

const money = (value) => `LKR ${Number(value || 0).toLocaleString('en-LK')}`;
const date = (value) => value ? new Date(value).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const fallback = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80';
const amenityOptions = ['Free Wi-Fi','Air Conditioning','Breakfast Included','Free Parking','Mountain View','Hot Water','Kitchen Access','Airport Shuttle'];

export default function HostDashboard({ onLogout, onNavigateHome }) {
  const [tab, setTab] = useState('overview');
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState('');
  const [form, setForm] = useState({ name:'', type:'Homestay', location:'', roomType:'', basePrice:'', image:'', description:'', amenities:['Free Wi-Fi','Breakfast Included'] });
  const user = useMemo(() => { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } }, []);

  const loadData = async () => {
    if (!user?.id) { setError('Please sign in again to access your host portal.'); setLoading(false); return; }
    setLoading(true); setError('');
    try {
      const [listRes, bookingRes] = await Promise.all([
        api.get(`/listings/host/${user.id}`),
        api.get(`/bookings/host/${user.id}`)
      ]);
      setListings(Array.isArray(listRes.data) ? listRes.data : []);
      setBookings(Array.isArray(bookingRes.data) ? bookingRes.data : []);
    } catch (err) { setError(err.response?.data?.message || 'Could not load host data. Check your connection and account role.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadData(); }, []);

  const pending = bookings.filter((b) => (b.bookingStatus || 'Pending') === 'Pending');
  const confirmed = bookings.filter((b) => b.bookingStatus === 'Confirmed');
  const earnings = confirmed.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);
  const activeListings = listings.filter((l) => l.status === 'Active').length;

  const updateBooking = async (id, bookingStatus) => {
    setBusyId(id); setError('');
    try {
      await api.put(`/bookings/${id}`, { bookingStatus });
      setBookings((items) => items.map((item) => item._id === id ? { ...item, bookingStatus } : item));
    } catch (err) { setError(err.response?.data?.message || 'Unable to update this reservation.'); }
    finally { setBusyId(''); }
  };

  const toggleAmenity = (value) => setForm((current) => ({
    ...current, amenities: current.amenities.includes(value) ? current.amenities.filter((item) => item !== value) : [...current.amenities, value]
  }));

  const submitListing = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    try {
      const response = await api.post('/listings', { ...form, basePrice: Number(form.basePrice) });
      setListings((items) => [response.data, ...items]);
      setShowForm(false);
      setForm({ name:'', type:'Homestay', location:'', roomType:'', basePrice:'', image:'', description:'', amenities:['Free Wi-Fi','Breakfast Included'] });
      setTab('properties');
    } catch (err) { setError(err.response?.data?.message || 'Could not submit this property. Check all required fields.'); }
    finally { setSaving(false); }
  };

  const tabs = [
    { id:'overview', label:'Overview', icon:Home },
    { id:'reservations', label:'Reservations', icon:CalendarDays, count:pending.length },
    { id:'properties', label:'My properties', icon:Building2, count:listings.length },
    { id:'earnings', label:'Earnings', icon:Wallet }
  ];

  return <div className="sa-dashboard">
    <header className="sa-dash-nav">
      <button className="sa-brand" onClick={onNavigateHome}><span className="sa-brand-mark"><Home size={19}/></span><span><strong>Suba-Arana</strong><small>HOST MANAGEMENT PORTAL</small></span></button>
      <div className="sa-nav-right"><span className="sa-host-pill"><span/> HOST PORTAL</span><span className="sa-avatar">{(user?.name || 'H').slice(0,1).toUpperCase()}</span><span className="sa-nav-user">{user?.name || 'Host'}</span><button className="sa-icon-button" onClick={onLogout} title="Sign out"><LogOut size={18}/></button></div>
    </header>
    <main className="sa-dash-main">
      <div className="sa-dash-welcome sa-host-welcome">
        <div><span className="sa-kicker">AYUBOWAN, {user?.name?.toUpperCase() || 'LOCAL HOST'}</span><h1>Hospitality Dashboard</h1><p>Manage your properties, welcome your guests and grow your local hosting business.</p></div>
        <button className="sa-primary-btn" onClick={() => setShowForm(true)}><Plus size={17}/> Add new property</button>
      </div>
      <nav className="sa-dash-tabs">{tabs.map(({id,label,icon:Icon,count}) => <button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}><Icon size={17}/>{label}{count>0&&<span className="sa-tab-count">{count}</span>}</button>)}</nav>
      {error && <div className="sa-alert"><span>{error}</span><button onClick={loadData}><RefreshCw size={15}/> Retry</button></div>}
      {loading ? <div className="sa-empty"><span className="sa-spinner"/><p>Loading your host workspace…</p></div> : <>
        {tab==='overview' && <>
          <section className="sa-stat-grid">
            <article className="sa-stat-card"><span className="sa-stat-icon"><Building2 size={19}/></span><small>TOTAL PROPERTIES</small><strong>{listings.length}</strong><p>{activeListings} currently visible to guests</p></article>
            <article className="sa-stat-card"><span className="sa-stat-icon gold"><Clock3 size={19}/></span><small>NEW REQUESTS</small><strong>{pending.length}</strong><p>Reservations awaiting your response</p></article>
            <article className="sa-stat-card"><span className="sa-stat-icon blue"><CalendarDays size={19}/></span><small>CONFIRMED BOOKINGS</small><strong>{confirmed.length}</strong><p>Accepted guest reservations</p></article>
            <article className="sa-stat-card"><span className="sa-stat-icon green"><Wallet size={19}/></span><small>BOOKING VALUE</small><strong>{money(earnings)}</strong><p>Total value of confirmed bookings</p></article>
          </section>
          <div className="sa-host-grid">
            <section className="sa-panel"><div className="sa-panel-heading"><div><span className="sa-kicker">NEEDS YOUR ATTENTION</span><h2>New reservation requests</h2></div><button className="sa-text-btn" onClick={()=>setTab('reservations')}>View all <ArrowRight size={15}/></button></div>
              {pending.length ? pending.slice(0,4).map((booking)=><HostBooking key={booking._id} booking={booking} onUpdate={updateBooking} busy={busyId===booking._id}/>) : <EmptyHost title="You're all caught up" text="New guest booking requests will appear here."/>}
            </section>
            <section className="sa-panel sa-host-side"><span className="sa-kicker">YOUR HOSTING SNAPSHOT</span><h2>Local hospitality, made simple.</h2><p>Keep your property information up to date and respond to guest requests promptly.</p><div className="sa-host-side-stat"><span><Building2 size={17}/> Listed properties</span><strong>{listings.length}</strong></div><div className="sa-host-side-stat"><span><Check size={17}/> Confirmed stays</span><strong>{confirmed.length}</strong></div><button className="sa-dark-wide" onClick={()=>setTab('properties')}>Manage my properties <ChevronRight size={16}/></button></section>
          </div>
        </>}
        {tab==='reservations' && <section className="sa-panel"><div className="sa-panel-heading"><div><span className="sa-kicker">GUEST RELATIONSHIPS</span><h2>Reservations & check-ins</h2></div><span className="sa-muted">{bookings.length} total</span></div>
          {bookings.length ? bookings.slice().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).map((booking)=><HostBooking key={booking._id} booking={booking} onUpdate={updateBooking} busy={busyId===booking._id}/>) : <EmptyHost title="No reservations yet" text="When guests request one of your approved properties, their reservations will appear here."/>}
        </section>}
        {tab==='properties' && <section className="sa-panel"><div className="sa-panel-heading"><div><span className="sa-kicker">YOUR PLACES</span><h2>My properties</h2></div><button className="sa-primary-btn" onClick={()=>setShowForm(true)}><Plus size={16}/> Add property</button></div>
          {listings.length ? <div className="sa-property-grid">{listings.map((listing)=><article className="sa-property-card" key={listing._id}><img src={listing.image||fallback} alt={listing.name}/><div className="sa-property-body"><div className="sa-property-top"><span className={`sa-status ${String(listing.status).toLowerCase().replace(/\s/g,'-')}`}>{listing.status||'Pending Approval'}</span><small>{listing.type}</small></div><h3>{listing.name}</h3><p><MapPin size={14}/>{listing.location}</p><div className="sa-property-price"><strong>{money(listing.basePrice)}</strong><small> / night</small></div></div></article>)}</div> : <EmptyHost title="Add your first property" text="Share your homestay with travellers looking for authentic local experiences." action={()=>setShowForm(true)}/>}
        </section>}
        {tab==='earnings' && <section className="sa-panel"><div className="sa-panel-heading"><div><span className="sa-kicker">HOST FINANCIALS</span><h2>Booking earnings overview</h2></div></div><div className="sa-earnings-hero"><span><TrendingUp size={20}/></span><div><small>CONFIRMED BOOKING VALUE</small><strong>{money(earnings)}</strong><p>Calculated from confirmed reservations in your account.</p></div></div><div className="sa-earnings-row"><span>Confirmed reservations</span><strong>{confirmed.length}</strong></div><div className="sa-earnings-row"><span>Pending requests</span><strong>{pending.length}</strong></div><div className="sa-earnings-row"><span>All reservations</span><strong>{bookings.length}</strong></div><p className="sa-disclaimer">This is a booking-value summary, not a verified payout statement. Payment settlement is not connected in the current backend.</p></section>}
      </>}
    </main>
    <footer className="sa-dash-footer"><span>© {new Date().getFullYear()} Suba-Arana · Host community</span><span>Thoughtful stays. Local connections.</span></footer>

    {showForm && <div className="sa-modal-backdrop" role="presentation" onMouseDown={(e)=>{if(e.target===e.currentTarget)setShowForm(false);}}><section className="sa-modal" role="dialog" aria-modal="true" aria-labelledby="sa-add-property-title"><div className="sa-modal-head"><div><span className="sa-kicker">WELCOME GUESTS TO YOUR HOME</span><h2 id="sa-add-property-title">Add a property</h2></div><button className="sa-icon-button" onClick={()=>setShowForm(false)}><X size={19}/></button></div><form onSubmit={submitListing} className="sa-form-grid">
      <label>PROPERTY NAME<input required value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="e.g. Hill Country Tea Bungalow"/></label>
      <label>PROPERTY TYPE<select value={form.type} onChange={(e)=>setForm({...form,type:e.target.value})}><option>Homestay</option><option>Guest House</option><option>Villa</option><option>Bungalow</option><option>Eco Lodge</option></select></label>
      <label>LOCATION<input required value={form.location} onChange={(e)=>setForm({...form,location:e.target.value})} placeholder="Ella, Sri Lanka"/></label>
      <label>ROOM TYPE<input required value={form.roomType} onChange={(e)=>setForm({...form,roomType:e.target.value})} placeholder="Deluxe double room"/></label>
      <label>PRICE PER NIGHT (LKR)<input required min="1" type="number" value={form.basePrice} onChange={(e)=>setForm({...form,basePrice:e.target.value})} placeholder="8500"/></label>
      <label>PROPERTY IMAGE URL<input value={form.image} onChange={(e)=>setForm({...form,image:e.target.value})} placeholder="https://…"/></label>
      <label className="sa-form-full">DESCRIPTION<textarea required rows="3" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} placeholder="Describe your property and the experience guests can enjoy."/></label>
      <div className="sa-form-full"><span className="sa-field-label">AMENITIES</span><div className="sa-amenity-picks">{amenityOptions.map((item)=><label key={item}><input type="checkbox" checked={form.amenities.includes(item)} onChange={()=>toggleAmenity(item)}/>{item}</label>)}</div></div>
      <div className="sa-form-actions sa-form-full"><button type="button" className="sa-outline-btn" onClick={()=>setShowForm(false)}>Cancel</button><button type="submit" className="sa-primary-btn" disabled={saving}>{saving?'Submitting…':'Submit for approval'} <ArrowRight size={15}/></button></div>
    </form><p className="sa-form-note">Your listing will be reviewed by Suba-Arana administrators before it appears publicly.</p></section></div>}
  </div>;
}

function HostBooking({ booking, onUpdate, busy }) {
  const listing=booking.listingId||{}, guest=booking.guestId||{};
  const status=booking.bookingStatus||'Pending';
  return <article className="sa-host-booking"><div className="sa-guest-avatar">{(guest.fullName||'G').slice(0,1).toUpperCase()}</div><div className="sa-host-booking-main"><div className="sa-host-booking-title"><strong>{guest.fullName||'Guest reservation'}</strong><span className={`sa-status ${status.toLowerCase()}`}>{status}</span></div><p>{listing.name||'Your property'} · {date(booking.checkIn)} – {date(booking.checkOut)}</p><small>{guest.email||'Guest contact details'} {guest.phone?`· ${guest.phone}`:''}</small></div><div className="sa-host-booking-end"><strong>{money(booking.totalPrice)}</strong>{status==='Pending'?<div className="sa-booking-actions"><button disabled={busy} onClick={()=>onUpdate(booking._id,'Confirmed')}><Check size={14}/> Accept</button><button disabled={busy} onClick={()=>onUpdate(booking._id,'Declined')}><X size={14}/> Decline</button></div>:<small>{booking.paymentStatus||'Payment status unavailable'}</small>}</div></article>;
}
function EmptyHost({title,text,action}) { return <div className="sa-empty-state"><span><Building2 size={25}/></span><h3>{title}</h3><p>{text}</p>{action&&<button className="sa-primary-btn" onClick={action}><Plus size={15}/> Add property</button>}</div>; }
