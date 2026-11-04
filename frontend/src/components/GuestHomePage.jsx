import React, { useState, useMemo } from 'react';
import {
  Home,
  Search,
  MapPin,
  Calendar,
  SlidersHorizontal,
  Heart,
  Star,
  Wifi,
  Wind,
  Coffee,
  Car,
  MessageSquare,
  Map,
  LayoutGrid,
  CheckCircle2,
  X,
  BedDouble,
  Navigation,
  User
} from 'lucide-react';

const SAMPLE_PROPERTIES = [
  {
    id: 1,
    name: 'Nine Arch Misty Homestay',
    type: 'Homestay',
    location: 'Ella',
    landmark: '0.8 km from Nine Arch Bridge',
    roomType: 'Deluxe Double Room',
    pricePerNight: 8500,
    rating: 4.9,
    reviews: 64,
    hostName: 'Nimal Rathnayake',
    available: true,
    facilities: ['Free Wi-Fi', 'Breakfast Included', 'Free Parking', 'Mountain View'],
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=900&q=80',
    coordinates: { top: '62%', left: '65%' },
    description: 'Family-run hillside homestay overlooking Ella Gap with complimentary home-cooked Sri Lankan breakfast.'
  },
  {
    id: 2,
    name: 'Rampart Breeze Guest House',
    type: 'Guest House',
    location: 'Galle',
    landmark: '0.3 km from Galle Dutch Fort',
    roomType: 'Colonial Family Suite',
    pricePerNight: 14000,
    rating: 4.8,
    reviews: 92,
    hostName: 'malini de Silva',
    available: true,
    facilities: ['Free Wi-Fi', 'Air Conditioning', 'Breakfast Included'],
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80',
    coordinates: { top: '85%', left: '38%' },
    description: 'Restored heritage guest house within walking distance of the lighthouse, cafes, and rampart walls.'
  },
  {
    id: 3,
    name: 'Coconut Grove Beach Cabanas',
    type: 'Cabana',
    location: 'Mirissa',
    landmark: '0.2 km from Coconut Tree Hill',
    roomType: 'Private Beachfront Cabana',
    pricePerNight: 12500,
    rating: 4.7,
    reviews: 48,
    hostName: 'Chathura Mendis',
    available: true,
    facilities: ['Free Wi-Fi', 'Air Conditioning', 'Free Parking'],
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=80',
    coordinates: { top: '88%', left: '46%' },
    description: 'Quiet wooden cabanas tucked beneath palm trees with direct access to surf breaks and whale watching tours.'
  },
  {
    id: 4,
    name: 'Lakeview Kandy Rest',
    type: 'Homestay',
    location: 'Kandy',
    landmark: '1.1 km from Temple of the Tooth',
    roomType: 'Standard Twin Room',
    pricePerNight: 6500,
    rating: 4.6,
    reviews: 37,
    hostName: 'Sunil Bandara',
    available: true,
    facilities: ['Free Wi-Fi', 'Free Parking', 'Breakfast Included'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
    coordinates: { top: '52%', left: '52%' },
    description: 'Peaceful upper-floor homestay with panoramic views of Kandy Lake and easy tuk-tuk access to town.'
  },
  {
    id: 5,
    name: 'Lion Rock Eco Bungalow',
    type: 'Bungalow',
    location: 'Sigiriya',
    landmark: '1.5 km from Sigiriya Rock Fortress',
    roomType: 'Garden Eco Chalet',
    pricePerNight: 11000,
    rating: 4.9,
    reviews: 81,
    hostName: 'Ruwan Kumara',
    available: true,
    facilities: ['Free Wi-Fi', 'Air Conditioning', 'Breakfast Included', 'Free Parking'],
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=80',
    coordinates: { top: '36%', left: '54%' },
    description: 'Surrounded by lush forest gardens and birdlife with unobstructed morning views of Sigiriya Rock.'
  },
  {
    id: 6,
    name: 'Tea Estate Heritage Guest House',
    type: 'Guest House',
    location: 'Nuwara Eliya',
    landmark: '1.0 km from Gregory Lake',
    roomType: 'Heated Attic Room',
    pricePerNight: 9500,
    rating: 4.8,
    reviews: 53,
    hostName: 'Pradeep Perera',
    available: true,
    facilities: ['Free Wi-Fi', 'Breakfast Included', 'Free Parking', 'Mountain View'],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
    coordinates: { top: '60%', left: '56%' },
    description: 'Cozy upcountry cottage surrounded by manicured tea gardens, serving fresh Ceylon tea on the veranda.'
  }
];

const FACILITY_OPTIONS = [
  'Free Wi-Fi',
  'Air Conditioning',
  'Breakfast Included',
  'Free Parking',
  'Mountain View'
];

export default function GuestHomePage({ onNavigateToLogin, onNavigateToRegister }) {
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
  const [favorites, setFavorites] = useState([1]);
  const [selectedPropertyForBooking, setSelectedPropertyForBooking] = useState(null);
  const [selectedPropertyForChat, setSelectedPropertyForChat] = useState(null);
  const [chatMessage, setChatMessage] = useState('');

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
    return SAMPLE_PROPERTIES.filter((property) => {
      const matchesLocation =
        property.location.toLowerCase().includes(searchLocation.toLowerCase()) ||
        property.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
        property.landmark.toLowerCase().includes(searchLocation.toLowerCase());

      const matchesType =
        selectedPropertyType === 'All' || property.type === selectedPropertyType;

      const matchesRoom =
        selectedRoomType === 'All' ||
        property.roomType.toLowerCase().includes(selectedRoomType.toLowerCase());

      const matchesPrice = property.pricePerNight <= maxPrice;

      const matchesFacilities = selectedFacilities.every((fac) =>
        property.facilities.includes(fac)
      );

      const matchesFavorites = !showFavoritesOnly || favorites.includes(property.id);

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={resetFilters}>
            <div className="bg-emerald-800 text-amber-400 p-2 rounded-xl shadow-sm">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Suba-Arana
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-full font-medium">
                Direct Booking Network
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                showFavoritesOnly
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  showFavoritesOnly ? 'fill-rose-500 text-rose-500' : 'text-slate-500'
                }`}
              />
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

      {/* Hero Banner & Primary Search Bar */}
      <section className="relative bg-emerald-900 text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1600&q=80')`
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="max-w-2xl mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-semibold mb-3">
              Zero Middleman Commissions • Verified Local Hosts
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              Find Authentic Homestays & Guest Houses Across Sri Lanka
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base">
              Search by town or landmark, compare facilities, chat directly with property owners, and book your stay.
            </p>
          </div>

          {/* Search Bar Grid */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-xl text-slate-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Location / Landmark Input */}
            <div className="lg:col-span-2 relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Location or Landmark
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-emerald-700 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Ella, Galle, Nine Arch Bridge..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Check-in Date */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Check-In
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-emerald-700 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full pl-9 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Check-out Date */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Check-Out
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-emerald-700 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full pl-9 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Room Type Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Room Type
              </label>
              <div className="relative">
                <BedDouble className="w-4 h-4 text-emerald-700 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={selectedRoomType}
                  onChange={(e) => setSelectedRoomType(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
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

      {/* Main Content Area: Sidebar Filters + Property Results */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Filter Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                  <span>Filters</span>
                </div>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                >
                  Reset All
                </button>
              </div>

              {/* Property Type Filter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                  Property Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['All', 'Homestay', 'Guest House', 'Cabana', 'Bungalow'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedPropertyType(type)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold border text-center transition cursor-pointer ${
                        selectedPropertyType === type
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Max Price / Night
                  </label>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    LKR {maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="20000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>LKR 5,000</span>
                  <span>LKR 20,000+</span>
                </div>
              </div>

              {/* Amenities / Facilities Filter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                  Amenities & Facilities
                </label>
                <div className="space-y-2">
                  {FACILITY_OPTIONS.map((facility) => (
                    <label
                      key={facility}
                      className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFacilities.includes(facility)}
                        onChange={() => toggleFacility(facility)}
                        className="w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                      />
                      <span>{facility}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Discovery Results Area */}
          <div className="flex-1">
            {/* Results Header & Map Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {filteredProperties.length}{' '}
                  {filteredProperties.length === 1 ? 'Property' : 'Properties'} Available
                </h2>
                <p className="text-xs text-slate-500">
                  Book directly with verified local hosts with instant confirmation
                </p>
              </div>

              {/* Grid vs Interactive Map View Switcher */}
              <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
                <button
                  type="button"
                  onClick={() => setShowMapView(false)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    !showMapView
                      ? 'bg-emerald-800 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowMapView(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    showMapView
                      ? 'bg-emerald-800 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>Interactive Map</span>
                </button>
              </div>
            </div>

            {/* Interactive Map View Panel (If toggled on) */}
            {showMapView && (
              <div className="mb-6 bg-emerald-950 rounded-2xl p-6 text-white relative overflow-hidden h-80 border border-emerald-800 shadow-lg">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:20px_20px]" />
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-emerald-900/90 px-3 py-1 rounded-full border border-emerald-700">
                      <Navigation className="w-3.5 h-3.5" />
                      Sri Lanka Interactive Radius Discovery
                    </span>
                    <p className="text-xs text-emerald-200 mt-1">
                      Click any price pin below to preview and book the property directly.
                    </p>
                  </div>
                </div>

                {/* Simulated Interactive Property Pins */}
                {filteredProperties.map((prop) => (
                  <button
                    key={prop.id}
                    type="button"
                    onClick={() => setSelectedPropertyForBooking(prop)}
                    style={{ top: prop.coordinates.top, left: prop.coordinates.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 bg-amber-400 hover:bg-white text-emerald-950 font-bold text-xs px-3 py-1.5 rounded-full shadow-lg border-2 border-emerald-900 transition transform hover:scale-110 cursor-pointer"
                  >
                    {prop.location}: LKR {(prop.pricePerNight / 1000).toFixed(1)}k
                  </button>
                ))}
              </div>
            )}

            {/* Property Cards Grid */}
            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-base font-bold text-slate-800 mb-1">
                  No matching stays found
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  Try increasing your maximum price range or clearing some facility filters.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-xl hover:bg-emerald-800 cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property) => {
                  const isFav = favorites.includes(property.id);
                  return (
                    <div
                      key={property.id}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col"
                    >
                      {/* Property Thumbnail */}
                      <div className="relative h-52 w-full bg-slate-200">
                        <img
                          src={property.image}
                          alt={property.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 bg-emerald-950/85 backdrop-blur-xs text-amber-300 text-xs font-semibold px-3 py-1 rounded-full">
                          {property.type}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleFavorite(property.id)}
                          aria-label="Save to favorites"
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md transition cursor-pointer"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
                            }`}
                          />
                        </button>
                        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-800 flex items-center gap-1 shadow-xs">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                          <span>
                            {property.location} • {property.landmark}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <h3 className="font-bold text-base text-slate-900 leading-snug">
                              {property.name}
                            </h3>
                            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-lg shrink-0">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-bold text-slate-800">
                                {property.rating}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                ({property.reviews})
                              </span>
                            </div>
                          </div>

                          <p className="text-xs font-medium text-emerald-800 mb-2">
                            {property.roomType} • Hosted by {property.hostName}
                          </p>

                          <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                            {property.description}
                          </p>

                          {/* Facility Badges */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {property.facilities.map((fac) => (
                              <span
                                key={fac}
                                className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium"
                              >
                                {fac}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Card Footer: Price & Direct Actions */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-lg font-bold text-slate-900">
                              LKR {property.pricePerNight.toLocaleString()}
                            </span>
                            <span className="text-xs text-slate-500"> / night</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedPropertyForChat(property)}
                              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                              title="Message Host Directly"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedPropertyForBooking(property)}
                              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
                            >
                              Book Direct
                            </button>
                          </div>
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

      {/* Modal 1: Direct Booking Request Modal */}
      {selectedPropertyForBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-700">
                  Direct Booking Request
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedPropertyForBooking.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedPropertyForBooking.roomType} • LKR{' '}
                  {selectedPropertyForBooking.pricePerNight.toLocaleString()} / night
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPropertyForBooking(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Property Host:</span>
                <span className="font-semibold text-slate-800">
                  {selectedPropertyForBooking.hostName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Check-In Date:</span>
                <span className="font-semibold text-slate-800">
                  {checkIn || 'Select in search bar (Default: Tomorrow)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Platform Commission:</span>
                <span className="font-semibold text-emerald-700">LKR 0 (Direct to Host)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                alert(
                  `Booking request sent to ${selectedPropertyForBooking.hostName} for ${selectedPropertyForBooking.name}!`
                );
                setSelectedPropertyForBooking(null);
              }}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-md transition cursor-pointer"
            >
              Confirm Booking Request
            </button>
          </div>
        </div>
      )}

      {/* Modal 2: In-App Direct Host Messaging Modal */}
      {selectedPropertyForChat && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-700">
                  Direct Host Messaging
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Chat with {selectedPropertyForChat.hostName}
                </h3>
                <p className="text-xs text-slate-500">{selectedPropertyForChat.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPropertyForChat(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              rows="4"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask about airport pick-up, early check-in, or meal options..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 mb-4"
            />

            <button
              type="button"
              onClick={() => {
                if (!chatMessage.trim()) return;
                alert(
                  `Message sent to ${selectedPropertyForChat.hostName}: "${chatMessage}"`
                );
                setChatMessage('');
                setSelectedPropertyForChat(null);
              }}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-md transition cursor-pointer"
            >
              Send Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
}