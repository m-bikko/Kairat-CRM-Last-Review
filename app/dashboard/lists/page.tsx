'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { ILeadList } from '@/models/LeadList';
import { Plus, Edit2, Trash2, X, FolderOpen, Tag } from 'lucide-react';

export default function ListsPage() {
  const [lists, setLists] = useState<ILeadList[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedList, setSelectedList] = useState<ILeadList | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', tags: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await fetch('/api/lists');
      const data = await response.json();
      if (data.lists) {
        setLists(data.lists);
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  const handleCreate = () => {
    setSelectedList(null);
    setFormData({ name: '', description: '', tags: '' });
    setShowModal(true);
  };

  const handleEdit = (list: ILeadList) => {
    setSelectedList(list);
    setFormData({
      name: list.name,
      description: list.description || '',
      tags: list.tags?.join(', ') || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this list?')) return;

    try {
      await fetch(`/api/lists/${id}`, { method: 'DELETE' });
      fetchLists();
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    try {
      const url = selectedList ? `/api/lists/${selectedList._id}` : '/api/lists';
      const method = selectedList ? 'PATCH' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, tags }),
      });

      setShowModal(false);
      fetchLists();
    } catch (error) {
      console.error('Error saving list:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Lead Lists" user={{ name: 'Admin User', email: 'admin@test.com' }} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-light text-gray-900">Lead Lists</h2>
            <p className="text-gray-500 text-sm mt-1">Organize your leads into custom lists</p>
          </div>
          <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            New List
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <div
              key={list._id}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <FolderOpen size={18} className="text-indigo-600" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(list)}
                    className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(list._id || '')}
                    className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="font-medium text-gray-900 mb-1">{list.name}</h3>
              {list.description && (
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{list.description}</p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                <span className="flex items-center gap-1">
                  <span className="font-medium text-gray-600">{list.leadIds?.length || 0}</span> leads
                </span>
                <span>{new Date(list.createdAt).toLocaleDateString()}</span>
              </div>

              {list.tags && list.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
                  {list.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]"
                    >
                      <Tag size={8} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {lists.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
              <FolderOpen size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium text-gray-500">No lists yet</p>
              <p className="text-sm">Create your first list to organize leads.</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedList ? 'Edit List' : 'New List'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  autoFocus
                  placeholder="My List"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="A brief description of this list..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (comma-separated)</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="urgent, follow-up, cold"
                />
              </div>
            </form>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.name}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  selectedList ? 'Update' : 'Create'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
