import { db } from '../db';
import { FlowItem, Cluster } from '../types';
import { nanoid } from 'nanoid';

// Simple temporal clustering: items captured within 15 minutes cluster together
const CLUSTER_WINDOW_MS = 15 * 60 * 1000;

export async function autoCluster(itemId: string): Promise<void> {
  const item = await db.items.get(itemId);
  if (!item || item.clusterId) return;

  // Find recent items
  const recentItems = await db.items
    .where('createdAt')
    .between(
      new Date(item.createdAt.getTime() - CLUSTER_WINDOW_MS),
      new Date(item.createdAt.getTime() + CLUSTER_WINDOW_MS)
    )
    .toArray();

  // Look for existing clusters
  const existingCluster = recentItems.find(i => i.clusterId);

  if (existingCluster?.clusterId) {
    // Join existing cluster
    await db.items.update(itemId, { clusterId: existingCluster.clusterId });
    const cluster = await db.clusters.get(existingCluster.clusterId);
    if (cluster) {
      await db.clusters.update(cluster.id, {
        items: [...cluster.items, itemId]
      });
    }
  } else if (recentItems.length > 1) {
    // Create new cluster
    const clusterId = nanoid();
    const cluster: Cluster = {
      id: clusterId,
      items: recentItems.map(i => i.id),
      createdAt: new Date(),
      context: item.energy === 'high' ? 'morning' : item.energy === 'low' ? 'evening' : 'afternoon'
    };

    await db.clusters.add(cluster);
    await Promise.all(
      recentItems.map(i => db.items.update(i.id, { clusterId }))
    );
  }
}

export async function getClusterItems(clusterId: string): Promise<FlowItem[]> {
  return db.items.where('clusterId').equals(clusterId).toArray();
}
