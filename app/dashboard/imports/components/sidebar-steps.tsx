import { Check, CheckCircle2, Package2, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarStepsProps {
  step: "details" | "payment" | "confirmation"
}

export function SidebarSteps({ step }: SidebarStepsProps) {
  return (
    <>
      <div className="flex items-center mb-8">
        <Package2 className="h-6 w-6 mr-2 text-indigo-400" />
        <h3 className="font-semibold text-lg">New Import</h3>
      </div>

      <div className="space-y-6">
        <div className="flex items-start">
          <div
            className={cn(
              "flex items-center justify-center rounded-full w-8 h-8 mr-3 shrink-0",
              step === "details"
                ? "bg-indigo-500 text-white"
                : step === "payment" || step === "confirmation"
                  ? "bg-green-500 text-white"
                  : "bg-white/10 text-white/60",
            )}
          >
            {step === "details" ? "1" : <Check className="h-4 w-4" />}
          </div>
          <div>
            <p className="font-medium">Import Details</p>
            <p className="text-sm text-white/60">Product and shipping info</p>
          </div>
        </div>

        <div className="flex items-start">
          <div
            className={cn(
              "flex items-center justify-center rounded-full w-8 h-8 mr-3 shrink-0",
              step === "payment"
                ? "bg-indigo-500 text-white"
                : step === "confirmation"
                  ? "bg-green-500 text-white"
                  : "bg-white/10 text-white/60",
            )}
          >
            {step === "confirmation" ? <Check className="h-4 w-4" /> : "2"}
          </div>
          <div>
            <p className={cn("font-medium", step === "details" && "text-white/60")}>Payment</p>
            <p className="text-sm text-white/60">Choose payment method</p>
          </div>
        </div>

        <div className="flex items-start">
          <div
            className={cn(
              "flex items-center justify-center rounded-full w-8 h-8 mr-3 shrink-0",
              step === "confirmation" ? "bg-indigo-500 text-white" : "bg-white/10 text-white/60",
            )}
          >
            3
          </div>
          <div>
            <p className={cn("font-medium", step !== "confirmation" && "text-white/60")}>Confirmation</p>
            <p className="text-sm text-white/60">Review your import</p>
          </div>
        </div>
      </div>
    </>
  )
}

interface SidebarHelpBoxProps {
  step: "details" | "payment" | "confirmation"
  paymentMethod?: "balance" | "external"
}

export function SidebarHelpBox({ step, paymentMethod }: SidebarHelpBoxProps) {
  if (step === "details") {
    return (
      <div className="bg-white/10 rounded-lg p-4">
        <p className="text-sm text-white/80 mb-2">Need help?</p>
        <p className="text-xs text-white/60">Contact our support team for assistance with your import process.</p>
      </div>
    )
  }

  if (step === "payment" && paymentMethod === "external") {
    return (
      <div className="bg-indigo-500/10 rounded-lg p-4 border border-indigo-500/20">
        <div className="flex items-center mb-2">
          <ShieldCheck className="h-4 w-4 mr-2 text-indigo-400" />
          <p className="text-sm text-white/80">Secure Payment</p>
        </div>
        <p className="text-xs text-white/60">All transactions are encrypted and processed securely.</p>
      </div>
    )
  }

  if (step === "confirmation") {
    return (
      <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
        <div className="flex items-center mb-2">
          <CheckCircle2 className="h-4 w-4 mr-2 text-green-400" />
          <p className="text-sm text-white/80">Import Created</p>
        </div>
        <p className="text-xs text-white/60">Your import has been successfully created and is being processed.</p>
      </div>
    )
  }

  return null
}

