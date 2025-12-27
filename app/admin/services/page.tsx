import { Briefcase, Plus, Edit, Trash2, Eye, DollarSign } from 'lucide-react';

// Mock services data
const services = [
  {
    id: '1',
    name: 'Business Formation - LLC',
    category: 'Legal',
    price: 1299,
    status: 'active',
    orders: 45,
    description: 'Complete LLC formation with state filing',
  },
  {
    id: '2',
    name: 'Tax Consultation Package',
    category: 'Tax',
    price: 899,
    status: 'active',
    orders: 32,
    description: 'Comprehensive tax planning and consultation',
  },
  {
    id: '3',
    name: 'Trademark Registration',
    category: 'Legal',
    price: 1799,
    status: 'active',
    orders: 28,
    description: 'Federal trademark registration service',
  },
  {
    id: '4',
    name: 'Business Plan Development',
    category: 'Consulting',
    price: 3499,
    status: 'active',
    orders: 15,
    description: 'Professional business plan writing',
  },
  {
    id: '5',
    name: 'Website Development - Starter',
    category: 'Technology',
    price: 4999,
    status: 'active',
    orders: 22,
    description: 'Custom business website with CMS',
  },
];

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage service offerings and pricing
          </p>
        </div>
        <button className="flex items-center space-x-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-orange-100 p-3">
              <Briefcase className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Services
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {services.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-green-100 p-3">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Price</p>
              <p className="text-2xl font-bold text-gray-900">
                $
                {Math.round(
                  services.reduce((sum, s) => sum + s.price, 0) /
                    services.length
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-blue-100 p-3">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Services
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {services.filter((s) => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-purple-100 p-3">
              <Briefcase className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(services.map((s) => s.category)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="rounded-lg bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700 border border-orange-200">
                    {service.category}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 border border-green-200">
                    {service.status}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-gray-900">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {service.description}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${service.price}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Orders</p>
                <p className="text-2xl font-bold text-orange-600">
                  {service.orders}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-2">
              <button className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Edit className="inline h-4 w-4 mr-1" />
                Edit
              </button>
              <button className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
