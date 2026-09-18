# Submission verification

Verified locally and on the hosted public deployment on September 14, 2026. This report distinguishes local authenticated tests, production public checks, and owner-reported production Google sign-in. GitHub sign-in and authenticated production write flows remain unverified.

## Completed checks

| Check                                     | Result                                                                      |
| ----------------------------------------- | --------------------------------------------------------------------------- |
| ESLint                                    | Passed                                                                      |
| Strict TypeScript                         | Passed                                                                      |
| Production build                          | Passed with Next.js 16.3.5 and configured Atlas data                        |
| Validation and redirect tests             | 7 passed (including the September 19 OAuth redirect regression)             |
| Production-server integration groups      | 10 passed                                                                   |
| Production dependency audit               | 0 known vulnerabilities from `npm audit --omit=dev`                         |
| Source and browser-bundle credential scan | No matches for configured secrets or common credential patterns             |
| Environment template                      | Names only; included in Git                                                 |
| Private environments and generated output | Excluded by Git ignore rules                                                |
| Local Atlas read verification             | Connected; 5 users, 8 blog records, 6 communities at verification time      |
| Existing real OAuth identities in Atlas   | 1 Google identity; no GitHub identity yet                                   |
| Public submission screenshots             | 6 real application captures at a 1440 × 1000 desktop viewport               |
| Authenticated submission screenshot       | Pending real account capture                                                |
| Hosted deployment                         | Public pages and Atlas reads verified at https://techtalks-sigma.vercel.app |

Record counts are a dated observation, not fixed UI counts. The owner first confirmed local sign-in and later reported success after following the production Google sign-in test. The agent has not signed into either provider in production.

## Audit coverage

Reviewed all application routes, components, styles, models, services, query/serialization helpers, API handlers, Server Actions, authentication, schemas, seed data, tests, package configuration, environment-variable references, and repository exclusions.

The build confirms 60-second ISR for Home, Blogs, and Communities; on-demand generation for article slugs; and dynamic private profile/editor routes. Mongoose remains on Node.js. No working feature was rebuilt or redesigned.

## Fixes made during preparation

- Community topic links now encode `+` and `#` correctly; browser tests follow `c++` and `c#` links.
- Root HTML declares the existing smooth-scroll behavior for Next.js navigation.
- The optional Atlas DNS override now configures `node:dns/promises`, which the MongoDB driver uses. A fresh production process successfully served its initial database request after this correction.
- Auth.js host trust honors the configured `NEXTAUTH_URL` as well as `AUTH_URL`. The final production integration run uses the documented `NEXTAUTH_*` variables without the test's former extra URL/trust aliases.
- Added actual sign-out testing: navbar updates, private API returns 401, and Profile redirects after logout.
- Expanded generated-file/credential exclusions and added submission documents plus reproducible screenshot capture.
- The Profile capture now waits for the authenticated Profile heading. A streamed redirect can briefly visit `/profile` before returning an unsigned browser to Login; one automated capture attempt reached that transient URL but `/api/me` returned 401, so no image was accepted. Capture in a regular signed-in browser remains the documented fallback.

## Integration evidence

The suite uses an isolated real MongoDB 7.0.24 process, a production Next.js server on port 3210, and Chrome. It does not mutate the configured Atlas database.

1. Repeated seeding preserves matching records and counts.
2. Concurrent join/leave operations cannot duplicate membership.
3. Services enforce authorship and unique slugs.
4. Every protected API rejects logged-out requests with 401.
5. Invalid input, draft privacy, private-field filtering, origins, and non-author edits are checked through HTTP.
6. Browser navigation covers public pages, articles, search, protected redirects, a visible OAuth account-conflict message, and a homepage without automatic login UI.
7. Real form actions persist profile edits, articles, communities, joins, and leaves; duplicate-slug feedback preserves entered values.
8. Editing, private drafts, republishing, cache invalidation, and confirmed deletion work.
9. The real sign-out action clears the test session and restores route/API protection.
10. Mobile/tablet pages at 390px and 768px, menu navigation, missing states/noindex, and absence of browser runtime errors pass.

Authenticated automated tests use signed Auth.js cookies created only by the test runner. They exercise the actual session verifier but do not execute external OAuth consent. There is no application login bypass. Their profile screenshots remain ignored test artifacts and are not used in the README.

## September 19 OAuth redirect regression

The internal `/login?error=OAuthAccountNotLinked` destination was incorrectly processed as a post-login callback and replaced with `/profile`. A logged-out browser then returned to Login without the error. The Auth.js redirect callback now preserves this one internal failure destination while user-supplied login callbacks remain restricted. Existing protections against linking accounts solely by email are unchanged.

Lint, TypeScript, the production build, 7 unit tests, and all 10 isolated integration groups passed after the fix. Regression coverage checks both redirect safety and the visible error in the rendered Login page. These tests do not authorize a real GitHub account; a full hosted GitHub sign-in remains a manual check.

## Git and credential scope

There was no Git repository or history at the start of submission preparation. A new local `main` repository was initialized; source and public browser bundles were scanned before staging. The final local commit includes source, safe configuration, documentation, and public screenshots. No existing history was rewritten or claimed to be scrubbed.

Real secrets remain outside tracked source. Credentials previously shared in chat/screenshots must be rotated if they are still active. A clean repository or working deployment does not revoke an exposed credential; rotation of every earlier credential has not been independently verified.

## Remaining external evidence

- The GitHub repository, screenshots folder, and live website each returned HTTP 200 to anonymous visitors. The repository is publicly accessible; the prepared commit and subsequent submission documentation were pushed to the remote.
- Verify authenticated persistence on the deployed site: profile editing, publishing, community membership, and logout.
- Test GitHub sign-in on the deployed origin; use a separate email if the Google identity already uses the same email because cross-provider linking is intentionally disabled.
- A Profile screenshot from a real sign-in, with private information kept out of the capture.
- Final links, screenshots, and optional recorded demo reviewed before submission.

Follow [DEPLOYMENT.md](docs/DEPLOYMENT.md), [MANUAL_TESTING.md](docs/MANUAL_TESTING.md), and [SUBMISSION_CHECKLIST.md](SUBMISSION_CHECKLIST.md). Machine-readable test/audit reports and diagnostics remain in ignored `.artifacts/`.

## Hosted public verification

At https://techtalks-sigma.vercel.app on September 14, 2026:

- Home, Blogs, Communities, Login, an actual article, and a community detail returned HTTP 200.
- The live blog and community APIs returned HTTP 200 with 8 articles and 6 communities, confirming production database reads.
- The anonymous session endpoint returned `null`; the private profile API returned HTTP 401.
- A fresh anonymous Chrome context followed the Profile page's streamed redirect to Login. Next.js can return HTTP 200 while delivering this redirect in the page stream.
- The first check found enabled login buttons with localhost callback URLs. After configuration and redeployment, `/api/auth/providers` was rechecked and now advertises `https://techtalks-sigma.vercel.app/api/auth/callback/google` and `https://techtalks-sigma.vercel.app/api/auth/callback/github`.
- The owner reported successful Google sign-in after the production setup instructions. This is manual owner confirmation, not an agent-executed OAuth test. GitHub's reported callback URL alone does not establish that its external OAuth app accepts the redirect or that its secret is valid.

The agent's checks did not log into an account or change production records. Authenticated production writes, a GitHub OAuth round trip, and testing on another physical device still need owner verification.
