import { nanoid } from 'nanoid';
import { db } from '../db';
import { FlowItem, CaptureType } from '../types';

export async function captureItem(
  content: string,
  type: CaptureType = 'text'
): Promise<FlowItem> {
  const hour = new Date().getHours();
  let energy: 'high' | 'medium' | 'low' = 'medium';

  if (hour >= 6 && hour < 12) energy = 'high';
  else if (hour >= 12 && hour < 18) energy = 'medium';
  else energy = 'low';

  const item: FlowItem = {
    id: nanoid(),
    content,
    type,
    status: 'stream',
    createdAt: new Date(),
    updatedAt: new Date(),
    energy,
    temperature: 0,
    surfaceCount: 0
  };

  await db.items.add(item);
  return item;
}

export async function updateItemStatus(
  id: string,
  status: FlowItem['status']
): Promise<void> {
  await db.items.update(id, {
    status,
    updatedAt: new Date()
  });
}

export async function archiveItem(id: string): Promise<void> {
  await updateItemStatus(id, 'archived');
}

export async function surfaceItem(id: string): Promise<void> {
  const item = await db.items.get(id);
  if (!item) return;

  const surfaceCount = (item.surfaceCount || 0) + 1;
  const isAnchor = surfaceCount >= 3; // Becomes anchor after 3 surfaces

  await db.items.update(id, {
    status: 'current',
    surfaceCount,
    lastSurfaced: new Date(),
    isAnchor,
    updatedAt: new Date()
  });
}
