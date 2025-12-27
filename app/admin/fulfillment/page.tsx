'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Edit2,
  ChevronDown,
} from 'lucide-react';

interface FulfillmentTask {
  id: string;
  order_id: string;
  type: string;
  status: string;
  assignee?: string | null;
  blockers?: string[] | null;
  automatable: boolean;
  notes?: string | null;
  started_at?: Date | null;
  completed_at?: Date | null;
  created_at: Date;
  order_items?: any;
  user_name?: string;
  user_email?: string;
}

// Mock data
const mockTasks: FulfillmentTask[] = [
  {
    id: '1',
    order_id: 'ORD-001',
    type: 'website',
    status: 'in_progress',
    assignee: 'Tyler Thompson',
    blockers: null,
    automatable: false,
    notes: 'Customer wants custom e-commerce integration',
    started_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    completed_at: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    user_name: 'John Smith',
    user_email: 'john@example.com',
  },
  {
    id: '2',
    order_id: 'ORD-002',
    type: 'crm',
    status: 'queued',
    assignee: null,
    blockers: null,
    automatable: true,
    notes: null,
    started_at: null,
    completed_at: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24),
    user_name: 'Sarah Johnson',
    user_email: 'sarah@example.com',
  },
  {
    id: '3',
    order_id: 'ORD-003',
    type: 'seo',
    status: 'blocked',
    assignee: 'Marcus Reed',
    blockers: ['Waiting for client content', 'Need access to Google Analytics'],
    automatable: false,
    notes: 'Client needs to provide keyword list',
    started_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    completed_at: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    user_name: 'Mike Davis',
    user_email: 'mike@example.com',
  },
  {
    id: '4',
    order_id: 'ORD-004',
    type: 'content',
    status: 'queued',
    assignee: null,
    blockers: null,
    automatable: true,
    notes: null,
    started_at: null,
    completed_at: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12),
    user_name: 'Emily Chen',
    user_email: 'emily@example.com',
  },
];

function getStatusBadge(status: string) {
  const styles = {
    queued: 'bg-gray-100 text-gray-800 border-gray-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    blocked: 'bg-red-100 text-red-800 border-red-200',
  };
  return styles[status as keyof typeof styles] || styles.queued;
}

function getTypeIcon(type: string) {
  const icons = {
    website: '🌐',
    crm: '📊',
    seo: '🔍',
    content: '✍️',
    branding: '🎨',
  };
  return icons[type as keyof typeof icons] || '📦';
}

