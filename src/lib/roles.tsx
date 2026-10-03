"use client";

/**
 * The three documented stakeholder experiences.
 * Internal roles stay RBAC permissions — never separate portals (core doc §4).
 * Public is anonymous; researcher and admin experiences are behind a demo
 * sign-in. The session is browser-local only — production binds these roles
 * to NCPOR identity accounts; the signIn/signOut seam is where that swap lands.
 */

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Role } from "@/lib/api/types";

const KEY = "yeti-role";
const SESSION_KEY = "yeti-session";

export interface Session {
  role: Exclude<Role, "public">;
  name: string;
  email: string;
}

interface RoleCtx {
  role: Role;
  session: Session | null;
  /** True once the persisted session has been read from localStorage. */
  ready: boolean;
  signIn: (s: Session) => void;
  signOut: () => void;
  isResearcher: boolean;
  isAdmin: boolean;
}

const Ctx = createContext<RoleCtx>({
  role: "public",
  session: null,
  ready: false,
  signIn: () => {},
  signOut: () => {},
  isResearcher: false,
  isAdmin: false,
});

function isSession(v: unknown): v is Session {
  return (
    !!v &&
    typeof v === "object" &&
    ((v as Session).role === "researcher" || (v as Session).role === "admin") &&
    typeof (v as Session).name === "string" &&
    typeof (v as Session).email === "string"
  );
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("public");
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(KEY);
    if (stored === "researcher" || stored === "admin" || stored === "public") setRoleState(stored);
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isSession(parsed)) setSession(parsed);
        else window.localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      window.localStorage.removeItem(SESSION_KEY);
    }
    setReady(true);
  }, []);

  const signIn = useCallback((s: Session) => {
    setSession(s);
    setRoleState(s.role);
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    window.localStorage.setItem(KEY, s.role);
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
    setRoleState("public");
    window.localStorage.removeItem(SESSION_KEY);
    window.localStorage.setItem(KEY, "public");
  }, []);

  return (
    <Ctx.Provider
      value={{
        role,
        session,
        ready,
        signIn,
        signOut,
        isResearcher: role === "researcher",
        isAdmin: role === "admin",
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useRole() {
  return useContext(Ctx);
}

export const ROLE_LABELS: Record<Role, string> = {
  public: "Public",
  researcher: "Researcher",
  admin: "NCPOR Admin",
};

export const ROLE_GOALS: Record<Role, string> = {
  public: "Discover · Understand · Explore · Learn",
  researcher: "Discover · Trace · Analyse · Connect · Contribute",
  admin: "Ingest · Validate · Review · Approve · Disseminate · Govern",
};

/** Demo accounts shown on the login page — the only accepted identities in this build. */
export const DEMO_ACCOUNTS: Record<Exclude<Role, "public">, Session> = {
  researcher: { role: "researcher", name: "Dr. Meera Iyer", email: "meera@yeti.demo" },
  admin: { role: "admin", name: "Data Steward", email: "steward@ncpor.demo" },
};
