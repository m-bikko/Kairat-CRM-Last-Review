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
  { name: 'Главная', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Воронка', path: '/dashboard/pipeline', icon: KanbanSquare },
  { name: 'Лиды', path: '/dashboard/lists', icon: FileText },
  { name: 'Клиенты', path: '/dashboard/clients', icon: Users },
  { name: 'Сотрудники', path: '/dashboard/employees', icon: Briefcase },
  { name: 'Финансы', path: '/dashboard/finance', icon: DollarSign },
  { name: 'Счета', path: '/dashboard/billing', icon: CreditCard },
  { name: 'Календарь', path: '/dashboard/calendar', icon: Calendar },
  { name: 'Задачи', path: '/dashboard/tasks', icon: CheckSquare },
  { name: 'Продукты', path: '/dashboard/products', icon: Package },
  { name: 'Настройки', path: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 glass-sidebar shadow-xl">
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <img src="/logo.svg" alt="Kairat CRM" className="h-8" />
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
              <p className="text-sm font-medium text-gray-900 truncate">Администратор</p>
              <p className="text-xs text-gray-500 truncate">admin@kairat.kz</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
