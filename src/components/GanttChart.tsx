/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Task, ConstructionPhase } from '../types';
import {
  Calendar,
  Compass,
  GitCommit,
  CheckCircle2,
  Hourglass,
  Clock,
  Sliders,
  Maximize2,
  Info,
} from 'lucide-react';

interface GanttChartProps {
  tasks: Task[];
}

interface Milestone {
  name: string;
  targetDate: string;
  status: 'Completed' | 'Pending' | 'At Risk';
  description: string;
}

export default function GanttChart({ tasks }: GanttChartProps) {
  const [criticalPathOnly, setCriticalPathOnly] = useState(false);

  // Group tasks by phase to identify start / end block durations
  const phaseSchedule = React.useMemo(() => {
    const defaultRange: Record<
      ConstructionPhase,
      { start: Date; end: Date; completion: number; tasksCount: number; status: 'Completed' | 'In Progress' | 'Delayed' | 'Not Started' }
    > = {
      'Site Preparation': { start: new Date('2026-03-01'), end: new Date('2026-03-25'), completion: 100, tasksCount: 0, status: 'Completed' },
      Excavation: { start: new Date('2026-03-20'), end: new Date('2026-04-20'), completion: 100, tasksCount: 0, status: 'Completed' },
      Foundation: { start: new Date('2026-04-15'), end: new Date('2026-05-15'), completion: 92, tasksCount: 0, status: 'In Progress' },
      Structural: { start: new Date('2026-05-02'), end: new Date('2026-07-15'), completion: 55, tasksCount: 0, status: 'In Progress' },
      Roofing: { start: new Date('2026-07-10'), end: new Date('2026-08-10'), completion: 0, tasksCount: 0, status: 'Not Started' },
      Electrical: { start: new Date('2026-05-10'), end: new Date('2026-06-25'), completion: 70, tasksCount: 0, status: 'In Progress' },
      Plumbing: { start: new Date('2026-05-20'), end: new Date('2026-07-15'), completion: 15, tasksCount: 0, status: 'In Progress' },
      HVAC: { start: new Date('2026-05-15'), end: new Date('2026-06-25'), completion: 35, tasksCount: 0, status: 'Delayed' },
      Finishing: { start: new Date('2026-08-01'), end: new Date('2026-09-30'), completion: 0, tasksCount: 0, status: 'Not Started' },
      Inspection: { start: new Date('2026-10-01'), end: new Date('2026-11-15'), completion: 0, tasksCount: 0, status: 'Not Started' },
    };

    // dynamically update baseline from actual task arrays
    tasks.forEach((t) => {
      const p = t.phase;
      if (defaultRange[p]) {
        defaultRange[p].tasksCount++;
        const tStart = new Date(t.startDate);
        const tEnd = new Date(t.endDate);
        if (tStart < defaultRange[p].start) defaultRange[p].start = tStart;
        if (tEnd > defaultRange[p].end) defaultRange[p].end = tEnd;
      }
    });

    return defaultRange;
  }, [tasks]);

  // Project Milestones List
  const milestones: Milestone[] = [
    {
      name: 'Foundation Complete',
      targetDate: '2026-05-15',
      status: 'Completed',
      description: 'Cylinder compression sheets submitted and cleared by city inspector.',
    },
    {
      name: 'Roof Installed',
      targetDate: '2026-08-10',
      status: 'Pending',
      description: 'Decking assembly and weatherized waterproof membranes.',
    },
    {
      name: 'MEP Approved',
      targetDate: '2026-09-10',
      status: 'At Risk',
      description: 'Mechanical, Electrical, and Plumbing rough-ins signed off by agency.',
    },
    {
      name: 'Final Inspection & Occupancy',
      targetDate: '2026-11-15',
      status: 'Pending',
      description: 'Building envelope, life-safety checks, city Certificate of Occupancy.',
    },
  ];

  // Helper date metrics to draw horizontal pixels
  const startTimeline = new Date('2026-03-01').getTime();
  const endTimeline = new Date('2026-11-30').getTime();
  const dateDiffTotal = endTimeline - startTimeline;

  const getPositionStyles = (start: Date, end: Date) => {
    const sTime = start.getTime();
    const eTime = end.getTime();

    // calculate percentages relative to parent timeline bounds
    const leftPx = Math.max(0, ((sTime - startTimeline) / dateDiffTotal) * 100);
    const widthPx = Math.max(5, ((eTime - sTime) / dateDiffTotal) * 100);

    return {
      left: `${leftPx}%`,
      width: `${widthPx}%`,
    };
  };

  const getBarColorClass = (status: 'Completed' | 'In Progress' | 'Delayed' | 'Not Started') => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500 border-emerald-600';
      case 'Delayed':
        return 'bg-amber-500 border-amber-600';
      case 'In Progress':
        return 'bg-sky-500 border-sky-600';
      case 'Not Started':
        return 'bg-slate-300 border-slate-400';
    }
  };

  const isCriticalPath = (phase: string) => {
    // Structural, Foundations and Inspections reside on critical construction paths
    return ['Foundation', 'Structural', 'HVAC', 'Inspection'].includes(phase);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden fade-in">
      {/* Gantt Header Controls */}
      <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-sans font-bold text-sm text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-600" />
            Primavera Master Schedule
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Visualizing dependency pipelines, delay indicators, and critical structural path tracking.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={criticalPathOnly}
              onChange={(e) => setCriticalPathOnly(e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500 h-4 w-4"
            />
            <span className="text-red-600">Highlight Critical Path</span>
          </label>
        </div>
      </div>

      <div className="p-6">
        {/* Simplified Gantt Grid Layout */}
        <div className="overflow-x-auto">
          <div className="min-w-[850px] relative">
            {/* Timeline static Head Months */}
            <div className="flex border-b border-slate-200 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider pb-2">
              <div className="w-48 shrink-0">Construction Phase</div>
              <div className="flex-1 grid grid-cols-9 text-center">
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
              </div>
            </div>

            {/* Scheduler Rows */}
            <div className="divide-y divide-slate-100 my-2 relative">
              {(Object.keys(phaseSchedule) as ConstructionPhase[]).map((phase) => {
                const sched = phaseSchedule[phase];
                const onCrit = isCriticalPath(phase);
                if (criticalPathOnly && !onCrit) return null;

                const positions = getPositionStyles(sched.start, sched.end);

                return (
                  <div key={phase} className="flex items-center py-3.5 group">
                    {/* Phase description */}
                    <div className="w-48 shrink-0 pr-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800 truncate">{phase}</span>
                        {onCrit && (
                          <span
                            title="Critical Path"
                            className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0"
                          />
                        )}
                      </div>
                      <span className="block text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wide">
                        {sched.tasksCount} Active • {sched.completion}% Done
                      </span>
                    </div>

                    {/* Timeline bar field */}
                    <div className="flex-1 h-8 bg-slate-50/50 rounded-sm relative border-l border-r border-dashed border-slate-100">
                      {/* Gantt Bar represents Phase Range */}
                      <div
                        style={positions}
                        className={`absolute top-1/2 -translate-y-1/2 h-5 rounded-xs border shadow-xs transition-transform hover:scale-[1.01] ${getBarColorClass(
                          sched.status
                        )} flex items-center justify-between px-2 overflow-hidden`}
                      >
                        <span className="text-[9px] font-mono font-bold text-white uppercase truncate">
                          {sched.status}
                        </span>
                        {sched.status === 'Delayed' && (
                          <Clock className="w-3.5 h-3.5 text-white/90 shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Milestone tracking Section */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <GitCommit className="w-5 h-5 text-sky-600" />
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              SCHEDULE MILESTONES (CRITICAL TARGETS)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {milestones.map((ms) => (
              <div
                key={ms.name}
                className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <h4 className="text-xs font-bold text-slate-800">{ms.name}</h4>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-wider ${
                      ms.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-700'
                        : ms.status === 'At Risk'
                        ? 'bg-red-500/10 text-red-700'
                        : 'bg-amber-500/10 text-amber-700'
                    }`}
                  >
                    {ms.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Target: {ms.targetDate}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">{ms.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
