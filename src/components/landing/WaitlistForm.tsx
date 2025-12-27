import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

import { twMerge } from "tailwind-merge";

interface WaitlistFormProps {
    className?: string;
    variant?: "default" | "hero" | "minimal";
}

const WaitlistForm = ({ className = "", variant = "default" }: WaitlistFormProps) => {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        // Redirect to Tally form with email pre-filled
        // Assuming the field name in Tally is 'email', we can pass it as a query param.
        // If the tally field ID is different, it needs to be updated here.
        // For now we just pass ?email=... which Tally often supports if configured.
        // Or just open the form directly.
        // The user provided link: https://tally.so/r/xXrAzG
        const tallyUrl = `https://tally.so/r/xXrAzG?email=${encodeURIComponent(email)}`;
        window.open(tallyUrl, '_blank', 'noopener,noreferrer');
    };

    if (variant === "minimal") {
        return (
            <form onSubmit={handleSubmit} className={twMerge("flex gap-2", className)}>
                <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 bg-background/50 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-offset-0 focus-visible:ring-[hsl(16,78%,49%)]"
                    required
                />
                <Button type="submit" size="sm" className="bg-[hsl(16,78%,49%)] hover:bg-[hsl(16,78%,45%)] text-white whitespace-nowrap">
                    Join Waitlist
                </Button>
            </form>
        );
    }

    const isHero = variant === "hero";

    return (
        <form
            onSubmit={handleSubmit}
            className={twMerge(`relative flex flex-col sm:flex-row gap-3 w-full max-w-md`, className)}
        >
            <div className="relative flex-grow group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-[hsl(16,78%,49%)] to-[hsl(16,78%,49%)] opacity-30 blur transition duration-1000 group-hover:opacity-70 ${isHero ? "rounded-lg" : "rounded-md"}`} />
                <Input
                    type="email"
                    placeholder="Enter your email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`relative bg-background border-white/10 ${isHero ? "h-12 md:h-14 text-lg" : "h-11"} focus-visible:ring-offset-0 focus-visible:ring-[hsl(16,78%,49%)]`}
                    required
                />
            </div>
            <Button
                type="submit"
                size={isHero ? "lg" : "default"}
                className={`relative ${isHero ? "h-12 md:h-14 px-8 text-lg" : "h-11"} bg-[hsl(16,78%,49%)] hover:bg-[hsl(16,78%,45%)] transition-all duration-300 shadow-[0_0_20px_-5px_hsl(16,78%,49%)] hover:shadow-[0_0_25px_-5px_hsl(16,78%,49%)]`}
            >
                {isHero && <Sparkles className="mr-2 h-5 w-5" />}
                Join Waitlist
                <ArrowRight className={`ml-2 ${isHero ? "h-5 w-5" : "h-4 w-4"}`} />
            </Button>
        </form>
    );
};

export default WaitlistForm;
