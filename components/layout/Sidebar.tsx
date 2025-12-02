'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  KanbanSquare,
  Calendar,
  CreditCard,
  Settings,
  Users,
  FileText,
  CheckSquare,
  Package,
  DollarSign,
  Briefcase
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Pipeline', path: '/dashboard/pipeline', icon: KanbanSquare },
  { name: 'Lists', path: '/dashboard/lists', icon: FileText },
  { name: 'Clients', path: '/dashboard/clients', icon: Users },
  { name: 'Employees', path: '/dashboard/employees', icon: Briefcase },
  { name: 'Finance', path: '/dashboard/finance', icon: DollarSign },
  { name: 'Billing', path: '/dashboard/billing', icon: CreditCard },
  { name: 'Calendar', path: '/dashboard/calendar', icon: Calendar },
  { name: 'Tasks', path: '/dashboard/tasks', icon: CheckSquare },
  { name: 'Products', path: '/dashboard/products', icon: Package },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 glass-sidebar shadow-xl">
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
            K
          </div>
          <span className="text-xl font-medium tracking-tight text-gray-900">Kairat CRM</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 py-4 overflow-y-auto scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <Users size={14} className="text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@test.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
