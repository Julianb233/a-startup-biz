import Link from 'next/link';
import {
  ClipboardList,
  Eye,
  Mail,
  Phone,
  Calendar,
  Building2,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { getAllOnboardingSubmissions, updateOnboardingStatus } from '@/lib/db-queries';

interface OnboardingSubmission {
  id: string;
  user_id: string | null;
  business_name: string;
  business_type: string;
  business_stage: string;
  goals: string[];
  challenges: string[];
  contact_email: string;
  contact_phone: string | null;
  timeline: string | null;
  budget_range: string | null;
  additional_info: string | null;
  status: 'submitted' | 'reviewed' | 'in_progress' | 'completed';
  created_at: Date;
  updated_at: Date;
  user_name?: string;
  user_email?: string;
}

// Mock data for when database is not available
const mockSubmissions: OnboardingSubmission[] = [
  {
    id: '1',
    user_id: null,
    business_name: 'TechStart Solutions',
    business_type: 'technology',
    business_stage: 'startup',
    goals: ['Launch MVP', 'Get first customers'],
    challenges: ['Limited funding'],
    contact_email: 'john@techstart.com',
    contact_phone: '(555) 123-4567',
    timeline: '3-6 months',
    budget_range: '$5,000-$10,000',
    additional_info: null,
    status: 'submitted',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '2',
    user_id: null,
    business_name: 'Green Garden Co.',
    business_type: 'retail',
    business_stage: 'growth',
    goals: ['Expand online presence', 'Increase sales'],
    challenges: ['Marketing strategy'],
    contact_email: 'sarah@greengarden.com',
    contact_phone: '(555) 987-6543',
    timeline: '1-3 months',
    budget_range: '$2,500-$5,000',
    additional_info: null,
    status: 'reviewed',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  {
    id: '3',
    user_id: null,
    business_name: 'Fitness First Studios',
    business_type: 'health',
    business_stage: 'established',
    goals: ['New location opening', 'Staff training'],
    challenges: ['Operations scaling'],
    contact_email: 'mike@fitnessfirst.com',
    contact_phone: null,
    timeline: '6+ months',
    budget_range: '$10,000+',
    additional_info: null,
    status: 'in_progress',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

function getStatusBadge(status: string) {
  const styles = {
    submitted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
    in_progress: 'bg-purple-100 text-purple-800 border-purple-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
  };
  return styles[status as keyof typeof styles] || styles.submitted;
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'submitted':
      return <AlertCircle className="w-4 h-4" />;
    case 'reviewed':
      return <Eye className="w-4 h-4" />;
    case 'in_progress':
      return <Clock className="w-4 h-4" />;
    case 'completed':
      return <CheckCircle2 className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export default async function AdminOnboardingPage() {
  let submissions: OnboardingSubmission[] = mockSubmissions;
  let total = mockSubmissions.length;

  try {
    const result = await getAllOnboardingSubmissions({ limit: 50 });
    if (result.submissions && result.submissions.length > 0) {
      submissions = result.submissions as OnboardingSubmission[];
      total = result.total;
    }
  } catch (error) {
    console.log('Using mock data - database not available:', error);
  }

  const statusCounts = {
    submitted: submissions.filter((s) => s.status === 'submitted').length,
    reviewed: submissions.filter((s) => s.status === 'reviewed').length,
    in_progress: submissions.filter((s) => s.status === 'in_progress').length,
    completed: submissions.filter((s) => s.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Onboarding Submissions</h1>
          <p className="text-gray-600 mt-1">
            Manage customer intake forms and track their onboarding progress
          </p>
        </div>
        <Link
          href="/onboarding"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Onboarding Page
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.submitted}</p>
              <p className="text-sm text-gray-600">New Submissions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.reviewed}</p>
              <p className="text-sm text-gray-600">Reviewed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.in_progress}</p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.completed}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Submissions</h2>
          <p className="text-sm text-gray-500">{total} total submissions</p>
        </div>

        {submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timeline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {submission.business_name}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            {submission.business_type} • {submission.business_stage}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <a
                          href={`mailto:${submission.contact_email}`}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <Mail className="w-3 h-3" />
                          {submission.contact_email}
                        </a>
                        {submission.contact_phone && (
                          <a
                            href={`tel:${submission.contact_phone}`}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                          >
                            <Phone className="w-3 h-3" />
                            {submission.contact_phone}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {submission.timeline || 'Not specified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {submission.budget_range || 'Not specified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                          submission.status
                        )}`}
                      >
                        {getStatusIcon(submission.status)}
                        {submission.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getTimeAgo(submission.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/onboarding/${submission.id}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
            <p className="text-gray-500 mb-4">
              When customers complete the onboarding form, their submissions will appear here.
            </p>
            <Link
              href="/onboarding"
              target="_blank"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              View Onboarding Page
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/admin/onboarding?status=submitted"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-colors"
          >
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Review New Submissions</p>
              <p className="text-sm text-gray-500">{statusCounts.submitted} waiting for review</p>
            </div>
          </Link>
          <Link
            href="/admin/onboarding?status=in_progress"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Active Clients</p>
              <p className="text-sm text-gray-500">{statusCounts.in_progress} in progress</p>
            </div>
          </Link>
          <a
            href="mailto:?subject=Welcome to A Startup Biz"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Send Bulk Email</p>
              <p className="text-sm text-gray-500">Contact multiple clients</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
