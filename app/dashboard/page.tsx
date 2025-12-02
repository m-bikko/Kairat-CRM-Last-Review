import Header from '@/components/layout/Header';
import { getSession } from '@/lib/auth';
import { ArrowUpRight, DollarSign, Users, Briefcase, Target } from 'lucide-react';

const StatCard = ({ title, value, trend, icon: Icon, color }: { title: string; value: string; trend: string; icon: any; color: string }) => (
  <div className="stat-card">
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${color} opacity-10 group-hover:scale-110 transition-transform`} />
    <div className="flex justify-between items-start z-10">
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-gray-700`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="flex items-center gap-1 text-green-600 text-xs font-medium z-10">
      <ArrowUpRight size={12} />
      {trend} <span className="text-gray-400 font-normal ml-1">за месяц</span>
    </div>
  </div>
);

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <>
      <Header
        title="Главная"
        user={session ? { name: session.name, email: session.email } : undefined}
      />

      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Общий доход" value="₸ 58 450 000" trend="+12.5%" icon={DollarSign} color="bg-green-500" />
            <StatCard title="Активные лиды" value="1 294" trend="+4.1%" icon={Target} color="bg-blue-500" />
            <StatCard title="В воронке" value="₸ 225 800 000" trend="+8.2%" icon={Briefcase} color="bg-purple-500" />
            <StatCard title="Конверсия" value="2.4%" trend="+0.8%" icon={Users} color="bg-orange-500" />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart Placeholder */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Аналитика доходов</h3>
              <div className="h-72 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
                <div className="text-center text-gray-400">
                  <DollarSign size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">График скоро появится</p>
                </div>
              </div>
            </div>

            {/* Lead Sources Placeholder */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Источники лидов</h3>
              <div className="h-72 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
                <div className="text-center text-gray-400">
                  <Target size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">График скоро появится</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Последние действия</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign size={14} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Новая сделка закрыта</p>
                    <p className="text-xs text-gray-500">2 минуты назад</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users size={14} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Добавлен новый лид</p>
                    <p className="text-xs text-gray-500">15 минут назад</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Briefcase size={14} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Встреча запланирована</p>
                    <p className="text-xs text-gray-500">1 час назад</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Предстоящие задачи</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Связаться с Kaspi Bank</p>
                    <p className="text-xs text-gray-500">Сегодня</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Подготовить КП для Казмунайгаз</p>
                    <p className="text-xs text-gray-500">Завтра</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Обзор воронки Q4</p>
                    <p className="text-xs text-gray-500">Через 3 дня</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
