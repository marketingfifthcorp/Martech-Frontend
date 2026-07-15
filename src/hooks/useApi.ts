"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";
import {
  clientsApi, briefsApi, strategyApi,
  projectsApi, postsApi, assetsApi, publishingApi, usersApi, notificationsApi, socialAuthApi,
  analyticsApi,
} from "@/lib/api";

// Module-level cache — shared across all hook instances, persists across re-renders
let _cachedToken: string | null = null;
let _tokenExpiresAt = 0;

/**
 * useApi — returns all API resource methods pre-bound with the active Clerk token.
 * Usage: const { clients } = useApi();
 *        const data = await clients.list();
 */
export function useApi() {
  const { getToken } = useAuth();

  const token = useCallback(async () => {
    const now = Date.now();
    if (_cachedToken && now < _tokenExpiresAt) return _cachedToken;
    const t = await getToken();
    if (!t) throw new Error("Not authenticated");
    _cachedToken = t;
    _tokenExpiresAt = now + 30_000; // cache for 30 seconds
    return t;
  }, [getToken]);

  return {
    clients: {
      list: async () => clientsApi.list(await token()),
      stats: async () => clientsApi.stats(await token()),
      get: async (id: string) => clientsApi.get(id, await token()),
      getOverview: async (id: string) => clientsApi.getOverview(id, await token()),
      create: async (data: any) => clientsApi.create(data, await token()),
      update: async (id: string, data: any) => clientsApi.update(id, data, await token()),
      updateStatus: async (id: string, status: string) =>
        clientsApi.updateStatus(id, status, await token()),
      remove: async (id: string) => clientsApi.remove(id, await token()),
    },
    briefs: {
      listByClient: async (clientId: string) => briefsApi.listByClient(clientId, await token()),
      get: async (id: string) => briefsApi.get(id, await token()),
      create: async (data: any) => briefsApi.create(data, await token()),
      update: async (id: string, data: any) => briefsApi.update(id, data, await token()),
      uploadBrief: async (briefId: string, file: File) =>
        briefsApi.uploadBrief(briefId, file, await token()),
      uploadBrandAsset: async (briefId: string, file: File) =>
        briefsApi.uploadBrandAsset(briefId, file, await token()),
    },
    strategy: {
      generate: async (briefId: string) => strategyApi.generate(briefId, await token()),
      listByClient: async (clientId: string) => strategyApi.listByClient(clientId, await token()),
      get: async (id: string) => strategyApi.get(id, await token()),
      update: async (id: string, data: any) => strategyApi.update(id, data, await token()),
      sendToClient: async (id: string) => strategyApi.sendToClient(id, await token()),
      resend: async (id: string) => strategyApi.resend(id, await token()),
      approve: async (id: string, action: "APPROVED" | "CHANGES_REQUESTED", comment: string) =>
        strategyApi.approve(id, action, comment, await token()),
    },
    projects: {
      create: async (data: any) => projectsApi.create(data, await token()),
      listByClient: async (clientId: string) => projectsApi.listByClient(clientId, await token()),
      get: async (id: string) => projectsApi.get(id, await token()),
      generateCalendar: async (id: string) => projectsApi.generateCalendar(id, await token()),
    },
    posts: {
      listByProject: async (projectId: string) => postsApi.listByProject(projectId, await token()),
      listByClient: async (clientId: string) => postsApi.listByClient(clientId, await token()),
      approvalQueue: async (clientId: string) => postsApi.approvalQueue(clientId, await token()),
      get: async (id: string) => postsApi.get(id, await token()),
      update: async (id: string, data: any) => postsApi.update(id, data, await token()),
      approve: async (id: string, action: "APPROVED" | "CHANGES_REQUESTED", comment: string) =>
        postsApi.approve(id, action, comment, await token()),
      expandCaption: async (id: string) => postsApi.expandCaption(id, await token()),
      improveField: async (id: string, field: string, instruction: string) =>
        postsApi.improveField(id, field, instruction, await token()),
      markCreativeUploaded: async (id: string) => postsApi.markCreativeUploaded(id, await token()),
      updateStatus: async (id: string, status: string) => postsApi.updateStatus(id, status, await token()),
    },
    assets: {
      upload: async (postId: string, file: File, notes: string) =>
        assetsApi.upload(postId, file, notes, await token()),
      listByPost: async (postId: string) => assetsApi.listByPost(postId, await token()),
    },
    publishing: {
      getQueue: async (clientId?: string) => publishingApi.getQueue(await token(), clientId),
      getLog: async (clientId?: string) => publishingApi.getLog(await token(), clientId),
      queueProject: async (projectId: string) => publishingApi.queueProject(projectId, await token()),
      publishPost: async (postId: string) => publishingApi.publishPost(postId, await token()),
      retryFailed: async (postId: string) => publishingApi.retryFailed(postId, await token()),
    },
    users: {
      me: async () => usersApi.me(await token()),
      list: async () => usersApi.list(await token()),
      updateRole: async (id: string, role: string) => usersApi.updateRole(id, role, await token()),
      invite: async (email: string, role: string) => usersApi.invite(email, role, await token()),
    },
    socialAuth: {
      connectUrl: async (platform: string, clientId: string) =>
        socialAuthApi.connectUrl(platform, clientId, await token()),
      listConnections: async (clientId: string) =>
        socialAuthApi.listConnections(clientId, await token()),
      disconnect: async (connectionId: string, clientId: string) =>
        socialAuthApi.disconnect(connectionId, clientId, await token()),
    },
    notifications: {
      list: async (unread?: boolean) => notificationsApi.list(await token(), unread),
      unreadCount: async () => notificationsApi.unreadCount(await token()),
      markRead: async (id: string) => notificationsApi.markRead(id, await token()),
      markAllRead: async () => notificationsApi.markAllRead(await token()),
      delete: async (id: string) => notificationsApi.delete(id, await token()),
    },
    analytics: {
      get: async (clientId: string, period: string) =>
        analyticsApi.get(clientId, period, await token()),
      seedFollowerSnapshot: async () => analyticsApi.seedFollowerSnapshot(await token()),
    },
  };
}
