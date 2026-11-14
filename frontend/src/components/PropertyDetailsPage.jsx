import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Wifi, Coffee, Car, Wind, Mountain, ShieldCheck, CalendarDays, Users, Heart, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

const amenityIcons = {
  'Free Wi-Fi': Wifi,
  'Breakfast Included': Coffee,
  'Free Parking': Car,
  'Air Conditioning': Wind,
  'Mountain View': Mountain,
};

export default function PropertyDetailsPage({ onNavigateToLogin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [property, setProperty] = useState(location.state?.property || null);
  const [loading, setLoading] = useState(!location.state?.property);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (property?._id === id) return;
    let active = true;
    api.get('/listings')
      .then(({ data }) => {
        if (active) setProperty(data.find((item) => item._id === id) || null);
      })
      .catch(() => { if (active) setMessage('We could not load this stay. Please return to the home page and try again.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    return diff > 0 ? Math.round(diff / 86400000) : 0;
  }, [checkIn, checkOut]);

  const today = new Date().toISOString().slice(0, 10);
  const total = property && nights ? Number(property.basePrice || 0) * nights : 0;

  const requestBooking = async (event) => {
    event.preventDefault();
    setMessage('');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');
    if (!token || user?.role !== 'guest') {
      setMessage('Please sign in with a guest account to request a booking.');
      return;
    }
    if (!nights) {
      setMessage('Choose a valid check-out date after your check-in date.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/bookings', {
        listingId: property._id,
        hostId: property.hostId?._id || property.hostId,
        checkIn,
        checkOut,
        totalPrice: total,
        notes: `${guests} guest(s). ${notes}`.trim(),
      });
      setMessage('Your booking request has been sent to the host. You can follow its status from your guest dashboard.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'We could not send your request. Please check the listing and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <main className="sa-page sa-centered"><div className="sa-loader" /><p>Finding this stay…</p></main>;
  if (!property) return <main className="sa-page sa-centered"><h1>Stay not found</h1><button className="sa-button sa-button-primary" onClick={() => navigate('/')}>Back to stays</button></main>;

  const image = property.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85';
  return (
    <main className="sa-page">
      <header className="sa-detail-top">
        <button className="sa-back" onClick={() => navigate(-1)}><ArrowLeft size={18}/> Back to explore</button>
        <button className={`sa-save ${favorite ? 'is-saved' : ''}`} onClick={() => setFavorite(!favorite)}><Heart size={17} fill={favorite ? 'currentColor' : 'none'}/> {favorite ? 'Saved' : 'Save stay'}</button>
      </header>

      <section className="sa-detail-heading">
        <div>
          <span className="sa-eyebrow">A SUBA-ARANA STAY · {property.type || 'HOMESTAY'}</span>
          <h1>{property.name}</h1>
          <p className="sa-location"><MapPin size={17}/> {property.location} <span>·</span> Sri Lanka</p>
        </div>
        <div className="sa-rating"><Star size={17} fill="currentColor"/> <strong>4.8</strong><span>Guest-loved stay</span></div>
      </section>

      <section className="sa-gallery">
        <img className="sa-gallery-main" src={image} alt={property.name} />
        <div className="sa-gallery-side">
          <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80" alt="Comfortable room" />
          <img src="https://images.unsplash.com/photo-160021-j?auto=format&fit=crop&w=800&q=80" alt="Homestay interior" onError={(e) => { e.currentTarget.src = image; }} />
        </div>
      </section>

      <div className="sa-detail-layout">
        <article className="sa-detail-content">
          <div className="sa-host-line">
            <div className="sa-host-avatar">{(property.name || 'S').slice(0,1).toUpperCase()}</div>
            <div><strong>A locally hosted experience</strong><span>Connect directly with your Sri Lankan host</span></div>
            <ShieldCheck className="sa-verified" size={23}/>
          </div>
          <div className="sa-section">
            <h2>About this stay</h2>
            <p>{property.description || 'Enjoy a welcoming local stay, discover the character of the area and experience Sri Lankan hospitality. Contact your host directly through Suba-Arana for details about your visit.'}</p>
          </div>
          <div className="sa-section">
            <h2>What this place offers</h2>
            <div className="sa-amenities">
              {(property.amenities?.length ? property.amenities : ['Local hospitality']).map((item) => {
                const Icon = amenityIcons[item] || CheckCircle2;
                return <div className="sa-amenity" key={item}><Icon size={19}/><span>{item}</span></div>;
              })}
            </div>
          </div>
          <div className="sa-section sa-direct-note">
            <ShieldCheck size={22}/>
            <div><strong>Book directly with local hosts</strong><p>Your request goes to the property host. No third-party booking marketplace is involved.</p></div>
          </div>
        </article>

        <aside className="sa-booking-card">
          <div className="sa-price"><strong>LKR {Number(property.basePrice || 0).toLocaleString()}</strong><span> / night</span></div>
          <form onSubmit={requestBooking}>
            <div className="sa-date-grid">
              <label>CHECK-IN<input type="date" min={today} value={checkIn} onChange={(e) => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(''); }} required /></label>
              <label>CHECK-OUT<input type="date" min={checkIn || today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required /></label>
            </div>
            <label className="sa-guests-label">GUESTS<select value={guests} onChange={(e) => setGuests(Number(e.target.value))}><option value={1}>1 guest</option><option value={2}>2 guests</option><option value={3}>3 guests</option><option value={4}>4 guests</option><option value={5}>5+ guests</option></select></label>
            <label className="sa-guests-label">NOTE TO HOST <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Share any questions or requests…" rows={3}/></label>
            {nights > 0 && <div className="sa-total"><span>{Number(property.basePrice).toLocaleString()} × {nights} night(s)</span><strong>LKR {total.toLocaleString()}</strong></div>}
            <button className="sa-button sa-button-primary sa-full" type="submit" disabled={submitting}>{submitting ? 'Sending request…' : 'Request to book'}</button>
            <p className="sa-booking-foot">You will not be charged now. The host will review your request.</p>
            {message && <p className="sa-form-message" role="status">{message} {!localStorage.getItem('token') && <button type="button" onClick={onNavigateToLogin}>Sign in</button>}</p>}
          </form>
        </aside>
      </div>
    </main>
  );
}
