# ts_shared

Shared modules for `frontends/`, `OfficialSitePrivate/`, and `OfficialSiteDocs/`.

## Active modules

- `localization/`: locale metadata, locale detection, locale URLs, locale path routing, shared dictionary helpers
- `theme-system/`: theme preference parsing, theme bootstrap, theme application helpers
- `language-menu/`: language menu options, shared menu styles, dropdown behavior for path-based locale switching
- `theme-toggle/`: binary theme toggle behavior and shared toggle styles
- `form-fields/`: shared form primitives such as field wrappers and text inputs
- `password-fields/`: password-specific inputs and strength UI

## Rules

- Keep imports on public module entrypoints. Do not import files across sibling modules.
- Split by product meaning, not by framework convenience or temporary reuse.
- Put only cross-project primitives here. Project-specific routing, fetching, page state, and branding stay in each app.
- If a component needs local theme or product wording, keep a thin wrapper in the app and keep the shared core here.
- Do not add broad catch-all modules. Add a new module only when its boundary is clear from the name.
- Prefer small stable exports. Internal helpers should stay inside their owning module.
- When replacing an old shared API, move callers to the new module first, then remove the old entry instead of keeping parallel sources.
