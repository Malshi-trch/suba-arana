import React, { useState } from 'react';
import {
  Home,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Compass,
  Building2,
  MapPin,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function RegisterPage({ onSwitchToLogin }) {
  // Registration is open to Guests (Travelers) and Hosts (Property Owners)
  const [role, setRole] = useState('guest');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    propertyName: '',
    propertyType: 'Homestay',
    location: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all required account fields.');
      return;
    }

    if (role === 'host' && (!formData.propertyName || !formData.location)) {
      setError('Please provide your property name and location to register as a host.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the Suba-Arana Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    // Simulated API registration call (Replace with your backend endpoint later)
    setTimeout(() => {
      setIsLoading(false);
      alert(
        `Account created successfully as ${
          role === 'host' ? 'Property Host' : 'Guest Traveler'
        } (${formData.email})`
      );
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Side: Branding & Role Benefits (Hidden on mobile screens) */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-emerald-900 text-white flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/75 to-emerald-900/40" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-amber-400 text-emerald-950 p-2.5 rounded-xl shadow-lg">
            <Home className="w-7 h-7 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Suba-Arana</h1>
            <p className="text-xs text-emerald-200 uppercase tracking-widest">
              Localized Direct Booking Network
            </p>
          </div>
        </div>

        {/* Dynamic Value Proposition based on selected role */}
        <div className="relative z-10 max-w-md my-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600 text-amber-300 text-xs font-semibold mb-4">
            {role === 'host' ? 'Partner With Us' : 'Join the Community'}
          </span>
          <h2 className="text-3xl font-bold leading-tight mb-4">
            {role === 'host'
              ? 'Advertise Your Homestay or Guest House Directly to Travelers.'
              : 'Discover & Book Authentic Local Stays Across the Island.'}
          </h2>
          <p className="text-emerald-100/90 text-sm leading-relaxed mb-8">
            {role === 'host'
              ? 'Create your host profile to showcase rooms, manage real-time availability calendars, set seasonal pricing, and receive direct booking requests.'
              : 'Create a free traveler account to filter stays by location and budget, chat directly with property owners, and manage all your upcoming trips.'}
          </p>

          <div className="space-y-3 text-sm text-emerald-100">
            {role === 'host' ? (
              <>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Upload high-resolution photos, room types & facility toggles</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Sync availability with iCal to prevent double-bookings</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Track earnings and manage booking requests in one dashboard</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Interactive map search & advanced amenity filtering</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>In-app direct messaging with local hosts before booking</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Secure local & international checkout with verified reviews</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-emerald-300/80 flex justify-between items-center">
          <span>© 2026 Suba-Arana Network</span>
          <span>EC5406 Software Group Project</span>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
          {/* Mobile Brand Header */}
          <div className="flex lg:hidden items-center gap-2.5 mb-5">
            <div className="bg-emerald-700 text-amber-300 p-2 rounded-lg">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Suba-Arana</h1>
              <p className="text-xs text-slate-500">Homestay & Guest House Network</p>
            </div>
          </div>

          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
            <p className="text-sm text-slate-600 mt-1">
              Choose your account type below to get started on Suba-Arana.
            </p>
          </div>

          {/* Role Selector (Guest vs. Property Host) */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRole('guest')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                role === 'guest'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>I want to Book Stays (Guest)</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('host')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                role === 'host'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>I want to List a Property (Host)</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Sign-Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g., Kasun Perera"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                />
              </div>
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Contact Number *
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+94 77 123 4567"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                  />
                </div>
              </div>
            </div>

            {/* Host-Specific Initial Property Fields */}
            {role === 'host' && (
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-4">
                <p className="text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                  Initial Property Details
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Property Name *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="propertyName"
                        value={formData.propertyName}
                        onChange={handleChange}
                        placeholder="e.g., Green Valley Homestay"
                        className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Property Type *
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="Homestay">Homestay</option>
                      <option value="Guest House">Guest House</option>
                      <option value="Bungalow">Bungalow</option>
                      <option value="Cabana">Cabana</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    City / Town Location *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., Ella, Kandy, Galle, Mirissa"
                      className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                  />
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  I agree to the Suba-Arana{' '}
                  <a href="#terms" className="font-semibold text-emerald-700 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#privacy" className="font-semibold text-emerald-700 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <span>Creating account...</span>
              ) : (
                <>
                  <span>
                    {role === 'host' ? 'Create Host Account' : 'Create Traveler Account'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch Back to Login */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Already have a Suba-Arana account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-4 cursor-pointer"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}