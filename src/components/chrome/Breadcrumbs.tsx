import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * "You are here" trail — the standard archival pattern (LoC, Europeana):
 * every item page shows its path from the section index, so deep records
 * never feel lost. Server-safe.
 */

export function Breadcrumbs({
  items,
}: {
  items: Array<{ href?: string; label: string }>;
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5">
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px]">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label + i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-3 text-text-3" strokeWidth={1.5} aria-hidden />}
              {item.href && !last ? (
                <Link href={item.href} className="text-text-3 transition-colors hover:text-text">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "font-medium text-text-2" : "text-text-3"}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
