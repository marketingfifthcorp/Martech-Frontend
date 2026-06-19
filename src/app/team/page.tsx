"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useApi } from "@/hooks/useApi";
import { useRoleGuard } from "@/hooks/useRoleGuard";

const ROLE_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  ADMIN: { bg: "var(--gb)", color: "var(--green)", border: "var(--gbb)" },
  DESIGNER: { bg: "var(--pb)", color: "var(--purple)", border: "var(--pbb)" },
  CLIENT: { bg: "var(--bb)", color: "var(--blue)", border: "var(--bbb)" },
};
const ROLE_PILL: Record<string, string> = {
  ADMIN: "plgg", DESIGNER: "plpg", CLIENT: "plbg",
};
const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Super Admin", DESIGNER: "Designer", CLIENT: "Account Manager",
};

const PERMISSIONS = [
  { label: "Manage clients & onboarding", admin: true, manager: true, designer: false },
  { label: "Edit & approve strategy", admin: true, manager: true, designer: false },
  { label: "Manage content calendars", admin: true, manager: true, designer: false },
  { label: "Approve creative", admin: true, manager: true, designer: false },
  { label: "Upload creative files", admin: true, manager: false, designer: true },
  { label: "Send to client for approval", admin: true, manager: true, designer: false },
  { label: "Manage publishing", admin: true, manager: true, designer: false },
  { label: "View analytics", admin: true, manager: true, designer: true },
  { label: "Manage team & billing", admin: true, manager: false, designer: false },
  { label: "Edit agency settings", admin: true, manager: false, designer: false },
];

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";
}

export default function TeamPage() {
  const api = useApi();
  const { checking } = useRoleGuard(["ADMIN"]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [inviteModal, setInviteModal] = useState(false);

  useEffect(() => {
    if (checking) return;
    (async () => {
      try {
        const [all, me] = await Promise.all([api.users.list(), api.users.me()]);
        setUsers(all);
        setCurrentUser(me);
      } catch {}
      finally { setLoading(false); }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checking]);

  async function changeRole(userId: string, role: string) {
    try {
      await api.users.updateRole(userId, role);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u));
    } catch {}
  }

  if (checking) return null;

  return (
    <DashboardShell
      title="Team"
      actionButton={
        <button className="gb gbp" onClick={() => setInviteModal(true)}>
          <i className="ti ti-user-plus" /> Invite member
        </button>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <div className="sa">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div className="slb">Team members ({users.length})</div>
          </div>

          {/* Member cards */}
          {loading ? (
            <div className="g4" style={{ marginBottom: 20 }}>
              {[1,2,3,4].map((i) => <div key={i} className="mcard" style={{ height: 140, animation: "pulse 1.5s ease infinite" }} />)}
            </div>
          ) : (
            <div className="g4" style={{ marginBottom: 20 }}>
              {users.map((u) => {
                const c = ROLE_COLORS[u.role] ?? ROLE_COLORS.CLIENT;
                const isMe = u.id === currentUser?.id;
                return (
                  <div key={u.id} className="mcard">
                    <div className="mav" style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}>
                      {getInitials(u.firstName, u.lastName)}
                    </div>
                    <div className="mnam">{[u.firstName, u.lastName].filter(Boolean).join(" ") || u.email}</div>
                    <div className="mrol">{ROLE_LABEL[u.role] ?? u.role}{isMe && " · Founder"}</div>
                    <span className={`pl ${ROLE_PILL[u.role] ?? "plbg"}`} style={{ fontSize: 9 }}>{ROLE_LABEL[u.role] ?? u.role}</span>
                    {!isMe && (
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        style={{ marginTop: 10, width: "100%", background: "var(--fi)", border: "1px solid var(--fi-b)", borderRadius: 7, padding: "5px 8px", fontSize: 10, color: "var(--t2)", outline: "none", cursor: "pointer", fontFamily: "Inter,system-ui" }}
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="DESIGNER">Designer</option>
                        <option value="CLIENT">Client</option>
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Permissions table */}
          <div className="cd">
            <div className="cdt">Role permissions</div>
            <div style={{ overflowX: "auto" }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Permission</th>
                    <th style={{ textAlign: "center" }}>Super Admin</th>
                    <th style={{ textAlign: "center" }}>Account Manager</th>
                    <th style={{ textAlign: "center" }}>Designer</th>
                  </tr>
                </thead>
                <tbody>
                  {PERMISSIONS.map((p) => (
                    <tr key={p.label}>
                      <td style={{ fontSize: 11, color: "var(--t2)", fontWeight: 300 }}>{p.label}</td>
                      <td style={{ textAlign: "center" }}>
                        {p.admin ? <div className="py" style={{ margin: "0 auto" }}><i className="ti ti-check" style={{ fontSize: 11, color: "var(--green)" }} /></div> : <div className="pn2" style={{ margin: "0 auto" }}><i className="ti ti-minus" style={{ fontSize: 10, color: "var(--t4)" }} /></div>}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {p.manager ? <div className="py" style={{ margin: "0 auto" }}><i className="ti ti-check" style={{ fontSize: 11, color: "var(--green)" }} /></div> : <div className="pn2" style={{ margin: "0 auto" }}><i className="ti ti-minus" style={{ fontSize: 10, color: "var(--t4)" }} /></div>}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {p.designer ? <div className="py" style={{ margin: "0 auto" }}><i className="ti ti-check" style={{ fontSize: 11, color: "var(--green)" }} /></div> : <div className="pn2" style={{ margin: "0 auto" }}><i className="ti ti-minus" style={{ fontSize: 10, color: "var(--t4)" }} /></div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Invite modal */}
      {inviteModal && (
        <div className="mo" onClick={(e) => { if (e.target === e.currentTarget) setInviteModal(false); }}>
          <div className="mb" style={{ maxWidth: 520 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div><div className="mbt">Invite team member</div><div className="mbs" style={{ marginBottom: 0 }}>Send an email invite to join your ZYR workspace.</div></div>
              <button className="gb gbg gbs" onClick={() => setInviteModal(false)}><i className="ti ti-x" /></button>
            </div>
            <div className="fg" style={{ marginBottom: 12 }}>
              <div className="fl"><label>First name</label><input type="text" placeholder="Sara" /></div>
              <div className="fl"><label>Last name</label><input type="text" placeholder="Ahmed" /></div>
            </div>
            <div className="fl" style={{ marginBottom: 12 }}><label>Work email</label><input type="email" placeholder="sara@agency.io" /></div>
            <div className="fl" style={{ marginBottom: 16 }}>
              <label>Role</label>
              <select>
                <option value="ADMIN">Account Manager — manage clients, calendars, approvals</option>
                <option value="DESIGNER">Designer — upload creative files only</option>
                <option value="CLIENT">Client — portal access only</option>
              </select>
            </div>
            <div style={{ background: "var(--in)", border: "1px solid var(--in-b)", borderRadius: 8, padding: "10px 12px", fontSize: 10, color: "var(--t4)", marginBottom: 16, lineHeight: 1.6, fontWeight: 300 }}>
              <i className="ti ti-info-circle" style={{ color: "var(--green)", fontSize: 11, verticalAlign: -1, marginRight: 4 }} />
              They&apos;ll receive an email with a link to set their password and access the workspace.
            </div>
            <div className="mbb">
              <button className="gb gbg" onClick={() => setInviteModal(false)}>Cancel</button>
              <button className="gb gbp" onClick={() => setInviteModal(false)}><i className="ti ti-send" /> Send invite</button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
