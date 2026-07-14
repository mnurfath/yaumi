"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { signup } from "@/app/(auth)/actions";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const result = await signup(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <Card className="rounded-3xl border-0 bg-white/80 py-8 shadow-[0_20px_60px_rgba(22,78,57,0.08)] ring-1 ring-emerald-950/5 backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-semibold text-emerald-950">
            Check Your Email
          </CardTitle>
          <CardDescription>
            We sent you a confirmation link. Please check your email to complete registration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/login"
            className={buttonVariants({
              variant: "outline",
              className: "h-11 w-full rounded-full border-emerald-900/10 bg-white/70 backdrop-blur hover:bg-white",
            })}
          >
            Back to Login
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-0 bg-white/80 py-8 shadow-[0_20px_60px_rgba(22,78,57,0.08)] ring-1 ring-emerald-950/5 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-semibold text-emerald-950">
          Join Yaumi
        </CardTitle>
        <CardDescription>
          Create an account to start tracking your spiritual journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              name="display_name"
              type="text"
              placeholder="Your name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              minLength={6}
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          )}

          <Button
            type="submit"
            className="h-11 w-full rounded-full bg-emerald-700 shadow-lg shadow-emerald-900/10 hover:bg-emerald-800"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
          >
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
