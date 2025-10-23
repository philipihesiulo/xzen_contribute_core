"use client";

import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

const contributions = [
  { token: "SOL", contract: "SPL Token", amount: "0.5", date: "Oct 3", points: "50 XZN", bonus: "+10%" },
  { token: "SOL", contract: "SPL Token", amount: "0.5", date: "Oct 3", points: "50 XZN", bonus: "+10%" },
  { token: "SOL", contract: "SPL Token", amount: "0.5", date: "Oct 3", points: "50 XZN", bonus: "+10%" },
  { token: "SOL", contract: "SPL Token", amount: "0.5", date: "Oct 3", points: "50 XZN", bonus: "+10%" },
  { token: "SOL", contract: "SPL Token", amount: "0.5", date: "Oct 3", points: "50 XZN", bonus: "+10%" },
];

export function RecentContributions() {

  return (
    <Card className="bg-card border-border w-full">
      <div className="flex items-center justify-between border-b border-border p-6">
        <h3 className="text-lg font-semibold">My Recent Contributions</h3>
        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          All <ChevronDown className="h-4 w-4" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border">
            <tr className="text-left text-sm text-muted-foreground">
              <th className="p-4 font-medium">Token</th>
              <th className="p-4 font-medium">Contract Address</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Points Earned</th>
              <th className="p-4 font-medium">Streak Bonus</th>
            </tr>
          </thead>
          <tbody>
            {contributions.map((item, index) => (
              <tr key={index} className="border-b border-border last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/20" />
                    <span className="font-medium">{item.token}</span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{item.contract}</td>
                <td className="p-4">{item.amount}</td>
                <td className="p-4 text-muted-foreground">{item.date}</td>
                <td className="p-4 font-medium">{item.points}</td>
                <td className="p-4 text-accent">{item.bonus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
