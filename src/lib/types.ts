export type CaptureType = 'text' | 'voice' | 'image' | 'bill';

// New category system for processing
export type ItemCategory =
  | 'thought'      // Random thoughts/ideas - just capture them
  | 'idea'         // Similar to thoughts, but actionable potential
  | 'todo'         // Actionable task
  | 'contact'      // Person to add to contacts
  | 'event'        // Calendar event
  | 'bill'         // Bill/payment reminder
  | 'uncategorized'; // Not yet processed

// Status now includes list placement
export type ItemStatus =
  | 'inbox'        // Captured, not processed
  | 'today'        // Today's to-do list
  | 'someday'      // Someday/Maybe list
  | 'awaiting'     // Waiting for response/blocked
  | 'archived';    // Completed or discarded

export interface FlowItem {
  id: string;
  content: string;
  type: CaptureType;
  category: ItemCategory;
  status: ItemStatus;
  createdAt: Date;
  updatedAt: Date;

  // Natural clustering metadata
  clusterId?: string;
  energy?: 'high' | 'medium' | 'low'; // Detected from time of day
  temperature?: number; // 0-100, urgency emerging over time

  // Category-specific data
  dueDate?: Date;
  tags?: string[];

  // Contact-specific
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;

  // Event-specific
  eventDate?: Date;
  eventEndDate?: Date;
  eventLocation?: string;

  // Awaiting-specific
  awaitingFrom?: string; // Who you're waiting for
  awaitingNote?: string; // What you're waiting for

  // Bill-specific
  billAmount?: number;
  billDueDate?: Date;

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