function formatDate(date: Date | null): string {
  if (!date) return 'Not started';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

export default function FulfillmentQueue() {
  const [tasks, setTasks] = useState<FulfillmentTask[]>(mockTasks);
  const [filteredTasks, setFilteredTasks] = useState<FulfillmentTask[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [assigneeInput, setAssigneeInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [blockersInput, setBlockersInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/fulfillment');
        if (response.ok) {
          const data = await response.json();
          if (data.tasks && data.tasks.length > 0) {
            setTasks(data.tasks);
            setFilteredTasks(data.tasks);
          }
        }
      } catch (error) {
        console.log('Using mock data - API not available');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filter tasks
  useEffect(() => {
    let filtered = tasks;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((task) => task.type === typeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.assignee?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  }, [searchTerm, statusFilter, typeFilter, tasks]);

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/fulfillment/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: newStatus,
                  started_at: newStatus === 'in_progress' && !task.started_at ? new Date() : task.started_at,
                  completed_at: newStatus === 'completed' ? new Date() : null,
                }
              : task
          )
        );
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const updateTaskDetails = async (taskId: string) => {
    try {
      const response = await fetch(`/api/admin/fulfillment/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignee: assigneeInput || null,
          notes: notesInput || null,
          blockers: blockersInput ? blockersInput.split(',').map((b) => b.trim()) : null,
        }),
      });

      if (response.ok) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  assignee: assigneeInput || null,
                  notes: notesInput || null,
                  blockers: blockersInput ? blockersInput.split(',').map((b) => b.trim()) : null,
                }
              : task
          )
        );
        setEditingTask(null);
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const startEditing = (task: FulfillmentTask) => {
    setEditingTask(task.id);
    setAssigneeInput(task.assignee || '');
    setNotesInput(task.notes || '');
    setBlockersInput(task.blockers?.join(', ') || '');
  };

  const statusOptions = [
    { value: 'all', label: 'All Tasks', count: tasks.length },
    {
      value: 'queued',
      label: 'Queued',
      count: tasks.filter((t) => t.status === 'queued').length,
    },
    {
      value: 'in_progress',
      label: 'In Progress',
      count: tasks.filter((t) => t.status === 'in_progress').length,
    },
    {
      value: 'blocked',
      label: 'Blocked',
      count: tasks.filter((t) => t.status === 'blocked').length,
    },
    {
      value: 'completed',
      label: 'Completed',
      count: tasks.filter((t) => t.status === 'completed').length,
    },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'website', label: 'Website' },
    { value: 'crm', label: 'CRM' },
    { value: 'seo', label: 'SEO' },
    { value: 'content', label: 'Content' },
    { value: 'branding', label: 'Branding' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fulfillment Queue</h1>
        <p className="text-gray-600 mt-1">
          Manage and track service fulfillment tasks
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Queued</p>
              <p className="text-2xl font-bold text-gray-900">
                {tasks.filter((t) => t.status === 'queued').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {tasks.filter((t) => t.status === 'in_progress').length}
              </p>
            </div>
            <Package className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Blocked</p>
              <p className="text-2xl font-bold text-red-600">
                {tasks.filter((t) => t.status === 'blocked').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {tasks.filter((t) => t.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order, customer, or assignee..."
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

          {/* Type Filter */}
          <div className="relative">
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <p className="text-gray-600">No tasks found</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getTypeIcon(task.type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {task.type} Setup
                      </h3>
                      <p className="text-sm text-gray-500">
                        Order: {task.order_id} • {task.user_name || 'No customer'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                        task.status
                      )}`}
                    >
                      {task.status.replace('_', ' ')}
                    </span>
                    {task.automatable && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        Automatable
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => startEditing(task)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>

              {editingTask === task.id ? (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assignee
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={assigneeInput}
                        onChange={(e) => setAssigneeInput(e.target.value)}
                        placeholder="Enter assignee name..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      rows={2}
                      placeholder="Add task notes..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blockers (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={blockersInput}
                      onChange={(e) => setBlockersInput(e.target.value)}
                      placeholder="Waiting for content, Need API access..."
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateTaskDetails(task.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTask(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {task.assignee && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Assigned to:</span>
                      <span className="font-medium text-gray-900">{task.assignee}</span>
                    </div>
                  )}
                  {task.notes && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {task.notes}
                    </div>
                  )}
                  {task.blockers && task.blockers.length > 0 && (
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-700 mb-1">Blockers:</p>
                        <ul className="text-sm text-red-600 space-y-1">
                          {task.blockers.map((blocker, idx) => (
                            <li key={idx}>• {blocker}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
                    <span>Created: {formatDate(task.created_at)}</span>
                    {task.started_at && (
                      <span>• Started: {formatDate(task.started_at)}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                {task.status === 'queued' && (
                  <button
                    onClick={() => updateTaskStatus(task.id, 'in_progress')}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Start Task
                  </button>
                )}
                {task.status === 'in_progress' && (
                  <>
                    <button
                      onClick={() => updateTaskStatus(task.id, 'completed')}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => updateTaskStatus(task.id, 'blocked')}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                    >
                      Block
                    </button>
                  </>
                )}
                {task.status === 'blocked' && (
                  <button
                    onClick={() => updateTaskStatus(task.id, 'in_progress')}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Resume
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
