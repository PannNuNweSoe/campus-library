
import Link from "next/link";
import { requireStaffUser } from "@/lib/currentUser";
import { SignOutButton } from "@/components/SignOutButton";
import { NotificationBell } from "@/components/NotificationBell";

// Shared shell for Staff/Admin screens.
// requireStaffUser() ensures only staff/admin accounts can access this layout.
export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { supabase, user, profile } = await requireStaffUser();

  const navItems = [
    { href: "/circulation", label: "Circulation Desk" },
    ...(profile.role === "admin"
      ? [{ href: "/admin/users", label: "Admin — Users" }]
      : []),
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Campus Library</div>

        <nav>
          <span className="nav-caption">Library operations</span>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
            >
              {item.label}
            </Link>
          ))}
          <span className="nav-caption nav-caption-spaced">Personal</span>
          <Link href="/dashboard" className="nav-link nav-link-staff">
            Student dashboard
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <span className="user-name">{profile.name}</span>
            <span className="badge badge-info capitalize">
              {profile.role}
            </span>
          </div>

          <SignOutButton />
        </div>
      </aside>

      <div className="portal-workspace">
        <header className="portal-header">
          <div>
            <p className="portal-kicker">Campus Library</p>
            <p className="portal-context">Staff workspace</p>
          </div>
          <div className="portal-header-actions">
            <span className="portal-role capitalize">{profile.role}</span>
            <NotificationBell supabase={supabase} userId={user.id} />
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
