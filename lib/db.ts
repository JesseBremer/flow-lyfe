import Dexie, { Table } from 'dexie';
import { FlowItem, Cluster, FocusSession, Reflection } from './types';

export class FlowLyfeDB extends Dexie {
  items!: Table<FlowItem>;
  clusters!: Table<Cluster>;
  focusSessions!: Table<FocusSession>;
  reflections!: Table<Reflection>;

  constructor() {
    super('FlowLyfeDB');

    this.version(2).stores({
      items: 'id, status, category, createdAt, dueDate, clusterId, isAnchor',
      clusters: 'id, createdAt',
      focusSessions: 'id, startedAt, itemId',
      reflections: 'id, date'
    });
  }
}

export const db = new FlowLyfeDB();
