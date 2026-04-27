# Google Drive Plant Sync

_Started 2026-04-27 23:12 UTC_

---

## User

Integration (required for production)

 Implement real Google OAuth 2.0 via google-identity JS library (replace mock setTimeout)
 Request scopes: profile, email, https://www.googleapis.com/auth/drive.appdata
 Use Drive App Data folder to read/write plant JSON on sign-in and on every save
 Handle token refresh and revocation gracefully
UX refinements

 Add a loading skeleton on My Plants while Drive data is being fetched after sign-in
 Show a "Restore from Drive" confirmation step if existing data is found — don't silently overwrite
 Add offline mode indicator and local-only save when Drive is unreachable
 Let users unlink Google Drive without signing out of the app entirely
Onboarding polish

 After Google auth, pre-fill name on the welcome step ("Hey Alex, let's set up your garden")
 Add a progress indicator visible during Drive restore so users know data is loading
 Skip the wizard entirely for returning sign-ins with existing plant data

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: update_todos]_

_[tool: copy_files]_

Got it — building v5 now with all the integration + UX changes.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Working on it — implementing all the changes now.

_[tool: write_file]_

