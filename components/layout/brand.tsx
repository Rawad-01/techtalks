import Link from "next/link";
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="TechTalks home">
      <span className="brand-mark" aria-hidden="true">
        &lt;&gt;
      </span>
      <span>
        TechTalks<span className="brand-cursor">_</span>
      </span>
    </Link>
  );
}
