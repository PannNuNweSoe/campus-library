
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBox({
  initialQuery,
  initialCategory,
  categories,
}: {
  initialQuery?: string;
  initialCategory?: string;
  categories: string[];
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery ?? "");
  const [category, setCategory] = useState(initialCategory ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();

    if (q.trim()) params.set("q", q.trim());
    if (category) params.set("category", category);

    router.push(
      `/browse${params.toString() ? `?${params.toString()}` : ""}`
    );
  }

  return (
    <form className="search-box catalog-search-form" onSubmit={handleSubmit} role="search">
      <label className="catalog-search-input">
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          placeholder="Try a title, author, or subject..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search resources"
        />
      </label>

      <label className="catalog-search-category">
        <span className="catalog-select-label">SUBJECT</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" className="btn btn-primary catalog-search-submit">
        <span>Search shelves</span><span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
