"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { reviews } from "@/content/reviews";
import { ReviewCard } from "./Reviews";

/** All reviews with job-type filter chips; cards re-flow with a quick fade. */
export function ReviewsGrid() {
  const jobs = useMemo(() => ["All", ...Array.from(new Set(reviews.map((r) => r.job)))], []);
  const [filter, setFilter] = useState("All");
  const list = filter === "All" ? reviews : reviews.filter((r) => r.job === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter reviews by service">
        {jobs.map((j) => (
          <button
            key={j}
            type="button"
            aria-pressed={filter === j}
            onClick={() => setFilter(j)}
            className={clsx(
              "min-h-[44px] rounded-full px-4 text-[0.9rem] font-medium transition-colors",
              filter === j ? "bg-navy text-frost" : "bg-white text-navy ring-1 ring-line hover:ring-navy/40",
            )}
          >
            {j}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {list.length} reviews
      </p>
      <div key={filter} className="anim-fade mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
        {list.map((r) => (
          <ReviewCard key={r.name} r={r} />
        ))}
      </div>
    </div>
  );
}
