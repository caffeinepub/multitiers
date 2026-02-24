# Specification

## Summary
**Goal:** Add automatic Minecraft skin fetching when adding players, display skin avatars on player cards, and add a remove player button in the admin panel.

**Planned changes:**
- Update the backend player data model to include an optional `avatarUrl` field; update `addPlayer` and query methods accordingly
- Add a `removePlayer` method to the backend to delete a player by ID
- In the admin panel add-player form, auto-fetch the player's Minecraft skin avatar from `mc-heads.net` when a username is entered and show a preview before submission
- Show a clear error or fallback if the username is invalid or the avatar fetch fails
- Add a remove button next to each player in the admin panel list that calls the backend delete method and refreshes the list
- Update `PlayerCard` to display the `avatarUrl` image when available, falling back to the existing initial-based avatar if not

**User-visible outcome:** Admins can add players by Minecraft username with an auto-fetched skin preview, remove players directly from the admin panel, and the public tier list shows each player's Minecraft skin avatar as their profile picture.
