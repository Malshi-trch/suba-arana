import React, { useEffect, useMemo, useState } from 'react';
import {
  Home, CalendarDays, Heart, Compass, LogOut, MapPin, Clock3,
  ArrowUpRight, Search, Trash2, BedDouble, Users, Wallet, ArrowRight, RefreshCw
} from 'lucide-react';
import api from '../api/axios';
import './dashboards.css';

const money = (value) => `LKR ${Number(value || 0).toLocaleString('en-LK')}`;
const date = (value) => value ? new Date(value).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const imageFallback = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80';

export default function GuestDashboard({ onNavigateHome, onViewProperty, onLogout }) {
  const [tab, setTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('suba-arana-favorites') || '[]'); } catch { return []; }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [busyId, setBusyId] = useState('');

  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  }, []);

  const loadData = async () => {
    if (!user?.id) { setError('Your session has expired. Please sign in again.'); setLoading(false); return; }
    setLoading(true);
    setError('');
    try {
      const [bookingRes, listingRes] = await Promise.all([
        api.get(`/bookings/guest/${user.id}`),
        api.get('/listings')
      ]);
      setBookings(Array.isArray(bookingRes.data) ? bookingRes.data : []);
      setListings(Array.isArray(listingRes.data) ? listingRes.data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load your account data. Check that the backend is running and sign in again.');
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => { localStorage.setItem('suba-arana-favorites', JSON.stringify(favorites)); }, [favorites]);

  const upcoming = bookings.filter((b) => new Date(b.checkOut) >= new Date(new Date().toDateString()) && !['Cancelled', 'Declined'].includes(b.bookingStatus));
  const past = bookings.filter((b) => new Date(b.checkOut) < new Date(new Date().toDateString()) || ['Cancelled', 'Declined'].includes(b.bookingStatus));
  const saved = listings.filter((item) => favorites.includes(item._id));
  const filteredSaved = saved.filter((item) => `${item.name} ${item.location}`.toLowerCase().includes(query.toLowerCase()));
  const pending = bookings.filter((b) => b.bookingStatus === 'Pending').length;
  const totalSpent = bookings.filter((b) => String(b.paymentStatus || '').startsWith('Paid')).reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);

  const cancelBooking = async (booking) => {
    if (!window.confirm('Cancel this booking request?')) return;
    setBusyId(booking._id);
    try {
      await api.put(`/bookings/${booking._id}`, { bookingStatus: 'Cancelled' });
      await loadData();
    } catch (err) { setError(err.response?.data?.message || 'Unable to cancel this booking.'); }
    finally { setBusyId(''); }
  };

  const removeFavorite = (id) => setFavorites((current) => current.filter((item) => item !== id));

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'trips', label: 'My trips', icon: CalendarDays, count: upcoming.length },
    { id: 'saved', label: 'Saved stays', icon: Heart, count: saved.length },
  ];

  return (
    <div className="sa-dashboard">
      <header className="sa-dash-nav">
        <button className="sa-brand" onClick={onNavigateHome} aria-label="Suba-Arana home">
          <span className="sa-brand-mark"><Home size={19}/></span>
          <span><strong>Suba-Arana</strong><small>TRAVELER PORTAL</small></span>
        </button>
        <div className="sa-nav-right">
          <button className="sa-nav-link" onClick={onNavigateHome}><Compass size={16}/> Explore stays</button>
          <span className="sa-avatar">{(user?.name || 'G').slice(0,1).toUpperCase()}</span>
          <span className="sa-nav-user">{user?.name || 'Guest'}</span>
          <button className="sa-icon-button" onClick={onLogout} title="Sign out"><LogOut size={18}/></button>
        </div>
      </header>

      <main className="sa-dash-main">
        <div className="sa-dash-welcome">
          <div><span className="sa-kicker">AYUBOWAN · YOUR JOURNEY STARTS HERE</span><h1>Welcome back, {user?.name?.split(' ')[0] || 'traveller'}.</h1><p>Your Sri Lankan stays, all in one peaceful place.</p></div>
          <button className="sa-primary-btn" onClick={onNavigateHome}><Compass size={17}/> Explore destinations <ArrowUpRight size={16}/></button>
        </div>

        <nav className="sa-dash-tabs" aria-label="Guest dashboard sections">
          {tabs.map(({ id, label, icon: Icon, count }) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}><Icon size={17}/>{label}{count > 0 && <span className="sa-tab-count">{count}</span>}</button>)}
        </nav>

        {error && <div className="sa-alert"><span>{error}</span><button onClick={loadData}><RefreshCw size={15}/> Retry</button></div>}
        {loading ? <div className="sa-empty"><span className="sa-spinner"/><p>Preparing your traveler dashboard…</p></div> : <>
          {tab === 'overview' && <>
            <section className="sa-stat-grid">
              <article className="sa-stat-card"><span className="sa-stat-icon"><CalendarDays size={19}/></span><small>UPCOMING TRIPS</small><strong>{upcoming.length}</strong><p>Reservations on your calendar</p></article>
              <article className="sa-stat-card"><span className="sa-stat-icon gold"><Clock3 size={19}/></span><small>AWAITING HOST</small><strong>{pending}</strong><p>Requests being reviewed</p></article>
              <article className="sa-stat-card"><span className="sa-stat-icon rose"><Heart size={19}/></span><small>SAVED STAYS</small><strong>{saved.length}</strong><p>Places on your wish list</p></article>
              <article className="sa-stat-card"><span className="sa-stat-icon blue"><Wallet size={19}/></span><small>PAID BOOKINGS</small><strong>{money(totalSpent)}</strong><p>Recorded paid reservations</p></article>
            </section>
            <section className="sa-panel">
              <div className="sa-panel-heading"><div><span className="sa-kicker">YOUR NEXT ADVENTURE</span><h2>Upcoming reservations</h2></div><button className="sa-text-btn" onClick={() => setTab('trips')}>View all trips <ArrowRight size={15}/></button></div>
              {upcoming.length ? <div className="sa-trip-list">{upcoming.slice(0,3).map((booking) => <BookingCard key={booking._id} booking={booking} onCancel={cancelBooking} busy={busyId === booking._id}/>)}</div> : <EmptyState title="No trips booked yet" text="Find a welcoming homestay and start planning your next Sri Lankan getaway." action="Explore stays" onClick={onNavigateHome}/>}
            </section>
          </>}

          {tab === 'trips' && <section className="sa-panel">
            <div className="sa-panel-heading"><div><span className="sa-kicker">YOUR RESERVATIONS</span><h2>My trips</h2></div><span className="sa-muted">{upcoming.length} upcoming · {past.length} past</span></div>
            <div className="sa-trip-list">{upcoming.length ? upcoming.map((booking) => <BookingCard key={booking._id} booking={booking} onCancel={cancelBooking} busy={busyId === booking._id}/>) : <EmptyState title="Nothing planned just yet" text="Browse local stays and send a booking request directly to a host." action="Find a stay" onClick={onNavigateHome}/>}</div>
            {past.length > 0 && <><div className="sa-subheading"><h3>Past reservations</h3></div><div className="sa-trip-list">{past.map((booking) => <BookingCard key={booking._id} booking={booking} compact/>)}</div></>}
          </section>}

          {tab === 'saved' && <section className="sa-panel">
            <div className="sa-panel-heading"><div><span className="sa-kicker">YOUR WISH LIST</span><h2>Saved stays</h2></div><label className="sa-search"><Search size={16}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search saved stays"/></label></div>
            {filteredSaved.length ? <div className="sa-saved-grid">{filteredSaved.map((stay) => <article className="sa-saved-card" key={stay._id}><img src={stay.image || imageFallback} alt={stay.name}/><div className="sa-saved-body"><span className="sa-kicker">{stay.type || 'HOMESTAY'}</span><h3>{stay.name}</h3><p><MapPin size={14}/>{stay.location}</p><div><strong>{money(stay.basePrice)}</strong><small> / night</small></div><div className="sa-saved-actions"><button onClick={() => onViewProperty ? onViewProperty(stay) : onNavigateHome?.()}>View stay</button><button className="sa-remove-btn" onClick={() => removeFavorite(stay._id)} title="Remove saved stay"><Trash2 size={16}/></button></div></div></article>)}</div> : <EmptyState title="Your wish list is waiting" text="Save a few favourite stays from Explore and they will appear here." action="Explore stays" onClick={onNavigateHome}/>}
          </section>}
        </>}
      </main>
      <footer className="sa-dash-footer"><span>© {new Date().getFullYear()} Suba-Arana · Authentic Sri Lankan hospitality</span><span>Made for meaningful local stays</span></footer>
    </div>
  );
}

