### Tasks

1.  **Create a `User` type:** Create a `User` type in `src/types/user.ts` that mirrors the `profiles` table in the database.
2.  **Create a `useUser` hook:** Create a `useUser` hook in `src/hooks/useUser.ts` to fetch and manage the current user's data.
3.  **Update `AuthProvider`:** Update the `AuthProvider` in `src/providers/AuthProvider.tsx` to use the `useUser` hook and provide the user data to the application.
4.  **Implement `getOrCreateUser` function:** In `src/lib/authService.ts`, implement a function `getOrCreateUser` that checks if a user exists in the database and creates a new one if they don't.
5.  **Update `Sidebar`:** Update the `Sidebar` component in `src/components/Sidebar.tsx` to display the user's XZN points and streak.
6.  **Update `Profile` page:** Update the `Profile` page in `src/app/profile/page.tsx` to display the user's profile information.
7.  **Implement Token Discovery:** In the `contribute` page, implement the logic to discover and display the user's SPL tokens.
8.  **Implement Contribution Logic:** In the `contribute` page, implement the logic to handle the contribution transaction, including signing, verification, and reward calculation.