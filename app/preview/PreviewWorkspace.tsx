"use client";

import { useState } from "react";

type Portal = "student" | "staff";

type PreviewView = "overview" | "browse" | "loans" | "reservations" | "profile" | "circulation" | "active" | "pickup" | "members";

const studentLinks: { label: string; view: PreviewView }[] = [
  { label: "Overview", view: "overview" },
  { label: "Browse collection", view: "browse" },
  { label: "My loans", view: "loans" },
  { label: "Reservations", view: "reservations" },
  { label: "Profile", view: "profile" },
];
const staffLinks: { label: string; view: PreviewView }[] = [
  { label: "Circulation desk", view: "circulation" },
  { label: "Active loans", view: "active" },
  { label: "Ready for pickup", view: "pickup" },
  { label: "Manage members", view: "members" },
];

export function PreviewWorkspace() {
  const [portal, setPortal] = useState<Portal>("student");
  const [studentView, setStudentView] = useState<PreviewView>("overview");
  const [staffView, setStaffView] = useState<PreviewView>("circulation");
  const isStudent = portal === "student";
  const activeView = isStudent ? studentView : staffView;
  const links = isStudent ? studentLinks : staffLinks;

  function choosePortal(nextPortal: Portal) {
    setPortal(nextPortal);
    setStudentView("overview");
    setStaffView("circulation");
  }

  function chooseView(view: PreviewView) {
    if (isStudent) setStudentView(view);
    else setStaffView(view);
  }

  return (
    <main className="preview-screen">
      <div className="preview-banner">
        <span><strong>UI preview</strong> · Sample content only · No sign-in or changes to your account</span>
        <span className="preview-local-label">LOCAL DESIGN PREVIEW</span>
      </div>

      <div className="preview-switcher" role="group" aria-label="Choose a portal preview">
        <button
          type="button"
          className={isStudent ? "preview-tab is-selected" : "preview-tab"}
          aria-pressed={isStudent}
          onClick={() => choosePortal("student")}
        >
          Student portal
        </button>
        <button
          type="button"
          className={!isStudent ? "preview-tab is-selected" : "preview-tab"}
          aria-pressed={!isStudent}
          onClick={() => choosePortal("staff")}
        >
          Staff portal
        </button>
      </div>

      <div className="preview-app">
        <aside className="preview-sidebar">
          <div className="preview-brand">
            <span className="preview-brand-mark">C</span>
            <span>Campus Library<small>READ · DISCOVER · RETURN</small></span>
          </div>

          <p className="preview-section-label">{isStudent ? "YOUR SPACE" : "LIBRARY TEAM"}</p>
          <nav className="preview-nav" aria-label="Preview navigation">
            {links.map((link, index) => (
              <button
                type="button"
                className={activeView === link.view ? "preview-nav-link active" : "preview-nav-link"}
                key={link.view}
                aria-current={activeView === link.view ? "page" : undefined}
                onClick={() => chooseView(link.view)}
              >
                <span className="preview-nav-icon" aria-hidden="true">{navMark(index)}</span>
                <span>{link.label}</span>
              </button>
            ))}
          </nav>

          <div className="preview-sidebar-bottom">
            <div className="preview-avatar">{isStudent ? "NS" : "LT"}</div>
            <div><strong>{isStudent ? "Nady San" : "Library Team"}</strong><small>{isStudent ? "Student member" : "Staff workspace"}</small></div>
            <span className="preview-online-dot" aria-label="Online" />
          </div>
        </aside>

        <section className="preview-main">
          <header className="preview-topbar">
            <div className="preview-breadcrumb">Campus Library <span>/</span> {isStudent ? "Student" : "Staff"} <span>/</span> {links.find((link) => link.view === activeView)?.label}</div>
            <div className="preview-top-actions">
              <span className="preview-today">MONDAY, NOVEMBER 9</span>
              <span className="preview-bell" aria-label="Notifications">♧<i /></span>
            </div>
          </header>

          {isStudent ? <StudentPreview view={activeView} onNavigate={chooseView} /> : <StaffPreview view={activeView} />}
        </section>
      </div>
    </main>
  );
}

