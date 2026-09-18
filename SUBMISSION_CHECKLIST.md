# TechTalks Capstone Submission Checklist

Checked items have evidence described in [VERIFICATION.md](VERIFICATION.md). Automated authenticated tests use isolated test sessions and MongoDB; they do not prove a hosted OAuth round trip. Public production reads and callback URLs are verified. Owner-reported production sign-in is labeled separately; remaining production checks stay unchecked.

## Application

- [x] Homepage works
- [x] Blogs page works
- [x] Blog details work
- [x] Communities page works
- [x] Community details work
- [x] Login page and app session handling work
- [x] Google OAuth works on the final deployment (owner-reported successful sign-in)
- [x] GitHub OAuth works on the final deployment (owner-reported successful sign-in)
- [x] Profile is protected
- [x] Profile editing works
- [x] Blog creation works
- [x] Join community works
- [x] Leave community works
- [x] Logout revokes the browser session and restores protection

The owner reported successful production sign-in with both Google and GitHub. Both provider buttons are configured, and both callback URLs use the production origin. An email already registered through another provider must use its original provider; accounts are not automatically linked by email.

## Database

- [x] MongoDB Atlas connected locally
- [x] MongoDB Atlas connected in production
- [x] User records persist in local Atlas; profile updates tested in isolated MongoDB
- [x] Blog records persist in local Atlas and isolated tests
- [x] Community membership persistence verified in isolated tests

## Validation & Security

- [x] Zod validation works
- [x] Protected APIs return 401
- [x] Ownership checks work
- [x] Source and browser-bundle credential scan passes
- [x] No secrets committed
- [x] `.env.local` and other private environment files ignored
- [x] `.env.example` contains names only and is included
- [ ] Rotate credentials previously exposed in chat/screenshots before deployment

## GitHub

- [x] Repository pushed
- [x] Repository and screenshots are publicly accessible without signing in
- [x] Clean project structure and generated-file exclusions
- [x] README documentation prepared
- [x] README Live Demo placeholder replaced with verified URL
- [x] Private `.env` files not committed
- [x] Final build passes

## Deployment

- [x] Application deployed
- [x] Production environment variables configured (public data and both sign-in providers work)
- [x] MongoDB production connection works
- [x] Google OAuth production origin/callback configured (correct callback observed; owner confirms login)
- [x] GitHub OAuth production callback configured (correct callback observed; owner confirms login)
- [ ] Live URL tested in a private browser and on another device
- [ ] Profile edit, article publish, join/leave, and logout verified on the live site

## Submission Materials

- [x] GitHub repository URL: https://github.com/Rawad-01/techtalks
- [x] Live deployment URL: https://techtalks-sigma.vercel.app
- [x] README
- [x] Homepage screenshot
- [x] Login screenshot
- [x] Blogs screenshot
- [x] Blog details screenshot
- [x] Communities screenshot
- [x] Community details screenshot
- [ ] Real authenticated Profile screenshot
- [x] Demo script
- [x] Manual testing document
- [x] GitHub and Vercel deployment instructions
- [ ] Demo video recorded if used
- [x] Teacher submission message drafted in [docs/TEACHER_MESSAGE.md](docs/TEACHER_MESSAGE.md)

Follow [DEPLOYMENT.md](docs/DEPLOYMENT.md) for the remaining hosting steps and [screenshot instructions](docs/screenshots/README.md) for the real profile capture. Do not use integration-test profile images as portfolio evidence of OAuth login.
