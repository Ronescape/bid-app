import { Card } from "../../ui/card";

const steps = [
  { number: 1, title: "Choose Package", description: "Select points bundle" },
  { number: 2, title: "Scan QR Code", description: "Or copy wallet address" },
  { number: 3, title: "Send USDT", description: "BSC network only" },
  { number: 4, title: "Get Points", description: "Submit transaction hash" },
];

export function HowToTopup() {
  return (
    <Card className="p-6 bg-slate-800/30 border-slate-700/50">
      <h3 className="text-white mb-6">How to Top Up</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 mb-3 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg">
              {step.number}
            </div>
            <p className="text-white text-sm font-medium">{step.title}</p>
            <p className="text-slate-400 text-xs mt-1">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
