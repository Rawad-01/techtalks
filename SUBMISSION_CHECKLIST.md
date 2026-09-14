# TechTalks Capstone Submission Checklist

Checked items have evidence described in [VERIFICATION.md](VERIFICATION.md). Automated authenticated tests use isolated test sessions and MongoDB; they do not prove a hosted OAuth round trip. Public production reads are verified; provider and authenticated production checks remain unchecked until performed.

## Application

- [x] Homepage works
- [x] Blogs page works
- [x] Blog details work
- [x] Communities page works
- [x] Community details work
- [x] Login page and app session handling work
- [ ] Google OAuth independently verified on the final deployment
- [ ] GitHub OAuth independently verified on the final deployment
- [x] Profile is protected
- [x] Profile editing works
- [x] Blog creation works
- [x] Join community works
- [x] Leave community works
- [x] Logout revokes the browser session and restores protection

The owner reported successful local sign-in after configuration. Both provider buttons are configured. Test the providers separately in production, using different emails where needed.

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
- [ ] Repository visibility/access configured for the teacher
- [x] Clean project structure and generated-file exclusions
- [x] README documentation prepared
- [x] README Live Demo placeholder replaced with verified URL
- [x] Private `.env` files not committed
- [x] Final build passes

## Deployment

- [x] Application deployed
- [ ] Production environment variables configured
- [x] MongoDB production connection works
- [ ] Google OAuth production origin/callback configured
- [ ] GitHub OAuth production callback configured
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

Follow [DEPLOYMENT.md](docs/DEPLOYMENT.md) for the remaining hosting steps and [screenshot instructions](docs/screenshots/README.md) for the real profile capture. Do not use integration-test profile images as portfolio evidence of OAuth login.
