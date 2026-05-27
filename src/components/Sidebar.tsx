/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BarChart3,
  FileText,
  Sparkles,
  Settings,
  HardHat,
  HelpCircle,
  LogOut,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', name: 'Tasks', icon: CheckSquare },
    { id: 'scheduling', name: 'Scheduling', icon: Calendar },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'documentation', name: 'Documentation', icon: FileText },
    { id: 'ai-insights', name: 'AI Insights', icon: Sparkles },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <HardHat className="w-4 h-4 text-white transform -rotate-12" />
            </div>
            <div>
              <span className="font-sans font-bold text-lg text-white tracking-tight block leading-none">BuildFlow AI</span>
              <span className="block font-mono text-[9px] text-blue-400 font-bold tracking-widest uppercase mt-1">
                CONSTRUCT-TECH
              </span>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-all focus:outline-none cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-150 hover:bg-slate-800'
                }`}
              >
                <IconComponent className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-450' : 'text-slate-400'}`} />
                <span>{item.name}</span>
                {item.id === 'ai-insights' && (
                  <span className="ml-auto bg-blue-600 text-[10px] text-white px-1.5 py-0.5 rounded-full uppercase font-bold shrink-0">
                    Pro
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* System Status Tracker */}
        <div className="px-4 py-2">
          <div className="bg-slate-800 rounded-xl p-3.5 border border-slate-700/30">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">System Status</span>
            </div>
            <p className="text-slate-200 text-xs font-medium">Syncing Daily Log... 84%</p>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20 space-y-0.5 shrink-0">
          <button className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-100 hover:bg-slate-800/30 transition-colors">
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>Help Center</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-red-400 hover:bg-red-950/10 transition-colors">
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
