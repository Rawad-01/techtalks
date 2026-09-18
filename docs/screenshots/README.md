# Submission screenshots

The six public captures use the real app and Atlas content at a 1440 × 1000 viewport, with full-page capture. `profile.png` is the owner's 1366 × 768 desktop capture from a real GitHub sign-in on the deployed site, with the email redacted and reviewed. These images are separate from synthetic-account integration images in `.artifacts/`.

| File                    | Page                  | Capture                       |
| ----------------------- | --------------------- | ----------------------------- |
| `home.png`              | Homepage              | Public                        |
| `login.png`             | Google/GitHub options | Public                        |
| `blogs.png`             | Blogs                 | Public                        |
| `blog-details.png`      | Published article     | Public                        |
| `communities.png`       | Communities           | Public                        |
| `community-details.png` | Community detail      | Public                        |
| `profile.png`           | Your real profile     | Owner capture; email redacted |

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

- [x] Capture the real Profile page.
- [x] Review the submission images and redact the Profile email.
- [x] Link the real Profile image from the main README.
- [x] Include the final screenshot and README change in the submission commit.
