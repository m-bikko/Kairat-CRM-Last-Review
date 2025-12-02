'use client';

import Header from '@/components/layout/Header';
import { useState } from 'react';
import { Plus, Check, Circle, Clock, Flag, MoreHorizontal, Calendar } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  completed: boolean;
  assignee: string;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Follow up with Acme Corp', description: 'Send proposal and schedule demo', priority: 'High', dueDate: '2024-01-15', completed: false, assignee: 'JS' },
  { id: '2', title: 'Prepare Q1 report', description: 'Compile sales data for quarterly review', priority: 'Medium', dueDate: '2024-01-20', completed: false, assignee: 'SJ' },
  { id: '3', title: 'Update CRM documentation', description: 'Add new feature descriptions', priority: 'Low', dueDate: '2024-01-25', completed: true, assignee: 'MB' },
  { id: '4', title: 'Client onboarding call', description: 'Wayne Enterprises kickoff meeting', priority: 'High', dueDate: '2024-01-16', completed: false, assignee: 'JS' },
  { id: '5', title: 'Review marketing materials', description: 'Check new brochure designs', priority: 'Medium', dueDate: '2024-01-18', completed: false, assignee: 'ED' },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'bg-red-50 text-red-600 border-red-100';
    case 'Medium': return 'bg-orange-50 text-orange-600 border-orange-100';
    case 'Low': return 'bg-blue-50 text-blue-600 border-blue-100';
    default: return 'bg-gray-50 text-gray-600 border-gray-100';
  }
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <>
      <Header
        title="Tasks"
        user={{ name: 'Admin User', email: 'admin@test.com' }}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-light text-gray-900">Task Management</h2>
            <p className="text-gray-500 text-sm mt-1">{pendingTasks.length} pending, {completedTasks.length} completed</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Add Task
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Tasks */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending Tasks</h3>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-0.5 w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-indigo-500 transition-colors"
                    >
                      <Circle size={12} className="text-gray-300" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                        <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{task.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar size={10} />
                          {task.dueDate}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-medium">
                          {task.assignee}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Completed</h3>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm opacity-60 group">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-0.5 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
                    >
                      <Check size={12} className="text-white" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-500 line-through truncate">{task.title}</h4>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-1">{task.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
