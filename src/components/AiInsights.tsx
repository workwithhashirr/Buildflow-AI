/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ProjectMetadata, Task, ChatMessage, AIAnalysis } from '../types';
import { aiPrompts } from '../data/mockData';
import {
  Sparkles,
  Send,
  AlertTriangle,
  Zap,
  RotateCw,
  Clock,
  CheckCircle,
  HelpCircle,
  Shield,
  CornerDownRight,
  Loader2,
} from 'lucide-react';

interface AiInsightsProps {
  selectedProject: ProjectMetadata;
  tasks: Task[];
}

export default function AiInsights({ selectedProject, tasks }: AiInsightsProps) {
  const [activeTab, setActiveTab] = useState<'copilot' | 'diagnostics'>('copilot');

  // Conversational state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Diagnostics / Risk State
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [diagnosing, setDiagnosing] = useState(false);

  // Initialize welcome message when selected project shifts
  useEffect(() => {
    setMessages([
      {
        id: 'msg-init',
        role: 'assistant',
        content: `Welcome Marcus. I am **BuildFlow AI Co-Pilot**, specializing in construction scheduling networks and material delay mitigations.

I have finalized scanning the metadata for the active site **${selectedProject.name}**. 

How can I help coordinate operations or inspect resource pipelines?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    triggerDiagnostics(true); // Pre-warm diagnostics quietly or fast
  }, [selectedProject]);

  // Scroll viewport down when chat appends messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Send message to Express backend Gemini AI chat
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || chatLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          projectName: selectedProject.name,
          tasks: tasks,
          history: messages.map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('API server failed');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `ast-err-${Date.now()}`,
          role: 'assistant',
          content: 'I observed a temporary interruption reaching the remote Gemini pipeline. However, based on standard site guidelines, ensure wind speeds under 15kts before concrete staging.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Trigger systematic risk diagnostics from Gemini structured schema
  const triggerDiagnostics = async (silent = false) => {
    if (!silent) setDiagnosing(true);
    try {
      const response = await fetch('/api/gemini/analyze-risks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: selectedProject.name,
          tasks: tasks,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
      }
    } catch (error) {
      console.error('Failed to run diagnostics:', error);
    } finally {
      if (!silent) setDiagnosing(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'bg-red-500/10 text-red-700 border-red-200';
      case 'High':
        return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-700 border-amber-200';
      default:
        return 'bg-sky-500/10 text-sky-700 border-sky-200';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 fade-in h-[750px]">
      {/* Tab Selector Left Column - Occupies 2 Columns on large, 1 on small */}
      <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg flex flex-col h-full overflow-hidden shadow-xs">
        {/* Panel Switcher */}
        <div className="h-14 px-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('copilot')}
              className={`text-xs font-mono font-bold tracking-wider py-1.5 px-3 rounded uppercase transition-colors ${
                activeTab === 'copilot' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              BUILDING CO-PILOT
            </button>
            <button
              onClick={() => {
                setActiveTab('diagnostics');
                if (!analysis) triggerDiagnostics();
              }}
              className={`text-xs font-mono font-bold tracking-wider py-1.5 px-3 rounded uppercase transition-colors ${
                activeTab === 'diagnostics' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              PREDICTIVE RISK ENGINE
            </button>
          </div>

          <span className="flex items-center gap-1.5 text-xs text-sky-700 font-bold bg-sky-50 px-2 py-1 rounded">
            <Sparkles className="w-4 h-4" />
            <span className="font-mono text-[10px]">GEMINI PRO-3.5</span>
          </span>
        </div>

        {/* Dynamic Panels */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === 'copilot' ? (
            /* CONVERSATIONAL CHAT SCREEN */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Message scroll list */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-3 max-w-[80%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    {/* Icon indicator */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        m.role === 'user' ? 'bg-sky-100 text-sky-700' : 'bg-slate-900 text-white'
                      }`}
                    >
                      {m.role === 'user' ? 'M' : 'AI'}
                    </div>

                    <div className="space-y-1">
                      <div
                        className={`p-3.5 rounded-lg text-xs leading-relaxed border ${
                          m.role === 'user'
                            ? 'bg-sky-600 border-sky-600 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        {/* Render simple newlines and bold terms markdown gracefully */}
                        <div className="whitespace-pre-wrap">
                          {m.content.split('**').map((chunk, i) => {
                            if (i % 2 === 1) {
                              return <strong key={i} className={m.role === 'user' ? 'text-white font-extrabold' : 'text-slate-900 font-extrabold'}>{chunk}</strong>;
                            }
                            return chunk;
                          })}
                        </div>
                      </div>
                      <span className="block text-[9px] text-slate-400 font-mono text-right">{m.timestamp}</span>
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex gap-3 items-center text-slate-400 text-xs font-mono">
                    <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                    <span>BuildFlow AI is analyzing safety regulations...</span>
                  </div>
                )}
              </div>

              {/* Chat Input row */}
              <div className="p-4 border-t border-slate-200 bg-slate-55">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about schedule impact, critical path, concrete curing guides..."
                    className="flex-1 bg-slate-50 border border-slate-200 text-xs p-3 rounded focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                  <button
                    type="submit"
                    disabled={chatLoading}
                    className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded px-4 py-2.5 flex items-center justify-center transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* PREDICTIVE RISK DIAGNOSTIC SCREEN */
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Diagnose Header block */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                    SYSTEM ANALYTICS FOR SITE {selectedProject.id}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Live schedule dependency vectors compiled with predictive site failure points.
                  </p>
                </div>

                <button
                  onClick={() => triggerDiagnostics()}
                  disabled={diagnosing}
                  className="text-xs font-mono font-bold py-1.5 px-3 border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 rounded"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${diagnosing ? 'animate-spin text-sky-600' : ''}`} />
                  <span>REFRESH ANALYSIS</span>
                </button>
              </div>

              {diagnosing ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
                  <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
                  <span className="text-xs font-mono">Running predictive regression algorithms...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Risks List */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-tight flex items-center gap-1.5 text-red-700">
                      <AlertTriangle className="w-4 h-4" />
                      Identified Site Delays & Danger Vectors
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis?.risksList.map((risk, index) => (
                        <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-2 hover:bg-slate-50/40">
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-xs font-bold text-slate-800 leading-snug">{risk.title}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${getRiskLevelColor(
                                risk.level
                              )}`}
                            >
                              {risk.level}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{risk.description}</p>
                          <div className="pt-2 border-t border-slate-100 flex items-start gap-1.5 text-[10px] text-emerald-800 font-medium">
                            <Shield className="w-3.5 h-3.5 shrink-0 text-emerald-600 mt-0.5" />
                            <span>
                              <strong>AI Mitigation:</strong> {risk.mitigation}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delay predictions */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-tight flex items-center gap-1.5 text-slate-700">
                      <Clock className="w-4 h-4 text-slate-500" />
                      Phase Timeline Forecast Impact
                    </h5>

                    <div className="divide-y divide-slate-100">
                      {analysis?.delayPredictions.map((dp, i) => (
                        <div key={i} className="py-2.5 flex items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <CornerDownRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <div>
                              <span className="text-xs font-bold text-slate-800">{dp.phase}</span>
                              <span className="block text-[10px] text-slate-500 mt-0.5 leading-normal">
                                {dp.reason}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="block text-xs font-extrabold text-red-600">
                              +{dp.impactDays} Days
                            </span>
                            <span className="block text-[9px] text-slate-400 font-mono font-bold uppercase">
                              {dp.likelihood}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Optimization tips */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-tight flex items-center gap-1.5 text-emerald-700">
                      <Zap className="w-4 h-4" />
                      AI Optimization Best-Practices Suggestions
                    </h5>
                    <ul className="space-y-2 bg-emerald-50/50 p-4 border border-emerald-100 rounded-lg">
                      {analysis?.optimizationTips.map((tip, i) => (
                        <li key={i} className="text-xs text-emerald-900 flex items-start gap-2 leading-relaxed">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Suggested Prompts sidebar (Right Column) - Occupies 1 Column */}
      <div className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg p-5 flex flex-col justify-between h-full shadow-xs">
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              SUGGESTED AI RUNS
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Click any instant macro prompt to feed site scheduling matrices into our deep analysis chatbot:
          </p>

          <div className="space-y-3">
            {aiPrompts.map((promptText, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveTab('copilot');
                  handleSendMessage(promptText);
                }}
                disabled={chatLoading}
                className="w-full text-left p-3 rounded bg-slate-800 hover:bg-slate-700 text-xs transition-colors hover:text-white border border-slate-700/50 hover:border-slate-600 leading-snug font-sans truncate"
                title={promptText}
              >
                {promptText}
              </button>
            ))}
          </div>
        </div>

        {/* Co-Pilot safety reminder footer */}
        <div className="pt-4 border-t border-slate-800 mt-5">
          <div className="flex gap-2.5 items-start text-[11px] text-slate-400">
            <Shield className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Regulated Guidance Safety Warning:</span>
              AI recommendations operate strictly as decision-support heuristics. Always cross-compile with local county engineer signoffs before pouring cement slabs.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
