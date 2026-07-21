"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { useRouter } from "@/i18n/routing";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { useTranslations } from "next-intl";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const t = useTranslations("Login");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        setEmailError(t("email_required"));
      } else if (!emailRegex.test(email)) {
        setEmailError(t("email_invalid"));
      } else {
        setEmailError("");
        setStep("otp");
      }
    } else {
      document.cookie = "is-authenticated=true; path=/";
      router.push("/");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative overflow-hidden rounded-[10px] p-0 shadow-none">
        <div className="absolute start-4 top-4">
          <LocaleSwitcher />
        </div>
        <div className="absolute end-4 top-4">
          <ThemeToggle />
        </div>
        <CardContent className="grid p-0">
          <form className="p-6 md:p-8" onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">{t("title")}</h1>
                <p className="text-muted-foreground text-balance">
                  {t("subtitle")}
                </p>
              </div>
              <Field data-invalid={!!emailError}>
                <FieldLabel htmlFor="email">{t("email_label")}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  placeholder={t("email_placeholder")}
                  className={cn(
                    "rounded-[6px] focus-visible:ring-2",
                    emailError &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                  required
                  readOnly={step === "otp"}
                />
                {emailError && <FieldError>{emailError}</FieldError>}
              </Field>

              {step === "otp" && (
                <Field>
                  <FieldLabel htmlFor="otp">{t("otp_label")}</FieldLabel>
                  <div dir="ltr" className="mt-2 flex w-full justify-center">
                    <InputOTP id="otp" maxLength={6}>
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={0}
                          className="size-8 text-base sm:size-10"
                        />
                        <InputOTPSlot
                          index={1}
                          className="size-8 text-base sm:size-10"
                        />
                        <InputOTPSlot
                          index={2}
                          className="size-8 text-base sm:size-10"
                        />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={3}
                          className="size-8 text-base sm:size-10"
                        />
                        <InputOTPSlot
                          index={4}
                          className="size-8 text-base sm:size-10"
                        />
                        <InputOTPSlot
                          index={5}
                          className="size-8 text-base sm:size-10"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </Field>
              )}

              <Field className="space-y-2">
                <Button
                  type="submit"
                  className="h-10 w-full rounded-[8px] px-4 py-2"
                >
                  {step === "email" ? t("login_button") : t("verify_button")}
                </Button>
                {step === "otp" && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-10 w-full rounded-[8px] px-4 py-2"
                    onClick={() => setStep("email")}
                  >
                    {t("back_button")}
                  </Button>
                )}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        {t("terms_prefix")}
        <a href="#">{t("terms")}</a>
        {t("terms_and")}
        <a href="#">{t("privacy")}</a>.
      </FieldDescription>
    </div>
  );
}
