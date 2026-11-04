import React, { useState } from 'react';
import {
  Home,
  Calendar,
  CheckCircle2,
  CreditCard,
  Wallet,
  Heart,
  MessageSquare,
  Star,
  MapPin,
  LogOut,
  Send,
  ShieldCheck,
  X,
  Compass,
  Trash2,
  Clock
} from 'lucide-react';

export default function GuestDashboard({ onNavigateHome, onLogout }) {
  const [activeTab, setActiveTab] = useState('upcoming');

  // 1. STATE: Upcoming Trips (Includes pending checkout & confirmed bookings)
  const [upcomingTrips, setUpcomingTrips] = useState([
    {
      id: 'BK-2041',
      propertyName: 'Nine Arch Misty Homestay',
      location: 'Ella',
      roomType: 'Deluxe Double Room',
      hostName: 'Nimal Rathnayake',
      hostPhone: '+94 77 234 5678',
      checkIn: '2026-11-12',
      checkOut: '2026-11-15',
      nights: 3,
      totalPrice: 25500,
      bookingStatus: 'Host Approved',
      paymentStatus: 'Awaiting Payment',
      image:
        'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'BK-2049',
      propertyName: 'Rampart Breeze Guest House',
      location: 'Galle',
      roomType: 'Colonial Family Suite',
      hostName: 'Malini de Silva',
      hostPhone: '+94 71 445 9988',
      checkIn: '2026-12-04',
      checkOut: '2026-12-06',
      nights: 2,
      totalPrice: 28000,
      bookingStatus: 'Confirmed',
      paymentStatus: 'Paid via LankaQR',
      image:
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
    }
  ]);

  // 2. STATE: Completed Stays (Booking History & Verified Reviews)
  const [completedStays, setCompletedStays] = useState([
    {
      id: 'BK-1982',
      propertyName: 'Lion Rock Eco Bungalow',
      location: 'Sigiriya',
      roomType: 'Garden Eco Chalet',
      hostName: 'Ruwan Kumara',
      checkIn: '2026-09-14',
      checkOut: '2026-09-16',
      nights: 2,
      totalPrice: 22000,
      reviewed: false,
      rating: 0,
      reviewComment: '',
      image:
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'BK-1920',
      propertyName: 'Lakeview Kandy Rest',
      location: 'Kandy',
      roomType: 'Standard Twin Room',
      hostName: 'Sunil Bandara',
      checkIn: '2026-08-20',
      checkOut: '2026-08-22',
      nights: 2,
      totalPrice: 13000,
      reviewed: true,
      rating: 5,
      reviewComment:
        'Warm hospitality, spotless room, and great views of Kandy Lake right from the balcony!',
      image:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    }
  ]);

  // 3. STATE: Saved Favorite Properties
  const [savedFavorites, setSavedFavorites] = useState([
    {
      id: 101,
      name: 'Coconut Grove Beach Cabanas',
      type: 'Cabana',
      location: 'Mirissa',
      pricePerNight: 12500,
      rating: 4.7,
      image:
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 102,
      name: 'Tea Estate Heritage Guest House',
      type: 'Guest House',
      location: 'Nuwara Eliya',
      pricePerNight: 9500,
      rating: 4.8,
      image:
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    }
  ]);

  // 4. STATE: In-App Direct Messaging Conversations
  const [conversations, setConversations] = useState([
    {
      id: 'CONV-1',
      hostName: 'Nimal Rathnayake',
      propertyName: 'Nine Arch Misty Homestay (Ella)',
      bookingRef: 'BK-2041',
      messages: [
        {
          sender: 'host',
          text: 'Ayubowan Amaya! Your booking request for Nov 12–15 is approved. Let me know what time your train arrives in Ella.',
          time: '10:30 AM'
        },
        {
          sender: 'guest',
          text: 'Thank you Nimal! We are taking the Kandy-Ella train and should arrive by 3:30 PM.',
          time: '10:42 AM'
        }
      ]
    },
    {
      id: 'CONV-2',
      hostName: 'Malini de Silva',
      propertyName: 'Rampart Breeze Guest House (Galle)',
      bookingRef: 'BK-2049',
      messages: [
        {
          sender: 'host',
          text: 'Hello! Payment received. We have reserved ground-floor parking for your car inside the fort gate.',
          time: 'Yesterday'
        }
      ]
    }
  ]);
  const [activeConvId, setActiveConvId] = useState('CONV-1');
  const [newMessage, setNewMessage] = useState('');

  // 5. STATE: Checkout Modal (Local & International Gateways)
  const [checkoutBooking, setCheckoutBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'local_wallet' | 'intl_wallet'
  const [cardDetails, setCardDetails] = useState({
    holderName: 'Amaya Senanayake',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [walletProvider, setWalletProvider] = useState('PayHere / LankaQR');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // 6. STATE: Verified Review Modal
  const [reviewingStay, setReviewingStay] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  // --- HANDLERS ---

  // Process Direct Booking Checkout
  const handleCompletePayment = (e) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    const methodLabel =
      paymentMethod === 'card'
        ? 'Paid via Visa/Mastercard'
        : `Paid via ${walletProvider}`;

    setTimeout(() => {
      setIsProcessingPayment(false);
      setUpcomingTrips((prev) =>
        prev.map((trip) =>
          trip.id === checkoutBooking.id
            ? {
                ...trip,
                bookingStatus: 'Confirmed',
                paymentStatus: methodLabel
              }
            : trip
        )
      );
      setCheckoutBooking(null);
    }, 900);
  };

  // Cancel an Upcoming Trip
  const handleCancelTrip = (id) => {
    setUpcomingTrips((prev) => prev.filter((t) => t.id !== id));
  };

  // Submit Verified Feedback for a Completed Stay
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    setCompletedStays((prev) =>
      prev.map((stay) =>
        stay.id === reviewingStay.id
          ? {
              ...stay,
              reviewed: true,
              rating: reviewRating,
              reviewComment: reviewText
            }
          : stay
      )
    );
    setReviewingStay(null);
    setReviewText('');
    setReviewRating(5);
  };

  // Remove Saved Favorite
  const handleRemoveFavorite = (id) => {
    setSavedFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  // Send In-App Direct Message to Host
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConvId
          ? {
              ...conv,
              messages: [
                ...conv.messages,
                { sender: 'guest', text: newMessage, time: 'Just now' }
              ]
            }
          : conv
      )
    );
    setNewMessage('');
  };

  const activeConversation = conversations.find((c) => c.id === activeConvId);
  const unpaidCount = upcomingTrips.filter(
    (t) => t.paymentStatus === 'Awaiting Payment'
  ).length;
  const unreviewedCount = completedStays.filter((s) => !s.reviewed).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Traveler Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-800 text-amber-400 p-2 rounded-xl shadow-xs">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">
                  Suba-Arana
                </span>
                <span className="text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold">
                  Traveler Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Signed in as Amaya Senanayake • Verified Guest
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs transition cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Stays</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Upcoming Trips
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">
                {upcomingTrips.length}
              </span>
              {unpaidCount > 0 && (
                <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                  {unpaidCount} Ready for Checkout
                </span>
              )}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Completed Stays
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">
                {completedStays.length}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {unreviewedCount} Pending Review
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Saved Favorites
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">
                {savedFavorites.length}
              </span>
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                Wishlist
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Direct Host Chats
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">
                {conversations.length}
              </span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                Active Threads
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 mb-6 pb-3">
          {[
            {
              id: 'upcoming',
              label: `Upcoming Trips & Checkout (${upcomingTrips.length})`,
              icon: Calendar
            },
            {
              id: 'history',
              label: `Booking History & Reviews (${completedStays.length})`,
              icon: Clock
            },
            {
              id: 'favorites',
              label: `Saved Properties (${savedFavorites.length})`,
              icon: Heart
            },
            {
              id: 'messages',
              label: `Direct Host Messages (${conversations.length})`,
              icon: MessageSquare
            }
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

        {/* TAB 1: UPCOMING TRIPS & DIRECT CHECKOUT */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Upcoming Reservations
              </h2>
              <p className="text-xs text-slate-500">
                Complete secure checkout for host-approved requests or message your host directly.
              </p>
            </div>

            {upcomingTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col md:flex-row"
              >
                <div className="md:w-64 h-48 md:h-auto bg-slate-200 shrink-0">
                  <img
                    src={trip.image}
                    alt={trip.propertyName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          {trip.id}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            trip.paymentStatus === 'Awaiting Payment'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {trip.paymentStatus}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {trip.propertyName}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-700">
                        {trip.location} • {trip.roomType} • Host: {trip.hostName} (
                        {trip.hostPhone})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">
                        Total Direct Price ({trip.nights} Nights)
                      </span>
                      <span className="text-lg font-bold text-slate-900">
                        LKR {trip.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div className="text-xs text-slate-600">
                      <strong>Check-In:</strong> {trip.checkIn} •{' '}
                      <strong>Check-Out:</strong> {trip.checkOut}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('messages')}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message Host</span>
                      </button>

                      {trip.paymentStatus === 'Awaiting Payment' ? (
                        <button
                          type="button"
                          onClick={() => setCheckoutBooking(trip)}
                          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Proceed to Secure Checkout</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl">
                          <CheckCircle2 className="w-4 h-4" />
                          Booking Confirmed
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleCancelTrip(trip.id)}
                        className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: BOOKING HISTORY & VERIFIED REVIEWS */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Completed Stays & Verified Reviews
              </h2>
              <p className="text-xs text-slate-500">
                Leave verified ratings and feedback for stays you have completed through Suba-Arana.
              </p>
            </div>

            {completedStays.map((stay) => (
              <div
                key={stay.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row gap-5"
              >
                <img
                  src={stay.image}
                  alt={stay.propertyName}
                  className="w-full md:w-48 h-36 object-cover rounded-xl bg-slate-200 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {stay.id} • Completed Stay ({stay.checkIn} to {stay.checkOut})
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        LKR {stay.totalPrice.toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {stay.propertyName} ({stay.location})
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">
                      {stay.roomType} • Hosted by {stay.hostName}
                    </p>

                    {stay.reviewed ? (
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs">
                        <div className="flex items-center gap-1 text-amber-500 font-bold mb-1">
                          {Array.from({ length: stay.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                            />
                          ))}
                          <span className="text-emerald-900 ml-1">
                            Your Verified Stay Review
                          </span>
                        </div>
                        <p className="text-slate-700 italic">
                          &ldquo;{stay.reviewComment}&rdquo;
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-amber-700 font-medium">
                          You haven&apos;t reviewed this completed stay yet.
                        </span>
                        <button
                          type="button"
                          onClick={() => setReviewingStay(stay)}
                          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>Leave Verified Review</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SAVED FAVORITE PROPERTIES */}
        {activeTab === 'favorites' && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Saved Favorite Properties
              </h2>
              <p className="text-xs text-slate-500">
                Homestays and guest houses you bookmarked for future trips.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedFavorites.map((fav) => (
                <div
                  key={fav.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col"
                >
                  <div className="relative h-48 bg-slate-200">
                    <img
                      src={fav.image}
                      alt={fav.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-emerald-950/85 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full">
                      {fav.type}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {fav.name}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                          {fav.location}
                        </p>
                      </div>
                      <span className="text-xs font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                        ★ {fav.rating}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-base font-bold text-slate-900">
                        LKR {fav.pricePerNight.toLocaleString()}{' '}
                        <span className="text-xs font-normal text-slate-500">
                          / night
                        </span>
                      </span>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveFavorite(fav.id)}
                          className="p-2 rounded-xl border border-slate-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Remove from Saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={onNavigateHome}
                          className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer"
                        >
                          View & Book
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: IN-APP DIRECT HOST MESSAGING */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-3 min-h-[420px]">
            {/* Left Thread List */}
            <div className="border-r border-slate-200 p-4 space-y-2 bg-slate-50/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2 mb-2">
                Host Conversations
              </h3>
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full text-left p-3 rounded-xl transition cursor-pointer ${
                    activeConvId === conv.id
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/70'
                  }`}
                >
                  <div className="font-bold text-xs">{conv.hostName}</div>
                  <div
                    className={`text-[11px] truncate ${
                      activeConvId === conv.id ? 'text-emerald-100' : 'text-slate-500'
                    }`}
                  >
                    {conv.propertyName}
                  </div>
                </button>
              ))}
            </div>

            {/* Right Active Chat Window */}
            <div className="lg:col-span-2 flex flex-col justify-between p-5">
              {activeConversation && (
                <>
                  <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {activeConversation.hostName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {activeConversation.propertyName} • Ref:{' '}
                        {activeConversation.bookingRef}
                      </p>
                    </div>
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold">
                      Direct Host Chat
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto mb-4 pr-1">
                    {activeConversation.messages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`flex ${
                          m.sender === 'guest' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-md rounded-2xl px-4 py-2.5 text-xs ${
                            m.sender === 'guest'
                              ? 'bg-emerald-700 text-white'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          <p>{m.text}</p>
                          <span className="block text-[10px] opacity-70 mt-1 text-right">
                            {m.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Write a message to your host..."
                      className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: SECURE CHECKOUT (LOCAL & INTERNATIONAL PAYMENT GATEWAYS) */}
      {checkoutBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                  Suba-Arana Direct Checkout
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {checkoutBooking.propertyName}
                </h3>
                <p className="text-xs text-slate-500">
                  {checkoutBooking.checkIn} to {checkoutBooking.checkOut} (
                  {checkoutBooking.nights} Nights)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutBooking(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price Summary Breakdown */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 mb-5">
              <div className="flex justify-between">
                <span className="text-slate-500">Room & Host Stay Charges:</span>
                <span className="font-semibold text-slate-800">
                  LKR {checkoutBooking.totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Booking Commission / Middleman Fee:</span>
                <span className="font-semibold text-emerald-700">LKR 0 (Direct)</span>
              </div>
              <div className="border-t border-slate-200 pt-1.5 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Amount Due:</span>
                <span>LKR {checkoutBooking.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Gateway Selector */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Credit / Debit Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                  paymentMethod === 'wallet'
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>Digital Wallets & QR</span>
              </button>
            </div>

            <form onSubmit={handleCompletePayment} className="space-y-3 text-xs">
              {paymentMethod === 'card' ? (
                <>
                  <div>
                    <label className="block font-bold uppercase text-slate-600 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardDetails.holderName}
                      onChange={(e) =>
                        setCardDetails((p) => ({ ...p, holderName: e.target.value }))
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase text-slate-600 mb-1">
                      Card Number (Visa / Mastercard / Amex)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="4532 •••• •••• 8891"
                      value={cardDetails.cardNumber}
                      onChange={(e) =>
                        setCardDetails((p) => ({ ...p, cardNumber: e.target.value }))
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold uppercase text-slate-600 mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="08/29"
                        value={cardDetails.expiry}
                        onChange={(e) =>
                          setCardDetails((p) => ({ ...p, expiry: e.target.value }))
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold uppercase text-slate-600 mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="•••"
                        value={cardDetails.cvv}
                        onChange={(e) =>
                          setCardDetails((p) => ({ ...p, cvv: e.target.value }))
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label className="block font-bold uppercase text-slate-600 mb-1">
                    Select Local or International Digital Wallet
                  </label>
                  {[
                    'PayHere / LankaQR (Sri Lankan Banks)',
                    'FriMi / Genie Digital Wallet',
                    'PayPal / Apple Pay (International Guests)'
                  ].map((provider) => (
                    <label
                      key={provider}
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="walletProvider"
                        checked={walletProvider === provider}
                        onChange={() => setWalletProvider(provider)}
                        className="accent-emerald-700"
                      />
                      <span className="font-semibold text-slate-800">{provider}</span>
                    </label>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full mt-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-md transition cursor-pointer"
              >
                {isProcessingPayment
                  ? 'Processing Secure Payment...'
                  : `Pay LKR ${checkoutBooking.totalPrice.toLocaleString()} & Confirm Stay`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: LEAVE VERIFIED FEEDBACK & RATING */}
      {reviewingStay && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-700">
                  Verified Stay Feedback
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {reviewingStay.propertyName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewingStay(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-2">
                  Overall Rating ({reviewRating} / 5 Stars)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`p-2 rounded-xl border cursor-pointer ${
                        star <= reviewRating
                          ? 'bg-amber-50 border-amber-300 text-amber-500'
                          : 'bg-slate-50 border-slate-200 text-slate-300'
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">
                  Your Review *
                </label>
                <textarea
                  rows="4"
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with the room cleanliness, location, and host hospitality..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm cursor-pointer"
              >
                Publish Verified Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}