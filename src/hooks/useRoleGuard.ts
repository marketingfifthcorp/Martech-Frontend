"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "./useApi";

const ROLE_HOME: Record<string, string> = {
  ADMIN: "/dashboard",
  DESIGNER: "/designer",
  CLIENT: "/client-portal",
};

/**
 * Guards a page to specific roles. Fetches the current user on mount and
 * redirects to the role's home page if they don't belong here.
 * Returns { checking, user } — render nothing (or a spinner) while checking === true.
 */
export function useRoleGuard(allowedRoles: string[]) {
  const api = useApi();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await api.users.me();
        setUser(me);
        if (!allowedRoles.includes(me.role)) {
          router.replace(ROLE_HOME[me.role] ?? "/dashboard");
        }
      } catch {
        // First-time user or network error — let page handle it
      } finally {
        setChecking(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { checking, user };
}