function BookingCard({ booking, onCancel, busy, compact = false }) {
  const listing = booking.listingId || {};
  const host = booking.hostId || {};
  const status = booking.bookingStatus || 'Pending';
  return <article className={`sa-trip-card ${compact ? 'compact' : ''}`}>
    <img src={listing.image || imageFallback} alt={listing.name || 'Homestay'}/>
    <div className="sa-trip-info"><div className="sa-trip-title-row"><h3>{listing.name || 'Homestay reservation'}</h3><span className={`sa-status ${status.toLowerCase().replace(/\s/g,'-')}`}>{status}</span></div><p><MapPin size={14}/>{listing.location || 'Sri Lanka'} <span>·</span> {listing.roomType || listing.type || 'Local stay'}</p><p><CalendarDays size={14}/>{date(booking.checkIn)} – {date(booking.checkOut)}</p>{!compact && <p><Users size={14}/>Host: {host.fullName || 'Your host'}</p>}</div>
    <div className="sa-trip-side"><strong>{money(booking.totalPrice)}</strong><small>{booking.paymentStatus || 'Awaiting Payment'}</small>{onCancel && ['Pending','Confirmed'].includes(status) && <button className="sa-outline-btn" onClick={() => onCancel(booking)} disabled={busy}>{busy ? 'Updating…' : 'Cancel request'}</button>}</div>
  </article>;
}

function EmptyState({ title, text, action, onClick }) {
  return <div className="sa-empty-state"><span><BedDouble size={25}/></span><h3>{title}</h3><p>{text}</p>{action && <button className="sa-primary-btn" onClick={onClick}>{action}<ArrowUpRight size={15}/></button>}</div>;
}
