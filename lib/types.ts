export type CaptureType = 'text' | 'voice' | 'image' | 'bill';

export type ItemStatus = 'stream' | 'current' | 'flow' | 'archived' | 'someday';

export interface FlowItem {
  id: string;
  content: string;
  type: CaptureType;
  status: ItemStatus;
  createdAt: Date;
  updatedAt: Date;

  // Natural clustering metadata
  clusterId?: string;
  energy?: 'high' | 'medium' | 'low'; // Detected from time of day
  temperature?: number; // 0-100, urgency emerging over time

  // Optional rich data
  dueDate?: Date;
  category?: string;
  tags?: string[];

  // Anchor tracking
  surfaceCount?: number; // How many times it's surfaced
  lastSurfaced?: Date;
  isAnchor?: boolean; // Items that repeatedly surface
}

export interface Cluster {
  id: string;
  items: string[]; // Item IDs
  createdAt: Date;
  keywords?: string[];
  context?: string; // morning, evening, work, personal
}

export interface FocusSession {
  id: string;
  itemId?: string;
  duration: number; // minutes
  startedAt: Date;
  completedAt?: Date;
  type: 'pomodoro' | 'flow'; // Pomodoro = 25min blocks, Flow = unlimited
}

export interface Reflection {
  id: string;
  date: Date;
  content: string;
  itemsProcessed: number;
  itemsCompleted: number;
  anchorsIdentified: string[]; // Item IDs
}
