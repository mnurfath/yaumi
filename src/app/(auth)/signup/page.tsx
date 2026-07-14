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
      <Card className="rounded-xl py-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
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
              className: "h-11 w-full",
            })}
          >
            Back to Login
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl py-8">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
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
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            type="submit"
            className="h-11 w-full"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/80"
          >
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
