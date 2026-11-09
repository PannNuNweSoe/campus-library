import Link from "next/link";
import { requireDashboardUser } from "@/lib/currentUser";
import { SearchBox } from "./SearchBox";

// Browse Books: search and browse available books (FR-01, AC-01). Queries
// the same resource_availability view the API's GET /resources uses,
// directly from this Server Component rather than fetching our own route.
export default async function BrowsePage(
  props: {
    searchParams: Promise<{ q?: string; category?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const { supabase } = await requireDashboardUser();

  const { data: categoryRows } = await supabase
    .from("resource_availability")
    .select("category")
    .order("category");

  const categories = [
    ...new Set(
      (categoryRows ?? [])
        .map((item) => item.category)
        .filter((category): category is string => Boolean(category))
    ),
  ];

  const q = searchParams.q?.trim();
  const category = searchParams.category?.trim();


  let query = supabase
    .from("resource_availability")
    .select("*")
    .order("title")
    .limit(50);

  // Search across title, author, category, and description
  if (q) {
    const escapedQ = q
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"');

    const pattern = `"%${escapedQ}%"`;

    query = query.or(
      [
        `title.ilike.${pattern}`,
        `author.ilike.${pattern}`,
        `category.ilike.${pattern}`,
        `description.ilike.${pattern}`,
      ].join(",")
    );
  }

  if (category) {
    query = query.eq("category", category);
  }

  const { data: resources, error } = await query;

  return (
    <div className="catalog-page">
      <header className="catalog-hero">
        <div className="catalog-hero-copy">
          <p className="eyebrow">THE CAMPUS COLLECTION</p>
          <h1>Find a story<br />that stays with you.</h1>
          <p>Thoughtful reads, new perspectives, and old favorites—all waiting on your campus.</p>
          <div className="catalog-hero-meta">
            <span><i /> Curated for campus life</span>
            <span>·</span>
            <span>Always something new to discover</span>
          </div>
        </div>
        <div className="catalog-hero-art" aria-hidden="true">
          <span className="catalog-hero-disc" />
          <span className="catalog-hero-shelf" />
          <span className="catalog-hero-book catalog-book-a"><i>IDEAS<br />TO LIVE BY</i></span>
          <span className="catalog-hero-book catalog-book-b"><i>THE<br />LONG WAY<br />HOME</i></span>
          <span className="catalog-hero-book catalog-book-c"><i>SMALL<br />WONDERS</i></span>
          <span className="catalog-hero-flower">✳</span>
          <span className="catalog-hero-edition">VOL. 01&nbsp; / &nbsp;THE READING ROOM</span>
        </div>
        <span className="catalog-count catalog-hero-count">
          <strong>{resources && !error ? resources.length : "—"}</strong>
          {resources && resources.length === 1 ? " title" : " titles"}
        </span>
      </header>

      <section className="catalog-search-section" aria-label="Find a book">
        <div className="catalog-search-heading">
          <div>
            <span className="catalog-section-number">01</span>
            <h2>What are you in the mood for?</h2>
          </div>
          <p>Search the shelves by title, author, or subject.</p>
        </div>
        <SearchBox
          initialQuery={q}
          initialCategory={category}
          categories={categories}
        />
      </section>

      <nav className="catalog-category-rail" aria-label="Browse categories">
        <span className="catalog-rail-label">EXPLORE BY SUBJECT</span>
        <div className="catalog-category-links">
          <Link href="/browse" className={!category ? "category-chip is-active" : "category-chip"}>
            All books
          </Link>
          {categories.slice(0, 6).map((item) => (
            <Link
              key={item}
              href={`/browse?category=${encodeURIComponent(item)}`}
              className={category === item ? "category-chip is-active" : "category-chip"}
            >
              {item}
            </Link>
          ))}
        </div>
      </nav>

      {error && <p className="error">{error.message}</p>}

      <section className="catalog-results">
        <div className="catalog-results-heading">
          <div>
            <span className="eyebrow">{category ? "A SHELF OF ITS OWN" : "PICKED FOR THE CURIOUS"}</span>
            <h2>{category ? category : q ? "Your search results" : "Explore the collection"}</h2>
          </div>
          {resources && !error && (
            <span className="catalog-results-count">
              Showing <strong>{resources.length}</strong> {resources.length === 1 ? "book" : "books"}
            </span>
          )}
        </div>

        {category && (
          <p className="muted small catalog-filter-note">
            Showing books in &quot;{category}&quot; —{" "}
            <Link href="/browse" className="link">clear filter</Link>
          </p>
        )}

        {resources && resources.length > 0 ? (
          <div className="card-grid catalog-grid">
            {resources.map((r: any, index: number) => (
              <Link key={r.id} href={`/books/${r.id}`} className="book-card catalog-book-card">
                <span className={`book-cover catalog-book-cover cover-variation-${index % 5}`} aria-hidden="true">
                  <span className="book-cover-lines" />
                  <span className="book-cover-mark">CL</span>
                  <span className="book-cover-edition">CAMPUS<br />LIBRARY</span>
                </span>
                <span className="book-card-content">
                  <span className="book-category">{r.category}</span>
                  <strong className="book-title">{r.title}</strong>
                  <span className="book-author">{r.author || "Campus collection"}</span>
                  <span className={`badge ${r.available_copies > 0 ? "badge-success" : "badge-muted"}`}>
                    <span className="availability-dot" aria-hidden="true" />
                    {r.available_copies > 0 ? `${r.available_copies} available` : "Currently on loan"}
                  </span>
                </span>
                <span className="catalog-card-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        ) : (
          <section className="empty-state">
            <span className="empty-state-mark" aria-hidden="true">⌕</span>
            <h2>No titles found</h2>
            <p>Try a different search, or clear your filters to explore the full collection.</p>
            <Link href="/browse" className="btn btn-secondary">Show all books</Link>
          </section>
        )}
      </section>
    </div>
  );
}
