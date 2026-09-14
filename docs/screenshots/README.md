# Submission screenshots

Public captures use the real app and Atlas content at 1440 × 1000, with full-page capture. They are separate from synthetic-account integration images in `.artifacts/`.

| File                    | Page                  | Capture                 |
| ----------------------- | --------------------- | ----------------------- |
| `home.png`              | Homepage              | Public                  |
| `login.png`             | Google/GitHub options | Public                  |
| `blogs.png`             | Blogs                 | Public                  |
| `blog-details.png`      | Published article     | Public                  |
| `communities.png`       | Communities           | Public                  |
| `community-details.png` | Community detail      | Public                  |
| `profile.png`           | Your real profile     | Manual sign-in required |

## Public pages

With Google Chrome installed and the configured application running:

```sh
npm run screenshots -- http://localhost:3000
```

Use a production build for clean captures: `npm run build`, then `npm start`. Replace the origin with your actual deployment URL for hosted screenshots. The script refuses missing content or page failures; it never creates accounts or session cookies.

## Profile

```sh
npm run screenshots -- http://localhost:3000 --profile
```

Chrome opens in a new window. Sign in yourself within five minutes. The script waits for Profile, verifies the real session, captures `profile.png`, and masks the private email row. Session cookies are never printed or saved.

If the provider blocks automated-browser sign-in, use your ordinary Chrome window where Google login worked: open `https://techtalks-sigma.vercel.app/profile`, use a desktop-width window, keep the private email outside the capture, and save the image as `docs/screenshots/profile.png`. The capture script checks for the actual Profile heading because a streamed redirect may briefly visit `/profile` without a valid session. Do not substitute an integration-test profile for real authentication.

- [ ] Capture the real Profile page.
- [ ] Review all images for private data, errors, and layout problems.
- [ ] Replace the Profile row in the main README with a relative image link once `profile.png` exists.
- [ ] Commit the final screenshot and README change.
