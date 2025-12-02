'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import LeadCard from './LeadCard';
import { ILead } from '@/models/Lead';
import { Plus } from 'lucide-react';

const columns = [
  { id: 'new', title: 'Новые', color: '#3B82F6' },
  { id: 'contacted', title: 'Контакт', color: '#8B5CF6' },
  { id: 'qualified', title: 'Квалификация', color: '#F59E0B' },
  { id: 'proposal', title: 'Предложение', color: '#10B981' },
  { id: 'won', title: 'Выиграно', color: '#059669' },
  { id: 'lost', title: 'Проиграно', color: '#EF4444' },
];

interface KanbanBoardProps {
  onCreateLead: () => void;
  onEditLead: (lead: ILead) => void;
  onDeleteLead: (id: string) => void;
}

export default function KanbanBoard({ onCreateLead, onEditLead, onDeleteLead }: KanbanBoardProps) {
  const [leads, setLeads] = useState<ILead[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('position');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchLeads();
  }, [sortBy]);

  const fetchLeads = async () => {
    try {
      const response = await fetch(`/api/leads?sort=${sortBy}`);
      const data = await response.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const getLeadsByStatus = (status: string) => {
    return leads.filter((lead) => lead.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeLead = leads.find((lead) => lead._id === activeId);
    if (!activeLead) return;

    const newStatus = columns.find((col) => col.id === overId)?.id || activeLead.status;

    if (newStatus !== activeLead.status) {
      try {
        await fetch(`/api/leads/${activeId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });

        setLeads((prev) =>
          prev.map((lead) =>
            lead._id === activeId ? { ...lead, status: newStatus } : lead
          )
        );
      } catch (error) {
        console.error('Error updating lead:', error);
      }
    }

    setActiveId(null);
  };

  const activeLead = activeId ? leads.find((lead) => lead._id === activeId) : null;

  const sortButtons = [
    { id: 'position', label: 'Порядок' },
    { id: 'priority', label: 'Приоритет' },
    { id: 'date', label: 'Дата' },
    { id: 'name', label: 'Имя' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 font-medium">Сортировка:</span>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {sortButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => setSortBy(btn.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  sortBy === btn.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={onCreateLead} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Новый лид
        </button>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-max h-full">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                color={column.color}
                leads={getLeadsByStatus(column.id)}
                onEdit={onEditLead}
                onDelete={onDeleteLead}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeLead ? (
            <div className="opacity-80 rotate-3 scale-105">
              <LeadCard lead={activeLead} onEdit={() => {}} onDelete={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
