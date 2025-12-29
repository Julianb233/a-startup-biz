'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Loader2,
  Ban,
  PlayCircle,
  Send,
} from 'lucide-react';

interface Partner {
  id: string;
  company_name: string;
  status: string;
  commission_rate: number;
  total_referrals: number;
  total_earnings: number;
  paid_earnings: number;
  pending_earnings: number;
  created_at: string;
  user_email: string;
  user_name?: string;
  stripe_account_id?: string;
  stripe_account_status?: string;
  stripe_payouts_enabled?: boolean;
  stripe_onboarding_complete?: boolean;
  available_balance?: number;
  pending_balance?: number;
}

interface PartnerStats {
  total_leads: number;
  pending: number;
  contacted: number;
  qualified: number;
  converted: number;
  lost: number;
  total_commission: number;
  paid_commission: number;
  pending_commission: number;
}

interface Lead {
  id: string;
  client_name: string;
  client_email: string;
  service: string;
  status: string;
  commission: number;
  commission_paid: boolean;
  created_at: string;
  converted_at?: string;
}

interface Transaction {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  processed_at?: string;
  description?: string;
  stripe_transfer_id?: string;
  stripe_payout_id?: string;
}

export default function PartnerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const partnerId = params.id as string;

  const [partner, setPartner] = useState<Partner | null>(null);
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [transfers, setTransfers] = useState<Transaction[]>([]);
  const [payouts, setPayouts] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchPartnerDetails();
  }, [partnerId]);

  const fetchPartnerDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/partners/${partnerId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch partner details');
      }

      const data = await response.json();
      setPartner(data.partner);
      setStats(data.partner.stats);
      setLeads(data.partner.recentLeads || []);
      setTransfers(data.partner.transfers || []);
      setPayouts(data.partner.payouts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePartnerStatus = async (newStatus: string, note?: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/partners/${partnerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminNote: note }),
      });

      if (!response.ok) {
        throw new Error('Failed to update partner');
      }

      await fetchPartnerDetails();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update partner');
    } finally {
      setIsUpdating(false);
    }
  };

  const triggerPayout = async (amount: number) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/partners/${partnerId}/payout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create payout');
      }

      await fetchPartnerDetails();
      alert('Payout initiated successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create payout');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (error || !partner) {
    return (
      <div className="p-6">
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-red-800">{error || 'Partner not found'}</p>
          <Link
            href="/admin/partners"
            className="text-red-600 hover:text-red-800 font-medium mt-2 inline-block"
          >
            Back to Partners
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      active: 'bg-green-100 text-green-800 border-green-200',
      suspended: 'bg-red-100 text-red-800 border-red-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return styles[status as keyof typeof styles] || styles.inactive;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/partners"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{partner.company_name}</h1>
            <p className="text-sm text-gray-500">{partner.user_email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {partner.status === 'pending' && (
            <>
              <button
                onClick={() => updatePartnerStatus('active', 'Approved by admin')}
                disabled={isUpdating}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </button>
              <button
                onClick={() => updatePartnerStatus('inactive', 'Rejected by admin')}
                disabled={isUpdating}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </button>
            </>
          )}
          {partner.status === 'active' && (
            <button
              onClick={() => updatePartnerStatus('suspended', 'Suspended by admin')}
              disabled={isUpdating}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              <Ban className="h-4 w-4" />
              Suspend
            </button>
          )}
          {partner.status === 'suspended' && (
            <button
              onClick={() => updatePartnerStatus('active', 'Reactivated by admin')}
              disabled={isUpdating}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <PlayCircle className="h-4 w-4" />
              Reactivate
            </button>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-4">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium capitalize ${getStatusBadge(
            partner.status
          )}`}
        >
          {partner.status}
        </span>
        <span className="text-sm text-gray-500">
          Commission Rate: <strong>{partner.commission_rate}%</strong>
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_leads || 0}</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Converted</p>
              <p className="text-2xl font-bold text-green-600">{stats?.converted || 0}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.total_leads
                  ? `${((stats.converted / stats.total_leads) * 100).toFixed(1)}%`
                  : '0%'}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                ${Number(partner.total_earnings || 0).toFixed(2)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Payout</p>
              <p className="text-2xl font-bold text-orange-600">
                ${Number(partner.pending_earnings || 0).toFixed(2)}
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Stripe Connect Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Stripe Connect Status</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Account Status</p>
            <p className="font-medium">
              {partner.stripe_payouts_enabled ? (
                <span className="text-green-600">Connected & Verified</span>
              ) : partner.stripe_account_id ? (
                <span className="text-yellow-600">Connected (Pending Verification)</span>
              ) : (
                <span className="text-gray-400">Not Connected</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Available Balance</p>
            <p className="font-medium text-lg">
              ${Number(partner.available_balance || 0).toFixed(2)}
            </p>
          </div>
          {partner.stripe_account_id && partner.stripe_payouts_enabled && (
            <div className="md:col-span-2">
              <button
                onClick={() => {
                  const amount = Number(partner.available_balance || 0);
                  if (amount < 1) {
                    alert('Minimum payout is $1.00');
                    return;
                  }
                  if (confirm(`Create payout of $${amount.toFixed(2)}?`)) {
                    triggerPayout(amount);
                  }
                }}
                disabled={isUpdating || !partner.available_balance || partner.available_balance < 1}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                Trigger Payout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                    No leads yet
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {lead.client_name}
                      </div>
                      <div className="text-xs text-gray-500">{lead.client_email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{lead.service}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium capitalize">{lead.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        ${Number(lead.commission).toFixed(2)}
                      </div>
                      {lead.commission_paid && (
                        <span className="text-xs text-green-600">Paid</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Payout History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Stripe ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                    No payouts yet
                  </td>
                </tr>
              ) : (
                payouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(payout.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${Number(payout.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium capitalize">{payout.status}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                      {payout.stripe_payout_id}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
