import { getTranslations } from 'next-intl/server'
import { Locale } from '@/lib/i18n'

interface FooterServerProps {
  locale: Locale
}

export async function FooterServer({ locale }: FooterServerProps) {
  const t = await getTranslations('footer')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 py-2">
        <div className="flex flex-col items-center text-center space-y-2">
          {/* Disclaimer */}
          <p className="text-sm text-muted-foreground">
            {t('disclaimer')}
          </p>
          
          {/* Copyright */}
          <div className="text-xs text-muted-foreground/70">
            <p>© {currentYear} B(H)log. {t('copyright')}.</p>
            <p className="mt-1">
              {t('description')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}