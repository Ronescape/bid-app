import { Badge, Calendar, Coins, DollarSign } from "lucide-react";
import { Card } from "../ui/card";
import { Transaction } from "./types";
import { useState } from "react";
import { formatTime } from "./utils";

export function BundleRewardsHistory() {
  const [dailyTransactions] = useState<Transaction[]>([
    { id: "1", bundleName: "Diamond Bundle", type: "usdt", amount: 5.5, date: new Date(Date.now() - 1 * 60 * 60 * 1000), status: "completed" },
    { id: "2", bundleName: "Gold Bundle", type: "points", amount: 50, date: new Date(Date.now() - 2 * 60 * 60 * 1000), status: "completed" },
    { id: "3", bundleName: "Premium Bundle", type: "usdt", amount: 8.2, date: new Date(Date.now() - 5 * 60 * 60 * 1000), status: "completed" },
    { id: "4", bundleName: "Silver Bundle", type: "points", amount: 30, date: new Date(Date.now() - 8 * 60 * 60 * 1000), status: "completed" },
    { id: "5", bundleName: "Diamond Bundle", type: "usdt", amount: 5.5, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: "completed" },
    { id: "6", bundleName: "Elite Bundle", type: "points", amount: 120, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: "completed" },
    { id: "7", bundleName: "Gold Bundle", type: "usdt", amount: 3.5, date: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000), status: "completed" },
    { id: "8", bundleName: "Premium Bundle", type: "points", amount: 80, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: "completed" },
    { id: "9", bundleName: "Starter Bundle", type: "points", amount: 15, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: "completed" },
    { id: "10", bundleName: "Diamond Bundle", type: "usdt", amount: 5.5, date: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000), status: "completed" },
    { id: "11", bundleName: "Silver Bundle", type: "points", amount: 30, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), status: "completed" },
    { id: "12", bundleName: "Elite Bundle", type: "usdt", amount: 12.0, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), status: "completed" },
    { id: "13", bundleName: "Gold Bundle", type: "points", amount: 50, date: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000), status: "completed" },
    { id: "14", bundleName: "Premium Bundle", type: "usdt", amount: 8.2, date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), status: "completed" },
    { id: "15", bundleName: "Starter Bundle", type: "points", amount: 15, date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), status: "completed" },
    { id: "16", bundleName: "Diamond Bundle", type: "usdt", amount: 5.5, date: new Date(Date.now() - 4.5 * 24 * 60 * 60 * 1000), status: "completed" },
    { id: "17", bundleName: "Silver Bundle", type: "points", amount: 30, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: "completed" },
    { id: "18", bundleName: "Gold Bundle", type: "usdt", amount: 3.5, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: "completed" },
    { id: "19", bundleName: "Elite Bundle", type: "points", amount: 120, date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), status: "completed" },
    { id: "20", bundleName: "Premium Bundle", type: "usdt", amount: 8.2, date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), status: "completed" },
  ]);

  return (
    <div>
      <h3 className="mb-4 text-white">Daily Rewards History</h3>
      <Card className="p-6 bg-slate-800/30 backdrop-blur-sm border-slate-700/50">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {dailyTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 bg-black/60 rounded-lg border border-slate-700/30 hover:border-purple-500/30 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "usdt" ? "bg-gradient-to-br from-blue-500 to-cyan-500" : "bg-gradient-to-br from-purple-500 to-pink-500"}`}>{tx.type === "usdt" ? <DollarSign className="w-5 h-5 text-white" /> : <Coins className="w-5 h-5 text-white" />}</div>
                <div>
                  <div className="text-white">{tx.bundleName}</div>
                  <div className="text-sm text-slate-400 flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {formatTime(tx.date)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={tx.type === "usdt" ? "text-blue-400" : "text-purple-400"}>
                  +{tx.amount} {tx.type === "usdt" ? "USDT" : "Points"}
                </div>
                <Badge className="mt-1 bg-green-500/20 text-green-400 border-green-500/30 text-xs">{tx.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
