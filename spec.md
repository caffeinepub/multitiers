# Specification

## Summary
**Goal:** Fix the stopped backend canister and perform a full UI/UX polish sweep across all pages and components of the MultiTiers app.

**Planned changes:**
- Redeploy the backend Motoko actor with a no-op change to bring the canister out of its stopped state, restoring all update and query calls
- Redesign the Home page with a more impactful hero section, glowing per-tier stat cards, and improved top-3 preview layout
- Polish the Tier List page and TierRow/PlayerCard components with stronger tier glow/gradient effects, better hover states, and improved empty-state styling
- Polish the Leaderboard page with gold/silver/bronze rank badges, alternating row highlights, hover effects, and improved tier badge styling
- Polish the AdminModal with refined dark card styling, consistent form input/select theming, distinct success/error notifications, scrollable player list, and prominent logout button
- Polish the Navbar with active link highlighting, dark-themed search input, improved mobile menu, and a bottom separator line
- Polish the CategoryFilter with clear active/inactive button states, hover effects, and responsive wrapping

**User-visible outcome:** The backend canister is fully operational again, and every page and component in the app has a visually polished, consistent dark gaming aesthetic with improved typography, spacing, and interactive states across desktop and mobile.
