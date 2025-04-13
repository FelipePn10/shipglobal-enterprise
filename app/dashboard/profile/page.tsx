"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { CreditCard, User, Save } from "lucide-react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stripeAccountId, setStripeAccountId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user?.stripeAccountId) {
      setStripeAccountId(session.user.stripeAccountId);
      setFetching(false);
    } else {
      setFetching(false);
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripeAccountId.startsWith("acct_")) {
      toast({
        title: "Invalid Account ID",
        description: "Stripe Connect account ID must start with 'acct_'.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/profile/stripe-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stripeAccountId }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to save Stripe account");
      }

      toast({
        title: "Success",
        description: "Stripe Connect account updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to save Stripe account.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <h1 className="text-3xl font-bold text-white mb-6">Profile Settings</h1>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white/80 flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-400" /> Name
              </Label>
              <Input
                id="name"
                value={session?.user?.name || ""}
                disabled
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-white/80 flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-400" /> Email
              </Label>
              <Input
                id="email"
                value={session?.user?.email || ""}
                disabled
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="stripeAccountId" className="text-white/80 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-indigo-400" /> Stripe Connect Account ID
              </Label>
              <Input
                id="stripeAccountId"
                value={stripeAccountId}
                onChange={(e) => setStripeAccountId(e.target.value)}
                placeholder="acct_xxx"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
              <p className="text-white/60 text-xs mt-1">
                Enter your Stripe Connect account ID (e.g., acct_xxx) from your{" "}
                <a
                  href="https://dashboard.stripe.com/account"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline"
                >
                  Stripe Dashboard
                </a>
                .
              </p>
            </div>
            <Button
              type="submit"
              disabled={loading || !stripeAccountId}
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-500"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save"}
            </Button>
          </form>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}