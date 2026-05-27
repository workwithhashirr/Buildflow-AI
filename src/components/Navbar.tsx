/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProjectMetadata } from '../types';
import {
  Menu,
  Search,
  CloudSun,
  Bell,
  Sliders,
  ChevronDown,
  Info,
} from 'lucide-react';

interface NavbarProps {
  projects: ProjectMetadata[];
  selectedProject: ProjectMetadata;
  setSelectedProject: (project: ProjectMetadata) => void;
  setSidebarOpen: (open: boolean) => void;
}

export default function Navbar({
  projects,
  selectedProject,
  setSelectedProject,
  setSidebarOpen,
}: NavbarProps) {
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Real-world notifications for the Skyline/Oakridge project context
  const notifications = [
    {
      id: 'n1',
      title: 'Structural Inspection Signoff',
      time: '2h ago',
      desc: 'Lead County Surveyor David Vance requested soil bearing log files.',
      urgent: true,
    },
    {
      id: 'n2',
      title: 'Material Order Delivered',
      time: '5h ago',
      desc: '24 tons of structural Grade-50 I-Beams verified at Ground Sector.',
      urgent: false,
    },
    {
      id: 'n3',
      title: 'Safety Warning Remediated',
      time: 'Yesterday',
      desc: 'Jack Vance replaced weathered harness safety lanyards on Scaffold 2.',
      urgent: false,
    },
  ];

  return (
    <header className="sticky top-0 bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between z-40">
      {/* Sidebar trigger + Project title display */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-slate-500 hover:text-slate-800 p-1.5 hover:bg-slate-50 rounded"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Project Selector Tab Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProjectDropdown(!showProjectDropdown)}
            className="flex items-center gap-2 hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-800 transition-colors bg-white shadow-xs"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>{selectedProject.name}</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>

          {showProjectDropdown && (
            <div className="absolute left-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
              <div className="px-3 py-1.5 text-xs font-mono font-bold text-slate-400 border-b border-slate-100 uppercase tracking-widest text-[10px]">
                SELECT ACTIVE WORKSPACE
              </div>
              {projects.map((proj) => (
                <button
                   key={proj.id}
                   onClick={() => {
                     setSelectedProject(proj);
                     setShowProjectDropdown(false);
                   }}
                   className={`w-full text-left px-4 py-3 hover:bg-slate-50 flex flex-col transition-colors ${
                     proj.id === selectedProject.id ? 'bg-blue-50/70 text-blue-700' : 'text-slate-700'
                   }`}
                >
                   <span className="text-sm font-semibold">{proj.name}</span>
                   <span className="text-xs text-slate-500 font-mono mt-0.5">{proj.location}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Right Items */}
      <div className="flex items-center gap-5">
        {/* Environmental / Weather Widget specific to construction sites */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg py-1 px-3 text-xs">
          <CloudSun className="w-4.5 h-4.5 text-amber-500" />
          <div className="text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-800">74°F Clear</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">Wind: 11kts</span>
            </div>
            <div className="text-[10px] text-emerald-600 font-mono font-semibold uppercase leading-none mt-0.5">
              ● Crane Status: Active Safe
            </div>
          </div>
        </div>

        {/* Dynamic Search */}
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents, issues, tasks..."
            className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs w-56 md:w-64 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-sans"
          />
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 hover:bg-slate-50 rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors relative"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                  ALERTS & NOTIFICATIONS
                </span>
                <span className="px-1.5 py-0.5 text-[9px] bg-amber-500/10 text-amber-700 font-bold font-mono uppercase rounded">
                  3 NEW
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-3 border-b border-slate-50 hover:bg-slate-50/50">
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        {notif.urgent && <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>}
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{notif.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{notif.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile section */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="text-right hidden sm:block">
            <span className="block text-xs font-bold text-slate-800 font-sans leading-none">Marcus Vance</span>
            <span className="block text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wide">
              SUPERINTENDENT
            </span>
          </div>
          <div className="w-8 h-8 rounded bg-slate-200 flex-shrink-0 overflow-hidden border border-slate-200">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrOKREo8Fff4qVORi8tlRwEY95dl7xhn0O9_rhLZFVCukFjHeZtTFCHP6fq2lmmjmqiahhaEj66Pj6itJqzS1PZqrNAglSLGArGvXXcZDo7zv0YdvjXhoR03JnKA7m7L_GjkunNMSFisqNJw-t-dRWr6W8jXcr5cqXIUA4Ed-DoFOp_uqdkcujFIyVyAdh4tkQDoY5_vwlieP7Emi4ETUDNk_V1Oj2x0b4dreeA2MTreHPsAnLqCjysa9DXg9qDPYrghUmBqq3uLk"
              alt="Avatar"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
