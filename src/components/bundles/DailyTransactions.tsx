import { DollarSign, Coins, Calendar, Badge } from "lucide-react";
import { Card } from "../ui/card";
import { Transaction } from "./types";


interface Props {
  transactions: Transaction[];
  formatTime: (date: Date) => string;
}

export function DailyTransactions({ transactions, formatTime }: Props) {
  return (
    <Card className="p-6 bg-slate-800/30">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex justify-between mb-3">
          <div className="flex gap-3">
            {tx.type === "usdt" ? <DollarSign /> : <Coins />}
            <div>
              <div className="text-white">{tx.bundleName}</div>
              <div className="text-xs text-slate-400 flex gap-1">
                <Calendar className="w-3 h-3" />
                {formatTime(tx.date)}
              </div>
            </div>
          </div>
          <Badge className="text-green-400">{tx.status}</Badge>
        </div>
      ))}
    </Card>
  );
}
