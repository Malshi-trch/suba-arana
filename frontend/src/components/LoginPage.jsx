import React, { useState } from 'react';
import { 
  Home, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Compass, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function LoginPage({ onSwitchToRegister }) {
  // Roles based on Suba-Arana requirements: guest, host, admin
  const [role, setRole] = useState('guest');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roleDetails = {
    guest: {
      label: 'Guest',
      icon: Compass,
      subtitle: 'Discover, compare, and directly book local homestays & guest houses.',
      placeholderEmail: 'traveler@example.com',
    },
    host: {
      label: 'Property Host',
      icon: Building2,
      subtitle: 'Manage your property listings, availability calendar, and bookings.',
      placeholderEmail: 'host@subaarana.lk',
    },
    admin: {
      label: 'Administrator',
      icon: ShieldCheck,
      subtitle: 'Oversee platform listings, user accounts, and system analytics.',
      placeholderEmail: 'admin@subaarana.lk',
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    // Simulated API login call (Replace with your backend endpoint later)
    setTimeout(() => {
      setIsLoading(false);
      alert(`Logged in successfully as ${roleDetails[role].label} (${email})`);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Side: Branding & Platform Overview (Hidden on small mobile screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-emerald-900 text-white flex-col justify-between p-12 overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1400&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/70 to-emerald-900/40" />

        {/* Top Brand Header */}
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

        {/* Center Value Proposition */}
        <div className="relative z-10 max-w-lg my-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600 text-amber-300 text-xs font-semibold mb-4">
            Supporting Local Tourism
          </span>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Authentic Homestays & Guest Houses, Booked Directly.
          </h2>
          <p className="text-emerald-100/90 text-base leading-relaxed mb-8">
            Connect directly with local accommodation providers across the island without middleman barriers. Compare facilities, check real-time availability, and book with confidence.
          </p>

          <div className="space-y-3 text-sm text-emerald-100">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Direct messaging & verified guest reviews</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Interactive map search & transparent local pricing</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Real-time calendar sync & instant booking management</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-emerald-300/80 flex justify-between items-center">
          <span>© 2026 Suba-Arana Network. All rights reserved.</span>
          <span>EC5406 Software Group Project</span>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          {/* Mobile Brand Header */}
          <div className="flex lg:hidden items-center gap-2.5 mb-6">
            <div className="bg-emerald-700 text-amber-300 p-2 rounded-lg">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Suba-Arana</h1>
              <p className="text-xs text-slate-500">Homestay & Guest House Network</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-sm text-slate-600 mt-1">
              {roleDetails[role].subtitle}
            </p>
          </div>

          {/* Role Switcher Tabs (Guest, Host, Admin) */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl mb-6">
            {Object.entries(roleDetails).map(([key, item]) => {
              const IconComponent = item.icon;
              const isSelected = role === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRole(key)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={roleDetails[role].placeholderEmail}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <a
                  href="#forgot-password"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                />
                <span className="text-xs text-slate-600">Keep me signed in</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign in as {roleDetails[role].label}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration Prompt (For Guests & Hosts) */}
          {role !== 'admin' && (
            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-600">
                {role === 'host'
                  ? 'Want to advertise your homestay or guest house?'
                  : 'New to Suba-Arana?'}{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-4 cursor-pointer"
                >
                  {role === 'host' ? 'Create a Host Account' : 'Create a Traveler Account'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}