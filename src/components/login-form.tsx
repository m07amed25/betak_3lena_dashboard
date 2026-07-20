"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/routing";
import { Smartphone } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { useTranslations } from "next-intl";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const t = useTranslations("Login");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    document.cookie = "is-authenticated=true; path=/";
    router.push("/");
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
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">{t("title")}</h1>
                <p className="text-muted-foreground text-balance">
                  {t("subtitle")}
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">{t("email_label")}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("email_placeholder")}
                  className="rounded-[6px] focus-visible:ring-2"
                  required
                />
              </Field>
              
              <Field>
                <Button
                  type="submit"
                  className="h-10 w-full rounded-[8px] px-4 py-2"
                >
                  {t("login_button")}
                </Button>
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
