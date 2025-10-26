# Xzen Contribute – Software Requirements Specification (SRS)

## 1. Overview

**Xzen Contribute** is a Web3 contribution and engagement platform built on **Solana**, where users contribute **SPL tokens** to a developer’s wallet and earn **Xzen Points (XZN)** as rewards.  

The platform encourages continued participation and community growth through:
- Token contributions  
- Leaderboards  
- Referral incentives  
- Daily streak bonuses  

---

## 2. System Features

---

## 2.1 Contribute

### Feature Description
Enables users to contribute SPL tokens from their connected Solana wallets and receive Xzen Points (XZN) rewards. Contributions are sent to the project’s developer wallet.

---

### Functional Specifications

#### 1. Wallet Connection
- Users must connect a Solana-compatible wallet (e.g., Phantom, Solflare, Torus).  
- The connected wallet serves as the user’s unique identifier.  
- Connection state is maintained across sessions.

#### 2. Token Discovery
- The system automatically detects all **SPL tokens** in the connected wallet.  
- Tokens are displayed in a list with name, balance, and symbol.

#### 3. Token Selection
- Users can select one or multiple tokens to contribute in a single transaction.  
- The interface allows:
  - Token selection checkboxes  
  - Entry of contribution amounts per token  

#### 4. Contribution Preview
- The preview panel shows:
  - Selected tokens and amounts  
  - Estimated **XZN points** to be earned  
  - Any applicable **streak bonus** multiplier  

#### 5. Transaction Signing
- On confirming, the system prompts the connected wallet to **sign the transaction**.  
- Uses Solana SDK functionality for **multi-token transfer** in one request.  

#### 6. Transaction Verification
- Once Solana confirms the transaction:
  - Contribution is recorded on Supabase.  
  - XZN rewards are calculated and issued.  
  - Referral reward (if applicable) is distributed to the referrer.  

---

### Reward System – Xzen Points (XZN)

| Contribution Type | Description | Reward (Example) |
|-------------------|-------------|------------------|
| **New Token Contribution** | First-ever contribution of a token | 100 XZN |
| **Rare Token Contribution** | Token contributed less than 5 times | 20 XZN |
| **Common Token Contribution** | Frequently contributed token | 5 XZN |

**Notes:**
- Rewards vary based on token rarity and 24-hour contribution frequency.  
- The system updates **total balance** and **contribution history** in real time.

---

### Daily Streak Bonus

Encourages daily activity through streak-based multipliers.

| Streak Duration | Bonus Multiplier |
|------------------|------------------|
| 3 days | +5% |
| 7 days | +10% |
| 14 days | +20% |
| 30 days | +50% |

#### Streak Logic
1. Contributing at least once daily increases streak count.  
2. A missed day resets the streak to 0.  
3. Bonus multiplier applies to all XZN earned during an active streak.  

#### Dashboard Display
- Shows current streak count, tier, and multiplier.  
- Visual indicators (badges, progress bars) display streak milestones.  

---

### Contribution Flow

1. Connect Solana wallet.  
2. System lists SPL tokens.  
3. User selects tokens and amounts.  
4. Preview estimated rewards and streak bonus.  
5. Confirm and sign transaction.  
6. Transaction verified → XZN and referral rewards distributed.  
7. Dashboard updates balance, streak, and history.  

---

### Technical Implementation
- **Frontend:** Next.js + Tailwind CSS (existing design to be reused).  
- **Backend:** Supabase for transactions, streak tracking, and user balances.  
- **Blockchain:** Solana SDK for wallet integration and multi-token transfers.  

---

## 2.2 Leaderboard

### Feature Description
Displays rankings of top contributors by total XZN earned, promoting competition and engagement.

---

### Functional Specifications

#### Leaderboard Views
- **Daily:** Resets every 24 hours.  
- **Weekly:** Resets every 7 days.  
- **Monthly:** Resets every 30 days.  
- **All-time:** Cumulative total without reset.  

