"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "./ui/badge";
import { AlertTriangle } from "lucide-react";
import { useI18n } from "./i18n-provider";

const scamData = [
    {
        value: "scam-1",
        title: "High-Yield Promises",
        content: "High-Yield Promises Content",
        tags: ["High Returns Tag", "Guaranteed Profits Tag", "Welcome Bonuses Tag"]
    },
    {
        value: "scam-2",
        title: "Pump and Dump Schemes",
        content: "Pump and Dump Content",
        tags: ["Price Manipulation Tag", "Social Media Hype Tag", "Low-Cap Coins Tag"]
    },
    {
        value: "scam-3",
        title: "Phishing Scams",
        content: "Phishing Scams Content",
        tags: ["Fake Websites Tag", "Private Keys Tag", "Impersonation Tag"]
    },
    {
        value: "scam-4",
        title: "Pressure to Act Fast",
        content: "Pressure to Act Fast Content",
        tags: ["False Urgency Tag", "Pressure Tactics Tag", "Limited-Time Offers Tag"]
    }
];

export default function CommonScams() {
  const { t } = useI18n();
  return (
    <section>
      <h2 className="font-headline text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3">
        <AlertTriangle className="h-7 w-7 text-primary" />
        {t('Common Crypto Scams')}
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {scamData.map((scam) => (
          <AccordionItem key={scam.value} value={scam.value}>
            <AccordionTrigger className="text-lg font-bold hover:no-underline">
              {t(scam.title as any)}
            </AccordionTrigger>
            <AccordionContent className="text-base text-foreground/80 px-2 space-y-4">
                <p>{t(scam.content as any)}</p>
                <div className="flex flex-wrap gap-2">
                    {scam.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{t(tag as any)}</Badge>
                    ))}
                </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
