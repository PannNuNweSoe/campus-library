import Link from "next/link";
import { requireDashboardUser } from "@/lib/currentUser";
import { toBangkokDateString } from "@/lib/dates";

// Dashboard: overview of currently borrowed books, reservations, and
// upcoming due dates (Student Dashboard spec).
export default async function DashboardPage() {
  const { supabase, user } = await requireDashboardUser();

  const [{ data: activeLoans }, { data: reservations }] = await Promise.all([
    supabase
      .from("loans")
      .select("id, due_at, borrowed_at, copies(resources(title))")
      .eq("user_id", user.id)
      .is("returned_at", null)
      .order("due_at", { ascending: true }),
    supabase
      .from("reservations")
      .select("id, status, created_at, ready_at, expires_at, resources(title)")
      .eq("user_id", user.id)
      .in("status", ["pending", "ready"])
      .order("created_at", { ascending: true }),
  ]);

  const loans = (activeLoans ?? []) as any[];
  const activeReservations = (reservations ?? []) as any[];

  const now = new Date();
  const today = toBangkokDateString(now);
  const in3Days = toBangkokDateString(new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000));

  const overdue = loans.filter((l) => toBangkokDateString(new Date(l.due_at)) < today);
  const dueSoon = loans.filter((l) => {
    const d = toBangkokDateString(new Date(l.due_at));
    return d >= today && d <= in3Days;
  });
  const readyReservations = activeReservations.filter((r) => r.status === "ready");

  return (
    <div className="dashboard-page">
      <header className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <p className="eyebrow">YOUR CAMPUS COLLECTION</p>
          <h1>Your reading life, in one place.</h1>
          <p>
            Keep an eye on your loans, plan your next read, and save a place
            for books that are in high demand.
          </p>
          <Link href="/browse" className="btn btn-primary dashboard-browse-link">
            Explore the collection <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="dashboard-hero-art" aria-hidden="true">
          <span className="dashboard-art-sun" />
          <span className="dashboard-art-book dashboard-art-book-back" />
          <span className="dashboard-art-book dashboard-art-book-middle" />
          <span className="dashboard-art-book dashboard-art-book-front" />
          <span className="dashboard-art-caption">READ · WANDER · REPEAT</span>
        </div>
      </header>

      <section className="stat-grid dashboard-stats" aria-label="Library account summary">
        <StatCard label="Active loans" value={loans.length} href="/loans" />
        <StatCard
          label="Overdue"
          value={overdue.length}
          href="/loans"
          tone={overdue.length > 0 ? "danger" : undefined}
        />
        <StatCard
          label="Due within 3 days"
          value={dueSoon.length}
          href="/loans"
          tone={dueSoon.length > 0 ? "warning" : undefined}
        />
        <StatCard label="Reservations" value={activeReservations.length} href="/reservations" />
      </section>

      {readyReservations.length > 0 && (
        <section className="panel">
          <h2>Ready for pickup</h2>
          <ul className="list">
            {readyReservations.map((r) => (
              <li key={r.id}>
                <span>{r.resources?.title ?? "Resource"}</span>
                <span className="badge badge-success">
                  Pick up by {r.expires_at ? new Date(r.expires_at).toLocaleString() : "—"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="panel">
        <h2>Upcoming due dates</h2>
        {loans.length === 0 ? (
          <p className="muted">No active loans.</p>
        ) : (
          <ul className="list">
            {loans.slice(0, 5).map((loan) => {
              const isOverdue = toBangkokDateString(new Date(loan.due_at)) < today;
              return (
                <li key={loan.id}>
                  <span>{loan.copies?.resources?.title ?? "Resource"}</span>
                  <span className={isOverdue ? "badge badge-danger" : "muted"}>
                    Due {new Date(loan.due_at).toLocaleDateString()}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        <div style={{ marginTop: "0.75rem" }}>
          <Link href="/loans" className="link">
            View all loans →
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
  tone,
}: {
  label: string;
  value: number;
  href: string;
  tone?: "danger" | "warning";
}) {
  return (
    <Link href={href} className={`stat-card${tone ? ` tone-${tone}` : ""}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </Link>
  );
}
