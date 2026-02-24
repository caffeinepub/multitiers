# Specification

## Summary
**Goal:** Display the full `/admin` URL as a copyable element inside the authenticated Admin management UI.

**Planned changes:**
- Add a labelled "Admin URL" section inside the post-login admin management UI in `AdminPage.tsx`
- Derive the URL dynamically using `window.location.origin + '/admin'`
- Render the URL in a styled read-only input or code block with a monospace font and distinct background matching the dark gaming theme
- Add a "Copy" button that copies the URL to the clipboard via the Clipboard API
- Show a brief "Copied!" confirmation on the button for ~2 seconds after clicking, then revert to "Copy"

**User-visible outcome:** Admins can see their full admin page URL displayed in the management UI and copy it to the clipboard with a single click.
