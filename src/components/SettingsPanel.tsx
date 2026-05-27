/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Shield, Bell, HelpCircle, Key, Layers, CloudLightning } from 'lucide-react';

export default function SettingsPanel() {
  const [enableWeatherAlerts, setEnableWeatherAlerts] = useState(true);
  const [windThreshold, setWindThreshold] = useState(15);
  const [notifyDaily, setNotifyDaily] = useState(true);
  const [notifyUrgent, setNotifyUrgent] = useState(true);

  return (
    <div className="space-y-6 fade-in max-w-4xl">
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <h3 className="font-sans font-bold text-sm text-slate-800 uppercase tracking-tight flex items-center gap-1.5 mb-2">
          <Settings className="w-5 h-5 text-sky-600" />
          Field Control Parameters
        </h3>
        <p className="text-xs text-slate-500">
          Configure regional compliance thresholds, wind notifications, and supervisor notifications.
        </p>

        {/* Form settings */}
        <div className="mt-6 space-y-6">
          {/* Section 1: Weather Toggles */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <CloudLightning className="w-4 h-4 text-slate-400" />
              Safety & Weather Warning Triggers
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center justify-between p-3.5 border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer">
                <div>
                  <span className="block text-xs font-bold text-slate-800">Crane Safe-Shutdown Monitors</span>
                  <span className="block text-[10px] text-slate-500 leading-normal">
                    Auto-suspend structural rigging if wind velocities cross safety thresholds.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={enableWeatherAlerts}
                  onChange={(e) => setEnableWeatherAlerts(e.target.checked)}
                  className="rounded text-sky-650 focus:ring-sky-500 w-4.5 h-4.5"
                />
              </label>

              <div className="p-3.5 border border-slate-200 rounded-lg space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Rigging Wind Suspend Threshold</span>
                  <span className="font-mono font-bold text-slate-600">{windThreshold} kts</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="35"
                  value={windThreshold}
                  onChange={(e) => setWindThreshold(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="block text-[10px] text-slate-400 font-mono text-right">
                  OSHA Standard: 20 kts maximum
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Alert Rules */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Bell className="w-4.5 h-4.5 text-slate-400" />
              Notifications & Daily Ledgers
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center justify-between p-3.5 border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer">
                <div>
                  <span className="block text-xs font-bold text-slate-800">Daily Superintendent digest</span>
                  <span className="block text-[10px] text-slate-500 leading-normal">
                    Generate daily compliance summaries at 05:00 PM for county submittals.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyDaily}
                  onChange={(e) => setNotifyDaily(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer">
                <div>
                  <span className="block text-xs font-bold text-slate-800">Critical Inspection Reminders</span>
                  <span className="block text-[10px] text-slate-500 leading-normal">
                    Alert the active contractor 24 hours before Scheduled structural signoffs.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyUrgent}
                  onChange={(e) => setNotifyUrgent(e.target.checked)}
                  className="rounded text-sky-650 focus:ring-sky-500"
                />
              </label>
            </div>
          </div>

          {/* Section 3: Diagnostic Security Overview */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Key className="w-4 h-4 text-slate-400" />
              Environment Secrets Alignment
            </h4>

            <div className="bg-slate-50 p-4 border border-slate-250 rounded-lg space-y-3">
              <div className="flex gap-3 text-xs leading-relaxed text-slate-600">
                <Shield className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">AI Studio Secrets Cryptography</span>
                  Your server-side `GEMINI_API_KEY` is managed securely at the platform layer. The container initializes the @google/genai pipeline on application refresh. If you need to customize or replace keys, navigate to the **Secrets panel** inside the outer Google AI Studio workspace UI under standard system security parameters.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
