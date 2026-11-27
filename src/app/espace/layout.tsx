import { MemberHeader } from "@/components/MemberHeader";
import { DeconnexionInactivite } from "@/components/DeconnexionInactivite";

export default function EspaceLayout({ children }: LayoutProps<"/espace">) {
  return (
    <>
      <DeconnexionInactivite />
      <MemberHeader />
      <main className="flex-1">{children}</main>
    </>
  );
}
