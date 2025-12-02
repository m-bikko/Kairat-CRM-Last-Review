'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ILead } from '@/models/Lead';
import { Trash2, Edit2, Mail, Phone, DollarSign } from 'lucide-react';

interface LeadCardProps {
  lead: ILead;
  onEdit: (lead: ILead) => void;
  onDelete: (id: string) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-50 text-red-600 border-red-100';
    case 'medium': return 'bg-orange-50 text-orange-600 border-orange-100';
    case 'low': return 'bg-blue-50 text-blue-600 border-blue-100';
    default: return 'bg-gray-50 text-gray-600 border-gray-100';
  }
};

export default function LeadCard({ lead, onEdit, onDelete }: LeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lead._id || '',
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${getPriorityColor(lead.priority)}`}>
          {lead.priority}
        </span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onEdit(lead)}
            className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded transition-colors"
            title="Edit"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={() => onDelete(lead._id || '')}
            className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <h4 className="font-medium text-gray-900 leading-tight">{lead.name}</h4>
      {lead.company && <p className="text-xs text-gray-500 mt-1">{lead.company}</p>}

      <div className="mt-3 space-y-1.5">
        {lead.email && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Mail size={10} />
            <span className="truncate">{lead.email}</span>
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Phone size={10} />
            <span>{lead.phone}</span>
          </div>
        )}
      </div>

      {lead.value !== undefined && lead.value > 0 && (
        <div className="mt-3 flex items-center gap-1 text-gray-700 text-sm font-medium bg-gray-50 px-2 py-1 rounded border border-gray-100 w-fit">
          <DollarSign size={12} />
          {lead.value.toLocaleString()}
        </div>
      )}

      {lead.notes && (
        <p className="mt-3 text-xs text-gray-400 line-clamp-2">{lead.notes}</p>
      )}

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">
          {new Date(lead.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
