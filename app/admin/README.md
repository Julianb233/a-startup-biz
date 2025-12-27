# Admin Dashboard

A comprehensive admin backend dashboard for managing the A Startup Biz platform.

## Features

### 1. Dashboard Home (`/admin`)
- Real-time statistics cards (Revenue, Orders, Users, Pending Orders)
- Recent orders overview
- Quick action buttons
- Monthly performance metrics
- Interactive stats with trends

### 2. Orders Management (`/admin/orders`)
- Complete order listing with search and filter
- Status-based tabs (All, Pending, Processing, Completed, Cancelled)
- Pagination support
- Export functionality (UI ready)
- Order details with customer info
- Payment method tracking
- Color-coded status indicators

### 3. Users Management (`/admin/users`)
- User directory with role-based filtering
- Search by name or email
- User stats dashboard
- Role management (Admin, Moderator, User)
- Order history per user
- Lifetime value tracking
- Avatar display with initials

### 4. Services Management (`/admin/services`)
- Service catalog display
- Category organization
- Pricing management
- Order count per service
- Active/inactive status
- Edit and delete actions (UI ready)

### 5. Settings (`/admin/settings`)
- General configuration
- Notification preferences
- Security settings
- Payment gateway configuration
- System information
- Danger zone for critical actions

## Design System

### Colors
- **Primary**: Orange (#ff6a1a) - Brand color for primary actions
- **Sidebar**: Dark gray (#1f2937) - Professional admin sidebar
- **Content**: White background with light borders
- **Accents**: Status-based colors (green, blue, yellow, red)

### Layout
- Fixed sidebar navigation (64px width)
- Sticky top header
- Responsive grid layouts
- Card-based UI components
- Professional table layouts

## Authentication & Authorization

### Protected Routes
All admin routes are protected with:
1. **Authentication Check** - Must be signed in via Clerk
2. **Role Check** - Must have 'admin' role in Clerk metadata

### Access Control
```typescript
// Implemented in layout.tsx
await requireAuth('/sign-in');  // Redirect to sign-in if not authenticated
const isAdmin = await checkRole('admin');  // Check for admin role
if (!isAdmin) {
  redirect('/dashboard');  // Redirect non-admins to regular dashboard
}
```

### Setting Admin Role
To give a user admin access, update their Clerk metadata:
```json
{
  "metadata": {
    "role": "admin"
  }
}
```

## Mock Data

All data is currently mocked in `/lib/admin-data.ts`. This includes:

- **Orders**: 8 sample orders with various statuses
- **Users**: 8 sample users with different roles
- **Dashboard Stats**: Real-time metrics
- **Revenue Data**: 6 months of revenue/order data

### Helper Functions
```typescript
// Currency formatting
formatCurrency(1299) // "$1,299.00"

// Date formatting
formatDate(new Date()) // "Dec 27, 2024"

// Get orders by status
getOrdersByStatus('pending')

// Get users by role
getUsersByRole('admin')

// Get recent orders
getRecentOrders(5)

// Get top customers
getTopCustomers(5)

// Status color coding
getStatusColor('completed') // { bg, text, border }
getRoleColor('admin') // { bg, text, border }
```

## Navigation

### Sidebar Menu
- Dashboard (Home)
- Orders
- Users
- Services
- Settings

### Quick Actions
Each page includes relevant quick actions:
- Dashboard: View All Orders, Manage Users, Services, View Site
- Orders: Export data
- Users: Add User
- Services: Add Service

## File Structure

```
app/admin/
├── layout.tsx           # Admin layout with sidebar & auth
├── page.tsx             # Dashboard home
├── orders/
│   └── page.tsx        # Orders management
├── users/
│   └── page.tsx        # Users management
├── services/
│   └── page.tsx        # Services management
└── settings/
    └── page.tsx        # Settings page

lib/
└── admin-data.ts       # Mock data & helper functions
```

## Future Enhancements

### Backend Integration
- [ ] Connect to real database (PostgreSQL/Prisma)
- [ ] Implement API routes for CRUD operations
- [ ] Add real-time updates with WebSockets
- [ ] Implement server actions for mutations

### Features
- [ ] Advanced filtering and sorting
- [ ] Bulk operations
- [ ] Export to CSV/PDF
- [ ] Email notifications
- [ ] Activity logs
- [ ] Analytics charts (using recharts)
- [ ] File uploads
- [ ] Rich text editor for service descriptions

### UI Enhancements
- [ ] Mobile responsive sidebar
- [ ] Dark mode toggle
- [ ] Loading states
- [ ] Error boundaries
- [ ] Toast notifications
- [ ] Confirmation modals
- [ ] Inline editing

## Usage

### Accessing Admin Dashboard

1. Sign in with an account that has admin role
2. Navigate to `/admin`
3. Use sidebar to navigate between sections

### Development

```bash
# Run development server
npm run dev

# Access admin dashboard
http://localhost:3000/admin

# Build for production
npm run build
```

## Components Used

- **Clerk**: Authentication (@clerk/nextjs)
- **Lucide React**: Icons
- **Tailwind CSS**: Styling
- **Next.js 15**: App Router, Server Components
- **TypeScript**: Type safety

## Performance

- Server Components for initial render
- Client Components only where needed (search, filters)
- Optimized pagination (10 items per page)
- Memoized filtered data
- Lazy loading ready

## Security Notes

1. All routes protected with Clerk authentication
2. Role-based access control via Clerk metadata
3. Server-side role verification
4. No sensitive data in client components
5. API keys hidden in settings (password fields)

## Support

For issues or questions:
- Check `/lib/auth.ts` for authentication helpers
- Review Clerk documentation for role management
- See Next.js 15 docs for App Router patterns
