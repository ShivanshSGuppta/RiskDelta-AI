import { requireUser } from "@/server/auth/session";

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return children;
}
