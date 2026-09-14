# Submission verification

Verified locally on September 14, 2026. This report distinguishes the production build running locally from an actual hosted deployment.

## Completed checks

| Check                                     | Result                                                                 |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| ESLint                                    | Passed                                                                 |
| Strict TypeScript                         | Passed                                                                 |
| Production build                          | Passed with Next.js 16.3.5 and configured Atlas data                   |
| Validation and redirect tests             | 6 passed                                                               |
| Production-server integration groups      | 10 passed                                                              |
| Production dependency audit               | 0 known vulnerabilities from `npm audit --omit=dev`                    |
| Source and browser-bundle credential scan | No matches for configured secrets or common credential patterns        |
| Environment template                      | Names only; included in Git                                            |
| Private environments and generated output | Excluded by Git ignore rules                                           |
| Local Atlas read verification             | Connected; 5 users, 8 blog records, 6 communities at verification time |
| Existing real OAuth identities in Atlas   | 1 Google identity; no GitHub identity yet                              |
| Public submission screenshots             | 6 real application captures at a 1440 × 1000 desktop viewport          |
| Authenticated submission screenshot       | Pending real account capture                                           |
| Hosted deployment                         | Pending; no actual URL or remote was available                         |

Record counts are a dated observation, not fixed UI counts. The owner confirmed successful local sign-in after Google configuration; that confirmation does not prove either provider on a future deployment.

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

## Integration evidence

The suite uses an isolated real MongoDB 7.0.24 process, a production Next.js server on port 3210, and Chrome. It does not mutate the configured Atlas database.

1. Repeated seeding preserves matching records and counts.
2. Concurrent join/leave operations cannot duplicate membership.
3. Services enforce authorship and unique slugs.
4. Every protected API rejects logged-out requests with 401.
5. Invalid input, draft privacy, private-field filtering, origins, and non-author edits are checked through HTTP.
6. Browser navigation covers public pages, articles, search, protected redirects, and a homepage without automatic login UI.
7. Real form actions persist profile edits, articles, communities, joins, and leaves; duplicate-slug feedback preserves entered values.
8. Editing, private drafts, republishing, cache invalidation, and confirmed deletion work.
9. The real sign-out action clears the test session and restores route/API protection.
10. Mobile/tablet pages at 390px and 768px, menu navigation, missing states/noindex, and absence of browser runtime errors pass.

Authenticated automated tests use signed Auth.js cookies created only by the test runner. They exercise the actual session verifier but do not execute external OAuth consent. There is no application login bypass. Their profile screenshots remain ignored test artifacts and are not used in the README.

## Git and credential scope

There was no Git repository or history at the start of submission preparation. A new local `main` repository was initialized; source and public browser bundles were scanned before staging. The final local commit includes source, safe configuration, documentation, and public screenshots. No existing history was rewritten or claimed to be scrubbed.

Real secrets remain only in ignored local environment files. Credentials previously shared in chat/screenshots must still be rotated before deployment. A clean repository does not revoke an exposed credential.

## Remaining external evidence

- Actual GitHub repository URL and push/access verification.
- Vercel production URL, production variables, Atlas network access, and deployed persistence checks.
- Independent Google and GitHub provider round trips on the deployed origin; use separate emails when testing because cross-provider linking is intentionally disabled.
- A Profile screenshot from a real sign-in, with private information kept out of the capture.
- Final links, screenshots, and optional recorded demo reviewed before submission.

Follow [DEPLOYMENT.md](docs/DEPLOYMENT.md), [MANUAL_TESTING.md](docs/MANUAL_TESTING.md), and [SUBMISSION_CHECKLIST.md](SUBMISSION_CHECKLIST.md). Machine-readable test/audit reports and diagnostics remain in ignored `.artifacts/`.
