import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TopupModalProps {
  package: {
    id: string;
    name: string;
    points: number;
    price: number;
    bonus?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (points: number) => void;
}

export function TopupModal({ package: pkg, isOpen, onClose, onSuccess }: TopupModalProps) {
  const [txHash, setTxHash] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock BSC wallet address
  const walletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast.success('Wallet address copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    if (!txHash.trim()) {
      toast.error('Please enter transaction hash');
      return;
    }

    if (txHash.length < 10) {
      toast.error('Invalid transaction hash');
      return;
    }

    setIsSubmitting(true);

    // Simulate verification
    setTimeout(() => {
      onSuccess(pkg.points);
      toast.success(`${pkg.points} points added to your account! 🎉`);
      setTxHash('');
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Top Up - {pkg.name} Package</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Package Info */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Points</span>
              <span className="text-purple-600">{pkg.points} Points</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Amount</span>
              <span>${pkg.price} USDT</span>
            </div>
            {pkg.bonus && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bonus</span>
                <Badge className="bg-green-100 text-green-700">
                  {pkg.bonus}
                </Badge>
              </div>
            )}
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center">
            <div className="text-sm text-gray-600 mb-3">Scan QR Code</div>
            <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
              {/* QR Code placeholder - using a real QR code generator */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${walletAddress}`}
                alt="QR Code"
                className="w-48 h-48"
              />
            </div>
            <Badge className="mt-3 bg-blue-100 text-blue-700 border-blue-300">
              BSC Network Only
            </Badge>
          </div>

          {/* Wallet Address */}
          <div className="space-y-2">
            <Label>Wallet Address (BSC Network)</Label>
            <div className="flex gap-2">
              <Input
                value={walletAddress}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Transaction Hash Input */}
          <div className="space-y-2">
            <Label htmlFor="txhash">Transaction Hash</Label>
            <Input
              id="txhash"
              placeholder="Enter your transaction hash (0x...)"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              After sending USDT, paste your transaction hash here
            </p>
          </div>

          {/* Warning */}
          <div className="flex gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="mb-1">Important:</p>
              <ul className="space-y-1 text-xs">
                <li>• Only send via BSC (BEP20) network</li>
                <li>• Send exactly ${pkg.price} USDT</li>
                <li>• Points credited after confirmation</li>
              </ul>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !txHash.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isSubmitting ? 'Verifying...' : 'Submit & Verify'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
