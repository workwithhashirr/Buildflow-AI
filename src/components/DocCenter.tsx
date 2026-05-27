/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DailyLog } from '../types';
import {
  FileText,
  AlertOctagon,
  LifeBuoy,
  FileCheck2,
  Truck,
  Plus,
  Search,
  Filter,
  User,
  Clock,
  ExternalLink,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

interface DocCenterProps {
  logs: DailyLog[];
  onLogsChange: (updatedLogs: DailyLog[]) => void;
}

export default function DocCenter({ logs, onLogsChange }: DocCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');

  // New Log inputs
  const [showFormModal, setShowFormModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<DailyLog['type']>('daily_report');
  const [newAuthor, setNewAuthor] = useState('Marcus Vance');
  const [newNotes, setNewNotes] = useState('');
  const [newStatus, setNewStatus] = useState<DailyLog['status']>('Draft');

  const logTypes = [
    { value: 'daily_report', label: 'Superintendent Daily Report', icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { value: 'issue_log', label: 'Blocked / Material Delay Log', icon: AlertOctagon, color: 'text-amber-600 bg-amber-50' },
    { value: 'safety_observation', label: 'Safety Observation Notice', icon: LifeBuoy, color: 'text-red-700 bg-red-50' },
    { value: 'inspection_record', label: 'County Inspection Record', icon: FileCheck2, color: 'text-emerald-700 bg-emerald-50' },
    { value: 'material_delivery', label: 'Slab Material Delivery Ticket', icon: Truck, color: 'text-purple-700 bg-purple-50 font-bold' },
  ];

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newNotes.trim()) return;

    const newLog: DailyLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      type: newType,
      title: newTitle,
      notes: newNotes,
      timestamp: new Date().toISOString(),
      author: newAuthor,
      status: newStatus,
    };

    onLogsChange([newLog, ...logs]);
    setNewTitle('');
    setNewNotes('');
    setNewStatus('Submitted');
    setShowFormModal(false);
  };

  const getLogIconDetails = (type: string) => {
    const matched = logTypes.find((lt) => lt.value === type);
    if (matched) return matched;
    return { value: 'daily_report', label: 'Daily Report', icon: FileText, color: 'text-slate-600 bg-slate-50' };
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Submitted':
      case 'Resolved':
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-800 border-emerald-200';
      case 'Pending':
      case 'Draft':
        return 'bg-amber-500/10 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || log.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 fade-in">
      {/* Control row */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Document Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search documents by author, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs w-60 focus:outline-none focus:border-sky-500 focus:bg-white"
            />
          </div>

          {/* Doc Type Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Cabinets:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="p-1 px-2 border border-slate-200 rounded bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="All">All Cabinets</option>
              {logTypes.map((typeObj) => (
                <option key={typeObj.value} value={typeObj.value}>
                  {typeObj.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            setNewTitle('');
            setNewNotes('');
            setNewStatus('Draft');
            setShowFormModal(true);
          }}
          className="bg-sky-600 hover:bg-sky-700 text-white rounded px-4 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Site Log</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document logs list (2 Columns on large screen) */}
        <div className="lg:col-span-2 space-y-4">
          {filteredLogs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-400 font-mono text-xs">
              No field ledger documents located in this folder.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const iconDetail = getLogIconDetails(log.type);
              const LogIconComp = iconDetail.icon;
              const formattedDate = new Date(log.timestamp).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={log.id} className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-xs hover:border-slate-300 transition-all">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${iconDetail.color}`}>
                        <LogIconComp className="w-5 h-5 shrink-0" />
                      </div>
                      <div>
                        <span className="block text-xs font-mono font-bold text-slate-400">
                          {log.id} • {iconDetail.label}
                        </span>
                        <h4 className="text-xs font-extrabold text-slate-800 font-sans mt-0.5">
                          {log.title}
                        </h4>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 border text-[9px] font-mono font-bold uppercase rounded-xs ${getStatusStyle(
                        log.status
                      )}`}
                    >
                      {log.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans">{log.notes}</p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span className="font-semibold text-slate-600">{log.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[10px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Informative Side Card with statistics */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-sky-600" />
              Document Verification Logs
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              This repository contains verified field records. Once logs are submitted, they are locked into the ledger and mirrored instantly to project architects and insurers.
            </p>

            <div className="space-y-3.5">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-600">Total Submissions:</span>
                <span className="font-mono font-bold text-slate-800">{logs.length} Files</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-600">Pending Clarification:</span>
                <span className="font-mono font-bold text-amber-700">1 Logged</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-600">Ledger Lock Rating:</span>
                <span className="font-mono font-bold text-emerald-700">100% Cryptographic</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- SUBMIT SITE LOG MODAL ----------------- */}
      {showFormModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-sans font-bold text-sm text-slate-800 uppercase tracking-tight">
                Submit Site Record Document
              </h3>
              <button
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                onClick={() => setShowFormModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateLog} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Completed concrete slump test Section B"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500">Record Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as DailyLog['type'])}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded"
                >
                  {logTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500">Author / Submitter</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500">Initial Document Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as DailyLog['status'])}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded"
                >
                  <option value="Draft">Draft Mode</option>
                  <option value="Submitted">Submitted (Locked in Ledger)</option>
                  <option value="Pending">Pending (HVAC/MEP Check Required)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 font-sans">Document Notes / Observations *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Insert quantitative details (compressive strengths, structural welds, weather variables)..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 hover:bg-slate-50 rounded border border-slate-200 text-slate-600"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded bg-sky-600 text-white hover:bg-sky-700">
                  Seal and Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
