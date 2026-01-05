import { Card } from "../../ui/card";
import { Sparkles } from "lucide-react";

const notes = [
  "Only send USDT via BSC (Binance Smart Chain) network",
  "Minimum transaction amount: $10 USDT",
  "Points are credited after confirmation (1–5 minutes)",
  "Submit the correct transaction hash",
  "Contact support if points are not received within 30 minutes",
];

export function ImportantNotes() {
  return (
    <Card className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-yellow-400/30">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h4 className="text-yellow-400">Important Notes</h4>
      </div>

      <ul className="space-y-2 text-sm text-slate-400">
        {notes.map((note, index) => (
          <li key={index} className="flex gap-2">
            <span className="text-yellow-400">•</span>
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