function StudentPreview({ view, onNavigate }: { view: PreviewView; onNavigate: (view: PreviewView) => void }) {
  if (view === "browse") return <StudentBrowsePreview />;
  if (view === "loans") return <StudentLoansPreview />;
  if (view === "reservations") return <StudentReservationsPreview />;
  if (view === "profile") return <StudentProfilePreview />;

  return (
    <div className="preview-content">
      <section className="preview-welcome">
        <div className="preview-welcome-copy">
          <span className="preview-overline">YOUR CAMPUS COLLECTION</span>
          <h1>A good book can<br />take you anywhere.</h1>
          <p>Pick up where you left off, or find something wonderful to read next.</p>
          <button type="button" className="preview-cta" onClick={() => onNavigate("browse")}>Explore the collection <span aria-hidden="true">→</span></button>
        </div>
        <div className="preview-books-art" aria-hidden="true">
          <span className="preview-orbit" />
          <span className="preview-book one"><i>FIELD<br />NOTES</i></span>
          <span className="preview-book two"><i>THE ART<br />OF LEARNING</i></span>
          <span className="preview-book three"><i>READ<br />WANDER<br />REPEAT</i></span>
          <span className="preview-spark">✳</span>
        </div>
        <span className="preview-welcome-index">01 — YOUR READING ROOM</span>
      </section>

      <div className="preview-section-heading">
        <div><span className="preview-overline">AT A GLANCE</span><h2>Your library, today</h2></div>
        <span className="preview-updated">Updated just now <i /></span>
      </div>

      <section className="preview-stat-grid" aria-label="Sample account statistics">
        <PreviewStat icon="↗" number="02" label="Active loans" foot="Books with you" tone="green" />
        <PreviewStat icon="◷" number="00" label="Overdue" foot="All caught up" tone="cream" />
        <PreviewStat icon="⌁" number="01" label="Due this week" foot="Next: The Design of…" tone="peach" />
        <PreviewStat icon="▤" number="03" label="Reservations" foot="One ready to collect" tone="lavender" />
      </section>

      <section className="preview-lower-grid">
        <div className="preview-card preview-loans-card">
          <div className="preview-card-heading"><div><span className="preview-overline">KEEP ON TRACK</span><h2>Coming up</h2></div><span className="preview-round-arrow">↗</span></div>
          <div className="preview-loan-row">
            <span className="preview-mini-cover cover-green">DESIGN<br />BETTER</span>
            <div className="preview-row-main"><strong>The Design of Everyday Things</strong><small>Don Norman · Non-fiction</small></div>
            <span className="preview-due-date"><small>DUE IN</small><strong>2 days</strong></span>
          </div>
          <div className="preview-progress"><span /></div>
          <div className="preview-row-footer"><span>12 of 14 days</span><span>Return by Nov 11</span></div>
        </div>

        <div className="preview-card preview-discover-card">
          <span className="preview-overline">A LITTLE INSPIRATION</span>
          <h2>Make room<br />for a new idea.</h2>
          <p>Browse the shelves and find your next favorite.</p>
          <div className="preview-discover-books" aria-hidden="true">
            <span className="discover-cover a">CREATIVE<br />ACTS</span>
            <span className="discover-cover b">SLOW<br />LOOKING</span>
            <span className="discover-cover c">THE<br />ALMANAC</span>
          </div>
          <button type="button" className="preview-discover-link" onClick={() => onNavigate("browse")}>Browse books <span aria-hidden="true">→</span></button>
        </div>
      </section>
    </div>
  );
}

