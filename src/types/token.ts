export interface Token {
    name: string;
    symbol: string;
    balance: number;
    mint: string;
    reward: number;
    uri?: string;
    description?: string;
    image?: string;
    createdOn?: string;
}

export interface ContributionToken extends Token {
    amount: number;
}
