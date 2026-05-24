/**
 * API Client — all calls to the NestJS backend go through here.
 * Tokens are always passed explicitly (from useApi hook or server auth).
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
  isFormData?: boolean;
};

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, token, isFormData = false } = options;

  const headers: Record<string, string> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!isFormData && body) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData
      ? (body as FormData)
      : body
      ? JSON.stringify(body)
      : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    let message = `API error ${res.status}`;
    try {
      const json = JSON.parse(errorText);
      message = json.message || message;
    } catch {}
    throw new Error(message);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json();
}

// ─── Resource helpers ────────────────────────────────────────

export const clientsApi = {
  list: (token: string) =>
    apiFetch<any[]>("/clients", { token }),
  stats: (token: string) =>
    apiFetch<any>("/clients/stats", { token }),
  get: (id: string, token: string) =>
    apiFetch<any>(`/clients/${id}`, { token }),
  create: (data: any, token: string) =>
    apiFetch<any>("/clients", { method: "POST", body: data, token }),
  update: (id: string, data: any, token: string) =>
    apiFetch<any>(`/clients/${id}`, { method: "PUT", body: data, token }),
  updateStatus: (id: string, status: string, token: string) =>
    apiFetch<any>(`/clients/${id}/status`, { method: "PATCH", body: { status }, token }),
};

export const briefsApi = {
  listByClient: (clientId: string, token: string) =>
    apiFetch<any[]>(`/briefs?clientId=${clientId}`, { token }),
  get: (id: string, token: string) =>
    apiFetch<any>(`/briefs/${id}`, { token }),
  create: (data: any, token: string) =>
    apiFetch<any>("/briefs", { method: "POST", body: data, token }),
  update: (id: string, data: any, token: string) =>
    apiFetch<any>(`/briefs/${id}`, { method: "PUT", body: data, token }),
  uploadBrief: (briefId: string, file: File, token: string) => {
    const fd = new FormData();
    fd.append("file", file);
    return apiFetch<any>(`/briefs/${briefId}/upload-brief`, {
      method: "POST", body: fd, isFormData: true, token,
    });
  },
  uploadBrandAsset: (briefId: string, file: File, token: string) => {
    const fd = new FormData();
    fd.append("file", file);
    return apiFetch<any>(`/briefs/${briefId}/upload-brand-asset`, {
      method: "POST", body: fd, isFormData: true, token,
    });
  },
};

export const strategyApi = {
  generate: (briefId: string, token: string) =>
    apiFetch<any>("/strategy/generate", { method: "POST", body: { briefId }, token }),
  listByClient: (clientId: string, token: string) =>
    apiFetch<any[]>(`/strategy?clientId=${clientId}`, { token }),
  get: (id: string, token: string) =>
    apiFetch<any>(`/strategy/${id}`, { token }),
  update: (id: string, data: any, token: string) =>
    apiFetch<any>(`/strategy/${id}`, { method: "PUT", body: data, token }),
  sendToClient: (id: string, token: string) =>
    apiFetch<any>(`/strategy/${id}/send`, { method: "POST", token }),
  resend: (id: string, token: string) =>
    apiFetch<any>(`/strategy/${id}/resend`, { method: "POST", token }),
  approve: (id: string, action: "APPROVED" | "CHANGES_REQUESTED", comment: string, token: string) =>
    apiFetch<any>(`/strategy/${id}/approve`, { method: "POST", body: { action, comment }, token }),
};

export const projectsApi = {
  create: (data: any, token: string) =>
    apiFetch<any>("/projects", { method: "POST", body: data, token }),
  listByClient: (clientId: string, token: string) =>
    apiFetch<any[]>(`/projects?clientId=${clientId}`, { token }),
  get: (id: string, token: string) =>
    apiFetch<any>(`/projects/${id}`, { token }),
  generateCalendar: (id: string, token: string) =>
    apiFetch<any>(`/projects/${id}/generate-calendar`, { method: "POST", token }),
};

export const postsApi = {
  listByProject: (projectId: string, token: string) =>
    apiFetch<any[]>(`/posts?projectId=${projectId}`, { token }),
  listByClient: (clientId: string, token: string) =>
    apiFetch<any[]>(`/posts?clientId=${clientId}`, { token }),
  approvalQueue: (clientId: string, token: string) =>
    apiFetch<any[]>(`/posts/approval-queue?clientId=${clientId}`, { token }),
  get: (id: string, token: string) =>
    apiFetch<any>(`/posts/${id}`, { token }),
  update: (id: string, data: any, token: string) =>
    apiFetch<any>(`/posts/${id}`, { method: "PUT", body: data, token }),
  approve: (id: string, action: "APPROVED" | "CHANGES_REQUESTED", comment: string, token: string) =>
    apiFetch<any>(`/posts/${id}/approve`, { method: "POST", body: { action, comment }, token }),
  expandCaption: (id: string, token: string) =>
    apiFetch<any>(`/posts/${id}/expand-caption`, { method: "POST", token }),
  improveField: (id: string, field: string, instruction: string, token: string) =>
    apiFetch<{ suggestion: string | string[] }>(`/posts/${id}/improve-field`, {
      method: "POST", body: { field, instruction }, token,
    }),
};

export const assetsApi = {
  upload: (postId: string, file: File, notes: string, token: string) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("postId", postId);
    fd.append("notes", notes);
    return apiFetch<any>("/assets/upload", { method: "POST", body: fd, isFormData: true, token });
  },
  listByPost: (postId: string, token: string) =>
    apiFetch<any[]>(`/assets?postId=${postId}`, { token }),
};

export const publishingApi = {
  getQueue: (token: string, clientId?: string) =>
    apiFetch<any[]>(`/publishing/queue${clientId ? `?clientId=${clientId}` : ""}`, { token }),
  getLog: (token: string, clientId?: string) =>
    apiFetch<any[]>(`/publishing/log${clientId ? `?clientId=${clientId}` : ""}`, { token }),
  queueProject: (projectId: string, token: string) =>
    apiFetch<any>(`/publishing/queue/${projectId}`, { method: "POST", token }),
  publishPost: (postId: string, token: string) =>
    apiFetch<any>(`/publishing/publish/${postId}`, { method: "POST", token }),
  retryFailed: (postId: string, token: string) =>
    apiFetch<any>(`/publishing/retry/${postId}`, { method: "POST", token }),
};

export const usersApi = {
  me: (token: string) => apiFetch<any>("/users/me", { token }),
  list: (token: string) => apiFetch<any[]>("/users", { token }),
  updateRole: (id: string, role: string, token: string) =>
    apiFetch<any>(`/users/${id}/role`, { method: "PATCH", body: { role }, token }),
};

export const socialAuthApi = {
  connectUrl: (platform: string, clientId: string, token: string) =>
    apiFetch<{ url: string }>(`/social-auth/${platform}/connect-url?clientId=${clientId}`, { token }),
  listConnections: (clientId: string, token: string) =>
    apiFetch<any[]>(`/social-auth/connections?clientId=${clientId}`, { token }),
  disconnect: (connectionId: string, clientId: string, token: string) =>
    apiFetch<any>(`/social-auth/connections/${connectionId}?clientId=${clientId}`, {
      method: "DELETE", token,
    }),
};

export const notificationsApi = {
  list: (token: string, unread?: boolean) =>
    apiFetch<any[]>(`/notifications${unread ? "?unread=true" : ""}`, { token }),
  unreadCount: (token: string) =>
    apiFetch<{ count: number }>("/notifications/unread-count", { token }),
  markRead: (id: string, token: string) =>
    apiFetch<any>(`/notifications/${id}/read`, { method: "PATCH", token }),
  markAllRead: (token: string) =>
    apiFetch<any>("/notifications/read-all", { method: "PATCH", token }),
  delete: (id: string, token: string) =>
    apiFetch<any>(`/notifications/${id}`, { method: "DELETE", token }),
};
