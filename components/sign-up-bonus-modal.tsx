"use client";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useStore } from "@/store";

export function SignUpBonusDialog() {
  const isSignUpBonusModalOpen = useStore(
    (state) => state.isSignUpBonusModalOpen
  );
  const setIsSignUpBonusModalOpen = useStore(
    (state) => state.setIsSignUpBonusModalOpen
  );

  return (
    <Dialog
      open={isSignUpBonusModalOpen}
      onOpenChange={setIsSignUpBonusModalOpen}
    >
      <DialogContent className="sm:max-w-md">
        <motion.div
          className="relative p-6 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-2">Congratulations! 🎉</h2>
          <p className="text-lg text-muted-foreground">
            Welcome aboard! We&apos;ve added ₹1,000 bonus credits to your
            account to get you started.
          </p>
        </motion.div>

        <DialogFooter className="sm:justify-center">
          <Button
            onClick={() => setIsSignUpBonusModalOpen(false)}
            className="w-full sm:w-auto"
            size="lg"
          >
            Awesome, Thanks!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
