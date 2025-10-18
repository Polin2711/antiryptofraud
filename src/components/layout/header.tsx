
"use client";

import Logo from '@/components/icons/logo';
import LanguageSwitcher from './language-switcher';
import { useI18n } from '@/components/i18n-provider';

export default function Header() {
  const { t } = useI18n();
  return (
    <header className="py-4 px-4 md:px-6 bg-card/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold text-foreground">
            {t('Scam Alert')}
          </span>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
