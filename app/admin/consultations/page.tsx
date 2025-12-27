'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  ChevronDown,
} from 'lucide-react';

interface Consultation {
  id: string;
  user_name?: string;
  user_email?: string;
  service_type: string;
  status: string;
  scheduled_at?: Date | null;
  notes?: string | null;
  created_at: Date;
  updated_at: Date;
}

// Mock data
const mockConsultations: Consultation[] = [
  {
    id: '1',
    user_name: 'Mike Davis',
    user_email: 'mike@example.com',
    service_type: 'Website Consultation',
    status: 'scheduled',
    scheduled_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    notes: 'Client wants e-commerce features',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '2',
    user_name: 'Sarah Johnson',
    user_email: 'sarah@example.com',
    service_type: 'SEO Strategy Session',
    status: 'pending',
    scheduled_at: null,
    notes: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: '3',
    user_name: 'John Smith',
    user_email: 'john@example.com',
    service_type: 'CRM Setup Consultation',
    status: 'completed',
    scheduled_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    notes: 'Completed HubSpot setup walkthrough',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
];

function formatDateTime(date: Date | null | undefined): string {
  if (!date) return 'Not scheduled';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

function getStatusBadge(status: string) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };
  return styles[status as keyof typeof styles] || styles.pending;
}

export default function ConsultationsManagement() {
  const [consultations, setConsultations] = useState<Consultation[]>(mockConsultations);
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>(mockConsultations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch consultations from API
  useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/consultations');
        if (response.ok) {
          const data = await response.json();
          if (data.consultations && data.consultations.length > 0) {
            setConsultations(data.consultations);
            setFilteredConsultations(data.consultations);
          }
        }
      } catch (error) {
        console.log('Using mock data - API not available');
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  // Filter consultations
  useEffect(() => {
    let filtered = consultations;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((consultation) => consultation.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (consultation) =>
          consultation.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          consultation.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          consultation.service_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredConsultations(filtered);
  }, [searchTerm, statusFilter, consultations]);

  const updateConsultationStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/consultations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setConsultations((prev) =>
          prev.map((consultation) =>
            consultation.id === id ? { ...consultation, status: newStatus, updated_at: new Date() } : consultation
          )
        );
        if (selectedConsultation?.id === id) {
          setSelectedConsultation({ ...selectedConsultation, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Failed to update consultation status:', error);
    }
  };

  const updateNotes = async () => {
    if (!selectedConsultation) return;

    try {
      const response = await fetch(`/api/admin/consultations/${selectedConsultation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      if (response.ok) {
        setConsultations((prev) =>
          prev.map((consultation) =>
            consultation.id === selectedConsultation.id
              ? { ...consultation, notes, updated_at: new Date() }
              : consultation
          )
        );
        setSelectedConsultation({ ...selectedConsultation, notes });
        setEditingNotes(false);
      }
    } catch (error) {
      console.error('Failed to update notes:', error);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All', count: consultations.length },
    {
      value: 'pending',
      label: 'Pending',
      count: consultations.filter((c) => c.status === 'pending').length,
    },
    {
      value: 'scheduled',
      label: 'Scheduled',
      count: consultations.filter((c) => c.status === 'scheduled').length,
    },
    {
      value: 'completed',
      label: 'Completed',
      count: consultations.filter((c) => c.status === 'completed').length,
    },
    {
      value: 'cancelled',
      label: 'Cancelled',
      count: consultations.filter((c) => c.status === 'cancelled').length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Consultation Management</h1>
        <p className="text-gray-600 mt-1">
          View and manage all consultation requests
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name, email, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Status Summary */}
        <div className="mt-4 flex flex-wrap gap-2">
          {statusOptions.slice(1).map((option) => (
            <button
              key={option.value}
              onClick={() =>
                setStatusFilter(statusFilter === option.value ? 'all' : option.value)
              }
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                statusFilter === option.value
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {option.label}: {option.count}
            </button>
          ))}
        </div>
      </div>

      {/* Consultations Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full p-12 text-center bg-white rounded-lg border">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading consultations...</p>
          </div>
        ) : filteredConsultations.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-lg border">
            <p className="text-gray-600">No consultations found</p>
          </div>
        ) : (
          filteredConsultations.map((consultation) => (
            <motion.div
              key={consultation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => {
                setSelectedConsultation(consultation);
                setNotes(consultation.notes || '');
                setEditingNotes(false);
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {consultation.user_name || 'Guest User'}
                  </h3>
                  <p className="text-sm text-gray-500">{consultation.user_email}</p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                    consultation.status
                  )}`}
                >
                  {consultation.status}
                </span>
              </div>

              {/* Service Type */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900">
                  {consultation.service_type}
                </p>
              </div>

              {/* Schedule */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Calendar className="w-4 h-4" />
                <span>{formatDateTime(consultation.scheduled_at)}</span>
              </div>

              {/* Notes Preview */}
              {consultation.notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {consultation.notes}
                  </p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-4 flex gap-2">
                {consultation.status === 'pending' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateConsultationStatus(consultation.id, 'scheduled');
                    }}
                    className="flex-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    Approve
                  </button>
                )}
                {consultation.status === 'scheduled' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateConsultationStatus(consultation.id, 'completed');
                    }}
                    className="flex-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                  >
                    Complete
                  </button>
                )}
                {(consultation.status === 'pending' || consultation.status === 'scheduled') && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateConsultationStatus(consultation.id, 'cancelled');
                    }}
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedConsultation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedConsultation(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Consultation Details
                    </h2>
                    <p className="text-gray-600 mt-1">#{selectedConsultation.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedConsultation(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Customer Info */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Customer Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium text-gray-900">
                        {selectedConsultation.user_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedConsultation.user_email}
                      </p>
                    </div>
                  </div>

                  {/* Service & Schedule */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Service Type
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-900">
                          {selectedConsultation.service_type}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Scheduled Date
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-900">
                          {formatDateTime(selectedConsultation.scheduled_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(
                        selectedConsultation.status
                      )}`}
                    >
                      {selectedConsultation.status}
                    </span>
                  </div>

                  {/* Notes */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-500">
                        Meeting Notes
                      </h3>
                      {!editingNotes && (
                        <button
                          onClick={() => setEditingNotes(true)}
                          className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      )}
                    </div>
                    {editingNotes ? (
                      <div>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={4}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Add meeting notes..."
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={updateNotes}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingNotes(false);
                              setNotes(selectedConsultation.notes || '');
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
                        <p className="text-gray-900 whitespace-pre-wrap">
                          {selectedConsultation.notes || 'No notes yet'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    {selectedConsultation.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            updateConsultationStatus(selectedConsultation.id, 'scheduled');
                          }}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve & Schedule
                        </button>
                        <button
                          onClick={() => {
                            updateConsultationStatus(selectedConsultation.id, 'cancelled');
                          }}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {selectedConsultation.status === 'scheduled' && (
                      <button
                        onClick={() => {
                          updateConsultationStatus(selectedConsultation.id, 'completed');
                        }}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