function StaffPreview({ view }: { view: PreviewView }) {
  if (view === "active") return <StaffListPreview mode="active" />;
  if (view === "pickup") return <StaffListPreview mode="pickup" />;
  if (view === "members") return <StaffListPreview mode="members" />;

  return (
    <div className="preview-content">
      <section className="preview-staff-welcome">
        <div>
          <span className="preview-overline">MONDAY, NOVEMBER 9, 2026</span>
          <h1>The library is in good hands.</h1>
          <p>Here’s what’s happening across the collection today.</p>
        </div>
        <span className="preview-staff-emblem" aria-hidden="true">C</span>
      </section>

      <section className="preview-stat-grid preview-staff-stats" aria-label="Sample library statistics">
        <PreviewStat icon="↗" number="24" label="Active loans" foot="Across all members" tone="green" />
        <PreviewStat icon="◷" number="03" label="Due today" foot="Needs attention" tone="cream" />
        <PreviewStat icon="⌁" number="08" label="Ready for pickup" foot="Waiting at the desk" tone="peach" />
        <PreviewStat icon="▤" number="126" label="Library members" foot="In the system" tone="lavender" />
      </section>

      <section className="preview-card preview-circulation">
        <div className="preview-card-heading">
          <div><span className="preview-overline">QUICK ACTION</span><h2>Circulation desk</h2></div>
          <span className="preview-status-pill"><i /> DESK OPEN</span>
        </div>
        <p>Find a member to check out a book or complete a pickup.</p>
        <div className="preview-fake-search"><span aria-hidden="true">⌕</span><span>Search a student by name or email</span><span className="preview-search-key">⌘ K</span></div>
        <div className="preview-action-links"><span>Check out a book <b>→</b></span><span>Process a return <b>→</b></span><span>View reservations <b>→</b></span></div>
      </section>

      <section className="preview-card preview-table-card">
        <div className="preview-card-heading"><div><span className="preview-overline">NEEDS A LOOK</span><h2>Due back today</h2></div><span className="preview-count-pill">3 books</span></div>
        <div className="preview-table">
          <div className="preview-table-head"><span>BOOK & MEMBER</span><span>DUE DATE</span><span>STATUS</span></div>
          <div className="preview-table-row"><span><strong>Thinking, Fast and Slow</strong><small>Arun S. · Student</small></span><span>Today, 5:00 PM</span><span className="preview-status-tag">Due today</span></div>
          <div className="preview-table-row"><span><strong>The Little Prince</strong><small>Mali K. · Student</small></span><span>Today, 5:00 PM</span><span className="preview-status-tag">Due today</span></div>
          <div className="preview-table-row"><span><strong>Ways of Seeing</strong><small>Beam P. · Student</small></span><span>Today, 5:00 PM</span><span className="preview-status-tag">Due today</span></div>
        </div>
      </section>
    </div>
  );
}

function StudentBrowsePreview() {
  const books = [
    { title: "Atomic Habits", author: "James Clear", category: "Self-development", available: false, cover: "green" },
    { title: "Clean Code", author: "Robert C. Martin", category: "Programming", available: true, cover: "rust" },
    { title: "Database System Concepts", author: "Abraham Silberschatz", category: "Database", available: true, cover: "blue" },
    { title: "The Little Prince", author: "Antoine de Saint-Exupéry", category: "Fiction", available: true, cover: "gold" },
    { title: "Ways of Seeing", author: "John Berger", category: "Art & culture", available: true, cover: "violet" },
    { title: "The Psychology of Money", author: "Morgan Housel", category: "Finance", available: true, cover: "green" },
  ];

  return (
    <div className="preview-content preview-inner-page">
      <header className="preview-page-intro">
        <span className="preview-overline">THE CAMPUS COLLECTION</span>
        <h1>Find your next read.</h1>
        <p>Browse the shelves, follow a curiosity, and find a book worth taking home.</p>
        <span className="preview-page-count">08 <small>titles in the collection</small></span>
      </header>
      <div className="preview-filter-row">
        <span className="preview-demo-search">⌕ <span>Search by title, author, or subject...</span></span>
        <span className="preview-demo-filter">All categories <span>⌄</span></span>
        <span className="preview-demo-search-button">Search</span>
      </div>
      <div className="preview-subject-row"><span>EXPLORE BY SUBJECT</span><i>All books</i><i>Fiction</i><i>Programming</i><i>Database</i><i>Self-development</i></div>
      <div className="preview-page-section-title"><div><span className="preview-overline">PICKED FOR THE CURIOUS</span><h2>Explore the collection</h2></div><small>Showing 6 books</small></div>
      <div className="preview-book-grid">
        {books.map((book) => (
          <article className="preview-book-tile" key={book.title}>
            <span className={`preview-tile-cover ${book.cover}`}><i>CL</i><small>CAMPUS<br />LIBRARY</small></span>
            <span className="preview-tile-copy"><small>{book.category}</small><strong>{book.title}</strong><i>{book.author}</i><em className={book.available ? "available" : ""}><b />{book.available ? "1 available" : "Currently on loan"}</em></span>
            <span className="preview-tile-arrow">↗</span>
          </article>
        ))}
      </div>
    </div>
  );
}

