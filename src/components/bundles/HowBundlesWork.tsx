import { Card } from "../ui/card";

const steps = [
  "Purchase a bundle",
  "Activates immediately",
  "Daily rewards",
  "Passive income",
];

export function HowBundlesWork() {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {steps.map((s, i) => (
          <div key={i} className="text-center text-slate-300">
            <div className="w-10 h-10 mx-auto mb-2 bg-purple-600 rounded-full flex items-center justify-center text-white">
              {i + 1}
            </div>
            {s}
          </div>
        ))}
      </div>
    </Card>
  );
}
