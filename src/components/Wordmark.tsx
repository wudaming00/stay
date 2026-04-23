import Link from "next/link";

export default function Wordmark({
  size = "md",
  asLink = true,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  asLink?: boolean;
}) {
  const sizeClass = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-3xl",
    xl: "text-5xl",
  }[size];

  const inner = (
    <span className={`wordmark ${sizeClass}`}>
      Stay<span className="wordmark-dot">.</span>
    </span>
  );

  if (asLink) {
    return (
      <Link
        href="/"
        className="inline-block transition-opacity hover:opacity-80"
      >
        {inner}
      </Link>
    );
  }
  return inner;
}
