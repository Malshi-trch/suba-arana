import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Home, Search, MapPin, Calendar, SlidersHorizontal, Heart, Star, LayoutGrid, Map, CheckCircle2, X, BedDouble, Navigation, User
} from 'lucide-react';

const FACILITY_OPTIONS = [
  'Free Wi-Fi',
  'Air Conditioning',
  'Breakfast Included',
  'Free Parking',
  'Mountain View'
];

export default function GuestHomePage({ onNavigateToLogin, onNavigateToRegister }) {
  // 1. STATE: Dynamic Property Data from MongoDB
  const [properties, setProperties] = useState([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Search & Filter states
  const [searchLocation, setSearchLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('All');
  const [selectedRoomType, setSelectedRoomType] = useState('All');
  const [maxPrice, setMaxPrice] = useState(20000);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [showMapView, setShowMapView] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Interactive User States
  const [favorites, setFavorites] = useState([]);
  const [selectedPropertyForBooking, setSelectedPropertyForBooking] = useState(null);
  const [selectedPropertyForChat, setSelectedPropertyForChat] = useState(null);
  const [chatMessage, setChatMessage] = useState('');

  // 2. Fetch live data from the backend when the component loads
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/listings');
        // Add mock visual coordinates and a default rating for the UI map/cards
        const enrichedData = response.data.map((prop, index) => ({
          ...prop,
          rating: 4.8, 
          reviews: Math.floor(Math.random() * 50) + 10,
          coordinates: { 
            top: `${Math.floor(Math.random() * 50) + 20}%`, 
            left: `${Math.floor(Math.random() * 60) + 20}%` 
          }
        }));
        setProperties(enrichedData);
      } catch (err) {
        setFetchError('Unable to load properties. Ensure the backend server is running.');
      } finally {
        setIsLoadingProperties(false);
      }
    };

    fetchProperties();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleFacility = (facility) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((item) => item !== facility)
        : [...prev, facility]
    );
  };

  // Filtered Properties Computation
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const locationField = property.location || '';
      const nameField = property.name || '';
      
      const matchesLocation =
        locationField.toLowerCase().includes(searchLocation.toLowerCase()) ||
        nameField.toLowerCase().includes(searchLocation.toLowerCase());

      const matchesType =
        selectedPropertyType === 'All' || property.type === selectedPropertyType;

      const roomField = property.roomType || '';
      const matchesRoom =
        selectedRoomType === 'All' ||
        roomField.toLowerCase().includes(selectedRoomType.toLowerCase());

      const matchesPrice = property.basePrice <= maxPrice;

      const propAmenities = property.amenities || [];
      const matchesFacilities = selectedFacilities.every((fac) =>
        propAmenities.includes(fac)
      );

      const matchesFavorites = !showFavoritesOnly || favorites.includes(property._id);

      return (
        matchesLocation &&
        matchesType &&
        matchesRoom &&
        matchesPrice &&
        matchesFacilities &&
        matchesFavorites
      );
    });
  }, [
    properties,
    searchLocation,
    selectedPropertyType,
    selectedRoomType,
    maxPrice,
    selectedFacilities,
    showFavoritesOnly,
    favorites
  ]);

  const resetFilters = () => {
    setSearchLocation('');
    setSelectedPropertyType('All');
    setSelectedRoomType('All');
    setMaxPrice(20000);
    setSelectedFacilities([]);
    setShowFavoritesOnly(false);
  };

  // 3. Handle Direct Booking Request to MongoDB
  const submitBookingRequest = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || user?.role !== 'guest') {
      alert('Please log in as a Traveler to book stays.');
      onNavigateToLogin();
      return;
    }

    if (!checkIn || !checkOut) {
      alert('Please select Check-In and Check-Out dates in the search bar first.');
      return;
    }

    // Calculate nights and price
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const calculatedTotal = selectedPropertyForBooking.basePrice * nights;

    try {
      await axios.post('http://localhost:5000/api/bookings', {
        guestId: user.id,
        listingId: selectedPropertyForBooking._id,
        hostId: selectedPropertyForBooking.hostId,
        checkIn: start,
        checkOut: end,
        totalPrice: calculatedTotal
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      alert(`Booking request sent successfully for ${selectedPropertyForBooking.name}!`);
      setSelectedPropertyForBooking(null);
    } catch (err) {
      alert('Failed to submit booking. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={resetFilters}>
            <div className="bg-emerald-800 text-amber-400 p-2 rounded-xl shadow-sm">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Suba-Arana</span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-full font-medium">
                Direct Booking Network
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                showFavoritesOnly ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
              <span>Saved ({favorites.length})</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="hidden md:inline-flex px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition cursor-pointer"
            >
              List Your Property
            </button>
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm transition cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </header>

      <section className="relative bg-emerald-900 text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1600&q=80')` }} />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="max-w-2xl mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-semibold mb-3">
              Zero Middleman Commissions • Verified Local Hosts
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              Find Authentic Homestays & Guest Houses Across Sri Lanka
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base">
              Search by town, compare facilities, chat directly with property owners, and book your stay.
            </p>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-xl text-slate-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="lg:col-span-2 relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Location / Town</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-emerald-700 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Ella, Galle, Mirissa..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Check-In</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-emerald-700 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full pl-9 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Check-Out</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-emerald-700 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full pl-9 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Room Type</label>
              <div className="relative">
                <BedDouble className="w-4 h-4 text-emerald-700 absolute left-3 top-1/2 -translate-y-1/2" />
                <select value={selectedRoomType} onChange={(e) => setSelectedRoomType(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600">
                  <option value="All">Any Room</option>
                  <option value="Double">Double Room</option>
                  <option value="Family">Family Suite</option>
                  <option value="Twin">Twin Room</option>
                  <option value="Cabana">Private Cabana</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 shrink-0 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                  <span>Filters</span>
                </div>
                <button type="button" onClick={resetFilters} className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer">Reset All</button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">Property Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['All', 'Homestay', 'Guest House', 'Cabana', 'Bungalow'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedPropertyType(type)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${selectedPropertyType === type ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Max Price / Night</label>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">LKR {maxPrice.toLocaleString()}</span>
                </div>
                <input type="range" min="5000" max="20000" step="500" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-emerald-700 cursor-pointer" />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>LKR 5,000</span>
                  <span>LKR 20,000+</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">Amenities & Facilities</label>
                <div className="space-y-2">
                  {FACILITY_OPTIONS.map((facility) => (
                    <label key={facility} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                      <input type="checkbox" checked={selectedFacilities.includes(facility)} onChange={() => toggleFacility(facility)} className="w-4 h-4 rounded border-slate-300 text-emerald-700" />
                      <span>{facility}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {isLoadingProperties ? 'Loading Stays...' : `${filteredProperties.length} Properties Available`}
                </h2>
                <p className="text-xs text-slate-500">Book directly with verified local hosts with instant confirmation</p>
              </div>

              <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200">
                <button type="button" onClick={() => setShowMapView(false)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${!showMapView ? 'bg-emerald-800 text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                  <LayoutGrid className="w-3.5 h-3.5" /><span>Cards</span>
                </button>
                <button type="button" onClick={() => setShowMapView(true)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${showMapView ? 'bg-emerald-800 text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                  <span>Map</span>
                </button>
              </div>
            </div>

            {fetchError && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm font-semibold mb-6">
                {fetchError}
              </div>
            )}

            {showMapView && (
              <div className="mb-6 bg-emerald-950 rounded-2xl p-6 text-white relative overflow-hidden h-80 border border-emerald-800 shadow-lg">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:20px_20px]" />
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-emerald-900/90 px-3 py-1 rounded-full border border-emerald-700">
                    <Navigation className="w-3.5 h-3.5" /> Sri Lanka Interactive Radius Discovery
                  </span>
                </div>
                {filteredProperties.map((prop) => (
                  <button
                    key={prop._id}
                    type="button"
                    onClick={() => setSelectedPropertyForBooking(prop)}
                    style={{ top: prop.coordinates.top, left: prop.coordinates.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 bg-amber-400 hover:bg-white text-emerald-950 font-bold text-xs px-3 py-1.5 rounded-full shadow-lg cursor-pointer"
                  >
                    {prop.location}: LKR {(prop.basePrice / 1000).toFixed(1)}k
                  </button>
                ))}
              </div>
            )}

            {!isLoadingProperties && filteredProperties.length === 0 && !fetchError ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-base font-bold text-slate-800 mb-1">No matching stays found</p>
                <p className="text-xs text-slate-500 mb-4">Try clearing some facility filters or adjusting your price range.</p>
                <button type="button" onClick={resetFilters} className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-xl cursor-pointer">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property) => {
                  const isFav = favorites.includes(property._id);
                  return (
                    <div key={property._id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
                      <div className="relative h-52 w-full bg-slate-200">
                        <img src={property.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80'} alt={property.name} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 bg-emerald-950/85 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full">{property.type}</span>
                        <button type="button" onClick={() => toggleFavorite(property._id)} className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-md cursor-pointer">
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`} />
                        </button>
                        <div className="absolute bottom-3 left-3 bg-white/95 px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-xs">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{property.location}</span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <h3 className="font-bold text-base text-slate-900">{property.name}</h3>
                            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-lg shrink-0">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-bold text-slate-800">{property.rating}</span>
                              <span className="text-[11px] text-slate-500">({property.reviews})</span>
                            </div>
                          </div>
                          <p className="text-xs font-medium text-emerald-800 mb-2">{property.roomType}</p>
                          <p className="text-xs text-slate-600 line-clamp-2 mb-3">{property.description}</p>
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {(property.amenities || []).map((fac) => (
                              <span key={fac} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">{fac}</span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-lg font-bold text-slate-900">LKR {property.basePrice.toLocaleString()}</span>
                            <span className="text-xs text-slate-500"> / night</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedPropertyForBooking(property)}
                            className="px-4 py-2.5 bg-emerald-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
                          >
                            Book Direct
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {selectedPropertyForBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-700">Direct Booking Request</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedPropertyForBooking.name}</h3>
                <p className="text-xs text-slate-500">{selectedPropertyForBooking.roomType} • LKR {selectedPropertyForBooking.basePrice.toLocaleString()} / night</p>
              </div>
              <button type="button" onClick={() => setSelectedPropertyForBooking(null)} className="p-1 cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Check-In:</span>
                <span className="font-semibold text-slate-800">{checkIn || 'Not Selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Check-Out:</span>
                <span className="font-semibold text-slate-800">{checkOut || 'Not Selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Platform Commission:</span>
                <span className="font-semibold text-emerald-700">LKR 0 (Direct to Host)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={submitBookingRequest}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl cursor-pointer"
            >
              Confirm Booking Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}