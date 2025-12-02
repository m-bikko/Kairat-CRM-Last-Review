'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import KanbanBoard from '@/components/pipeline/KanbanBoard';
import LeadModal from '@/components/pipeline/LeadModal';
import UploadModal from '@/components/pipeline/UploadModal';
import { ILead } from '@/models/Lead';
import { Upload } from 'lucide-react';

export default function PipelinePage() {
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ILead | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateLead = () => {
    setSelectedLead(null);
    setShowModal(true);
  };

  const handleEditLead = (lead: ILead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleSave = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <Header title="Pipeline" user={{ name: 'Admin User', email: 'admin@test.com' }} />

      <div className="flex-1 overflow-hidden p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-light text-gray-900">Sales Pipeline</h2>
            <p className="text-gray-500 text-sm mt-1">Drag leads between stages to update their status</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload size={16} />
            Upload CSV
          </button>
        </div>

        <div className="flex-1 min-h-0">
          <KanbanBoard
            key={refreshKey}
            onCreateLead={handleCreateLead}
            onEditLead={handleEditLead}
            onDeleteLead={handleDeleteLead}
          />
        </div>
      </div>

      {showModal && (
        <LeadModal
          lead={selectedLead}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleSave}
        />
      )}
    </>
  );
}
