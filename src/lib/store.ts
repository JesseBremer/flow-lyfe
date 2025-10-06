import { create } from 'zustand';
import { FlowItem, FocusSession } from './types';

interface FlowState {
  // Current view
  currentView: 'stream' | 'lists' | 'focus';
  setCurrentView: (view: FlowState['currentView']) => void;

  // Active focus session
  activeFocusSession: FocusSession | null;
  setActiveFocusSession: (session: FocusSession | null) => void;

  // Quick capture state
  captureOpen: boolean;
  setCaptureOpen: (open: boolean) => void;

  // Selected items (for batch operations)
  selectedItems: string[];
  toggleSelectedItem: (id: string) => void;
  clearSelection: () => void;

  // Energy detection (based on time of day)
  currentEnergy: 'high' | 'medium' | 'low';
  updateEnergy: () => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  currentView: 'stream',
  setCurrentView: (view) => set({ currentView: view }),

  activeFocusSession: null,
  setActiveFocusSession: (session) => set({ activeFocusSession: session }),

  captureOpen: true, // Always available on app open
  setCaptureOpen: (open) => set({ captureOpen: open }),

  selectedItems: [],
  toggleSelectedItem: (id) => set((state) => ({
    selectedItems: state.selectedItems.includes(id)
      ? state.selectedItems.filter(i => i !== id)
      : [...state.selectedItems, id]
  })),
  clearSelection: () => set({ selectedItems: [] }),

  currentEnergy: 'medium',
  updateEnergy: () => {
    const hour = new Date().getHours();
    let energy: 'high' | 'medium' | 'low' = 'medium';

    if (hour >= 6 && hour < 12) energy = 'high'; // Morning
    else if (hour >= 12 && hour < 18) energy = 'medium'; // Afternoon
    else energy = 'low'; // Evening/Night

    set({ currentEnergy: energy });
  }
}));
