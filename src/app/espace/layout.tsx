import { MemberHeader } from "@/components/MemberHeader";

export default function EspaceLayout({ children }: LayoutProps<"/espace">) {
  return (
    <>
      <MemberHeader />
      <main className="flex-1">{children}</main>
    </>
  );
}
