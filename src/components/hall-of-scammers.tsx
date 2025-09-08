"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getScammerUrls, type ScammerUrl } from "@/ai/flows/get-scammer-urls";
import { Loader2, ShieldX } from "lucide-react";
import { useI18n } from "./i18n-provider";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from "@/lib/utils";

export default function HallOfScammers() {
    const [scammers, setScammers] = useState<ScammerUrl[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t, language } = useI18n();

    const fetchScammers = async () => {
        setIsLoading(true);
        try {
            const scammerUrls = await getScammerUrls();
            setScammers(scammerUrls);
        } catch (error) {
            console.error("Failed to fetch scammers", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchScammers();

        const handleStorageChange = () => {
            fetchScammers();
        };
        window.addEventListener('scammerAdded', handleStorageChange);
        return () => {
            window.removeEventListener('scammerAdded', handleStorageChange);
        };
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <ShieldX className="h-6 w-6 text-accent" />
                    {t('Hall of Scammers')}
                </CardTitle>
                <CardDescription>
                    {t('A community-reported list of fraudulent websites. URLs are added here when they get a high fraud score from our AI.')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center gap-2 py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <p>{t('Loading reported scams...')}</p>
                    </div>
                ) : scammers.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">{t('No scams reported yet. Be the first!')}</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {scammers.map((scammer) => (
                            <div key={scammer.id} className="p-4 rounded-lg bg-card border flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div className="text-3xl font-bold text-accent">{scammer.confidenceScore}%</div>
                                    <span className="text-xs text-muted-foreground flex-shrink-0">
                                        {formatDistanceToNow(new Date(scammer.reportedAt), { addSuffix: true, locale: language === 'es' ? es : undefined })}
                                    </span>
                                </div>
                                <a href={scammer.url} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-primary hover:underline truncate">
                                    {scammer.url}
                                </a>
                                <p className="text-sm text-muted-foreground line-clamp-3">{scammer.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
