# Specification

## Summary
**Goal:** Add a password-protected Admin/Management area where admins can add new players to the tier list.

**Planned changes:**
- Add an `addPlayer` update function to the backend Motoko actor that accepts player name, tier, category, and rating score, persists the new player, and returns it
- Create a new `/admin` route and `AdminPage.tsx` with a full-screen password gate (password: `65515616151`) using sessionStorage for auth state, including a Logout button
- Add an "Add Player" form in the management UI with fields for name, tier (10 options: LT5–HT1), category (8 options: Sword, Axe, Crystal, Mace, Spearmace, Diamond SMP, UHC, SMP), and rating score; shows success notification and clears form on submission
- Register the `/admin` route in `App.tsx` without adding it to the main Navbar

**User-visible outcome:** Admins can navigate directly to `/admin`, log in with the password, and add new players that immediately appear on the Tier List and Leaderboard pages. The admin area is not linked from the main navigation.
