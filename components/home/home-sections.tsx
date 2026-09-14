import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { ConversationArt } from "./conversation-art";
export function Hero() {
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-dot" />A home for curious minds
          </p>
          <h1>
            Join a community
            <br />
            of <em>developers.</em>
          </h1>
          <p className="hero-description">
            Great things happen when developers share.
            <br />
            Discover fresh perspectives, write what you learn,
            <br className="hidden sm:block" /> and find the people who speak
            your language.
          </p>
          <div className="hero-buttons">
            <ButtonLink href="/blogs">
              Explore blogs
              <ArrowUpRight size={16} />
            </ButtonLink>
            <ButtonLink href="/communities" variant="secondary">
              Browse communities
              <ArrowRight size={15} />
            </ButtonLink>
            <ButtonLink href="/login" variant="ghost">
              Get started
            </ButtonLink>
          </div>
          <p className="hero-footnote">
            <Check size={13} />
            Built for the curious. Open to everyone.
          </p>
        </div>
        <ConversationArt />
      </section>
      <div className="topic-strip">
        <span className="eyebrow">Find your kind of curious</span>
        {[
          { name: "React", symbol: "⚛", tag: "react" },
          { name: "Next.js", symbol: "N", tag: "nextjs" },
          { name: "TypeScript", symbol: "ts", tag: "typescript" },
          { name: "AI & ML", symbol: "✳", tag: "ai" },
          { name: "Backend", symbol: "{ }", tag: "backend" },
          { name: "Design", symbol: "◇", tag: "design" },
        ].map((topic) => (
          <Link key={topic.tag} href={`/blogs?tag=${topic.tag}`}>
            <b aria-hidden="true">{topic.symbol}</b>
            {topic.name}
          </Link>
        ))}
      </div>
    </>
  );
}
export function Benefits() {
  return (
    <section className="section manifesto">
      <div>
        <p className="eyebrow">Less noise. More signal.</p>
        <h2>
          Your next breakthrough
          <br />
          starts with <em>someone.</em>
        </h2>
        <p className="manifesto-intro">
          Behind every great developer is a community that helped them get
          there. This is yours.
        </p>
      </div>
      <div>
        {[
          {
            title: "Learn from people who build",
            description:
              "Real experiences, thoughtful tutorials, and the lessons that rarely make it into the docs.",
          },
          {
            title: "Turn what you know into what's next",
            description:
              "Share the problem you solved, the thing you tried, or the question you can't stop thinking about.",
          },
          {
            title: "Find your corner of the internet",
            description:
              "From your first component to your next big idea, there are people here exploring it too.",
          },
        ].map((benefit, i) => (
          <div className="benefit" key={benefit.title}>
            <span>0{i + 1}</span>
            <div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export function ClosingCTA() {
  return (
    <section className="closing-cta">
      <div>
        <p className="eyebrow">Your people are out there</p>
        <h2>Let&apos;s build something together.</h2>
        <p>
          Bring your questions. Share your discoveries. Make yourself at home.
        </p>
      </div>
      <ButtonLink href="/login">
        Find your community
        <ArrowUpRight size={17} />
      </ButtonLink>
    </section>
  );
}
