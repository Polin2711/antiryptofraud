
"use client";

import Header from '@/components/layout/header';
import FraudAnalyzer from '@/components/fraud-analyzer';
import ScamHelp from '@/components/scam-help';
import { Separator } from '@/components/ui/separator';
import CommonScams from '@/components/common-scams';
import { useI18n } from '@/components/i18n-provider';
import HallOfScammers from '@/components/hall-of-scammers';

export default function Home() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <section className="text-center mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
              {t('CryptoFraud Buster')}
            </h1>
            <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
              {t('Unmask crypto scams with AI. Upload an ad, screenshot, or video, and provide a URL to get an instant fraud analysis. Stay safe in the crypto world.')}
            </p>
          </section>
          <FraudAnalyzer />
          <Separator className="my-12" />
          <HallOfScammers />
          <Separator className="my-12" />
          <CommonScams />
          <Separator className="my-12" />
          <ScamHelp />
        </div>
      </main>
    </div>
  );
}
