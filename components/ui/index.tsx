import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Braces } from "lucide-react";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn, initials } from "@/lib/utils";

export function Container({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("container", className)} {...props}>
      {children}
    </div>
  );
}
export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
}) {
  return (
    <button
      className={cn("button", `button-${variant}`, className)}
      {...props}
    />
  );
}
export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  return (
    <Link href={href} className={cn("button", `button-${variant}`, className)}>
      {children}
    </Link>
  );
}
export function Card({
  className,
  variant = "standard",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  variant?: "standard" | "interactive" | "featured";
}) {
  return (
    <div className={cn("card", `card-${variant}`, className)} {...props} />
  );
}
export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cn("badge", className)}>{children}</span>;
}
export function Avatar({
  name,
  image,
  size = "sm",
}: {
  name: string;
  image?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const allowed =
    image &&
    /^https:\/\/(avatars\.githubusercontent\.com|lh3\.googleusercontent\.com)\//.test(
      image,
    );
  return (
    <span className={cn("avatar", `avatar-${size}`)}>
      {allowed ? (
        <Image
          src={image}
          alt={`${name}'s avatar`}
          fill
          sizes={size === "lg" ? "96px" : "44px"}
        />
      ) : (
        <span aria-label={name}>{initials(name)}</span>
      )}
    </span>
  );
}
export function EmptyState({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="empty-state">
      <Braces size={30} strokeWidth={1.4} />
      <h3>{title}</h3>
      <p>{description}</p>
      {href && (
        <ButtonLink href={href} variant="secondary">
          {action}
          <ArrowUpRight size={16} />
        </ButtonLink>
      )}
    </div>
  );
}
export function SectionHeader({
  label,
  title,
  href,
  action,
}: {
  label?: string;
  title: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        {label && <p className="eyebrow">{label}</p>}
        <h2>{title}</h2>
      </div>
      {href && (
        <Link href={href} className="text-link">
          {action}
          <ArrowUpRight size={17} />
        </Link>
      )}
    </div>
  );
}
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {children}
    </header>
  );
}
export function FormField({
  label,
  name,
  hint,
  errors,
  children,
}: {
  label: string;
  name: string;
  hint?: string;
  errors?: string[];
  children: ReactNode;
}) {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      {children}
      {hint && (
        <p className="field-hint" id={`${name}-hint`}>
          {hint}
        </p>
      )}
      {errors && errors.length > 0 && (
        <div id={`${name}-error`}>
          {errors.map((error, index) => (
            <p className="field-error" key={`${error}-${index}`}>
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
export function LoadingSkeleton() {
  return (
    <Container
      className="page-shell"
      aria-busy="true"
      aria-label="Loading content"
    >
      <div className="skeleton skeleton-label" />
      <div className="skeleton skeleton-heading" />
      <div className="skeleton skeleton-description" />
      <div className="community-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card skeleton-card">
            <div className="skeleton skeleton-icon" />
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line" />
          </div>
        ))}
      </div>
    </Container>
  );
}
