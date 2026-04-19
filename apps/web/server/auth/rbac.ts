const ROLE_RANK = {
  VIEWER: 10,
  OPERATOR: 20,
  ADMIN: 30,
  OWNER: 40,
} as const;

export type Role = keyof typeof ROLE_RANK;

export function hasMinimumRole(actual: string | null | undefined, required: Role) {
  const normalized = String(actual ?? "VIEWER").toUpperCase();
  const actualRank = ROLE_RANK[normalized as Role] ?? ROLE_RANK.VIEWER;
  return actualRank >= ROLE_RANK[required];
}
