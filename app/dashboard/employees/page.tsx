import Header from '@/components/layout/Header';
import { getSession } from '@/lib/auth';
import { Plus, MoreHorizontal, Mail, Phone, MapPin } from 'lucide-react';

const employees = [
  { id: '1', name: 'John Smith', role: 'Sales Manager', email: 'john@company.com', phone: '+1 234 567 890', location: 'New York', status: 'Active', avatar: 'JS' },
  { id: '2', name: 'Sarah Johnson', role: 'Account Executive', email: 'sarah@company.com', phone: '+1 234 567 891', location: 'Los Angeles', status: 'Active', avatar: 'SJ' },
  { id: '3', name: 'Mike Brown', role: 'Sales Rep', email: 'mike@company.com', phone: '+1 234 567 892', location: 'Chicago', status: 'Active', avatar: 'MB' },
  { id: '4', name: 'Emily Davis', role: 'Marketing Lead', email: 'emily@company.com', phone: '+1 234 567 893', location: 'Boston', status: 'On Leave', avatar: 'ED' },
];

export default async function EmployeesPage() {
  const session = await getSession();

  return (
    <>
      <Header
        title="Employees"
        user={session ? { name: session.name, email: session.email } : undefined}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-light text-gray-900">Team Members</h2>
            <p className="text-gray-500 text-sm mt-1">Manage your team and their roles</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Add Employee
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {employees.map((employee) => (
            <div key={employee.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                  {employee.avatar}
                </div>
                <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <h3 className="font-medium text-gray-900">{employee.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{employee.role}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Mail size={14} />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Phone size={14} />
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin size={14} />
                  <span>{employee.location}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  employee.status === 'Active'
                    ? 'bg-green-50 text-green-700 border border-green-100'
                    : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                }`}>
                  {employee.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
