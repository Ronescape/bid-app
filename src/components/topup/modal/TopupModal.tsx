import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import { Card } from "../../ui/card";
import { X, Copy, Check, ExternalLink, Coins, Shield, AlertCircle, Gift, Loader2, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";
import { Package } from "../../../data/gameData";
import { PaymentData, SubmitHashResponse } from "../../packages/types";

interface TopupModalProps {
  package: Package;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (points: number) => void;
  onPurchase: () => Promise<any>;
  onSubmitHash?: (referenceId: string, transactionHash: string) => Promise<any>;
  isPurchaseLoading?: boolean;
  currentStep?: number;
  onStepChange?: (step: number) => void;
  verificationStatus?: string;
  onVerificationStatusChange?: (status: string) => void;
  onTransactionComplete?: () => void;
}

export function TopupModal({ package: pkg, isOpen, onClose, onSuccess, onPurchase, onSubmitHash, isPurchaseLoading = false, currentStep = 1, onStepChange = () => {}, verificationStatus = "", onVerificationStatusChange = () => {}, onTransactionComplete = () => {} }: TopupModalProps) {
  const [step, setStep] = useState(currentStep);
  const [transactionHash, setTransactionHash] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [expiryTime, setExpiryTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isSubmittingHash, setIsSubmittingHash] = useState(false);
  const [submitResponse, setSubmitResponse] = useState<SubmitHashResponse | null>(null);

  const totalPoints = pkg.points + (pkg.bonusPoints || 0);
  const bscScanUrl = `https://bscscan.com/tx/${transactionHash}`;

  // Sync step with parent component
  useEffect(() => {
    if (step !== currentStep) {
      console.log(`🔄 [Modal] Syncing step from parent: ${currentStep}`);
      setStep(currentStep);
    }
  }, [currentStep, step]);

  // Update parent when step changes
  const handleStepChange = (newStep: number) => {
    console.log(`🔄 [Modal] Step changing: ${step} -> ${newStep}`);
    setStep(newStep);
    onStepChange(newStep);
  };

  // Update parent when verification status changes
  const handleVerificationStatusChange = (newStatus: string) => {
    console.log(`🔄 [Modal] Verification status: ${newStatus}`);
    onVerificationStatusChange(newStatus);
  };

  const formatWalletAddress = (address: string): string => {
    if (!address) return "";
    const cleanAddress = address.trim();
    if (cleanAddress.length <= 12) return cleanAddress;
    return `${cleanAddress.substring(0, 6)}...${cleanAddress.substring(cleanAddress.length - 4)}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePurchase = async () => {
    if (isPurchasing) return;

    setIsPurchasing(true);
    try {
      const response = await onPurchase();
      console.log("Purchase response:", response);

      if (response?.success && response?.data) {
        setPaymentData(response.data);

        if (response.data.topup_request?.expire_ts) {
          const expiry = new Date(response.data.topup_request.expire_ts);
          setExpiryTime(expiry);
        }

        // toast.success("Payment details generated!");
        handleStepChange(2);
      } else {
        toast.error(response?.message || "Failed to generate payment details");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Failed to process purchase");
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleSubmitTransaction = async () => {
    if (!transactionHash.trim()) {
      toast.error("Please enter transaction hash");
      return;
    }

    if (!paymentData?.topup_request?.reference) {
      toast.error("Reference ID not found. Please restart the process.");
      return;
    }

    setIsSubmittingHash(true);

    try {
      if (onSubmitHash) {
        console.log("Submitting transaction hash:", {
          referenceId: paymentData.topup_request.reference,
          transactionHash,
        });

        const response = await onSubmitHash(paymentData.topup_request.reference, transactionHash);

        console.log("Submit hash response:", response);
        setSubmitResponse(response);

        if (response?.success) {
          const status = response.data?.status || "confirming";
          handleVerificationStatusChange(status);
          handleStepChange(4);
          toast.success(response.message || "Transaction submitted successfully!");
        } else {
          toast.error(response?.message || "Failed to verify transaction");
        }
      } else {
        handleVerificationStatusChange("confirming");
        handleStepChange(4);
        toast.success("Transaction submitted!");
      }
    } catch (error: any) {
      console.error("Error submitting transaction hash:", error);
      toast.error(error.message || "Failed to verify transaction");
    } finally {
      setIsSubmittingHash(false);
    }
  };

  const handleClose = () => {
    console.log("[Modal] Closing modal");
    setStep(1);
    setTransactionHash("");
    setPaymentData(null);
    setExpiryTime(null);
    setSubmitResponse(null);
    handleVerificationStatusChange("");
    onClose();
  };

  // Handle step 5 completion
  const handleSuccessComplete = () => {
    console.log("[Modal] Success complete, triggering onSuccess");
    if (step === 5) {
      onSuccess(totalPoints);
      onTransactionComplete();
    }
  };

  // Countdown timer for expiry
  useEffect(() => {
    if (!expiryTime) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = expiryTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setTransactionHash("");
      setPaymentData(null);
      setExpiryTime(null);
      setSubmitResponse(null);
      handleVerificationStatusChange("");
    }
  }, [isOpen]);

  // QR Code URL based on wallet address
  const qrCodeUrl = paymentData?.topup_request?.wallet_address ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${paymentData.topup_request.wallet_address}` : "";

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
              <DialogDescription className="text-slate-400 truncate">Package: {pkg.name}</DialogDescription>
            </div>
          </DialogTitle>
          <Button size="sm" variant="ghost" className="absolute right-0 top-0 text-slate-400 hover:text-white" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= s ? "bg-gradient-to-r from-purple-600 to-blue-600" : "bg-slate-700"}`}>
                    <span className="text-white text-sm">{s}</span>
                  </div>
                  {s < 5 && <div className={`w-12 h-1 ${step > s ? "bg-gradient-to-r from-purple-600 to-blue-600" : "bg-slate-700"}`}></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Step Descriptions */}
          <div className="text-center text-sm text-slate-400 mb-6">
            {step === 1 && "Select Package"}
            {step === 2 && "Make Payment"}
            {step === 3 && "Verify Transaction"}
            {step === 4 && "Awaiting Confirmation"}
            {step === 5 && "Complete"}
          </div>

          {/* Package Info */}
          <Card className="bg-slate-800/50 border-slate-700/50 p-4 mb-4">
            <div className="flex items-center justify-between mb-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="text-lg text-white">${pkg.price}</div>
                <div className="text-sm text-slate-400">USDT</div>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <div className="text-2xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">{totalPoints}</div>
                <div className="text-sm text-slate-400">Points</div>
              </div>
            </div>
          </Card>

          {/* Step 1: Package Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <Gift className="w-5 h-5 text-purple-400" />
                  <h4 className="text-white truncate">Package Details</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Package:</span>
                    <span className="text-white font-medium">{pkg.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Price:</span>
                    <span className="text-white font-medium">${pkg.price} USDT</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Base Points:</span>
                    <span className="text-white">{pkg.points}</span>
                  </div>
                  {pkg.bonusPoints && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Bonus Points:</span>
                      <span className="text-green-400">+{pkg.bonusPoints}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-700/50">
                    <span className="text-slate-400">Total Points:</span>
                    <span className="text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">{totalPoints}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-purple-400 font-medium mb-1 truncate">Payment Method</div>
                    <p className="text-xs text-slate-300">You will be provided with a BSC wallet address to send USDT. After payment, you'll need to verify the transaction.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <h4 className="text-white truncate">Payment Details</h4>
                  </div>
                  {timeLeft && <Badge className={`px-4 py-1.5 text-sm ${timeLeft === "Expired" ? "bg-red-500" : "bg-yellow-500"} text-white`}>{timeLeft === "Expired" ? "Expired" : `Expires in ${timeLeft}`}</Badge>}
                </div>

                {/* QR Code */}
                <div className="text-center mb-6">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="w-48 h-48 mx-auto border-4 border-white/10 rounded-lg"
                      onError={(e) => {
                        console.error("Failed to load QR code");
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-48 h-48 mx-auto border-4 border-white/10 rounded-lg flex items-center justify-center bg-slate-800/50">
                      <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {/* Wallet Address */}
                  <div>
                    <div className="text-sm text-slate-400 mb-1 truncate">Wallet Address (BSC)</div>
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <code className="text-sm text-slate-300 font-mono">{paymentData?.topup_request?.wallet_address ? formatWalletAddress(paymentData.topup_request.wallet_address) : "Generating..."}</code>
                          <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white p-1 h-6 w-6" onClick={() => paymentData?.topup_request?.wallet_address && handleCopy(paymentData.topup_request.wallet_address)} disabled={!paymentData?.topup_request?.wallet_address}>
                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          </Button>
                        </div>
                        <a href={`https://bscscan.com/address/${paymentData?.topup_request?.wallet_address || ""}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-purple-400">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Reference ID */}
                  <div>
                    <div className="text-sm text-slate-400 mb-1 truncate">Reference ID</div>
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 flex items-center justify-between">
                      <code className="text-sm text-slate-300 font-mono">{paymentData?.topup_request?.reference || "Generating..."}</code>
                      <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white p-1 h-6 w-6" onClick={() => paymentData?.topup_request?.reference && handleCopy(paymentData.topup_request.reference)} disabled={!paymentData?.topup_request?.reference}>
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>

                  {/* Amount and Network */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Amount to Send</div>
                      <div className="text-xl text-white">${pkg.price} USDT</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Network</div>
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 truncate">BSC (Binance Smart Chain)</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-yellow-400 font-medium mb-1 truncate">Important Notice</div>
                    <ul className="text-xs text-white space-y-1">
                      <li>• Send only USDT via BSC network</li>
                      <li>• Do not send any other tokens</li>
                      <li>• Amount must be exactly ${pkg.price} USDT</li>
                      <li>• Include sufficient gas fees</li>
                      <li>• Complete payment within time limit</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Transaction Hash Input */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <h4 className="text-white truncate">Verify Transaction</h4>
                </div>
                <div className="space-y-4">
                  <Input value={transactionHash} onChange={(e) => setTransactionHash(e.target.value)} placeholder="Enter your transaction hash (0x...)" className="bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500" />
                  <div className="text-xs text-slate-400 text-center">
                    You can find the transaction hash in your wallet or on{" "}
                    <a href={bscScanUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1">
                      BSCScan <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Waiting for Confirmation */}
          {step === 4 && (
            <div className="space-y-6 text-center">
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-8 border border-yellow-500/20">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-white mb-2">Awaiting Confirmation</h3>
                <p className="text-slate-300 mb-6">{submitResponse?.message || "Please wait for your payment to be confirmed."}</p>

                {/* Status Indicator */}
                <div className="mb-8">
                  <Badge className={`px-4 py-1.5 text-sm ${verificationStatus === "confirming" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : verificationStatus === "completed" ? "bg-green-500/20 text-green-400 border-green-500/30" : verificationStatus === "failed" ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-blue-500/20 text-blue-400 border-blue-500/30"}`}>
                    {verificationStatus === "confirming" && "⏳ Confirming..."}
                    {verificationStatus === "completed" && "✅ Confirmed"}
                    {verificationStatus === "failed" && "❌ Failed"}
                    {!verificationStatus && "Pending"}
                  </Badge>
                </div>

                {/* Transaction Details */}
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-1 mt-2">
                  {submitResponse?.data && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Reference:</span>
                        <code className="text-sm text-slate-300 font-mono">{submitResponse.data.reference}</code>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Transaction Hash:</span>
                        <div className="flex items-center gap-1">
                          <code className="text-sm text-slate-300 font-mono truncate max-w-[120px]">{formatWalletAddress(submitResponse.data.txn_hash)}</code>
                          <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white p-1 h-6 w-6" onClick={() => submitResponse.data.txn_hash && handleCopy(submitResponse.data.txn_hash)}>
                            <Copy className="w-3 h-3" />
                          </Button>
                          <a href={`https://bscscan.com/tx/${submitResponse.data.txn_hash}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-purple-400">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Status:</span>
                        <span className={`font-medium ${submitResponse.data.status === "confirming" ? "text-yellow-400" : submitResponse.data.status === "completed" ? "text-green-400" : "text-slate-300"}`}>{submitResponse.data.status}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Loading Animation */}
                <div className="mt-6">
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3].map((dot) => (
                      <div key={dot} className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: `${dot * 0.2}s` }}></div>
                    ))}
                  </div>
                  <p className="text-slate-400 text-sm mt-2">Waiting for blockchain confirmation...</p>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <h4 className="text-yellow-400 text-sm font-medium mb-1">What's happening?</h4>
                    <ul className="text-xs text-white text-slate-300 space-y-1">
                      <li>• Your transaction is being verified on the blockchain</li>
                      <li>• This usually takes 1-5 minutes</li>
                      <li>• You will receive a notification when confirmed</li>
                      <li>• Points will be added automatically after confirmation</li>
                      <li>• You can close this window and check back later</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="space-y-4 text-center">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-8 border border-green-500/20">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-white mb-2">Top Up Successful!</h3>
                <p className="text-slate-300 mb-6">{totalPoints} points have been added to your account</p>
                <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
                  <div className="text-3xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-1">+{totalPoints}</div>
                  <div className="text-sm text-slate-400">Points Added</div>
                </div>
                <p className="text-xs text-slate-400">You can now close this window or continue bidding</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-slate-700/50 p-4 flex gap-2 flex-wrap">
          {step === 1 && (
            <>
              <Button variant="outline" className="flex-1 border-slate-700 text-slate-400 hover:text-white" onClick={handleClose}>
                Cancel
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-purple-500/70" onClick={handlePurchase} disabled={isPurchasing || isPurchaseLoading}>
                {isPurchasing || isPurchaseLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Continue to Payment"
                )}
              </Button>
            </>
          )}
          {step === 2 && (
            <>
              <Button variant="outline" className="flex-1 border-slate-700 text-slate-400 hover:text-white" onClick={() => handleStepChange(1)}>
                Back
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-green-500/70" onClick={() => handleStepChange(3)} disabled={!paymentData?.topup_request?.wallet_address}>
                I've Sent Payment
              </Button>
            </>
          )}
          {step === 3 && (
            <>
              <Button variant="outline" className="flex-1 border-slate-700 text-slate-400 hover:text-white" onClick={() => handleStepChange(2)}>
                Back
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-green-500/70" onClick={handleSubmitTransaction} disabled={isSubmittingHash}>
                {isSubmittingHash ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Transaction"
                )}
              </Button>
            </>
          )}
          {step === 4 && (
            <Button variant="outline" className="w-full border-slate-700 text-slate-400 hover:text-white" onClick={handleClose}>
              Close (Check Back Later)
            </Button>
          )}
          {step === 5 && (
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-purple-500/70" onClick={handleSuccessComplete}>
              Start Bidding
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
