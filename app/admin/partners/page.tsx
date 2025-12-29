'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  Users,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Loader2,
  AlertCircle,
  ExternalLink,
  Building2,
} from 'lucide-react';

interface Partner {
  id: string;
  user_id: string;
  company_name: string;
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  commission_rate: number;
  total_referrals: number;
  total_earnings: number;
  paid_earnings: number;
  pending_earnings: number;
  created_at: string;
  user_name?: string;
  user_email?: string;
  active_leads?: number;
  converted_leads?: number;
  conversion_rate?: number;
  stripe_account_status?: string;
  stripe_payouts_enabled?: boolean;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'active' | 'suspended' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const partnersPerPage = 20;

  const fetchPartners = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        limit: partnersPerPage.toString(),
        offset: ((currentPage - 1) * partnersPerPage).toString(),
      });

      if (searchQuery) {
        params.set('search', searchQuery);
      }
      if (statusFilter !== 'all') {
        params.set('status', statusFilter);
      }

      const response = await fetch(`/api/admin/partners?${params.toString()}`);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please sign in to access this page');
        }
        if (response.status === 403) {
          throw new Error('You do not have permission to view partners');
        }
        throw new Error('Failed to fetch partners');
      }

      const data = await response.json();
      setPartners(data.partners || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setPartners([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter, partnersPerPage]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleApprovePartner = async (partnerId: string, companyName: string) => {
    if (!confirm(`Approve ${companyName}? This will activate their account and send a welcome email.`)) {
      return;
    }

    setProcessingId(partnerId);
    try {
      const response = await fetch(`/api/admin/partners/${partnerId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to approve partner');
      }

      const data = await response.json();
      alert(data.message || 'Partner approved successfully!');
      await fetchPartners();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve partner');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectPartner = async (partnerId: string, companyName: string) => {
    const reason = prompt(`Reject ${companyName}?\n\nOptionally provide a reason for rejection:`);
    if (reason === null) {
      return; // User cancelled
    }

    setProcessingId(partnerId);
    try {
      const response = await fetch(`/api/admin/partners/${partnerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'inactive',
          adminNote: reason || 'Rejected by admin',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject partner');
      }

      alert('Partner rejected successfully');
      await fetchPartners();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject partner');
    } finally {
      setProcessingId(null);
    }
  };

  const totalPages = Math.ceil(total / partnersPerPage);

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      active: 'bg-green-100 text-green-800 border-green-200',
      suspended: 'bg-red-100 text-red-800 border-red-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return styles[status as keyof typeof styles] || styles.inactive;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'suspended':
      case 'inactive':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Calculate stats from current data
  const stats = {
    total: partners.length,
    active: partners.filter(p => p.status === 'active').length,
    pending: partners.filter(p => p.status === 'pending').length,
    totalEarnings: partners.reduce((sum, p) => sum + Number(p.total_earnings || 0), 0),
    pendingEarnings: partners.reduce((sum, p) => sum + Number(p.pending_earnings || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partner Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage partner accounts, approvals, and payouts
          </p>
        </div>
        <button
          onClick={fetchPartners}
          disabled={isLoading}
          className="flex items-center space-x-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error loading partners</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={fetchPartners}
              className="text-sm text-red-600 hover:text-red-800 font-medium mt-2"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg bg-white border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Partners</p>
              <p className="text-2xl font-bold text-gray-900">{total}</p>
            </div>
            <Building2 className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        <div className="rounded-lg bg-white border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Partners</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="rounded-lg bg-white border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="rounded-lg bg-white border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-blue-600">
                ${stats.totalEarnings.toFixed(2)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by company name, contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>

        <div className="flex space-x-1 overflow-x-auto rounded-lg bg-gray-100 p-1">
          {[
            { label: 'All', value: 'all' as const },
            { label: 'Pending', value: 'pending' as const },
            { label: 'Active', value: 'active' as const },
            { label: 'Suspended', value: 'suspended' as const },
            { label: 'Inactive', value: 'inactive' as const },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setCurrentPage(1);
              }}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === tab.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Partners Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Partner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Leads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Conversion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Earnings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Stripe
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto" />
                    <p className="mt-2 text-sm text-gray-500">Loading partners...</p>
                  </td>
                </tr>
              ) : partners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    {error ? 'Unable to load partners' : 'No partners found'}
                  </td>
                </tr>
              ) : (
                partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {partner.company_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {partner.user_email}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusBadge(
                          partner.status
                        )}`}
                      >
                        {getStatusIcon(partner.status)}
                        {partner.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {partner.total_referrals || 0} total
                      </div>
                      <div className="text-xs text-gray-500">
                        {partner.active_leads || 0} active
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {partner.conversion_rate ? `${partner.conversion_rate}%` : '0%'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {partner.converted_leads || 0} converted
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        ${Number(partner.total_earnings || 0).toFixed(2)}
                      </div>
                      <div className="text-xs text-orange-600">
                        ${Number(partner.pending_earnings || 0).toFixed(2)} pending
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {partner.stripe_payouts_enabled ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          Connected
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Not connected</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {partner.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleApprovePartner(partner.id, partner.company_name)}
                              disabled={processingId === partner.id}
                              className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {processingId === partner.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <CheckCircle className="h-3 w-3" />
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectPartner(partner.id, partner.company_name)}
                              disabled={processingId === partner.id}
                              className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {processingId === partner.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              Reject
                            </button>
                          </>
                        ) : (
                          <Link
                            href={`/admin/partners/${partner.id}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700"
                          >
                            View
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium mx-1">
                {(currentPage - 1) * partnersPerPage + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium mx-1">
                {Math.min(currentPage * partnersPerPage, total)}
              </span>{' '}
              of <span className="font-medium mx-1">{total}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isLoading}
                className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || isLoading}
                className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
