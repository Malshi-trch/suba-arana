import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ShieldCheck, Users, DollarSign, BarChart3, Check, X, Search, LogOut, Trash2, Sliders, TrendingUp, Flag
} from 'lucide-react';

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('moderation');
  const [currentUser, setCurrentUser] = useState(null);

  // 1. DYNAMIC MONGODB STATE: Pending Property Listings
  const [pendingListings, setPendingListings] = useState([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);

  // Fetch Pending Listings on Load
  useEffect(() => {
    const fetchPendingListings = async () => {
      const userStr = localStorage.getItem('user');
      if (userStr) setCurrentUser(JSON.parse(userStr));

      try {
        const response = await axios.get('http://localhost:5000/api/listings/pending');
        setPendingListings(response.data);
      } catch (err) {
        console.error("Failed to load pending listings:", err);
      } finally {
        setIsLoadingListings(false);
      }
    };

    fetchPendingListings();
  }, []);

  // Action Handler: Approve or Reject a Property
  const handleListingDecision = async (id, decision) => {
    try {
      // 'decision' is either 'Approved' or 'Rejected'
      // If Approved, we set the MongoDB status to 'Active' so it appears on the Guest Homepage
      const dbStatus = decision === 'Approved' ? 'Active' : 'Rejected';
      
      await axios.put(`http://localhost:5000/api/listings/${id}`, {
        status: dbStatus
      });

      // Update the UI to show the new status badge
      setPendingListings((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: decision } : item))
      );
      
      alert(`Property successfully ${decision.toLowerCase()}!`);
    } catch (err) {
      alert("Failed to update property status.");
      console.error(err);
    }
  };

  // --- STATIC PLACEHOLDERS FOR OTHER TABS ---
  const [flaggedReviews, setFlaggedReviews] = useState([
    { id: 'REV-881', propertyName: 'Coconut Grove Beach Cabanas', reviewerName: 'kasun_travel99', rating: 1, reason: 'Reported Content: External Spam Link', comment: 'Visit www.cheap-scam-stays-lk.com for 90% discount!!', date: '2026-10-25', status: 'Flagged' }
  ]);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [users, setUsers] = useState([
    { id: 'USR-101', name: 'Nimal Rathnayake', email: 'host@subaarana.lk', role: 'Host', activity: 'Active Properties', status: 'Active', notes: 'Verified NIC' }
  ]);
  const [commissionSettings, setCommissionSettings] = useState({ bookingCommissionPercent: 5, hostAnnualSubscriptionLKR: 12000, zeroCommissionPromoActive: false });
  const [hostPayouts, setHostPayouts] = useState([]);
  const monthlyMetrics = [{ month: 'Oct', visits: 9600, bookings: 312, revenueLKR: 4120000 }];

  const handleReviewDecision = (id, decision) => {
    setFlaggedReviews((prev) => prev.map((rev) => (rev.id === id ? { ...rev, status: decision } : rev)));
  };
  const handleUserStatusChange = (id, newStatus) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u)));
  };
  const handleSaveCommission = (e) => { e.preventDefault(); alert("Commission Settings Saved"); };

  const pendingModerationCount = pendingListings.filter((l) => l.status === 'Pending Approval').length + flaggedReviews.filter((r) => r.status === 'Flagged').length;

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
                Welcome, {currentUser?.name || 'Admin'} • Content Moderation & Governance
              </p>
            </div>
          </div>
          <button type="button" onClick={onLogout} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer">
            <LogOut className="w-4 h-4" /><span>Sign Out</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 mb-6 pb-3">
          {[
            { id: 'moderation', label: `Content Moderation (${pendingModerationCount})`, icon: Flag },
            { id: 'users', label: `User Management`, icon: Users },
            { id: 'financials', label: 'Financial Oversight', icon: DollarSign },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${active ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
                <Icon className="w-4 h-4" /><span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'moderation' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">New Property Listings Pending Approval</h2>
              <p className="text-xs text-slate-500 mb-4">Review host property submissions from the database.</p>

              {isLoadingListings ? (
                <p className="text-sm text-slate-500">Loading pending properties...</p>
              ) : pendingListings.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
                  No properties pending approval.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingListings.map((listing) => {
                    // Populate hostName from MongoDB reference
                    const hostName = listing.hostId?.fullName || 'Unknown Host';
                    
                    return (
                      <div key={listing._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
                        <div className="relative h-44 bg-slate-200">
                          <img src={listing.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'} alt={listing.name} className="w-full h-full object-cover" />
                          <span className="absolute top-3 left-3 bg-slate-900/85 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full">{listing.type}</span>
                          <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${listing.status === 'Approved' || listing.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : listing.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-900'}`}>
                            {listing.status === 'Active' ? 'Approved' : listing.status}
                          </span>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between text-xs text-slate-400 font-mono mb-1">
                              <span>{listing._id.substring(0, 8).toUpperCase()}</span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900">{listing.name}</h3>
                            <p className="text-xs font-semibold text-emerald-700 mb-2">{listing.location} • Host: {hostName}</p>
                            <p className="text-xs text-slate-600 mb-4">{listing.description}</p>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-900">LKR {listing.basePrice?.toLocaleString()} / night</span>
                            <div className="flex gap-2">
                              <button type="button" disabled={listing.status !== 'Pending Approval'} onClick={() => handleListingDecision(listing._id, 'Approved')} className={`px-3.5 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-1 transition ${listing.status === 'Pending Approval' ? 'bg-emerald-700 hover:bg-emerald-800 cursor-pointer' : 'bg-emerald-300 cursor-not-allowed'}`}>
                                <Check className="w-3.5 h-3.5" /><span>Approve</span>
                              </button>
                              <button type="button" disabled={listing.status !== 'Pending Approval'} onClick={() => handleListingDecision(listing._id, 'Rejected')} className={`px-3.5 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-1 transition ${listing.status === 'Pending Approval' ? 'bg-rose-600 hover:bg-rose-700 cursor-pointer' : 'bg-rose-300 cursor-not-allowed'}`}>
                                <X className="w-3.5 h-3.5" /><span>Reject</span>
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

            {/* Static Flagged Reviews Section */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Flagged Guest Reviews</h2>
              <div className="space-y-3 mt-3">
                {flaggedReviews.map((rev) => (
                  <div key={rev.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">{rev.reason}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">{rev.propertyName} • By {rev.reviewerName}</p>
                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 italic">&ldquo;{rev.comment}&rdquo;</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button type="button" onClick={() => handleReviewDecision(rev.id, 'Removed')} className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" /><span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Static placeholders for other tabs */}
        {activeTab !== 'moderation' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            This module is disabled in the current MongoDB prototype demo.
          </div>
        )}
      </div>
    </div>
  );
}