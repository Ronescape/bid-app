import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Card } from '../../ui/card';
import { X, Copy, Check, ExternalLink, Coins, Shield, AlertCircle, Gift } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Package } from '../../../data/gameData';

interface TopupModalProps {
  package: Package;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (points: number) => void;
}

export function TopupModal({ package: pkg, isOpen, onClose, onSuccess }: TopupModalProps) {
  const [step, setStep] = useState(1);
  const [transactionHash, setTransactionHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const walletAddress = '0x1234567890abcde......f12345678';
  const bscScanUrl = `https://bscscan.com/address/${walletAddress}`;
  const totalPoints = pkg.points + (pkg.bonusPoints || 0);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast.success('Wallet address copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitTransaction = () => {
    if (!transactionHash.trim()) {
      toast.error('Please enter transaction hash');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Success! ${totalPoints} points added to your account`);
      onSuccess(totalPoints);
      setStep(3);
    }, 1500);
  };

  const handleClose = () => {
    setStep(1);
    setTransactionHash('');
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setTransactionHash('');
    }
  }, [isOpen]);

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${walletAddress}`;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl w-full h-[90vh] max-h-[90vh] p-0 bg-slate-900 border-slate-700/50 flex flex-col">
        {/* Header */}
        <DialogHeader className="relative flex-shrink-0 p-4 border-b border-slate-700/50">
          <DialogTitle className="text-white flex items-center gap-2 truncate">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <div className="truncate">
              <div className="truncate">Top Up Points</div>
              <DialogDescription className="text-slate-400 truncate">
                Package: {pkg.name}
              </DialogDescription>
            </div>
          </DialogTitle>
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-0 top-0 text-slate-400 hover:text-white"
            onClick={handleClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    step >= s ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-slate-700'
                  }`}>
                    <span className="text-white text-sm">{s}</span>
                  </div>
                  {s < 3 && (
                    <div className={`w-16 h-1 ${step > s ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-slate-700'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Package Info */}
          <Card className="bg-slate-800/50 border-slate-700/50 p-4 mb-4">
            <div className="flex items-center justify-between mb-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="text-lg text-white">${pkg.price}</div>
                <div className="text-sm text-slate-400">USDT</div>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <div className="text-2xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  {totalPoints}
                </div>
                <div className="text-sm text-slate-400">Points</div>
              </div>
            </div>
            {pkg.bonus && (
              <div className="flex items-center justify-center mt-2">
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 truncate">
                  <Gift className="w-3 h-3 mr-1" />
                  {pkg.bonus} ({pkg.bonusPoints} bonus points)
                </Badge>
              </div>
            )}
          </Card>

          {/* Step Content */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <h4 className="text-white truncate">Payment Details</h4>
                </div>
                <div className="text-center mb-4">
                  <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto border-4 border-white/10 rounded-lg" />
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-slate-400 mb-1 truncate">Wallet Address (BSC)</div>
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 flex items-center justify-between">
                      <code className="text-sm text-slate-300 truncate">{walletAddress}</code>
                      <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white" onClick={handleCopy}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Network</div>
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 truncate">
                      BSC (Binance Smart Chain)
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Amount to Send</div>
                    <div className="text-xl text-white">${pkg.price} USDT</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-yellow-400 font-medium mb-1 truncate">Important Notice</div>
                    <ul className="text-xs text-yellow-300/80 space-y-1">
                      <li className='text-white'>• Send only USDT via BSC network</li>
                      <li className='text-white'>• Do not send any other tokens</li>
                      <li className='text-white'>• Minimum amount: $10 USDT</li>
                      <li className='text-white'>• Include sufficient gas fees</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <h4 className="text-white truncate">Verify Transaction</h4>
                </div>
                <div className="space-y-4">
                  <Input
                    value={transactionHash}
                    onChange={(e) => setTransactionHash(e.target.value)}
                    placeholder="0x..."
                    className="bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500"
                  />
                  <div className="text-xs text-slate-400 text-center truncate">
                    You can find the transaction hash in your wallet or on{' '}
                    <a href={bscScanUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 truncate">
                      BSCScan <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-8 border border-green-500/20">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-white mb-2 truncate">Top Up Successful!</h3>
                <p className="text-slate-300 mb-6 truncate">{totalPoints} points have been added to your account</p>
                <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
                  <div className="text-3xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-1">+{totalPoints}</div>
                  <div className="text-sm text-slate-400">Points Added</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-slate-700/50 p-4 flex gap-2 flex-wrap">
          {step === 1 && (
            <>
              <Button
                variant="outline"
                className="flex-1 border-slate-700 text-slate-400 hover:text-white"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-purple-500/70"
                onClick={() => setStep(2)}
              >
                I've Sent Payment
              </Button>
            </>
          )}
          {step === 2 && (
            <>
              <Button
                variant="outline"
                className="flex-1 border-slate-700 text-slate-400 hover:text-white"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-green-500/70"
                onClick={handleSubmitTransaction}
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Submit Transaction'}
              </Button>
            </>
          )}
          {step === 3 && (
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-purple-500/70"
              onClick={handleClose}
            >
              Start Bidding
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