#### Data Display
Each leaderboard entry includes:
- User avatar  
- Wallet address (shortened form)  
- Total XZN points  
- Current streak level  

#### Filtering & Sorting
- Sort by:
  - Highest total points  
  - Longest streak  
  - New contributors  

#### Community Highlights (Optional)
- Optionally display:
  - Top daily contributor badge  
  - Longest streak holder  
  - Featured “Most Rare Token Contributor”  

---

### Technical Implementation
- Data sourced from Supabase’s aggregation of contribution records.  
- Leaderboards updated periodically or on demand.  
- Cached data served to reduce load on blockchain queries.  

---

## 2.3 Referrals

### Feature Description
Users earn rewards by inviting others to the platform. Referrers receive 10% of all future XZN earned by their referrals.

---

### Functional Specifications

#### 1. Referral Code Generation
- Every user has a unique referral code generated on profile creation.  
- The referral link embeds this code (e.g., `xzen.app/?ref=<code>`).  

#### 2. Referral Tracking
- When a new user joins via a referral link:
  - Their wallet is linked to the referrer.  
  - The relationship is stored permanently.  

#### 3. Reward Logic
- Referrers earn **10%** of their referrals’ contribution points.  
- Rewards are distributed automatically after each contribution event.

**Example:**  
If a referred user earns **100 XZN**, the referrer gets **10 XZN**.

#### 4. Anti-Abuse Rules
- A user cannot refer themselves.  
- Each wallet can only be referred once.  
- Duplicate referrals are ignored.  

---

### Referral Flow

1. User generates or copies referral link.  
2. New user connects wallet via referral link.  
3. System links referral and referrer.  
4. On every contribution:
   - Referral’s XZN calculated.  
   - 10% credited to referrer.  
   - Both balances updated in real time.  

---

### Technical Implementation
- **Supabase**: Tracks referral links and point distribution.  
- **Next.js Frontend**: Provides referral link generation and display.  
- **Blockchain (Solana)**: No on-chain logic; handled off-chain in Supabase logic layer.  

---

## 2.4 Profile

### Feature Description
Represents the user’s identity and contribution stats within the Xzen ecosystem.

---

### Functional Specifications

#### 1. Profile Creation
- Automatically generated upon wallet connection.  
- No manual signup required.  

#### 2. Profile Data
Includes:
- Wallet address  
- Avatar (based on first letter of wallet address)  
- Total XZN balance  
- Total contributions  
- Current streak count and tier  
- Referral code/link  
- Contribution history  

#### 3. Profile Dashboard
Displays:
- Token contribution history (sortable by date/token).  
- XZN earned (with streak multiplier).  
- Current streak and next bonus tier.  
- Referral earnings and referred users count.  

---

### User Interface
- Clean layout built on Tailwind CSS.  
- Tabs or cards for:
  - Contributions  
  - Streak progress  
  - Referral stats  

---

### Technical Implementation
- **Next.js + Supabase** integration for real-time data updates.  
- Supabase profiles table stores user details and metrics.  
- Data fetched and displayed dynamically.  

---

## 3. Technical Summary

| Component | Technology | Purpose |
|------------|-------------|----------|
| **Frontend** | Next.js + Tailwind CSS | UI and user interactions |
| **Backend** | Supabase | Data storage, leaderboards, referrals |
| **Blockchain** | Solana SDK | Wallet connection, token transfers |
| **Reward Logic** | Supabase Functions or Edge Functions | Points and streak calculations |

---

## 4. Acceptance Criteria
- ✅ Users can contribute multiple tokens in one transaction.  
- ✅ XZN rewards calculated and credited instantly.  
- ✅ Referral logic applies 10% bonus correctly.  
- ✅ Streaks increment daily and reset after inactivity.  
- ✅ Leaderboards display accurate and timely data.  
- ✅ Profiles show all relevant contribution and referral information.  
