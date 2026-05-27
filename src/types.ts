/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'Not Started' | 'In Progress' | 'Delayed' | 'Completed';

export type ConstructionPhase =
  | 'Site Preparation'
  | 'Excavation'
  | 'Foundation'
  | 'Structural'
  | 'Roofing'
  | 'Electrical'
  | 'Plumbing'
  | 'HVAC'
  | 'Finishing'
  | 'Inspection';

export interface Task {
  id: string;
  name: string;
  phase: ConstructionPhase;
  assignedContractor: string;
  priority: PriorityLevel;
  status: TaskStatus;
  startDate: string;
  endDate: string;
  completion: number; // 0 - 100
  dependencies: string[]; // List of other task names/IDs
  notes?: string;
}

export interface Inspection {
  id: string;
  name: string;
  inspector: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Passed' | 'Failed';
  notes?: string;
}

export interface DailyLog {
  id: string;
  type: 'daily_report' | 'issue_log' | 'safety_observation' | 'inspection_record' | 'material_delivery';
  title: string;
  notes: string;
  timestamp: string;
  author: string;
  status: 'Draft' | 'Submitted' | 'Resolved' | 'Delivered' | 'Pending';
  imageUrl?: string;
}

export interface ProjectMetadata {
  id: string;
  name: string;
  location: string;
  type: 'Commercial' | 'Residential';
  budget: string;
  actualSpent: string;
  completion: number;
  safetyDays: number;
  activeWorkers: number;
  deadline: string;
  activePhase: string;
  totalBudgetVal: number;
  actualSpentVal: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIAnalysis {
  risksList: Array<{
    title: string;
    level: 'Low' | 'Medium' | 'High' | 'Critical';
    description: string;
    mitigation: string;
  }>;
  delayPredictions: Array<{
    phase: string;
    likelihood: string;
    impactDays: number;
    reason: string;
  }>;
  optimizationTips: string[];
}
