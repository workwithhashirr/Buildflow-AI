/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ProjectMetadata } from '../types';
import { TrendingUp, DollarSign, Users, ShieldAlert, CheckSquare, Layers } from 'lucide-react';

interface AnalyticsDashProps {
  selectedProject: ProjectMetadata;
}

export default function AnalyticsDash({ selectedProject }: AnalyticsDashProps) {
  // Budget breakdown over time (cumulative)
  const budgetAndSpentData = [
    { month: 'Mar', allocated: 2.5, spent: 2.1 },
    { month: 'Apr', allocated: 5.0, spent: 4.5 },
    { month: 'May', allocated: 9.0, spent: 8.2 },
    { month: 'Jun', allocated: 11.0, spent: 9.5 },
    { month: 'Jul', allocated: 12.4, spent: 11.0 },
  ];

  // Project progress percentage trend
  const progressTrendData = [
    { month: 'Mar', progress: 10 },
    { month: 'Apr', progress: 35 },
    { month: 'May', progress: 68 },
    { month: 'Jun', progress: 85 },
    { month: 'Jul', progress: 100 },
  ];

  // Labor strength counts across contractors
  const contractorLaborData = [
    { contractor: 'SolidRock Concrete', crewCount: 24 },
    { contractor: 'Apex Groundworks', crewCount: 16 },
    { contractor: 'Erectors Structural', crewCount: 12 },
    { contractor: 'Delta HVAC & Temp', crewCount: 8 },
    { contractor: 'VoltTech Electrical', crewCount: 6 },
  ];

  // Inspections breakdown data
  const inspectionPieData = [
    { name: 'Passed', value: 14, color: '#10b981' },
    { name: 'Failed (Resolved)', value: 3, color: '#f59e0b' },
    { name: 'Scheduled', value: 4, color: '#3b82f6' },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* Dynamic Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
              AUTHORIZED BUDGET
            </span>
            <span className="block text-xl font-extrabold text-slate-800 mt-1">{selectedProject.budget}</span>
            <span className="block text-[10px] text-slate-400 font-mono font-medium mt-0.5">
              Approved Contract Value
            </span>
          </div>
          <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-500">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
              ACTUAL SPENT TO DATE
            </span>
            <span className="block text-xl font-extrabold text-slate-800 mt-1">{selectedProject.actualSpent}</span>
            <span className="block text-[10px] text-sky-600 font-mono font-semibold mt-0.5">
              {(
                (selectedProject.actualSpentVal / selectedProject.totalBudgetVal) *
                100
              ).toFixed(1)}
              % Utilization
            </span>
          </div>
          <div className="w-10 h-10 rounded bg-sky-50 flex items-center justify-center text-sky-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
              ACTIVE FIELD FORCE
            </span>
            <span className="block text-xl font-extrabold text-slate-800 mt-1">
              {selectedProject.activeWorkers} Crew
            </span>
            <span className="block text-[10px] text-emerald-600 font-mono font-semibold mt-0.5">
              ● All Crews Check-in Safe
            </span>
          </div>
          <div className="w-10 h-10 rounded bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
              CRITICAL FIELD PATH
            </span>
            <span className="block text-xl font-extrabold text-slate-800 mt-1">
              {selectedProject.completion}% Done
            </span>
            <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
              Deadline: {selectedProject.deadline}
            </span>
          </div>
          <div className="w-10 h-10 rounded bg-slate-50 flex items-center justify-center text-slate-500">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Cost & Cash Flow Tracking AreaChart */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="mb-4">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">
              FINANCIALS & CASH FLOW
            </span>
            <h4 className="text-sm font-bold text-slate-800 font-sans mt-0.5">
              Cumulative Allocation vs Act. Spent ($ Millions)
            </h4>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={budgetAndSpentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11, pt: 10 }} />
                <Area
                  name="Allocated Budget"
                  type="monotone"
                  dataKey="allocated"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="none"
                />
                <Area
                  name="Actual Spent"
                  type="monotone"
                  dataKey="spent"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSpent)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Completion Trend LineChart */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="mb-4">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">
              SCHEDULE DISCIPLINE
            </span>
            <h4 className="text-sm font-bold text-slate-800 font-sans mt-0.5">
              Project Progress Curve (%)
            </h4>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Line
                  name="Completion %"
                  type="monotone"
                  dataKey="progress"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Labor Strength BarChart */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="mb-4">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">
              RESOURCE ALLOCATION
            </span>
            <h4 className="text-sm font-bold text-slate-800 font-sans mt-0.5">
              Field Force Headcount by Sub-Contractor
            </h4>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contractorLaborData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="contractor" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar name="Workers on Site" dataKey="crewCount" fill="#475569" radius={[4, 4, 0, 0]}>
                  {contractorLaborData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.contractor.includes('Concrete') ? '#0284c7' : '#475569'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Inspection Metrics pie representation */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="mb-4">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">
              QUALITY CONTROL
            </span>
            <h4 className="text-sm font-bold text-slate-800 font-sans mt-0.5">
              Safety & Regulatory Inspections Status
            </h4>
          </div>
          <div className="h-64 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="w-full md:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inspectionPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {inspectionPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend column */}
            <div className="w-full md:w-1/2 space-y-3">
              {inspectionPieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-xs shrink-0" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs text-slate-600 font-semibold">{entry.name}</span>
                  <span className="ml-auto text-xs font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {entry.value} Checked
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
