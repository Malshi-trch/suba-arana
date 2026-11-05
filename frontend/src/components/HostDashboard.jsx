import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Home, Building2, Calendar, Clock, Plus, Edit3, DollarSign, Download, RefreshCw, User, MapPin, Check, X, LogOut, Sliders, Link2
} from 'lucide-react';

const AMENITY_OPTIONS = [
  'Free Wi-Fi', 'Air Conditioning', 'Breakfast Included', 'Free Parking', 'Mountain View', 'Hot Water', 'Kitchen Access', 'Airport Shuttle'
];

export default function HostDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('bookings');
  const [currentUser, setCurrentUser] = useState(null);

  // Dynamic MongoDB State
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data on Load
  useEffect(() => {
    const fetchHostData = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        setIsLoading(false);
        return;
      }
      
      const user = JSON.parse(userStr);
      setCurrentUser(user);

      try {
        // Fetch properties owned by this host
        const listingsRes = await axios.get(`http://localhost:5000/api/listings/host/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setListings(listingsRes.data);

        // Fetch bookings requested for this host's properties
        const bookingsRes = await axios.get(`http://localhost:5000/api/bookings/host/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error("Failed to load host dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHostData();
  }, []);

  // Listing Form State
  const [showListingModal, setShowListingModal] = useState(false);
  const [listingForm, setListingForm] = useState({
    name: '', type: 'Homestay', location: '', roomType: '', basePrice: '', image: '', description: '', amenities: ['Free Wi-Fi', 'Breakfast Included']
  });

  // Booking / Guest Modals
  const [selectedGuestProfile, setSelectedGuestProfile] = useState(null);
  const [modifyingBooking, setModifyingBooking] = useState(null);

  // Pricing Engine State
  const [pricingConfig, setPricingConfig] = useState({
    baseRate: 8500, seasonalMarkupPercent: 15, weekendDiscountPercent: 10, enableSeasonal: true, enableWeekendDiscount: true
  });

  // Calculate pending bookings dynamically
  const pendingCount = bookings.filter(b => b.bookingStatus === 'Pending').length;

  // --- Handlers ---

  const handleBookingStatus = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}`, 
        { bookingStatus: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(prev => prev.map(b => b._id === id ? { ...b, bookingStatus: newStatus } : b));
    } catch (err) {
      alert("Failed to update booking status.");
    }
  };

  const openAddListingModal = () => {
    setListingForm({
      name: '', type: 'Homestay', location: '', roomType: '', basePrice: '', image: '', description: '', amenities: ['Free Wi-Fi', 'Breakfast Included']
    });
    setShowListingModal(true);
  };

  const toggleListingAmenity = (amenity) => {
    setListingForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity) ? prev.amenities.filter(a => a !== amenity) : [...prev.amenities, amenity]
    }));
  };

  const handleSaveListing = async (e) => {
    e.preventDefault();
    if (!listingForm.name || !listingForm.location || !listingForm.basePrice) return;

    const token = localStorage.getItem('token');
    if (!token || !currentUser) {
      alert("Session expired. Please log in again.");
      return;
    }

    try {
      const newListing = {
        ...listingForm,
        hostId: currentUser.id,
        basePrice: Number(listingForm.basePrice)
      };

      const response = await axios.post('http://localhost:5000/api/listings', newListing, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Add the new MongoDB document to the UI immediately
      setListings(prev => [...prev, response.data]);
      setShowListingModal(false);
      alert("Property submitted! It is pending administrator approval.");
    } catch (err) {
      alert("Failed to create property. Ensure your backend is running.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-emerald-950 text-white border-b border-emerald-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-400 text-emerald-950 p-2 rounded-xl shadow">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight">Suba-Arana</span>
                <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-800 text-amber-300 font-semibold">Host Portal</span>
              </div>
              <p className="text-xs text-emerald-300 hidden sm:block">
                Welcome back, {currentUser?.name || 'Host'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={openAddListingModal} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-sm transition cursor-pointer">
              <Plus className="w-4 h-4" /><span>Add Property</span>
            </button>
            <button type="button" onClick={onLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-100 text-xs font-semibold transition cursor-pointer">
              <LogOut className="w-4 h-4" /><span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Properties</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">{listings.length}</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Requests</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-amber-600">{pendingCount}</span>
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">Needs Action</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-slate-200 mb-6 pb-3">
          {[
            { id: 'bookings', label: `Booking Requests (${pendingCount})`, icon: Clock },
            { id: 'listings', label: `My Listings (${listings.length})`, icon: Building2 },
            { id: 'calendar', label: 'Availability & Pricing', icon: Calendar },
            { id: 'financials', label: 'Financials', icon: DollarSign }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${active ? 'bg-emerald-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
              >
                <Icon className="w-4 h-4" /><span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Incoming & Upcoming Bookings</h2>
            
            {isLoading ? (
              <p className="text-sm text-slate-500">Loading bookings from database...</p>
            ) : bookings.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
                No bookings found.
              </div>
            ) : (
              bookings.map((booking) => (
                <div key={booking._id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {booking._id.substring(0, 8).toUpperCase()}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${booking.bookingStatus === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : booking.bookingStatus === 'Declined' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                        {booking.bookingStatus}
                      </span>
                      <span className="text-sm font-bold text-slate-900">{booking.listingId?.name || 'Unknown Property'}</span>
                    </div>

                    <p className="text-xs text-slate-700">
                      <strong>Guest:</strong> {booking.guestId?.fullName || 'Traveler'} • <strong>Dates:</strong> {new Date(booking.checkIn).toLocaleDateString()} to {new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="mr-2">
                      <span className="block text-[11px] uppercase text-slate-400 font-semibold">Total Price</span>
                      <span className="text-base font-bold text-emerald-800">LKR {booking.totalPrice?.toLocaleString() || 0}</span>
                    </div>

                    {booking.bookingStatus === 'Pending' && (
                      <>
                        <button type="button" onClick={() => handleBookingStatus(booking._id, 'Confirmed')} className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                          <Check className="w-3.5 h-3.5" /><span>Accept</span>
                        </button>
                        <button type="button" onClick={() => handleBookingStatus(booking._id, 'Declined')} className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                          <X className="w-3.5 h-3.5" /><span>Decline</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: LISTINGS */}
        {activeTab === 'listings' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-bold text-slate-900">My Property Listings</h2>
              <button type="button" onClick={openAddListingModal} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm cursor-pointer">
                <Plus className="w-4 h-4" /><span>Create New Listing</span>
              </button>
            </div>

            {isLoading ? (
              <p className="text-sm text-slate-500">Loading properties...</p>
            ) : listings.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
                You haven't listed any properties yet. Click "Create New Listing" to start!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {listings.map((item) => (
                  <div key={item._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
                    <div className="relative h-48 bg-slate-200">
                      <img src={item.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80'} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 bg-emerald-950/85 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full">{item.type}</span>
                      <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1 text-xs text-emerald-700 font-semibold mb-1">
                          <MapPin className="w-3.5 h-3.5" /><span>{item.location} • {item.roomType}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-2">{item.name}</h3>
                        <p className="text-xs text-slate-600 mb-3 line-clamp-2">{item.description}</p>
                        
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {item.amenities.map((am) => (
                            <span key={am} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium">{am}</span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-100">
                        <span className="text-base font-bold text-slate-900">LKR {item.basePrice.toLocaleString()}</span>
                        <span className="text-xs text-slate-500"> / night base</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3 & 4: Placeholders for now */}
        {(activeTab === 'calendar' || activeTab === 'financials') && (
           <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
             These modules are disabled in the live MongoDB prototype demo.
           </div>
        )}
      </div>

      {/* CREATE PROPERTY MODAL */}
      {showListingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Add New Property Listing</h3>
              <button type="button" onClick={() => setShowListingModal(false)} className="p-1 cursor-pointer">
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSaveListing} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase text-slate-600 mb-1">Property Name *</label>
                  <input type="text" required value={listingForm.name} onChange={(e) => setListingForm(p => ({ ...p, name: e.target.value }))} placeholder="Hilltop Tea Homestay" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">Property Type</label>
                  <select value={listingForm.type} onChange={(e) => setListingForm(p => ({ ...p, type: e.target.value }))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                    <option value="Homestay">Homestay</option>
                    <option value="Guest House">Guest House</option>
                    <option value="Bungalow">Bungalow</option>
                    <option value="Cabana">Cabana</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">Location *</label>
                  <input type="text" required value={listingForm.location} onChange={(e) => setListingForm(p => ({ ...p, location: e.target.value }))} placeholder="Ella, Kandy..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">Room Type *</label>
                  <input type="text" required value={listingForm.roomType} onChange={(e) => setListingForm(p => ({ ...p, roomType: e.target.value }))} placeholder="Deluxe Double" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">Nightly Price (LKR) *</label>
                  <input type="number" required value={listingForm.basePrice} onChange={(e) => setListingForm(p => ({ ...p, basePrice: e.target.value }))} placeholder="8500" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Image URL</label>
                <input type="url" value={listingForm.image} onChange={(e) => setListingForm(p => ({ ...p, image: e.target.value }))} placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Description</label>
                <textarea rows="2" value={listingForm.description} onChange={(e) => setListingForm(p => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-600 mb-2">Amenities</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AMENITY_OPTIONS.map((amenity) => {
                    const active = listingForm.amenities.includes(amenity);
                    return (
                      <button key={amenity} type="button" onClick={() => toggleListingAmenity(amenity)} className={`py-2 px-2.5 rounded-xl border text-left font-semibold cursor-pointer ${active ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-slate-50 text-slate-700'}`}>
                        {active ? '✓ ' : '+ '}{amenity}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowListingModal(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 font-semibold cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold cursor-pointer">Publish Property</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}