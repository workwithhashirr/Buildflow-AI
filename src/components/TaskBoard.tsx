/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Task, ConstructionPhase, TaskStatus, PriorityLevel } from '../types';
import {
  ListTodo,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Trash2,
  Edit3,
  CheckCircle,
  FileText,
  AlertTriangle,
  Layers,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  onTasksChange: (updatedTasks: Task[]) => void;
}

export default function TaskBoard({ tasks, onTasksChange }: TaskBoardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form states
  const [newName, setNewName] = useState('');
  const [newPhase, setNewPhase] = useState<ConstructionPhase>('Site Preparation');
  const [newContractor, setNewContractor] = useState('');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('Medium');
  const [newStatus, setNewStatus] = useState<TaskStatus>('Not Started');
  const [newStartDate, setNewStartDate] = useState('2026-05-28');
  const [newEndDate, setNewEndDate] = useState('2026-06-15');
  const [newCompletion, setNewCompletion] = useState(0);
  const [newDependencyList, setNewDependencyList] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Lists for dropdown selections
  const phases: ConstructionPhase[] = [
    'Site Preparation',
    'Excavation',
    'Foundation',
    'Structural',
    'Roofing',
    'Electrical',
    'Plumbing',
    'HVAC',
    'Finishing',
    'Inspection',
  ];

  const statuses: TaskStatus[] = ['Not Started', 'In Progress', 'Delayed', 'Completed'];
  const priorities: PriorityLevel[] = ['Low', 'Medium', 'High', 'Urgent'];

  // Add Task handler
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newContractor.trim()) return;

    const newTask: Task = {
      id: `TSK-${Date.now().toString().slice(-4)}`,
      name: newName,
      phase: newPhase,
      assignedContractor: newContractor,
      priority: newPriority,
      status: newStatus,
      startDate: newStartDate,
      endDate: newEndDate,
      completion: newStatus === 'Completed' ? 100 : newStatus === 'Not Started' ? 0 : newCompletion,
      dependencies: newDependencyList ? newDependencyList.split(',').map((d) => d.trim()) : [],
      notes: newNotes,
    };

    onTasksChange([...tasks, newTask]);
    resetForm();
    setShowAddModal(false);
  };

  // Edit Task Loader
  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setNewName(task.name);
    setNewPhase(task.phase);
    setNewContractor(task.assignedContractor);
    setNewPriority(task.priority);
    setNewStatus(task.status);
    setNewStartDate(task.startDate);
    setNewEndDate(task.endDate);
    setNewCompletion(task.completion);
    setNewDependencyList(task.dependencies.join(', '));
    setNewNotes(task.notes || '');
    setShowEditModal(true);
  };

  // Edit Task executor
  const handleEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    const updated = tasks.map((t) => {
      if (t.id === editingTask.id) {
        return {
          ...t,
          name: newName,
          phase: newPhase,
          assignedContractor: newContractor,
          priority: newPriority,
          status: newStatus,
          startDate: newStartDate,
          endDate: newEndDate,
          completion: newStatus === 'Completed' ? 100 : newStatus === 'Not Started' ? 0 : newCompletion,
          dependencies: newDependencyList ? newDependencyList.split(',').map((d) => d.trim()) : [],
          notes: newNotes,
        };
      }
      return t;
    });

    onTasksChange(updated);
    resetForm();
    setEditingTask(null);
    setShowEditModal(false);
  };

  // Delete Task executor
  const handleDeleteTask = (taskId: string) => {
    const remaining = tasks.filter((t) => t.id !== taskId);
    onTasksChange(remaining);
    if (editingTask && editingTask.id === taskId) {
      setShowEditModal(false);
      setEditingTask(null);
    }
  };

  const resetForm = () => {
    setNewName('');
    setNewPhase('Site Preparation');
    setNewContractor('');
    setNewPriority('Medium');
    setNewStatus('Not Started');
    setNewStartDate('2026-05-28');
    setNewEndDate('2026-06-15');
    setNewCompletion(0);
    setNewDependencyList('');
    setNewNotes('');
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedContractor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPhase = selectedPhase === 'All' || task.phase === selectedPhase;
    const matchesStatus = selectedStatus === 'All' || task.status === selectedStatus;
    return matchesSearch && matchesPhase && matchesStatus;
  });

  const getPriorityColor = (level: PriorityLevel) => {
    switch (level) {
      case 'Urgent':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'High':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Low':
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500';
      case 'Delayed':
        return 'bg-amber-500';
      case 'In Progress':
        return 'bg-sky-500';
      case 'Not Started':
        return 'bg-slate-300';
    }
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Task Filters & Control Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search active tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs w-60 focus:outline-none focus:border-sky-500 focus:bg-white"
            />
          </div>

          {/* Phase Filter dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Layers className="w-4 h-4 text-slate-400" />
            <span>Phase:</span>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="p-1 px-2 border border-slate-200 rounded bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="All">All Phases</option>
              {phases.map((ph) => (
                <option key={ph} value={ph}>
                  {ph}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-1 px-2 border border-slate-200 rounded bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="All">All Statuses</option>
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View mode toggle + Add button */}
        <div className="flex items-center gap-3">
          <div className="flex rounded border border-slate-200 p-0.5 bg-slate-100">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded ${
                viewMode === 'kanban' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-500'
              }`}
            >
              BOARD
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded ${
                viewMode === 'list' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-500'
              }`}
            >
              LIST
            </button>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="bg-sky-600 hover:bg-sky-700 text-white rounded px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Grid view mode or Kanban columns */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statuses.map((colStatus) => {
            const columnTasks = filteredTasks.filter((t) => t.status === colStatus);
            return (
              <div key={colStatus} className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col h-[700px]">
                {/* Column header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-xs ${getStatusColor(colStatus)}`} />
                    <span className="font-sans font-bold text-xs text-slate-800 uppercase tracking-tight">
                      {colStatus}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-200/50 px-1.5 py-0.5 rounded">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {columnTasks.length === 0 ? (
                    <div className="h-28 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-[11px] text-slate-400 font-mono">
                      No active tasks
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleOpenEdit(task)}
                        className="bg-white border border-slate-200 hover:border-slate-300 rounded p-3 hover:shadow-soft transition-all cursor-pointer group flex flex-col"
                      >
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <span className="text-[10px] text-slate-400 font-mono font-semibold">
                            {task.id}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 border text-[9px] font-mono font-bold rounded-xs tracking-wider uppercase ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-800 leading-snug group-hover:text-sky-700 transition-colors mb-2">
                          {task.name}
                        </h4>

                        <span className="text-[10px] text-sky-700 font-semibold bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-xs w-max mb-3">
                          {task.phase}
                        </span>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
                          <div
                            className={`h-full rounded-full ${
                              task.status === 'Completed'
                                ? 'bg-emerald-500'
                                : task.status === 'Delayed'
                                ? 'bg-amber-500'
                                : 'bg-sky-500'
                            }`}
                            style={{ width: `${task.completion}%` }}
                          />
                        </div>

                        {/* Footer info row */}
                        <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <div className="flex items-center gap-1 font-sans">
                            <User className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[100px] font-medium">{task.assignedContractor}</span>
                          </div>
                          <div className="flex items-center gap-1 font-mono text-[10px]">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{task.endDate.slice(5)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List view mode */
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                <th className="py-3 px-4 w-20">ID</th>
                <th className="py-3 px-4">Task Name</th>
                <th className="py-3 px-4">Phase</th>
                <th className="py-3 px-4">Contractor</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Progress</th>
                <th className="py-3 px-4 text-right">Deadline</th>
                <th className="py-3 px-4 w-12 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-700 divide-y divide-slate-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-mono">
                    No matching construction tasks found.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">{task.id}</td>
                    <td className="py-3 px-4">
                      <span
                        onClick={() => handleOpenEdit(task)}
                        className="font-bold text-slate-800 hover:text-sky-700 cursor-pointer"
                      >
                        {task.name}
                      </span>
                      {task.notes && (
                        <span className="block text-[10px] text-slate-400 mt-0.5 truncate max-w-sm">
                          {task.notes}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded">
                        {task.phase}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{task.assignedContractor}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-1.5 py-0.5 border text-[9px] font-mono font-bold rounded-xs uppercase ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`} />
                        <span className="font-semibold text-slate-700">{task.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-500 w-8 text-right">
                          {task.completion}%
                        </span>
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              task.status === 'Completed'
                                ? 'bg-emerald-500'
                                : task.status === 'Delayed'
                                ? 'bg-amber-500'
                                : 'bg-sky-500'
                            }`}
                            style={{ width: `${task.completion}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-500">
                      {task.endDate}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(task)}
                          className="p-1 hover:text-sky-600 rounded hover:bg-sky-50 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ----------------- ADD TASK MODAL ----------------- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-sans font-bold text-sm text-slate-800 uppercase tracking-tight">
                Add Construction Task
              </h3>
              <button
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddTask} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-normal">
                    Task Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rough-in plumbing risers Section A"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-normal">
                    Construction Phase
                  </label>
                  <select
                    value={newPhase}
                    onChange={(e) => setNewPhase(e.target.value as ConstructionPhase)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-sky-500"
                  >
                    {phases.map((ph) => (
                      <option key={ph} value={ph}>
                        {ph}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-normal">
                    Assigned Contractor *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FlowMaster Piping Ltd"
                    value={newContractor}
                    onChange={(e) => setNewContractor(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-normal">
                    Priority Level
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-sky-500"
                  >
                    {priorities.map((pr) => (
                      <option key={pr} value={pr}>
                        {pr}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-normal">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-sky-500"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-normal">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-normal">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                  />
                </div>

                {newStatus === 'In Progress' && (
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-normal">
                      Completion Progress ({newCompletion}%)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="99"
                      value={newCompletion}
                      onChange={(e) => setNewCompletion(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-normal">
                    Dependencies (Optional comma-separated list of names)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Subgrade Excavation, Compaction Test"
                    value={newDependencyList}
                    onChange={(e) => setNewDependencyList(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-normal">
                    Additional Construction Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Verify weather conditions before conducting this task..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-sky-500 resize-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 hover:bg-slate-50 rounded border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded bg-sky-600 text-white font-bold hover:bg-sky-700">
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- EDIT TASK MODAL ----------------- */}
      {showEditModal && editingTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-sans font-bold text-sm text-slate-800 uppercase tracking-tight">
                Update Task details: {editingTask.id}
              </h3>
              <button
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditTask} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500">Task Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500">Construction Phase</label>
                  <select
                    value={newPhase}
                    onChange={(e) => setNewPhase(e.target.value as ConstructionPhase)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded"
                  >
                    {phases.map((ph) => (
                      <option key={ph} value={ph}>
                        {ph}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500">Assigned Contractor</label>
                  <input
                    type="text"
                    required
                    value={newContractor}
                    onChange={(e) => setNewContractor(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500">Priority Level</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded"
                  >
                    {priorities.map((pr) => (
                      <option key={pr} value={pr}>
                        {pr}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500">Start Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500">End Date</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded"
                  />
                </div>

                {newStatus === 'In Progress' && (
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-normal">
                      Completion Progress ({newCompletion}%)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="99"
                      value={newCompletion}
                      onChange={(e) => setNewCompletion(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500">Dependencies</label>
                  <input
                    type="text"
                    value={newDependencyList}
                    onChange={(e) => setNewDependencyList(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500">Additional Notes</label>
                  <textarea
                    rows={2}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-sky-500 resize-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleDeleteTask(editingTask.id)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded border border-transparent font-bold flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Task</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 hover:bg-slate-50 rounded border border-slate-200 text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 rounded bg-sky-600 text-white font-bold hover:bg-sky-700">
                    Update Details
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
