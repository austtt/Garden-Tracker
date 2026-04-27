# Google OAuth Onboarding

_Started 2026-04-27 17:47 UTC_

---

## User

On the onboarding wizard, lets incorporate a page to create an account by using google to see email and name. The app should automatically keep people signed in. The already have an account? sign in should take you to sign in with google as well and then bring up all of your saved data from your linked google drive. For the plant photo on the onboarding screen, incorporate a generic spring garden photo. Provide bulleted next steps to refine the app for ease of use and required integration

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: copy_files]_

_[tool: str_replace_edit]_

Now I'll make all the changes. Let me do them in targeted passes:

_[tool: str_replace_edit]_

Now update the App to wire up auth state and new screens:

_[tool: str_replace_edit]_

Now update renderScreen and pass user/auth props to relevant screens:

_[tool: str_replace_edit]_

Now update MyPlantsScreen to show user avatar, and SettingsScreen to show Google account + sign out:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Now update SettingsScreen to show Google account info and sign-out:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Now re-add the Location card that got cut off, and add the Google Drive card that was separate before:

_[tool: read_file]_

_[tool: str_replace_edit]_

I can see the SettingsScreen has orphaned old content. Let me replace the whole broken section cleanly:

_[tool: grep]_

Now let me check for any duplicate definitions left over in the file:Good — no duplicates. Now let me load and check it:

_[tool: done]_

_[tool: fork_verifier_agent]_

Here's a summary of what changed in **v4**, plus your next steps:

---

### ✅ What's new in v4

- **Spring garden photo** — real Unsplash photo on the onboarding hero and the Google sign-in screen, with a soft gradient fade into the background
- **Google Sign-Up flow** — "Get Started" now routes to a dedicated Google auth screen with a real G logo button, permission disclosure copy, and a success state before proceeding to the wizard
- **Google Sign-In flow** — "Already have an account? Sign in" routes to the same screen in sign-in mode, then drops directly into My Plants with all saved data
- **Auto stay signed in** — auth state persists in `localStorage`; returning users skip onboarding entirely and land on My Plants
- **User avatar** — the 👤 icon in My Plants shows the user's initials (AJ) once signed in
- **Settings → Google Account** — shows name, email, Drive sync toggle, and a Sign Out link

---

### 📋 Recommended next steps

**Integration (required for production)**
- [ ] Implement real Google OAuth 2.0 via `google-identity` JS library (replace mock `setTimeout`)
- [ ] Request scopes: `profile`, `email`, `https://www.googleapis.com/auth/drive.appdata`
- [ ] Use Drive App Data folder to read/write plant JSON on sign-in and on every save
- [ ] Handle token refresh and revocation gracefully

**UX refinements**
- [ ] Add a loading skeleton on My Plants while Drive data is being fetched after sign-in
- [ ] Show a "Restore from Drive" confirmation step if existing data is found — don't silently overwrite
- [ ] Add offline mode indicator and local-only save when Drive is unreachable
- [ ] Let users unlink Google Drive without signing out of the app entirely

**Onboarding polish**
- [ ] After Google auth, pre-fill name on the welcome step ("Hey Alex, let's set up your garden")
- [ ] Add a progress indicator visible during Drive restore so users know data is loading
- [ ] Skip the wizard entirely for returning sign-ins with existing plant data

**Notifications & permissions**
- [ ] Request push notification permission during onboarding wizard (not before — ask in context)
- [ ] Add a camera permission explanation screen before the Identify flow on first use

## User

Verifier agent check completed

## Assistant

All checks passed! The prototype is looking good. The spring garden photo, Google auth flows, and persistent sign-in are all working correctly.

Let me know which next step you'd like to tackle — whether that's wiring up real Google OAuth, refining the onboarding wizard flow, or polishing another screen.

