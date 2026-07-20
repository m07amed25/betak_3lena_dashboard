"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/routing"
import { Button } from "@/components/ui/button"

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en'
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <Button variant="ghost" size="sm" onClick={switchLocale} className="text-xs font-semibold px-2">
      {locale === 'en' ? 'عربي' : 'EN'}
    </Button>
  )
}
