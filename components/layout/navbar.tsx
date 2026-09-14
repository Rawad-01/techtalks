"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { ArrowUpRight, LogOut, Menu, PenLine, X } from "lucide-react";
import { Avatar, Button, ButtonLink, Container } from "@/components/ui";
import { Brand } from "./brand";
const links = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Blogs" },
  { href: "/communities", label: "Communities" },
];
function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const current = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const account = session?.user;
  return (
    <header className="site-header">
      <Container className="nav-inner">
        <Brand />
        <nav className="nav-links" aria-label="Main navigation">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link ${current(href) ? "active" : ""}`}
              aria-current={current(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <Link href="/blogs/new" className="text-link nav-write">
            <PenLine size={14} />
            Write a story
          </Link>
          {account ? (
            <>
              <Link href="/profile" className="nav-profile">
                <Avatar
                  name={account.name || "Developer"}
                  image={account.image}
                />
                <span>Profile</span>
              </Link>
              <Button
                variant="ghost"
                onClick={() => signOut({ callbackUrl: "/" })}
                aria-label="Sign out"
              >
                <LogOut size={16} />
              </Button>
            </>
          ) : (
            <ButtonLink href="/login" variant="primary">
              {status === "loading" ? "Welcome" : "Login"}
              <ArrowUpRight size={15} />
            </ButtonLink>
          )}
        </div>
        <button
          className="mobile-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Mobile navigation"
          onClick={() => setOpen(false)}
        >
          {links.map(({ href, label }) => (
            <Link
              href={href}
              key={href}
              aria-current={current(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
          <Link href="/blogs/new">Write a story</Link>
          {account ? (
            <>
              <Link href="/profile">Your profile</Link>
              <Button
                variant="secondary"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign out
              </Button>
            </>
          ) : (
            <ButtonLink href="/login">
              Login
              <ArrowUpRight size={16} />
            </ButtonLink>
          )}
        </nav>
      )}
    </header>
  );
}
export function Navbar() {
  return (
    <SessionProvider>
      <Navigation />
    </SessionProvider>
  );
}
