### Plan

The plan is to implement the core business logic for the Xzen Contribute platform within the existing application structure.

**Phase 1: User Profile**

1.  **Create User Profile:** Implement the logic to create a user profile when a new user connects their Solana wallet. The profile will be based on the `profiles` table schema in the database.
2.  **Display Profile Information:** Update the existing UI components to display the user's profile information, including their wallet address, XZN points, and streak.

**Phase 2: Contribution and Reward System**

1.  **Token Discovery:** Implement the logic to discover all SPL tokens in the user's connected wallet.
2.  **Transaction Signing and Verification:** Integrate with the Solana SDK to sign and verify the contribution transaction.
3.  **Reward Calculation:** Implement the logic to calculate the XZN points earned for each contribution based on the rules defined in the SRS.
4.  **Streak Bonus:** Implement the logic to calculate and apply the daily streak bonus.

**Phase 3: Leaderboard and Referrals**

1.  **Leaderboard:** Implement the leaderboard feature, displaying the top contributors based on their XZN points.
2.  **Referral System:** Implement the referral system, allowing users to refer others and earn a percentage of their contributions.