function StudentLoansPreview() {
  return (
    <div className="preview-content preview-inner-page">
      <PreviewPageIntro eyebrow="YOUR READING LIST" title="My loans" description="A little overview of the books currently travelling with you." count="2 active" />
      <div className="preview-loan-summary">
        <div><small>ACTIVE LOANS</small><strong>02</strong></div><div><small>DUE THIS WEEK</small><strong>01</strong></div><div><small>OVERDUE</small><strong>00</strong></div>
      </div>
      <section className="preview-card preview-list-card">
        <div className="preview-page-section-title"><div><span className="preview-overline">CURRENTLY WITH YOU</span><h2>Keep turning the pages</h2></div><span className="preview-count-pill">2 books</span></div>
        <PreviewBookRow title="The Design of Everyday Things" author="Don Norman · Non-fiction" due="Nov 11" tone="green" />
        <PreviewBookRow title="Ways of Seeing" author="John Berger · Art & culture" due="Nov 16" tone="blue" />
      </section>
      <p className="preview-fine-print">Sample loan details for visual preview only. No account data is loaded here.</p>
    </div>
  );
}

function StudentReservationsPreview() {
  return (
    <div className="preview-content preview-inner-page">
      <PreviewPageIntro eyebrow="YOUR PLACE IN LINE" title="Reservations" description="Keep track of the books you’ve saved a place for." count="3 active" />
      <div className="preview-reservation-feature">
        <span className="preview-reservation-icon">✳</span>
        <div><span className="preview-overline">READY FOR PICKUP</span><h2>The Little Prince is waiting.</h2><p>Collect it at the Circulation Desk by November 11.</p></div>
        <span className="preview-pickup-badge">READY</span>
      </div>
      <section className="preview-card preview-list-card">
        <div className="preview-page-section-title"><div><span className="preview-overline">IN YOUR QUEUE</span><h2>Saved for later</h2></div></div>
        <PreviewReservationRow title="Database System Concepts" detail="Position 2 in the queue" />
        <PreviewReservationRow title="The Pragmatic Programmer" detail="Position 1 in the queue" />
      </section>
      <p className="preview-fine-print">Sample reservations for visual preview only.</p>
    </div>
  );
}

function StudentProfilePreview() {
  return (
    <div className="preview-content preview-inner-page">
      <PreviewPageIntro eyebrow="YOUR ACCOUNT" title="Profile" description="Your campus library account at a glance." />
      <section className="preview-card preview-profile-card">
        <div className="preview-profile-heading"><span className="preview-profile-avatar">NS</span><div><h2>Nady San</h2><p>Student member · Joined September 2026</p></div><span className="preview-profile-status">ACTIVE MEMBER</span></div>
        <div className="preview-profile-details"><div><small>UNIVERSITY EMAIL</small><strong>nady.san@campus.edu</strong></div><div><small>STUDENT ID</small><strong>••••••3090</strong></div><div><small>ACCOUNT STATUS</small><strong>Active</strong></div><div><small>LIBRARY ROLE</small><strong>Student</strong></div></div>
      </section>
      <div className="preview-privacy-note"><span>◎</span><p><strong>Your information stays yours.</strong><br />Account and eligibility details are handled securely by the library.</p></div>
      <p className="preview-fine-print">All profile information shown is fictional sample data.</p>
    </div>
  );
}

