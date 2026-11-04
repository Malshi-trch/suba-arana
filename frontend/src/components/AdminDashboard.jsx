import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  DollarSign,
  BarChart3,
  Check,
  X,
  Search,
  LogOut,
  Trash2,
  Sliders,
  TrendingUp,
  Flag
} from 'lucide-react';

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('moderation');

  const [pendingListings, setPendingListings] = useState([
    {
      id: 'PROP-301',
      name: 'Hilltop Cinnamon Villa',
      type: 'Homestay',
      location: 'Bentota',
      hostName: 'Kusal Jayawardena',
      pricePerNight: 9500,
      rooms: 3,
      submittedDate: '2026-10-26',
      status: 'Pending Approval',
      image:
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
      description:
        'Quiet cinnamon estate homestay located 1.2 km from Bentota Beach with homemade breakfast.'
    },
    {
      id: 'PROP-302',
      name: 'Cloud Nine Tea Bungalow',
      type: 'Bungalow',
      location: 'Haputale',
      hostName: 'Dilshan Silva',
      pricePerNight: 13500,
      rooms: 4,
      submittedDate: '2026-10-27',
      status: 'Pending Approval',
      image:
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      description:
        'Colonial-style bungalow perched near Lipton Seat with panoramic southern plains views.'
    }
  ]);

  const [flaggedReviews, setFlaggedReviews] = useState([
    {
      id: 'REV-881',
      propertyName: 'Coconut Grove Beach Cabanas',
      reviewerName: 'kasun_travel99',
      rating: 1,
      reason: 'Reported Content: External Spam Link',
      comment:
        'Do not book here! Visit www.cheap-scam-stays-lk.com for 90% discount vouchers!!',
      date: '2026-10-25',
      status: 'Flagged'
    },
    {
      id: 'REV-884',
      propertyName: 'Lakeview Kandy Rest',
      reviewerName: 'Elena Rostova',
      rating: 2,
      reason: 'Complaint: Check-In & Parking Dispute',
      comment:
        'The host was unreachable for 2 hours during check-in and the driveway was blocked.',
      date: '2026-10-26',
      status: 'Flagged'
    }
  ]);

  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [users, setUsers] = useState([
    {
      id: 'USR-101',
      name: 'Nimal Rathnayake',
      email: 'nimal@subaarana.lk',
      role: 'Host',
      activity: '2 Active Properties',
      status: 'Active',
      notes: 'Verified NIC & Property Ownership'
    },
    {
      id: 'USR-102',
      name: 'Amaya Senanayake',
      email: 'amaya.s@example.com',
      role: 'Guest',
      activity: '4 Completed Stays',
      status: 'Active',
      notes: 'Verified Traveler'
    },
    {
      id: 'USR-103',
      name: 'Rohan FakeStays',
      email: 'rohan.quickcash@tempmail.com',
      role: 'Host',
      activity: '1 Flagged Listing',
      status: 'Suspended',
      notes: 'Multiple guest reports of misleading property photos'
    },
    {
      id: 'USR-104',
      name: 'kasun_travel99',
      email: 'kasun99@spambox.org',
      role: 'Guest',
      activity: '0 Completed Stays',
      status: 'Active',
      notes: 'Flagged for posting promotional spam links in reviews'
    }
  ]);

  const [commissionSettings, setCommissionSettings] = useState({
    bookingCommissionPercent: 5,
    hostAnnualSubscriptionLKR: 12000,
    zeroCommissionPromoActive: false
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  const [hostPayouts, setHostPayouts] = useState([
    {
      id: 'PAY-501',
      hostName: 'Nimal Rathnayake',
      property: 'Nine Arch Misty Homestay',
      grossAmount: 42500,
      netPayout: 40375,
      subscriptionStatus: 'Active (Renews Aug 2027)',
      payoutStatus: 'Pending Release'
    },
    {
      id: 'PAY-502',
      hostName: 'Malini de Silva',
      property: 'Rampart Breeze Guest House',
      grossAmount: 56000,
      netPayout: 53200,
      subscriptionStatus: 'Renewal Due in 5 Days',
      payoutStatus: 'Pending Release'
    }
  ]);

  const monthlyMetrics = [
    { month: 'May', visits: 4200, bookings: 115, revenueLKR: 1450000 },
    { month: 'Jun', visits: 5100, bookings: 142, revenueLKR: 1820000 },
    { month: 'Jul', visits: 6800, bookings: 198, revenueLKR: 2540000 },
    { month: 'Aug', visits: 8400, bookings: 260, revenueLKR: 3380000 },
    { month: 'Sep', visits: 7900, bookings: 235, revenueLKR: 3010000 },
    { month: 'Oct', visits: 9600, bookings: 312, revenueLKR: 4120000 }
  ];

  const handleListingDecision = (id, decision) => {
    setPendingListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: decision } : item))
    );
  };

  const handleReviewDecision = (id, decision) => {
    setFlaggedReviews((prev) =>
      prev.map((rev) => (rev.id === id ? { ...rev, status: decision } : rev))
    );
  };

  const handleUserStatusChange = (id, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
  };

  const handleReleasePayout = (id) => {
    setHostPayouts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, payoutStatus: 'Released' } : p))
    );
  };

  const handleRenewSubscription = (id) => {
    setHostPayouts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, subscriptionStatus: 'Active (Renewed for 2027)' }
          : p
      )
    );
  };

  const handleSaveCommission = (e) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const pendingModerationCount =
    pendingListings.filter((l) => l.status === 'Pending Approval').length +
    flaggedReviews.filter((r) => r.status === 'Flagged').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-400 text-slate-950 p-2 rounded-xl shadow">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight">Suba-Arana</span>
                <span className="text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  System Administrator
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Content Moderation, User Governance, Financial Oversight & Analytics
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 mb-6 pb-3">
          {[
            {
              id: 'moderation',
              label: `Content Moderation (${pendingModerationCount})`,
              icon: Flag
            },
            { id: 'users', label: `User Management (${users.length})`, icon: Users },
            {
              id: 'financials',
              label: 'Financial Oversight & Commissions',
              icon: DollarSign
            },
            { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 }
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
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'moderation' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                New Property Listings Pending Approval
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Review host property submissions and approve or reject them for quality control.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col"
                  >
                    <div className="relative h-44 bg-slate-200">
                      <img
                        src={listing.image}
                        alt={listing.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-slate-900/85 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full">
                        {listing.type}
                      </span>
                      <span
                        className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${
                          listing.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : listing.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {listing.status}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {listing.name}
                        </h3>
                        <p className="text-xs font-semibold text-emerald-700 mb-2">
                          {listing.location} • Host: {listing.hostName} ({listing.rooms}{' '}
                          Rooms)
                        </p>
                        <p className="text-xs text-slate-600 mb-4">
                          {listing.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900">
                          LKR {listing.pricePerNight.toLocaleString()} / night
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleListingDecision(listing.id, 'Approved')}
                            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleListingDecision(listing.id, 'Rejected')}
                            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Flagged Guest Reviews & Reported Content
              </h2>
              <div className="space-y-3 mt-3">
                {flaggedReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          {rev.reason}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          {rev.status}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">
                        {rev.propertyName} • By {rev.reviewerName} ({rev.rating}★)
                      </p>
                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 italic">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleReviewDecision(rev.id, 'Approved')}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        Keep Review
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReviewDecision(rev.id, 'Removed')}
                        className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-900">
                User Account Management
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search user name or email..."
                    className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="All">All Roles</option>
                  <option value="Host">Hosts Only</option>
                  <option value="Guest">Guests Only</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-400">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Activity</th>
                    <th className="py-3 px-4">Notes</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-slate-500">{u.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold">{u.role}</td>
                      <td className="py-3.5 px-4">{u.activity}</td>
                      <td className="py-3.5 px-4 text-slate-600">{u.notes}</td>
                      <td className="py-3.5 px-4 font-bold">{u.status}</td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleUserStatusChange(u.id, 'Active')}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-semibold cursor-pointer"
                        >
                          Restore
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUserStatusChange(u.id, 'Suspended')}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 font-semibold cursor-pointer"
                        >
                          Suspend
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUserStatusChange(u.id, 'Banned')}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 font-semibold cursor-pointer"
                        >
                          Ban
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 h-fit">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sliders className="w-4 h-4 text-emerald-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Commission Settings
                </h2>
              </div>

              {settingsSaved && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  ✓ Commission settings updated!
                </div>
              )}

              <form onSubmit={handleSaveCommission} className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="font-bold uppercase text-slate-600">
                      Booking Commission
                    </label>
                    <span className="font-bold text-emerald-800">
                      {commissionSettings.bookingCommissionPercent}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="1"
                    value={commissionSettings.bookingCommissionPercent}
                    onChange={(e) =>
                      setCommissionSettings((prev) => ({
                        ...prev,
                        bookingCommissionPercent: Number(e.target.value)
                      }))
                    }
                    className="w-full accent-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1.5">
                    Annual Host Fee (LKR)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={commissionSettings.hostAnnualSubscriptionLKR}
                    onChange={(e) =>
                      setCommissionSettings((prev) => ({
                        ...prev,
                        hostAnnualSubscriptionLKR: Number(e.target.value)
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl cursor-pointer"
                >
                  Save Settings
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900">
                Host Payouts & Subscription Renewals
              </h2>
              <div className="space-y-3">
                {hostPayouts.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 text-xs">
                      <div className="font-bold text-sm text-slate-900">
                        {item.property} ({item.payoutStatus})
                      </div>
                      <p className="text-slate-600">
                        Host: {item.hostName} • Net Payout: LKR{' '}
                        {item.netPayout.toLocaleString()}
                      </p>
                      <p className="text-slate-500">
                        Subscription: {item.subscriptionStatus}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleRenewSubscription(item.id)}
                        className="px-3 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-semibold cursor-pointer"
                      >
                        Renew Subscription
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReleasePayout(item.id)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                      >
                        Release Payout
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Platform Traffic, Booking Volume & Revenue
              </h2>
              <TrendingUp className="w-5 h-5 text-emerald-700" />
            </div>

            <div className="space-y-3 pt-2">
              {monthlyMetrics.map((m) => {
                const widthPercent = Math.round((m.bookings / 320) * 100);
                return (
                  <div key={m.month} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-700">{m.month} 2026</span>
                      <span className="text-slate-600">
                        {m.bookings} bookings • {m.visits.toLocaleString()} visits • LKR{' '}
                        {(m.revenueLKR / 1000000).toFixed(2)}M
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${widthPercent}%` }}
                        className="h-full bg-emerald-700 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}