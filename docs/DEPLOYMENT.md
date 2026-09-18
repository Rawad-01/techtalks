# GitHub and Vercel deployment

The repository is https://github.com/Rawad-01/techtalks and the production site is https://techtalks-sigma.vercel.app. The prepared commit has been pushed; public pages and production database reads are verified. Local development has its own credentials; configure production secrets directly in the hosting dashboard.

The production callback URLs have been corrected and verified, and the owner reports successful Google and GitHub sign-in. The production `NEXTAUTH_URL` is `https://techtalks-sigma.vercel.app`. Google uses origin `https://techtalks-sigma.vercel.app` and redirect `https://techtalks-sigma.vercel.app/api/auth/callback/google`; GitHub uses homepage `https://techtalks-sigma.vercel.app` and callback `https://techtalks-sigma.vercel.app/api/auth/callback/github`. Redeploy after any future production variable changes. Authenticated production writes remain to be verified.

## 1. Push the prepared Git repository

Create an empty repository in your own GitHub account. Choose the visibility required by your teacher; a private repository requires granting the teacher access. Do not initialize the remote with another README or license.

In the project terminal, first review the current state:

```powershell
git status
git log -1 --oneline
git remote -v
```

The preparation process initializes `main` and creates a local submission commit. After adding any final profile screenshot or documentation changes:

```powershell
git add README.md SUBMISSION_CHECKLIST.md docs
git diff --cached --stat
git diff --cached --name-only
```

If there are staged changes, commit them:

```powershell
git commit -m "Add final submission evidence"
```

With no existing `origin`, replace the placeholder inside quotes and run:

```powershell
git remote add origin "<MY_GITHUB_REPOSITORY_URL>"
git push -u origin main
```

If `origin` already exists, inspect it and push only when it matches your intended repository. Do not overwrite it blindly. Authenticate using GitHub's browser/credential-manager flow; do not embed a token in the remote URL. Confirm GitHub contains source, README, docs, and `.env.example`, but no `.env.local`, `.next`, `node_modules`, or `.artifacts`.

## 2. Import into Vercel

Sign in to Vercel with GitHub, choose **Add New → Project**, and import your repository. Use the **Next.js** framework preset, repository root, Node.js **24.x**, install command `npm ci`, and build command `npm run build`. Leave the output directory at the Next.js default. See [Vercel project setup](https://vercel.com/docs/projects/managing-projects).

## 3. Configure production secrets and Atlas

Set environment variables in the Vercel project's **Settings → Environment Variables**, scoped to **Production**:

| Name                   | Production setting                                                     |
| ---------------------- | ---------------------------------------------------------------------- |
| `MONGODB_URI`          | Intended Atlas database, including its database name                   |
| `NEXTAUTH_SECRET`      | A newly generated random secret; keep stable across normal deployments |
| `NEXTAUTH_URL`         | Actual stable HTTPS production origin, without a trailing slash        |
| `GOOGLE_CLIENT_ID`     | Production Google web-client ID                                        |
| `GOOGLE_CLIENT_SECRET` | Its actual secret                                                      |
| `GITHUB_CLIENT_ID`     | Production GitHub OAuth app ID                                         |
| `GITHUB_CLIENT_SECRET` | Its actual secret                                                      |

Normally omit `MONGODB_DNS_SERVERS`; the local override addresses this computer's network. Vercel is recognized as a trusted host by Auth.js. Do not prefix secrets with `NEXT_PUBLIC_`.

If the production domain is unknown until the first deployment, initially supply `MONGODB_URI` and `NEXTAUTH_SECRET`, deploy to obtain the actual domain, then complete `NEXTAUTH_URL` and both provider pairs and redeploy before testing login. Do not submit the initial unconfigured version.

Rotate credentials already exposed in chat/screenshots before putting them online. Use a database user with read/write access only to the intended app database. The existing Atlas seed can be reused if that is the intended demo database; a separate empty database needs its own seed/index initialization.

### Atlas network access

Atlas must allow the deployment's outbound connections. Prefer an explicit IP allowlist when your hosting setup offers stable egress. Vercel's standard deployments use dynamic outbound addresses; its [Atlas integration documentation](https://www.mongodb.com/docs/atlas/reference/partner-integrations/vercel/) describes allowing `0.0.0.0/0` for that configuration.

That rule allows connection attempts from every IPv4 address; it removes the IP restriction even though database authentication and TLS still apply. Use it only if you accept that demo-hosting tradeoff, with rotated strong credentials and database-limited permissions. Use stable/private networking for stricter restrictions. Preparation does not change your Atlas access list.

## 4. Deploy and record the real domain

Click **Deploy**. After success, copy the project's stable production domain from Vercel. Use that domain for OAuth and the teacher's link, rather than a temporary preview URL. Standard deployment protection can restrict previews while leaving the production domain public; check the actual behavior in a private browser. See [Vercel deployment protection](https://vercel.com/docs/deployment-protection).

## 5. Configure Google production OAuth

In **Google Auth Platform → Clients**, create/use your production Web application client. Using the actual production origin:

```text
Authorized JavaScript origin: <PRODUCTION_ORIGIN>
Authorized redirect URI:      <PRODUCTION_ORIGIN>/api/auth/callback/google
```

`<PRODUCTION_ORIGIN>` includes `https://` and has no trailing slash. These are placeholders, not invented domains. Update Vercel with the corresponding Google client ID and secret. Configure audience/consent access so your teacher's account can sign in; add test users where the project's settings require them. Follow [Google's client management guide](https://support.google.com/cloud/answer/15549257?hl=en).

## 6. Configure GitHub production OAuth

Create a separate GitHub OAuth App for the deployed project:

```text
Homepage URL:               <PRODUCTION_ORIGIN>
Authorization callback URL: <PRODUCTION_ORIGIN>/api/auth/callback/github
```

Save its client ID and secret in Vercel. Keeping local and production OAuth apps separate preserves local development. See [GitHub's registration guide](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app).

## 7. Redeploy and verify

If GitHub returns to Login with an account-conflict message, the email is already registered with another provider. Use the original provider or a GitHub account with a different email. TechTalks does not automatically link provider identities by email. The authentication redirect preserves this message instead of silently returning to Login.

Redeploy after changing environment variables. Confirm `NEXTAUTH_URL`, Google settings, and GitHub settings all use the same actual HTTPS origin.

In a private browser, test Home, Blogs, article, Communities, and community detail. Test Google and GitHub separately, using different emails if necessary because this app intentionally prevents cross-provider account linking.

Then verify the complete write flow: edit Profile, refresh, publish an original article, revisit it, join a community, refresh, leave, and sign out. Verify the records in the intended Atlas database and check that `/profile` is protected after logout. Use [MANUAL_TESTING.md](MANUAL_TESTING.md).

## 8. Finish the handoff

Replace the README's Live Demo placeholder with the verified URL. Capture the real Profile screenshot, update the checklist, and commit/push the final evidence. Send your teacher the GitHub URL, live production URL, and screenshots or recorded demo. Test the exact links from another device before submitting.

For a source ZIP, exclude Git internals, environment values, dependencies, build output, and local artifacts. The ZIP does not deploy the application; its README explains how another developer can configure it.