function StaffListPreview({ mode }: { mode: "active" | "pickup" | "members" }) {
  const config = {
    active: { eyebrow: "COLLECTION PULSE", title: "Active loans", description: "Keep track of every book currently out in the community.", count: "24 currently out" },
    pickup: { eyebrow: "THE HOLD SHELF", title: "Ready for pickup", description: "These reserved books are waiting at the circulation desk.", count: "8 waiting" },
    members: { eyebrow: "YOUR LIBRARY COMMUNITY", title: "Manage members", description: "A quick look at the people who make this library a community.", count: "126 members" },
  }[mode];

  return (
    <div className="preview-content preview-inner-page">
      <PreviewPageIntro eyebrow={config.eyebrow} title={config.title} description={config.description} count={config.count} />
      <div className="preview-staff-toolbar"><span className="preview-demo-search">⌕ <span>{mode === "members" ? "Search by member name or email..." : "Search by book title or member..."}</span></span><span className="preview-demo-filter">{mode === "members" ? "All members" : "All statuses"} <span>⌄</span></span></div>
      <section className="preview-card preview-list-card preview-staff-list">
        <div className="preview-page-section-title"><div><span className="preview-overline">{mode === "members" ? "CAMPUS COMMUNITY" : mode === "pickup" ? "HOLD WINDOW IS OPEN" : "OUT IN THE COMMUNITY"}</span><h2>{mode === "members" ? "Library members" : mode === "pickup" ? "Books on the pickup shelf" : "Books currently on loan"}</h2></div><span className="preview-count-pill">{config.count}</span></div>
        {mode === "members" ? (
          <>
            <PreviewStaffRow title="Arun S." detail="arun.s@campus.edu · Student" right="Active member" tone="green" />
            <PreviewStaffRow title="Mali K." detail="mali.k@campus.edu · Student" right="Active member" tone="green" />
            <PreviewStaffRow title="Beam P." detail="beam.p@campus.edu · Student" right="Active member" tone="green" />
            <PreviewStaffRow title="Nady San" detail="nady.san@campus.edu · Student" right="Active member" tone="green" />
          </>
        ) : mode === "pickup" ? (
          <>
            <PreviewStaffRow title="The Little Prince" detail="Reserved for Mali K. · Hold until Nov 11" right="Ready for pickup" tone="peach" />
            <PreviewStaffRow title="Atomic Habits" detail="Reserved for Arun S. · Hold until Nov 12" right="Ready for pickup" tone="peach" />
            <PreviewStaffRow title="Clean Code" detail="Reserved for Beam P. · Hold until Nov 12" right="Ready for pickup" tone="peach" />
          </>
        ) : (
          <>
            <PreviewStaffRow title="Thinking, Fast and Slow" detail="Arun S. · Borrowed Oct 28" right="Due today" tone="peach" />
            <PreviewStaffRow title="Ways of Seeing" detail="Mali K. · Borrowed Oct 30" right="Due Nov 16" tone="green" />
            <PreviewStaffRow title="Clean Code" detail="Beam P. · Borrowed Nov 02" right="Due Nov 16" tone="green" />
            <PreviewStaffRow title="The Little Prince" detail="Nady San · Borrowed Nov 04" right="Due Nov 18" tone="green" />
          </>
        )}
      </section>
      <p className="preview-fine-print">Sample staff data for visual preview only. These controls do not access or modify real records.</p>
    </div>
  );
}

function PreviewPageIntro({ eyebrow, title, description, count }: { eyebrow: string; title: string; description: string; count?: string }) {
  return (
    <header className="preview-page-intro">
      <span className="preview-overline">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
      {count && <span className="preview-page-count">{count}</span>}
    </header>
  );
}

function PreviewBookRow({ title, author, due, tone }: { title: string; author: string; due: string; tone: string }) {
  return (
    <div className="preview-data-row">
      <span className={`preview-row-cover ${tone}`}>CL</span>
      <span className="preview-data-main"><strong>{title}</strong><small>{author}</small></span>
      <span className="preview-data-side"><small>DUE DATE</small><strong>{due}</strong></span>
      <span className="preview-row-status">On loan</span>
    </div>
  );
}

function PreviewReservationRow({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="preview-data-row">
      <span className="preview-row-cover gold">CL</span>
      <span className="preview-data-main"><strong>{title}</strong><small>{detail}</small></span>
      <span className="preview-queue-status">IN QUEUE</span>
    </div>
  );
}

function PreviewStaffRow({ title, detail, right, tone }: { title: string; detail: string; right: string; tone: string }) {
  return (
    <div className="preview-data-row">
      <span className={`preview-row-cover ${tone}`}>{title.slice(0, 1)}</span>
      <span className="preview-data-main"><strong>{title}</strong><small>{detail}</small></span>
      <span className={`preview-row-status ${tone}`}>{right}</span>
      <span className="preview-row-kebab">···</span>
    </div>
  );
}

function PreviewStat({ icon, number, label, foot, tone }: { icon: string; number: string; label: string; foot: string; tone: string }) {
  return (
    <article className={`preview-stat ${tone}`}>
      <div className="preview-stat-top"><span className="preview-stat-icon">{icon}</span><span className="preview-stat-dots">···</span></div>
      <strong className="preview-stat-number">{number}</strong>
      <span className="preview-stat-label">{label}</span>
      <small>{foot}</small>
    </article>
  );
}

function navMark(index: number) {
  return ["⌂", "⌕", "▤", "⌁", "◉"][index % 5];
}
