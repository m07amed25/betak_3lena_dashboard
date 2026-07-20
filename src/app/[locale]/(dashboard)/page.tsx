import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("Dashboard");

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col flex-1 items-center justify-center">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
      </div>
    </div>
  )
}
