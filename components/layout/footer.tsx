import Link from "next/link";
import { Container } from "@/components/ui";
import { Brand } from "./brand";
export function Footer() {
  return (
    <footer className="site-footer">
      <Container className="footer-inner">
        <Brand />
        <p className="footer-copy">
          A little curiosity. A lot of possibility. © {new Date().getFullYear()}{" "}
          TechTalks
        </p>
        <nav className="footer-links" aria-label="Footer">
          <Link href="/blogs">Read</Link>
          <Link href="/communities">Connect</Link>
          <Link href="/blogs/new">Contribute</Link>
        </nav>
      </Container>
    </footer>
  );
}
