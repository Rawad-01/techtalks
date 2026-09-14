# Manual testing

Run these checks locally and again on the final deployment. Use a private browser window and real OAuth accounts. Create clearly named test content and remove only records you own afterward. Automated results are in [VERIFICATION.md](../VERIFICATION.md).

## Authentication

| Action                                                | Expected result                                                                              |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Open Home logged out                                  | Public content and Login link; no automatic login form/modal                                 |
| Click Login                                           | Dedicated page with Google and GitHub options                                                |
| Complete Google sign-in                               | Return to Profile/requested route; navbar shows Profile and Sign out; user persists in Atlas |
| Repeat sign-in with the same provider                 | Existing MongoDB user reused                                                                 |
| Test GitHub with a separate account/email             | GitHub callback works; its identity is created/reused                                        |
| Use another provider with an already-registered email | Clear account-linking message; no silent identity linking                                    |
| Open Profile or either creation page logged out       | Redirect to Login with local return URL                                                      |
| Sign out and refresh Profile                          | Login redirect; `/api/me` returns 401                                                        |
| Cancel consent                                        | Recoverable login state; no false success                                                    |

## Blogs

| Action                                                          | Expected result                                                               |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Browse, filter/search, and open an article                      | Correct matching content, author, date, tags, and Markdown                    |
| Publish an original article                                     | Redirect to article; record persists and appears in journal                   |
| Save a draft                                                    | Author can view/edit it; absent from public pages and other users' API access |
| Edit content/title, publish, revisit                            | Fresh content appears in dependent pages                                      |
| Change slug                                                     | New URL works; old URL becomes missing                                        |
| Enter duplicate/reserved slug, short content, or excessive tags | Feedback appears and inputs remain available                                  |
| Confirm deletion                                                | Owned story disappears from database and public pages                         |
| Open a missing slug                                             | Branded not-found UI with noindex; streamed response may be HTTP 200          |

## Communities

| Action                                      | Expected result                                   |
| ------------------------------------------- | ------------------------------------------------- |
| Browse, search/filter, and open a community | Correct description, members, and related stories |
| Create a valid community                    | Record persists; creator joins automatically      |
| Submit short description or duplicate slug  | Validation/conflict feedback; inputs preserved    |
| Join, refresh, revisit Profile              | Membership persists and appears on Profile        |
| Repeatedly join through API                 | Only one membership for the same user             |
| Leave and refresh                           | Membership removed from community and Profile     |
| Follow a `c++` or `c#` community topic      | Complete topic reaches the blog filter            |
| Open a missing community                    | Branded missing-page UI and noindex               |

## Profile

| Action                                         | Expected result                                 |
| ---------------------------------------------- | ----------------------------------------------- |
| Save name, bio, GitHub/portfolio links         | Success; values survive refresh and later login |
| Submit missing name, excessive bio, unsafe URL | Server validation rejects input                 |
| Try to submit email/provider changes           | Identity changes rejected                       |
| View an account without stories/memberships    | Clear empty states and useful actions           |
| Inspect public JSON                            | No private email, OAuth ID, or provider token   |

## API authorization

Use an API client or browser Network panel and two separate user sessions. Never include session cookies in submission materials.

| Action                                                                                                                                         | Expected result                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Logged-out POST `/api/blogs`, POST `/api/communities`, PATCH/DELETE `/api/blogs/[id]`, POST/DELETE `/api/communities/[id]/join`, GET `/api/me` | Safe 401 JSON                                    |
| Valid authenticated creation                                                                                                                   | 201 and created record identity                  |
| Invalid JSON/content type/fields                                                                                                               | Safe 400; no write                               |
| User B edits/deletes User A's story                                                                                                            | 403; record unchanged                            |
| Valid nonexistent record ID                                                                                                                    | 404; malformed ID gives 400                      |
| Duplicate slug                                                                                                                                 | 409; original unchanged                          |
| Non-author or anonymous GET of draft                                                                                                           | 404                                              |
| Mutation with unrelated Origin                                                                                                                 | 403                                              |
| Inspect error responses                                                                                                                        | No stack traces/secrets; Cache-Control: no-store |

## Responsive design

| Action                                                       | Expected result                                 |
| ------------------------------------------------------------ | ----------------------------------------------- |
| Review all required pages and editor at 390px, 768px, 1440px | No overflow, overlap, or inaccessible controls  |
| Open mobile menu, follow a link                              | Route changes and menu closes                   |
| Navigate with Tab/Shift+Tab                                  | Visible focus, logical order, working skip link |
| Enable reduced motion                                        | Motion preference respected                     |
| Trigger failed save/empty search                             | Useful feedback; text preserved                 |

## Deployment

| Action                                                 | Expected result                                          |
| ------------------------------------------------------ | -------------------------------------------------------- |
| Open stable HTTPS production domain in private browser | Public content without a Vercel account                  |
| Complete both OAuth flows                              | Exact production callbacks; no localhost redirect        |
| Edit profile, publish story, join/leave                | Writes reach intended Atlas database and survive refresh |
| Open from another device/network                       | Public site and OAuth work                               |
| Inspect browser bundles, public source/JSON            | No credentials                                           |
| Compare README, screenshots, GitHub, deployed version  | Materials match final application                        |

Record actual provider-specific and production results in [SUBMISSION_CHECKLIST.md](../SUBMISSION_CHECKLIST.md). Leave untested items unchecked.
