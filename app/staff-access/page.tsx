import { SignInButton } from "../SignInButton";

export const metadata = {
  title: "Staff Access | Campus Library",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StaffAccessPage() {
  return (
    <main className="staff-access-screen">
      <section className="auth-card" aria-label="Staff sign in">
        <p className="eyebrow">STAFF ACCESS</p>
        <h2>Welcome back, library team.</h2>
        <p>Sign in with the Google account registered for your staff role.</p>
        <SignInButton portal="staff" />
        <p className="auth-footnote">
          Access is verified against your library account role.
        </p>
      </section>
    </main>
  );
}
