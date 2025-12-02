'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import LeadCard from './LeadCard';
import { ILead } from '@/models/Lead';

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  leads: ILead[];
  onEdit: (lead: ILead) => void;
  onDelete: (id: string) => void;
}

export default function KanbanColumn({ id, title, color, leads, onEdit, onDelete }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="w-80 flex flex-col h-full flex-shrink-0">
      <div
        className="flex items-center justify-between mb-4 px-1 pb-3 border-b-2"
        style={{ borderBottomColor: color }}
      >
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium">
          {leads.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 bg-gray-50/50 rounded-xl p-3 border border-dashed transition-colors ${
          isOver ? 'border-indigo-300 bg-indigo-50/30' : 'border-gray-200'
        }`}
      >
        <SortableContext items={leads.map((l) => l._id || '')} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <LeadCard key={lead._id} lead={lead} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </SortableContext>

        {leads.length === 0 && (
          <div className="h-24 flex items-center justify-center text-gray-300 text-xs italic">
            Drop leads here
          </div>
        )}
      </div>
    </div>
  );
}
