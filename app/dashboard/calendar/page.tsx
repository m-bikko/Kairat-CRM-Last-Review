import Header from '@/components/layout/Header';
import { getSession } from '@/lib/auth';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export default async function CalendarPage() {
  const session = await getSession();

  return (
    <>
      <Header
        title="Calendar"
        user={session ? { name: session.name, email: session.email } : undefined}
      />

      <div className="flex-1 overflow-hidden p-6 flex flex-col">
        <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-medium text-gray-900">January 2024</h2>
              <div className="flex items-center gap-1">
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronLeft size={16} className="text-gray-600" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronRight size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select className="text-sm border-gray-200 rounded-md bg-gray-50 px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-100">
                <option>Week View</option>
                <option>Day View</option>
                <option>Month View</option>
              </select>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Plus size={14} />
                New Event
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-6 min-w-[800px] h-full">
              {/* Time Column */}
              <div className="border-r border-gray-100">
                <div className="h-10 border-b border-gray-100 bg-gray-50"></div>
                {HOURS.map(hour => (
                  <div key={hour} className="h-20 border-b border-gray-100 text-xs text-gray-400 font-mono text-right pr-2 pt-2">
                    {hour}:00
                  </div>
                ))}
              </div>

              {/* Days Columns */}
              {DAYS.map((day, index) => (
                <div key={day} className="relative border-r border-gray-100 last:border-r-0">
                  <div className="h-10 border-b border-gray-100 bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-600 sticky top-0 z-10">
                    {day}
                  </div>
                  {HOURS.map(hour => (
                    <div key={`${day}-${hour}`} className="h-20 border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"></div>
                  ))}

                  {/* Mock Events */}
                  {index === 0 && (
                    <div className="absolute top-[85px] left-1 right-1 h-[70px] bg-indigo-50 border-l-4 border-indigo-500 rounded p-2 text-xs hover:scale-[1.02] transition-transform cursor-pointer shadow-sm">
                      <p className="font-medium text-indigo-900">Team Standup</p>
                      <p className="text-indigo-600 mt-1">9:00 - 10:00</p>
                    </div>
                  )}
                  {index === 2 && (
                    <div className="absolute top-[245px] left-1 right-1 h-[150px] bg-purple-50 border-l-4 border-purple-500 rounded p-2 text-xs hover:scale-[1.02] transition-transform cursor-pointer shadow-sm">
                      <p className="font-medium text-purple-900">Sprint Planning</p>
                      <p className="text-purple-600 mt-1">11:00 - 1:00 PM</p>
                    </div>
                  )}
                  {index === 3 && (
                    <div className="absolute top-[165px] left-1 right-1 h-[70px] bg-green-50 border-l-4 border-green-500 rounded p-2 text-xs hover:scale-[1.02] transition-transform cursor-pointer shadow-sm">
                      <p className="font-medium text-green-900">Client Call</p>
                      <p className="text-green-600 mt-1">10:00 - 11:00</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
