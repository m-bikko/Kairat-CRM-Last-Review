'use client';

import { useState } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadModal({ onClose, onSuccess }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(selectedFile);
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter((line) => line.trim());
    if (lines.length === 0) return;

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const data = [];

    for (let i = 1; i < Math.min(lines.length, 6); i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      const obj: any = {};

      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });

      data.push(obj);
    }

    setPreview(data);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setResult(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter((line) => line.trim());

      if (lines.length === 0) {
        setUploading(false);
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const leads = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim());
        const lead: any = {};

        headers.forEach((header, index) => {
          const value = values[index];

          if (header === 'name') lead.name = value;
          else if (header === 'email') lead.email = value;
          else if (header === 'phone') lead.phone = value;
          else if (header === 'company') lead.company = value;
          else if (header === 'value') lead.value = parseFloat(value) || 0;
          else if (header === 'status') lead.status = value || 'new';
          else if (header === 'priority') lead.priority = value || 'medium';
          else if (header === 'notes') lead.notes = value;
        });

        if (lead.name) {
          leads.push(lead);
        }
      }

      try {
        const response = await fetch('/api/leads/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leads }),
        });

        const data = await response.json();
        setResult(data);

        if (data.success && data.created > 0) {
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 2000);
        }
      } catch (error) {
        console.error('Error uploading leads:', error);
      }

      setUploading(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Загрузка лидов</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <p className="text-sm text-gray-700 mb-2">Загрузите CSV файл со следующими колонками:</p>
            <code className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-700">
              name, email, phone, company, value, status, priority, notes
            </code>
            <p className="text-xs text-gray-500 mt-2">
              Обязательна только колонка <strong>name</strong>. Значения status: new, contacted, qualified, proposal, won, lost.
              Значения priority: low, medium, high.
            </p>
          </div>

          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              id="file-upload"
              className="sr-only"
            />
            <label
              htmlFor="file-upload"
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                file
                  ? 'border-indigo-300 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {file ? (
                <>
                  <FileText size={24} className="text-indigo-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900">{file.name}</span>
                  <span className="text-xs text-gray-500 mt-1">Нажмите чтобы выбрать другой файл</span>
                </>
              ) : (
                <>
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Выберите CSV файл</span>
                  <span className="text-xs text-gray-500 mt-1">или перетащите сюда</span>
                </>
              )}
            </label>
          </div>

          {preview.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Предпросмотр (первые 5 строк):</h4>
              <div className="bg-gray-50 rounded-lg border border-gray-100 divide-y divide-gray-100">
                {preview.map((row, index) => (
                  <div key={index} className="px-3 py-2 text-sm">
                    <strong className="text-gray-900">{row.name || 'Без имени'}</strong>
                    {row.company && <span className="text-gray-500"> - {row.company}</span>}
                    {row.email && <span className="text-gray-400"> ({row.email})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${
                result.errors > 0
                  ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                  : 'bg-green-50 border border-green-200 text-green-800'
              }`}
            >
              {result.errors > 0 ? (
                <AlertCircle size={16} />
              ) : (
                <CheckCircle size={16} />
              )}
              <span className="text-sm font-medium">
                Успешно загружено {result.created} лидов
                {result.errors > 0 && ` (${result.errors} ошибок)`}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleUpload}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!file || uploading}
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Загрузка...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload size={16} />
                Загрузить
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
