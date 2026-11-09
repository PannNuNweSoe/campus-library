
import Link from "next/link";
import { requireDashboardUser } from "@/lib/currentUser";
import { SignOutButton } from "@/components/SignOutButton";
import { NotificationBell } from "@/components/NotificationBell";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/browse", label: "Browse Books" },
  { href: "/loans", label: "My Loans" },
  { href: "/reservations", label: "My Reservations" },
  { href: "/profile", label: "Profile" },
];

// Shared shell for the Student Portal.
// requireDashboardUser() ensures only student accounts can access this layout.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { supabase, user } = await requireDashboardUser();

  const { data: profile } = await supabase
    .from("users")
    .select("name, role, eligibility_status")
    .eq("id", user.id)
    .single();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Campus Library</div>

        <nav>
          <span className="nav-caption">Student portal</span>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
            >
              {item.label}
            </Link>
          ))}
          {(profile?.role === "staff" || profile?.role === "admin") && (
            <>
              <span className="nav-caption nav-caption-spaced">Library team</span>
              <Link href="/circulation" className="nav-link nav-link-staff">
                Staff tools
              </Link>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <span className="user-name">
              {profile?.name ?? user.email}
            </span>
            <span className="badge badge-info capitalize">
              {profile?.role ?? "student"}
            </span>

            {profile?.eligibility_status === "ineligible" && (
              <span className="badge badge-danger">
                Not eligible to borrow
              </span>
            )}
          </div>

          <SignOutButton />
        </div>
      </aside>

      <div className="portal-workspace">
        <header className="portal-header">
          <div>
            <p className="portal-kicker">Campus Library</p>
            <p className="portal-context">Student portal</p>
          </div>
          <div className="portal-header-actions">
            <span className="portal-role">Student</span>
            <NotificationBell supabase={supabase} userId={user.id} />
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
