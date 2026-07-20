import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Sidebar" });

  return {
    title: t("payments")
  };
}

export default function Page() {
  const tSidebar = useTranslations("Sidebar");
  const tCommon = useTranslations("Common");

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{tSidebar("payments")}</h1>
      </div>
      <div className="flex-1 rounded-xl bg-card border shadow-sm p-6">
        <p className="text-muted-foreground">{tCommon("content_placeholder", { module: tSidebar("payments") })}</p>
      </div>
    </div>
  );
}
