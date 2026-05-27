/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  mockProjects,
  initialTasksForProjects,
  sampleInspections,
  sampleDailyLogs,
} from './data/mockData';
import { Task, DailyLog, Inspection, ProjectMetadata } from './types';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import TaskBoard from './components/TaskBoard';
import GanttChart from './components/GanttChart';
import AnalyticsDash from './components/AnalyticsDash';
import AiInsights from './components/AiInsights';
import DocCenter from './components/DocCenter';
import SettingsPanel from './components/SettingsPanel';

import {
  ListTodo,
  CheckCircle,
  Sparkles,
  AlertTriangle,
  Users,
  DollarSign,
  Calendar,
  FileText,
  Clock,
  Briefcase,
  ChevronRight,
  HardHat,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Core Project selection state
  const [selectedProject, setSelectedProject] = useState<ProjectMetadata>(mockProjects[0]);

  // Load project-specific data states initialized from mockData with session-level fallback
  const [projectTasks, setProjectTasks] = useState<Record<string, Task[]>>({});
  const [projectInspections, setProjectInspections] = useState<Record<string, Inspection[]>>({});
  const [projectLogs, setProjectLogs] = useState<Record<string, DailyLog[]>>({});

  useEffect(() => {
    // Attempt local storage hydration first or default to mocked data
    const localTasks = localStorage.getItem('buildflow_tasks_v2');
    const localInspections = localStorage.getItem('buildflow_inspections_v2');
    const localLogs = localStorage.getItem('buildflow_logs_v2');

    if (localTasks) {
      setProjectTasks(JSON.parse(localTasks));
    } else {
      setProjectTasks(initialTasksForProjects);
    }

    if (localInspections) {
      setProjectInspections(JSON.parse(localInspections));
    } else {
      setProjectInspections(sampleInspections);
    }

    if (localLogs) {
      setProjectLogs(JSON.parse(localLogs));
    } else {
      setProjectLogs(sampleDailyLogs);
    }
  }, []);

  // Update localStorage when lists alter
  const handleUpdateTasks = (updatedList: Task[]) => {
    const updatedRecord = { ...projectTasks, [selectedProject.id]: updatedList };
    setProjectTasks(updatedRecord);
    localStorage.setItem('buildflow_tasks_v2', JSON.stringify(updatedRecord));
  };

  const handleUpdateLogs = (updatedList: DailyLog[]) => {
    const updatedRecord = { ...projectLogs, [selectedProject.id]: updatedList };
    setProjectLogs(updatedRecord);
    localStorage.setItem('buildflow_logs_v2', JSON.stringify(updatedRecord));
  };

  const currentProjectTasks = projectTasks[selectedProject.id] || [];
  const currentProjectInspections = projectInspections[selectedProject.id] || [];
  const currentProjectLogs = projectLogs[selectedProject.id] || [];

  // Derived dashboard indices
  const totalTasksCount = currentProjectTasks.length;
  const completedTasksCount = currentProjectTasks.filter((t) => t.status === 'Completed').length;
  const delayedTasksCount = currentProjectTasks.filter((t) => t.status === 'Delayed').length;
  const progressRatio =
    totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : selectedProject.completion;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* 1. Collapsible Sidebar Navigation Drawer */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* 2. Unified Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Sticky Header */}
        <Navbar
          projects={mockProjects}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Dynamic Inner Tab Router */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 fade-in">
              {/* HERO SECTION SPLIT GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* PROJECT DETAILED MILESTONE DECK */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <div>
                        <span className="text-[10px] text-blue-700 font-mono font-bold uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded">
                          CONSTRUCTION GENERAL SUPERINTENDENCE HUB
                        </span>
                        <h2 className="text-xl md:text-2xl font-black text-slate-800 leading-tight mt-3">
                          Console: {selectedProject.name}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1 max-w-xl">
                          Located in <span className="font-semibold text-slate-700">{selectedProject.location}</span>. Ready for physical foundations checks. Steel rigging wind safe indicators are active.
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap hidden sm:inline-block">
                        Phase: {selectedProject.activePhase}
                      </span>
                    </div>

                    <div className="space-y-2 mt-6">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Project Completion Progress</span>
                        <span className="font-mono text-blue-750 font-bold">{progressRatio}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 border border-slate-200/50 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${progressRatio}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Deadline</div>
                      <div className="font-extrabold text-sm text-slate-800">{selectedProject.deadline}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono font-semibold">Days Remaining</div>
                      <div className="font-extrabold text-sm text-blue-600">44 Days</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Active Workers</div>
                      <div className="font-extrabold text-sm text-slate-800">{selectedProject.activeWorkers} On-Site</div>
                    </div>
                  </div>
                </div>

                {/* DYNAMIC CONSOLE AI ASSISTANT CARD */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="font-bold text-[11px] tracking-wide text-slate-100 font-mono uppercase">AI INSIGHT ENGINE</span>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed mb-4 font-sans leading-relaxed">
                      "Concrete delivery scheduled for Thursday may be slightly bottlenecked by wind velocities. Recommend coordinating safety metrics to ensure zero rigging delay during pour operations."
                    </p>
                  </div>
                  <div className="space-y-2 mt-4 z-10">
                    <button 
                      onClick={() => setActiveTab('ai-insights')}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold tracking-tight transition-all text-white cursor-pointer"
                    >
                      Analyze Site Guidance
                    </button>
                    <button 
                      onClick={() => setActiveTab('analytics')}
                      className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold tracking-tight transition-all text-slate-300 cursor-pointer"
                    >
                      Audit Budget Impact ($)
                    </button>
                  </div>
                </div>
              </div>

              {/* DASHBOARD STATISTICS GRID */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* 1. Total Tasks */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-center shadow-xs">
                  <span className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                    Total Tasks
                  </span>
                  <span className="block text-base font-extrabold text-slate-800 mt-1">
                    {totalTasksCount} Active
                  </span>
                  <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                    across elements
                  </span>
                </div>

                {/* 2. Completed Tasks */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-center shadow-xs">
                  <span className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                    Completed
                  </span>
                  <span className="block text-base font-extrabold text-emerald-600 mt-1">
                    {completedTasksCount} Passed
                  </span>
                  <span className="block text-[10px] text-slate-450 font-mono mt-0.5">
                    approved items
                  </span>
                </div>

                {/* 3. Delayed Tasks */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-center shadow-xs">
                  <span className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                    Delayed
                  </span>
                  <span className="block text-base font-extrabold text-amber-600 mt-1">
                    {delayedTasksCount} Delayed
                  </span>
                  <span className="block text-[10px] text-slate-500 font-mono mt-0.5 font-semibold">
                    {delayedTasksCount > 0 ? 'Action required' : 'All clear'}
                  </span>
                </div>

                {/* 4. Upcoming Inspections */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-center shadow-xs">
                  <span className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                    Inspections
                  </span>
                  <span className="block text-base font-extrabold text-blue-600 mt-1">
                    {currentProjectInspections.filter((i) => i.status === 'Scheduled').length} Set
                  </span>
                  <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                    rebar & hydro check
                  </span>
                </div>

                {/* 5. Active Workers */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-center shadow-xs">
                  <span className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                    Workers
                  </span>
                  <span className="block text-base font-extrabold text-slate-800 mt-1">
                    {selectedProject.activeWorkers} Crew
                  </span>
                  <span className="block text-[10px] text-emerald-600 font-mono font-semibold mt-0.5">
                    ● active checks
                  </span>
                </div>

                {/* 6. Budget Spent */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-center shadow-xs">
                  <span className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                    Budget Spent
                  </span>
                  <span className="block text-base font-extrabold text-slate-800 mt-1">
                    {selectedProject.actualSpent}
                  </span>
                  <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                    of {selectedProject.budget}
                  </span>
                </div>
              </div>

              {/* SECONDARY DASHBOARD SPLIT TABLE & LEDGER */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Columns 1: Inspections roster */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
                  <div>
                    <h3 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-widest">
                      UPCOMING COUNTY SURVEYS & INSPECTIONS
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Important milestones requiring third-party surveyors on location.</p>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
                    {currentProjectInspections.map((ins) => (
                      <div key={ins.id} className="py-3 flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-800 block">{ins.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            Inspector: {ins.inspector}
                          </span>
                          {ins.notes && (
                            <span className="block text-[10px] text-slate-500 font-sans italic">
                              "{ins.notes}"
                            </span>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-xs tracking-wider uppercase block ${
                              ins.status === 'Passed'
                                ? 'bg-emerald-500/10 text-emerald-700'
                                : ins.status === 'Failed'
                                ? 'bg-red-500/10 text-red-700'
                                : 'bg-blue-500/10 text-blue-700'
                            }`}
                          >
                            {ins.status}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                            {ins.date} • {ins.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Columns 2: Latest Daily Field logs Ledger preview */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-widest">
                        SITE LEDGER FEED (DAILY LOGS)
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 font-sans">Active observations logged today.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('documentation')}
                      className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      View Cabinet
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
                    {currentProjectLogs.slice(0, 3).map((log) => (
                      <div key={log.id} className="py-3.5 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-800">{log.title}</span>
                          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">
                            {log.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-sans">{log.notes}</p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                          <span>By: {log.author}</span>
                          <span>•</span>
                          <span>{log.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <TaskBoard tasks={currentProjectTasks} onTasksChange={handleUpdateTasks} />
          )}

          {activeTab === 'scheduling' && <GanttChart tasks={currentProjectTasks} />}

          {activeTab === 'analytics' && <AnalyticsDash selectedProject={selectedProject} />}

          {activeTab === 'documentation' && (
            <DocCenter logs={currentProjectLogs} onLogsChange={handleUpdateLogs} />
          )}

          {activeTab === 'ai-insights' && (
            <AiInsights selectedProject={selectedProject} tasks={currentProjectTasks} />
          )}

          {activeTab === 'settings' && <SettingsPanel />}
        </main>
      </div>
    </div>
  );
}
