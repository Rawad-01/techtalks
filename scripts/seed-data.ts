export const seedUsers = [
  {
    name: "Maya Chen",
    email: "maya@seed.techtalks.example",
    bio: "Frontend engineer. I write about the small decisions that make software feel better.",
    provider: "seed" as const,
  },
  {
    name: "Alex Rivera",
    email: "alex@seed.techtalks.example",
    bio: "Building reliable backends and explaining the things I wish someone had explained to me.",
    provider: "seed" as const,
  },
  {
    name: "Sam Okafor",
    email: "sam@seed.techtalks.example",
    bio: "Designer who codes. Curious about the space between how things work and how they feel.",
    provider: "seed" as const,
  },
  {
    name: "Leila Haddad",
    email: "leila@seed.techtalks.example",
    bio: "Applied AI engineer, notebook enthusiast, and a firm believer in measuring before optimizing.",
    provider: "seed" as const,
  },
];
export const seedCommunities = [
  {
    name: "Next.js Collective",
    slug: "nextjs",
    category: "Frontend",
    tags: ["nextjs", "react"],
    description:
      "For the developers turning ideas into experiences with Next.js. Explore the App Router, server rendering, caching, and the little details that make a website feel fast.\n\nWhether you're shipping your first page or untangling a production architecture, bring your questions and share what you've learned.",
    author: 0,
  },
  {
    name: "React, Together",
    slug: "react",
    category: "Frontend",
    tags: ["react", "typescript", "frontend"],
    description:
      "A thoughtful corner for people who build with React. Components, state, accessibility, and the occasional spirited conversation about where that effect belongs.\n\nWe value clear explanations, small examples, and helping the next person understand why something works.",
    author: 0,
  },
  {
    name: "Behind the API",
    slug: "backend-engineering",
    category: "Backend",
    tags: ["backend", "databases", "api"],
    description:
      "Good backends make complicated things feel simple. Talk APIs, databases, system design, and the practical work of keeping services reliable.\n\nShare the tradeoffs behind your architecture, the incident you learned from, or the query you finally made fast.",
    author: 1,
  },
  {
    name: "Design & Details",
    slug: "design-and-details",
    category: "Design",
    tags: ["design", "accessibility", "frontend"],
    description:
      "For people who notice the details and care about the people using what they build. Explore interface design, accessibility, typography, and the art of making software feel understandable.\n\nDesigners, engineers, and everyone between are welcome.",
    author: 2,
  },
  {
    name: "Applied Intelligence",
    slug: "applied-ai",
    category: "AI & ML",
    tags: ["ai", "machine-learning", "python"],
    description:
      "Less hype, more useful experiments. A space for building with machine learning and language models, evaluating what actually works, and sharing the results honestly.\n\nBring reproducible examples, interesting failures, and the questions your benchmark couldn't answer.",
    author: 3,
  },
  {
    name: "Small Screen Society",
    slug: "mobile-development",
    category: "Mobile",
    tags: ["mobile", "react-native", "design"],
    description:
      "Big ideas for the screens in our pockets. Discuss native and cross-platform development, offline experiences, performance, and the surprisingly hard details of a great mobile app.\n\nFrom your first screen to your next release, there's room for your perspective.",
    author: 2,
  },
];
export const seedBlogs = [
  {
    title: "The best React component is the one you don't notice",
    slug: "the-best-react-component-is-the-one-you-dont-notice",
    excerpt:
      "Good abstractions don't announce themselves. A practical look at building components that make the next developer's day a little easier.",
    tags: ["react", "frontend", "design"],
    author: 0,
    content: `I used to measure a component by how many situations it could handle. Every new prop felt like proof that the abstraction was getting better. Then a teammate asked how to use my button, and I sent them a paragraph.

That was the moment I realized I had optimized for the wrong thing.

## Start with the next person

A component is a small interface for another developer. Its job is to make a reasonable thing easy to express. If the caller needs to understand your implementation before they can use it, some of the complexity has escaped.

Consider a message that appears after saving a profile. The caller knows two things: whether the save succeeded and what the user needs to hear. They shouldn't also need to select a border color, icon, spacing scale, and accessibility role.

\`\`\`tsx
<Notice status="success">
  Your profile is up to date.
</Notice>
\`\`\`

This is a small API, but it owns a meaningful decision. A success message has a consistent appearance and an appropriate announcement behavior everywhere it appears.

## Prefer composition to prediction

You cannot predict every layout a product will eventually need. You can give people useful pieces that fit together. A card with a title, content slot, and footer slot is often easier to understand than a card with twelve booleans describing every combination you have seen so far.

The trick is to extract the stable idea. A button is stable. The precise arrangement of a pricing experiment probably isn't.

> An abstraction earns its place by making a real decision disappear from the caller's workload.

## A review checklist I actually use

- Can someone understand the default usage from one example?
- Does the component preserve native keyboard and form behavior?
- Are the names describing a user-facing purpose?
- Can the caller add content without adding a new prop to the library?
- Is the component solving a repeated problem, or an imagined future one?

I also ask a teammate to use the component before documenting it. The questions they ask are better feedback than my confidence in the API.

## The quiet kind of success

The best feedback I get about a shared component is no feedback at all. Someone opens the file, recognizes the shape, and gets back to the problem they were solving.

That doesn't happen because the component is clever. It happens because the component is considerate.`,
  },
  {
    title: "A mental model for caching in the Next.js App Router",
    slug: "a-mental-model-for-caching-in-nextjs",
    excerpt:
      "Before reaching for another revalidation flag, ask what is cached, who can see it, and what makes it stale.",
    tags: ["nextjs", "react", "backend"],
    author: 1,
    content: `Caching is easy to describe and surprisingly easy to misunderstand. We save some work now so we don't have to do it again later. The difficult questions arrive immediately afterward: which work, for whom, and for how long?

When I investigate a stale page, I draw three boxes: the source of truth, the rendered result, and the browser. Then I follow one piece of data through them.

## Name the thing you're keeping

A database query result and a rendered route are different things. So are a server response and an already-open client view. Refreshing one doesn't necessarily refresh the others.

For a public journal, a rendered list of published articles is a good candidate for reuse. For a private profile, the request must first establish whose profile is being requested. The difference is the audience of the data.

## Freshness is a product decision

Ask how stale the page can be before a person notices. A public list might tolerate a short delay. A confirmation after pressing Publish should reflect the change immediately.

Time-based revalidation can serve ordinary readers efficiently. Mutation-based invalidation connects a specific change to the pages that depend on it. They solve different parts of the same experience.

\`\`\`ts
// After the database write succeeds:
revalidatePath('/blogs');
revalidatePath('/');
\`\`\`

The order matters: invalidate after the write has succeeded. Otherwise the next render can put the old data right back into the cache.

## Follow dependencies, not just routes

An article title may appear on its detail page, the journal, the home page, an author's profile, and a related-stories section. Updating only the detail page leaves a fragmented experience.

Write down those dependencies when designing the mutation. A short shared invalidation function is often easier to review than repeated calls scattered across handlers.

## Verify the behavior in a production build

Development rendering is useful for iteration, but it isn't the final authority on production caching. Build the application, request the same page twice, change the data through its real mutation, and request it again.

Also test the uncomfortable cases: a deleted story, an unpublished draft, and a renamed slug. Caches should improve performance without changing who is allowed to see something.

The goal isn't to memorize every switch. It's to understand the lifetime and audience of each piece of information.`,
  },
  {
    title: "TypeScript patterns I keep coming back to",
    slug: "typescript-patterns-i-keep-coming-back-to",
    excerpt:
      "Three small patterns that make everyday code easier to change: explicit states, narrow boundaries, and boring return types.",
    tags: ["typescript", "frontend"],
    author: 0,
    content: `The TypeScript code I appreciate most is rarely the code with the most elaborate types. It's the code that tells me what can happen before I have to run it.

Here are three patterns that have survived several projects and a lot of changing requirements.

## Give states a name

A loading boolean, an error string, and an optional result can describe combinations your interface doesn't support. A discriminated union can make those combinations impossible to construct by accident.

\`\`\`ts
type Result<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: T };
\`\`\`

Now a rendering branch that checks for ready has the data it needs. A branch that checks for error has a message. The state model does part of the review for you.

## Validate at the boundary

A type annotation doesn't validate a network response. Data entering the application starts as unknown until a runtime check establishes its shape.

I like to keep that transition visible: receive unknown data, parse it with a schema, and pass the validated value inward. The rest of the application can work with smaller, clearer assumptions.

This also gives errors a useful home. A missing title is a validation problem, not a database exception that the interface must somehow translate later.

## Keep return types unsurprising

If a function sometimes returns a document, sometimes a message, and sometimes nothing, every caller becomes a small detective. Choose a stable result shape or throw a documented category of error.

For UI actions, I prefer a small object with success, message, and field errors. For internal queries, a value or null can be perfectly clear.

## The practical payoff

These patterns aren't about expressing the most information the type system can possibly hold. They're about putting the useful information where the next change will need it.

When a refactor points directly to the branches you need to reconsider, TypeScript has done something more valuable than making the editor look green.`,
  },
  {
    title: "Your first AI feature needs an evaluation, not another prompt",
    slug: "your-first-ai-feature-needs-an-evaluation",
    excerpt:
      "A tiny, representative test set can teach you more about your AI feature than an afternoon of adjusting instructions.",
    tags: ["ai", "machine-learning"],
    author: 3,
    content: `The first demo worked beautifully. The second question produced a confident answer to a different question. By the fifth prompt revision, we could no longer tell whether we were improving the feature or just improving the demo.

We stopped changing the prompt and wrote down what useful meant.

## Start with real tasks

An evaluation set doesn't need to be enormous to be useful. Start with a handful of representative tasks, a few awkward inputs, and examples where the correct behavior is to admit uncertainty.

For a documentation assistant, that might include a straightforward API question, a question about an unavailable version, a request with an incorrect assumption, and a request whose answer spans two documents.

Keep the expected behavior next to each case. You don't always need an exact answer; you need a way to recognize an acceptable one.

## Separate the failure modes

When an answer is wrong, ask whether the system retrieved the wrong source, misunderstood the source, or presented a reasonable answer without enough evidence.

These failures need different interventions. A longer prompt won't fix a missing document. A different retrieval query won't fix an interface that hides uncertainty.

## Measure what the product promises

Our first scorecard had three questions:

1. Does the answer address the user's actual question?
2. Is the important factual content supported by the provided material?
3. Does it communicate missing information clearly?

We tracked latency separately. A fast wrong answer isn't a success, and a useful answer can still be too slow for the intended interaction.

## Keep a record of regressions

Every surprising production example became a candidate for the evaluation set. We removed sensitive information, described the expected behavior, and checked whether later changes improved the case without breaking the earlier ones.

The result wasn't a perfect system. It was a system we could discuss with evidence. That changed the conversation from “this prompt feels better” to “these tasks improved, and these two still need work.”`,
  },
  {
    title: "The details that make an interface feel considerate",
    slug: "the-details-that-make-an-interface-feel-considerate",
    excerpt:
      "Focus rings, empty states, and honest feedback aren't finishing touches. They're how a product shows people it was built for them.",
    tags: ["design", "accessibility", "frontend"],
    author: 2,
    content: `A polished interface isn't only a collection of attractive screens. It's a collection of decisions about what happens when someone is uncertain, distracted, or doing something for the first time.

The details I care about most tend to appear between the screenshots.

## Preserve a person's work

If a form fails validation, keep what they wrote. Put the explanation beside the field that needs attention. Don't make someone reconstruct a long thought because one URL was missing its protocol.

A failed request should also leave a clear next step. “Something went wrong” tells the truth, but “We couldn't save your changes. Your text is still here; try again” tells a more useful truth.

## Make focus visible

Try using your interface without a mouse. Can you tell where you are? Can you reach every action? Does the order follow the visual story?

A focus ring is navigation feedback. Removing it without replacing it is like hiding the pointer because it clashes with the color palette.

## Let empty states do a little work

A new member hasn't failed because their profile has no articles. They have just arrived. An empty state can explain the feature, establish a welcoming tone, and offer one sensible next action.

Avoid filling every empty surface with an urgent call to action. Sometimes the useful message is simply that something will appear here after a specific event.

## Tell the truth about progress

Disable duplicate submissions while a save is pending. Acknowledge success when the server confirms it. If an operation takes longer than expected, keep the interface understandable.

This is where design and engineering become the same conversation. A button label, a pending state, and an idempotent mutation are all working toward the same outcome: confidence that the action did what the person intended.

The interface feels considerate when it remembers there is a person on the other side of every state transition.`,
  },
  {
    title: "Designing APIs for the requests that happen twice",
    slug: "designing-apis-for-requests-that-happen-twice",
    excerpt:
      "Networks retry. People double-click. Build membership and other set-like operations so repetition is harmless.",
    tags: ["backend", "api", "databases"],
    author: 1,
    content: `A join-community button seems like one of the simplest features in an application. Add a user to a list and return success. Then two requests arrive together.

If both requests read the list before either writes, both may decide the user isn't a member yet. The problem isn't unusual traffic. It's a normal network doing normal network things.

## Express the operation you mean

Joining a community means ensuring that a membership exists. Leaving means ensuring that it doesn't. Those are set operations, not instructions to append or remove an arbitrary position in an array.

In MongoDB, an atomic set update can express that intent directly:

\`\`\`ts
await Community.updateOne(
  { _id: communityId },
  { $addToSet: { members: userId } }
);
\`\`\`

The corresponding leave operation uses pull. Repeating either operation leaves the same final membership state.

## Separate identity from input

The authenticated user comes from the server session. A request body that includes a user ID is not a reason to trust that identity.

Validate the community identifier, authenticate the caller, and let the database express the atomic change. Each step has a distinct responsibility.

## Think beyond the happy response

A request can succeed in the database and fail before the response reaches the browser. The person may retry because they never saw confirmation. Your design should account for that ambiguity.

Not every operation is naturally idempotent. Creating a payment or submitting an order needs a more deliberate strategy, often involving a unique request key and a stored result. The principle is the same: decide what repetition means before the network decides for you.

## Test concurrency on purpose

Send several join requests at the same time and inspect the stored membership count. Then send several leave requests. A sequential test is useful, but it doesn't exercise the timing that created the original bug.

The most reliable fixes often make the correct behavior a property of the database operation itself.`,
  },
  {
    title: "Offline isn't an edge case on a small screen",
    slug: "offline-isnt-an-edge-case-on-a-small-screen",
    excerpt:
      "A mobile experience should survive a train tunnel. Start by deciding what people can still do when the connection disappears.",
    tags: ["mobile", "design", "react-native"],
    author: 2,
    content: `A person doesn't experience a mobile app as a set of successful HTTP requests. They experience it while walking between buildings, switching networks, or reading on a train.

A connection that briefly disappears is ordinary life. Treating it as an exceptional state makes the product feel fragile.

## Decide what remains useful

Start with the main task. If people open your app to read saved material, previously downloaded content should remain readable. If they write notes, their words shouldn't depend on a stable connection.

This doesn't mean every feature needs a complicated synchronization engine. It means you should decide explicitly which work can happen locally and which work needs the server.

## Distinguish saved from synced

“Saved on this device” and “Synced to your account” are different promises. Clear language is more useful than a single optimistic checkmark that conceals the difference.

When the network returns, show a quiet confirmation that the pending work has reached the server. If a conflict needs a decision, preserve both versions long enough for a person to make it.

## Design the transition

Avoid replacing the whole screen with an error when useful cached content is still available. A small connection notice can explain the state while letting the person continue.

Also consider what happens to an in-progress action. Can it retry safely? Is it queued? Does the interface explain when the person needs to try again?

## Test somewhere inconvenient

Throttle the connection, switch it off mid-request, and reopen the app after it has been suspended. These checks reveal assumptions that a fast office network hides.

A good mobile experience feels steady even when the connection isn't. That steadiness comes from deliberate product decisions as much as from storage code.`,
  },
];
