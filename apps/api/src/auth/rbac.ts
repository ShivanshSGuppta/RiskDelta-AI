export const ROLE_RANK = {
  VIEWER: 10,
  OPERATOR: 20,
  ADMIN: 30,
  OWNER: 40,
} as const;

export type Role = keyof typeof ROLE_RANK;

export function normalizeRole(role: string | null | undefined): Role {
  const candidate = String(role ?? "VIEWER").toUpperCase();
  if (candidate in ROLE_RANK) {
    return candidate as Role;
  }

  return "VIEWER";
}

export function hasMinimumRole(actual: string | null | undefined, required: Role) {
  return ROLE_RANK[normalizeRole(actual)] >= ROLE_RANK[required];
}
