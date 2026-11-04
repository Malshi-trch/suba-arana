import React, { useState } from 'react';
import {
  Home,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Edit3,
  DollarSign,
  Download,
  RefreshCw,
  User,
  MapPin,
  Percent,
  Check,
  X,
  LogOut,
  Sliders,
  Link2,
  Image,
  Phone
} from 'lucide-react';

const AMENITY_OPTIONS = [
  'Free Wi-Fi',
  'Air Conditioning',
  'Breakfast Included',
  'Free Parking',
  'Mountain View',
  'Hot Water',
  'Kitchen Access',
  'Airport Shuttle'
];

export default function HostDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('bookings');

  // 1. STATE: Property Listings (Listing Management)
  const [listings, setListings] = useState([
    {
      id: 1,
      name: 'Nine Arch Misty Homestay',
      type: 'Homestay',
      location: 'Ella',
      roomType: 'Deluxe Double Room',
      basePrice: 8500,
      contact: '+94 77 234 5678',
      status: 'Active',
      image:
        'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=900&q=80',
      description:
        'Family-run hillside homestay overlooking Ella Gap with complimentary home-cooked Sri Lankan breakfast.',
      amenities: ['Free Wi-Fi', 'Breakfast Included', 'Free Parking', 'Mountain View']
    },
    {
      id: 2,
      name: 'Ella Ridge Garden Cottage',
      type: 'Bungalow',
      location: 'Ella',
      roomType: 'Family Garden Suite',
      basePrice: 12000,
      contact: '+94 77 234 5678',
      status: 'Active',
      image:
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=80',
      description:
        'Private two-bedroom cottage surrounded by tea slopes and spice gardens.',
      amenities: ['Free Wi-Fi', 'Free Parking', 'Hot Water', 'Kitchen Access']
    }
  ]);

  const [showListingModal, setShowListingModal] = useState(false);
  const [editingListingId, setEditingListingId] = useState(null);
  const [listingForm, setListingForm] = useState({
    name: '',
    type: 'Homestay',
    location: '',
    roomType: '',
    basePrice: '',
    contact: '',
    image: '',
    description: '',
    amenities: ['Free Wi-Fi', 'Breakfast Included']
  });

  // 2. STATE: Incoming Booking Requests (Booking Management)
  const [bookings, setBookings] = useState([
    {
      id: 'BK-2041',
      guestName: 'Amaya Senanayake',
      guestEmail: 'amaya.s@example.com',
      guestPhone: '+94 71 987 6543',
      guestVerified: true,
      completedStays: 4,
      propertyName: 'Nine Arch Misty Homestay',
      roomType: 'Deluxe Double Room',
      checkIn: '2026-11-05',
      checkOut: '2026-11-08',
      nights: 3,
      totalPrice: 25500,
      status: 'Pending',
      notes: 'Arriving by afternoon train from Kandy around 3:30 PM.'
    },
    {
      id: 'BK-2042',
      guestName: 'Daniel Rossi',
      guestEmail: 'd.rossi@example.it',
      guestPhone: '+39 347 112 2334',
      guestVerified: true,
      completedStays: 2,
      propertyName: 'Ella Ridge Garden Cottage',
      roomType: 'Family Garden Suite',
      checkIn: '2026-11-12',
      checkOut: '2026-11-15',
      nights: 3,
      totalPrice: 36000,
      status: 'Pending',
      notes: 'Would love vegetarian Sri Lankan breakfast options if possible.'
    },
    {
      id: 'BK-2038',
      guestName: 'Tharindu Perera',
      guestEmail: 'tharindu.p@example.lk',
      guestPhone: '+94 77 555 8219',
      guestVerified: true,
      completedStays: 7,
      propertyName: 'Nine Arch Misty Homestay',
      roomType: 'Deluxe Double Room',
      checkIn: '2026-10-28',
      checkOut: '2026-10-30',
      nights: 2,
      totalPrice: 17000,
      status: 'Confirmed',
      notes: 'Celebrating our anniversary!'
    }
  ]);

  const [selectedGuestProfile, setSelectedGuestProfile] = useState(null);
  const [modifyingBooking, setModifyingBooking] = useState(null);

  // 3. STATE: Availability Calendar, iCal Sync & Pricing Engine
  const [selectedCalendarProperty, setSelectedCalendarProperty] = useState(1);
  const [icalUrl, setIcalUrl] = useState('https://www.airbnb.com/calendar/ical/89432109.ics');
  const [lastSynced, setLastSynced] = useState('Today at 10:15 AM');
  const [isSyncing, setIsSyncing] = useState(false);

  // Pricing Engine state
  const [pricingConfig, setPricingConfig] = useState({
    baseRate: 8500,
    seasonalMarkupPercent: 15,
    weekendDiscountPercent: 10,
    enableSeasonal: true,
    enableWeekendDiscount: true
  });

  // 30-Day Interactive Calendar State ('available', 'booked', 'blocked')
  const [calendarDays, setCalendarDays] = useState(() => {
    const initial = {};
    for (let d = 1; d <= 30; d++) {
      if ([5, 6, 7, 12, 13, 14].includes(d)) {
        initial[d] = 'booked';
      } else if ([19, 20].includes(d)) {
        initial[d] = 'blocked';
      } else {
        initial[d] = 'available';
      }
    }
    return initial;
  });

  // 4. STATE: Financial Dashboard & Payouts
  const payouts = [
    {
      id: 'PO-901',
      date: '2026-10-15',
      bookingRef: 'BK-2019 (3 Nights)',
      property: 'Nine Arch Misty Homestay',
      grossAmount: 25500,
      commission: 0,
      netPayout: 25500,
      status: 'Paid'
    },
    {
      id: 'PO-902',
      date: '2026-10-08',
      bookingRef: 'BK-2011 (4 Nights)',
      property: 'Ella Ridge Garden Cottage',
      grossAmount: 48000,
      commission: 0,
      netPayout: 48000,
      status: 'Paid'
    },
    {
      id: 'PO-903',
      date: '2026-10-28',
      bookingRef: 'BK-2038 (2 Nights)',
      property: 'Nine Arch Misty Homestay',
      grossAmount: 17000,
      commission: 0,
      netPayout: 17000,
      status: 'Scheduled'
    }
  ];

  // --- HANDLERS ---

  // Booking Actions: Accept / Decline / Modify
  const handleBookingStatus = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  const handleSaveModifiedBooking = (e) => {
    e.preventDefault();
    setBookings((prev) =>
      prev.map((b) => (b.id === modifyingBooking.id ? modifyingBooking : b))
    );
    setModifyingBooking(null);
  };

  // Listing Actions: Open Add/Edit Modal & Save
  const openAddListingModal = () => {
    setEditingListingId(null);
    setListingForm({
      name: '',
      type: 'Homestay',
      location: '',
      roomType: '',
      basePrice: '',
      contact: '+94 ',
      image:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
      description: '',
      amenities: ['Free Wi-Fi', 'Breakfast Included']
    });
    setShowListingModal(true);
  };

  const openEditListingModal = (listing) => {
    setEditingListingId(listing.id);
    setListingForm({
      name: listing.name,
      type: listing.type,
      location: listing.location,
      roomType: listing.roomType,
      basePrice: listing.basePrice,
      contact: listing.contact,
      image: listing.image,
      description: listing.description,
      amenities: listing.amenities
    });
    setShowListingModal(true);
  };

  const toggleListingAmenity = (amenity) => {
    setListingForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSaveListing = (e) => {
    e.preventDefault();
    if (!listingForm.name || !listingForm.location || !listingForm.basePrice) return;

    if (editingListingId) {
      setListings((prev) =>
        prev.map((item) =>
          item.id === editingListingId
            ? { ...item, ...listingForm, basePrice: Number(listingForm.basePrice) }
            : item
        )
      );
    } else {
      const newListing = {
        ...listingForm,
        id: Date.now(),
        basePrice: Number(listingForm.basePrice),
        status: 'Active'
      };
      setListings((prev) => [...prev, newListing]);
    }
    setShowListingModal(false);
  };

  // Calendar Actions
  const toggleDayStatus = (day) => {
    setCalendarDays((prev) => {
      const current = prev[day];
      const next =
        current === 'available'
          ? 'blocked'
          : current === 'blocked'
          ? 'booked'
          : 'available';
      return { ...prev, [day]: next };
    });
  };

  const handleSyncIcal = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSynced('Just now (Synced with Airbnb & Booking.com)');
      // Block day 24 & 25 to demonstrate external iCal import
      setCalendarDays((prev) => ({ ...prev, 24: 'blocked', 25: 'blocked' }));
    }, 900);
  };

  // Compute effective weekend and peak rates in Pricing Engine
  const calculatedPeakRate = Math.round(
    pricingConfig.baseRate *
      (1 + (pricingConfig.enableSeasonal ? pricingConfig.seasonalMarkupPercent / 100 : 0))
  );
  const calculatedWeekendRate = Math.round(
    pricingConfig.baseRate *
      (1 -
        (pricingConfig.enableWeekendDiscount
          ? pricingConfig.weekendDiscountPercent / 100
          : 0))
  );

  // Tax-Ready CSV Report Download
  const handleDownloadTaxReport = () => {
    const headers = ['Payout ID,Date,Booking Ref,Property,Gross LKR,Commission LKR,Net LKR,Status'];
    const rows = payouts.map(
      (p) =>
        `${p.id},${p.date},"${p.bookingRef}","${p.property}",${p.grossAmount},${p.commission},${p.netPayout},${p.status}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Suba_Arana_Host_Tax_Report_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Host Header */}
      <header className="bg-emerald-950 text-white border-b border-emerald-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-400 text-emerald-950 p-2 rounded-xl shadow">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight">Suba-Arana</span>
                <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-800 text-amber-300 font-semibold">
                  Host Portal
                </span>
              </div>
              <p className="text-xs text-emerald-300 hidden sm:block">
                Welcome back, Nimal Rathnayake • Verified Property Owner
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openAddListingModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Property</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-100 text-xs font-semibold transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Properties
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">{listings.length}</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                All Verified
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pending Requests
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-amber-600">{pendingCount}</span>
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                Needs Action
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              October Earnings
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">LKR 90,500</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                0% Commission
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              iCal Sync Status
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-sm font-bold text-slate-800 truncate">{lastSynced}</span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md shrink-0">
                Connected
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 mb-6 pb-3">
          {[
            { id: 'bookings', label: `Booking Requests (${pendingCount})`, icon: Clock },
            { id: 'listings', label: `My Listings (${listings.length})`, icon: Building2 },
            { id: 'calendar', label: 'Availability Calendar & Pricing', icon: Calendar },
            { id: 'financials', label: 'Financial Dashboard', icon: DollarSign }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  active
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: BOOKING MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Incoming & Upcoming Bookings
                </h2>
                <p className="text-xs text-slate-500">
                  Accept, decline, or modify incoming guest booking requests and inspect guest profiles.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {booking.id}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          booking.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : booking.status === 'Declined'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {booking.propertyName}
                      </span>
                      <span className="text-xs text-slate-500">• {booking.roomType}</span>
                    </div>

                    <p className="text-xs text-slate-700">
                      <strong>Guest:</strong> {booking.guestName} ({booking.guestPhone}) •{' '}
                      <strong>Dates:</strong> {booking.checkIn} to {booking.checkOut} (
                      {booking.nights} nights)
                    </p>

                    <p className="text-xs text-slate-500 italic">
                      &ldquo;{booking.notes}&rdquo;
                    </p>
                  </div>

                  {/* Right Side: Total Price & Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="mr-2">
                      <span className="block text-[11px] uppercase text-slate-400 font-semibold">
                        Direct Payout
                      </span>
                      <span className="text-base font-bold text-emerald-800">
                        LKR {booking.totalPrice.toLocaleString()}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedGuestProfile(booking)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Guest Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModifyingBooking({ ...booking })}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Modify</span>
                    </button>

                    {booking.status === 'Pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleBookingStatus(booking.id, 'Confirmed')}
                          className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBookingStatus(booking.id, 'Declined')}
                          className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: LISTING MANAGEMENT */}
        {activeTab === 'listings' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">My Property Listings</h2>
                <p className="text-xs text-slate-500">
                  Create and edit your homestay or guest house profiles, photographs, room types, and amenity toggles.
                </p>
              </div>
              <button
                type="button"
                onClick={openAddListingModal}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Listing</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {listings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col"
                >
                  <div className="relative h-48 bg-slate-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-emerald-950/85 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full">
                      {item.type}
                    </span>
                    <span className="absolute top-3 right-3 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                      {item.status}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-xs text-emerald-700 font-semibold mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>
                          {item.location} • {item.roomType}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-600 mb-3">{item.description}</p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {item.amenities.map((am) => (
                          <span
                            key={am}
                            className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium"
                          >
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-base font-bold text-slate-900">
                          LKR {item.basePrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500"> / night base</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => openEditListingModal(item)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Listing</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AVAILABILITY CALENDAR, ICAL SYNC & PRICING ENGINE */}
        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Interactive Availability Calendar & iCal Sync */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Real-Time Availability Calendar
                  </h2>
                  <p className="text-xs text-slate-500">
                    Click any date to cycle its status between Available, Blocked, and Booked.
                  </p>
                </div>

                <select
                  value={selectedCalendarProperty}
                  onChange={(e) => setSelectedCalendarProperty(Number(e.target.value))}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  {listings.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-emerald-100 border border-emerald-400 inline-block" />
                  Available
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-amber-100 border border-amber-400 inline-block" />
                  Booked (Suba-Arana)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-slate-200 border border-slate-400 inline-block" />
                  Blocked / External iCal
                </span>
              </div>

              {/* 30-Day Grid (November 2026) */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  November 2026
                </h3>
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2.5">
                  {Object.entries(calendarDays).map(([day, status]) => {
                    const isWeekend = Number(day) % 7 === 0 || Number(day) % 7 === 6;
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDayStatus(day)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          status === 'available'
                            ? 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100 text-emerald-950'
                            : status === 'booked'
                            ? 'bg-amber-50 border-amber-300 text-amber-900'
                            : 'bg-slate-100 border-slate-300 text-slate-500'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-bold">Nov {day}</span>
                          {isWeekend && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-white/80 rounded text-slate-600 font-semibold">
                              Wknd
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-semibold capitalize">{status}</div>
                        <div className="text-[10px] opacity-80 mt-0.5">
                          LKR{' '}
                          {(isWeekend
                            ? calculatedWeekendRate
                            : pricingConfig.baseRate
                          ).toLocaleString()}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* iCal Synchronization Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      iCal Calendar Synchronization (Airbnb / Booking.com)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">Last synced: {lastSynced}</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={icalUrl}
                    onChange={(e) => setIcalUrl(e.target.value)}
                    placeholder="Paste your Airbnb or Booking.com .ics calendar link"
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleSyncIcal}
                    disabled={isSyncing}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync iCal Now'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing Engine */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 h-fit">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sliders className="w-4 h-4 text-emerald-700" />
                <h2 className="text-base font-bold text-slate-900">Dynamic Pricing Engine</h2>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Base Nightly Rate (LKR)
                </label>
                <input
                  type="number"
                  step="500"
                  value={pricingConfig.baseRate}
                  onChange={(e) =>
                    setPricingConfig((p) => ({ ...p, baseRate: Number(e.target.value) }))
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                />
              </div>

              {/* Seasonal Rate Control */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950">
                    Peak Seasonal Rate (+{pricingConfig.seasonalMarkupPercent}%)
                  </span>
                  <input
                    type="checkbox"
                    checked={pricingConfig.enableSeasonal}
                    onChange={(e) =>
                      setPricingConfig((p) => ({ ...p, enableSeasonal: e.target.checked }))
                    }
                    className="w-4 h-4 accent-emerald-700"
                  />
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={pricingConfig.seasonalMarkupPercent}
                  onChange={(e) =>
                    setPricingConfig((p) => ({
                      ...p,
                      seasonalMarkupPercent: Number(e.target.value)
                    }))
                  }
                  className="w-full accent-emerald-700"
                />
                <p className="text-xs text-emerald-800 font-semibold">
                  Effective Peak Rate: LKR {calculatedPeakRate.toLocaleString()} / night
                </p>
              </div>

              {/* Custom Weekend Discount Control */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950">
                    Custom Weekend Discount (-{pricingConfig.weekendDiscountPercent}%)
                  </span>
                  <input
                    type="checkbox"
                    checked={pricingConfig.enableWeekendDiscount}
                    onChange={(e) =>
                      setPricingConfig((p) => ({
                        ...p,
                        enableWeekendDiscount: e.target.checked
                      }))
                    }
                    className="w-4 h-4 accent-amber-600"
                  />
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="5"
                  value={pricingConfig.weekendDiscountPercent}
                  onChange={(e) =>
                    setPricingConfig((p) => ({
                      ...p,
                      weekendDiscountPercent: Number(e.target.value)
                    }))
                  }
                  className="w-full accent-amber-600"
                />
                <p className="text-xs text-amber-900 font-semibold">
                  Effective Weekend Rate: LKR {calculatedWeekendRate.toLocaleString()} / night
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FINANCIAL DASHBOARD */}
        {activeTab === 'financials' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Earnings & Payout History
                </h2>
                <p className="text-xs text-slate-500">
                  Track your direct booking earnings, view payout status, and download tax-ready CSV statements.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadTaxReport}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Tax-Ready Report (CSV)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-400">
                    <th className="py-3 px-4">Payout ID</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Booking Reference</th>
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Gross Earnings</th>
                    <th className="py-3 px-4">Net Payout</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {payouts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {p.id}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{p.date}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {p.bookingRef}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{p.property}</td>
                      <td className="py-3.5 px-4 text-slate-800">
                        LKR {p.grossAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-800">
                        LKR {p.netPayout.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            p.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: CREATE / EDIT PROPERTY LISTING */}
      {showListingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingListingId ? 'Edit Property Listing' : 'Add New Property Listing'}
              </h3>
              <button
                type="button"
                onClick={() => setShowListingModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveListing} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase text-slate-600 mb-1">
                    Property Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={listingForm.name}
                    onChange={(e) =>
                      setListingForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="e.g., Hilltop Tea Breeze Homestay"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">
                    Property Type
                  </label>
                  <select
                    value={listingForm.type}
                    onChange={(e) =>
                      setListingForm((p) => ({ ...p, type: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Homestay">Homestay</option>
                    <option value="Guest House">Guest House</option>
                    <option value="Bungalow">Bungalow</option>
                    <option value="Cabana">Cabana</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">
                    Location (Town) *
                  </label>
                  <input
                    type="text"
                    required
                    value={listingForm.location}
                    onChange={(e) =>
                      setListingForm((p) => ({ ...p, location: e.target.value }))
                    }
                    placeholder="Ella, Galle, Kandy..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">
                    Room Type *
                  </label>
                  <input
                    type="text"
                    required
                    value={listingForm.roomType}
                    onChange={(e) =>
                      setListingForm((p) => ({ ...p, roomType: e.target.value }))
                    }
                    placeholder="Deluxe Double Room"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">
                    Nightly Price (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={listingForm.basePrice}
                    onChange={(e) =>
                      setListingForm((p) => ({ ...p, basePrice: e.target.value }))
                    }
                    placeholder="8500"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">
                    High-Resolution Photo URL
                  </label>
                  <input
                    type="url"
                    value={listingForm.image}
                    onChange={(e) =>
                      setListingForm((p) => ({ ...p, image: e.target.value }))
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">
                    Host Contact Number
                  </label>
                  <input
                    type="text"
                    value={listingForm.contact}
                    onChange={(e) =>
                      setListingForm((p) => ({ ...p, contact: e.target.value }))
                    }
                    placeholder="+94 77 123 4567"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">
                  Property Description
                </label>
                <textarea
                  rows="2"
                  value={listingForm.description}
                  onChange={(e) =>
                    setListingForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Describe your rooms, nearby attractions, and hospitality..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Amenity Toggles */}
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-2">
                  Amenity & Facility Toggles
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AMENITY_OPTIONS.map((amenity) => {
                    const active = listingForm.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleListingAmenity(amenity)}
                        className={`py-2 px-2.5 rounded-xl border text-left font-semibold transition cursor-pointer ${
                          active
                            ? 'bg-emerald-800 text-white border-emerald-800'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {amenity}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowListingModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold cursor-pointer"
                >
                  {editingListingId ? 'Save Changes' : 'Publish Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: VIEW GUEST PROFILE */}
      {selectedGuestProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-700">
                  Verified Traveler Profile
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedGuestProfile.guestName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGuestProfile(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold text-slate-800">
                  {selectedGuestProfile.guestEmail}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-semibold text-slate-800">
                  {selectedGuestProfile.guestPhone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Completed Suba-Arana Stays:</span>
                <span className="font-bold text-emerald-700">
                  {selectedGuestProfile.completedStays} Verified Stays
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Identity Status:</span>
                <span className="font-semibold text-emerald-700">
                  NIC / Passport Verified ✓
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedGuestProfile(null)}
              className="w-full py-2.5 bg-emerald-800 text-white font-semibold text-xs rounded-xl cursor-pointer"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: MODIFY BOOKING REQUEST */}
      {modifyingBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-700">
                  Modify Booking ({modifyingBooking.id})
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {modifyingBooking.guestName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModifyingBooking(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModifiedBooking} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">
                  Check-In Date
                </label>
                <input
                  type="date"
                  value={modifyingBooking.checkIn}
                  onChange={(e) =>
                    setModifyingBooking((p) => ({ ...p, checkIn: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">
                  Check-Out Date
                </label>
                <input
                  type="date"
                  value={modifyingBooking.checkOut}
                  onChange={(e) =>
                    setModifyingBooking((p) => ({ ...p, checkOut: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">
                  Adjusted Total Price (LKR)
                </label>
                <input
                  type="number"
                  value={modifyingBooking.totalPrice}
                  onChange={(e) =>
                    setModifyingBooking((p) => ({
                      ...p,
                      totalPrice: Number(e.target.value)
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setModifyingBooking(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold cursor-pointer"
                >
                  Update Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}