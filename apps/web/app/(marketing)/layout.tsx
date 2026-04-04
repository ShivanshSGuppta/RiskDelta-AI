import { PublicPage } from "@/components/marketing/public-shell";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <PublicPage>{children}</PublicPage>;
}
