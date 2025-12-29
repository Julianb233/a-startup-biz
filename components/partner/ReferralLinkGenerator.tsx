'use client';

import { useState, useEffect } from 'react';
import { Link, Copy, Check, Share2, Mail, ExternalLink, TrendingUp } from 'lucide-react';

interface ReferralStats {
  clicks: number;
  conversions: number;
  revenue: number;
}

interface Service {
  id: string;
  name: string;
  slug: string;
}

const SERVICES: Service[] = [
  { id: 'all', name: 'All Services', slug: '' },
  { id: 'consulting', name: 'Business Consulting', slug: 'consulting' },
  { id: 'formation', name: 'Company Formation', slug: 'formation' },
  { id: 'bookkeeping', name: 'Bookkeeping', slug: 'bookkeeping' },
  { id: 'tax', name: 'Tax Services', slug: 'tax-services' },
  { id: 'legal', name: 'Legal Services', slug: 'legal' },
];

export default function ReferralLinkGenerator() {
  const [partnerCode, setPartnerCode] = useState<string>('');
  const [selectedService, setSelectedService] = useState<Service>(SERVICES[0]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReferralStats>({
    clicks: 0,
    conversions: 0,
    revenue: 0,
  });

  useEffect(() => {
    fetchPartnerProfile();
  }, []);

  const fetchPartnerProfile = async () => {
    try {
      const response = await fetch('/api/partner/profile');
      if (response.ok) {
        const data = await response.json();
        setPartnerCode(data.partner.referral_code || 'PARTNER123');
        // Simulate stats - in production, fetch from API
        setStats({
          clicks: Math.floor(Math.random() * 1000),
          conversions: Math.floor(Math.random() * 50),
          revenue: Math.floor(Math.random() * 10000),
        });
      }
    } catch (error) {
      console.error('Failed to fetch partner profile:', error);
      setPartnerCode('PARTNER123'); // Fallback for demo
    } finally {
      setLoading(false);
    }
  };

  const generateReferralLink = (): string => {
    const baseUrl = 'https://astartupbiz.com';
    if (selectedService.slug) {
      return `${baseUrl}/services/${selectedService.slug}?ref=${partnerCode}`;
    }
    return `${baseUrl}?ref=${partnerCode}`;
  };

  const copyToClipboard = async () => {
    const link = generateReferralLink();
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const generateEmailTemplate = (): string => {
    const link = generateReferralLink();
    const subject = encodeURIComponent('Start Your Business Journey with A Startup Biz');
    const body = encodeURIComponent(
      `Hi there,\n\nI wanted to share this resource with you. A Startup Biz offers comprehensive business services to help entrepreneurs like you succeed.\n\nCheck it out here: ${link}\n\nBest regards`
    );
    return `mailto:?subject=${subject}&body=${body}`;
  };

  const shareViaEmail = () => {
    window.location.href = generateEmailTemplate();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  const referralLink = generateReferralLink();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center gap-2 text-white">
          <Link className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Referral Link Generator</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Service Selector */}
        <div>
          <label htmlFor="service-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Service
          </label>
          <select
            id="service-select"
            value={selectedService.id}
            onChange={(e) => {
              const service = SERVICES.find((s) => s.id === e.target.value);
              if (service) setSelectedService(service);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            {SERVICES.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        {/* Referral Link Display */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Referral Link
          </label>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 font-mono break-all">
              {referralLink}
            </div>
            <button
              onClick={copyToClipboard}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <button
            onClick={shareViaEmail}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-700 font-medium"
          >
            <Mail className="w-4 h-4" />
            Email Template
          </button>
          <a
            href={referralLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-700 font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            Preview Link
          </a>
        </div>

        {/* Referral Code Badge */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium mb-1">Your Referral Code</p>
              <p className="text-2xl font-bold text-blue-900">{partnerCode}</p>
            </div>
            <Share2 className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <p className="text-xs font-medium text-purple-600 uppercase">Clicks</p>
            </div>
            <p className="text-2xl font-bold text-purple-900">{stats.clicks}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <Check className="w-4 h-4 text-green-600" />
              <p className="text-xs font-medium text-green-600 uppercase">Conversions</p>
            </div>
            <p className="text-2xl font-bold text-green-900">{stats.conversions}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <p className="text-xs font-medium text-blue-600 uppercase">Revenue</p>
            </div>
            <p className="text-2xl font-bold text-blue-900">${stats.revenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">💡 Sharing Tips</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Share your link on social media to reach more potential clients</li>
            <li>• Include your referral code in email signatures</li>
            <li>• Create service-specific links for targeted campaigns</li>
            <li>• Track which services perform best and focus your efforts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
