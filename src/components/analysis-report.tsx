"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Flag, Loader2, ShieldX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "./i18n-provider";
import { addScammerUrl } from "@/ai/flows/add-scammer-url";

const CircularProgress = ({ score }: { score: number }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setProgress(score), 100);
        return () => clearTimeout(timer);
    }, [score]);


    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    const scoreColorClass = score >= 75 ? "text-accent" : score >= 40 ? "text-muted-foreground" : "text-primary";
    const scoreBgColorClass = score >= 75 ? "text-accent/20" : score >= 40 ? "text-muted-foreground/20" : "text-primary/20";
    
    return (
        <div className="relative h-40 w-40">
            <svg className="h-full w-full" viewBox="0 0 120 120">
                <circle
                    className={cn("stroke-current", scoreBgColorClass)}
                    strokeWidth="10"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    className={cn("stroke-current transition-[stroke-dashoffset] duration-1000 ease-out", scoreColorClass)}
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    strokeDasharray={circumference}
                    style={{ strokeDashoffset: offset }}
                    transform="rotate(-90 60 60)"
                />
            </svg>
            <div className={cn("absolute inset-0 flex flex-col items-center justify-center", scoreColorClass)}>
                <span className="text-4xl font-bold">{score}</span>
                <span className="text-sm font-medium -mt-1">%</span>
            </div>
        </div>
    );
};


export default function AnalysisReport({ report, confidenceScore, analyzedUrl }: { report: string; confidenceScore: number, analyzedUrl?: string; }) {
    const { toast } = useToast();
    const { t } = useI18n();
    const [isReportingScammer, setIsReportingScammer] = useState(false);
    
    const scoreText =
        confidenceScore >= 75
        ? t('High Fraud Risk')
        : confidenceScore >= 40
        ? t('Potential Risk Detected')
        : t('Low Fraud Risk');

    const scoreColorClass = confidenceScore >= 75 ? "text-accent" : confidenceScore >= 40 ? "text-muted-foreground" : "text-primary";

    const handleReport = () => {
        toast({
            title: t('Report Sent'),
            description: t('Thank you for your feedback. We will review the analysis.'),
        })
    }

    const handleAddToHallOfScammers = async () => {
        if (!analyzedUrl) return;
        setIsReportingScammer(true);
        try {
            const result = await addScammerUrl({ 
                url: analyzedUrl,
                confidenceScore: confidenceScore,
                description: report
            });
            if (result.success) {
                toast({
                    title: t('Added to Hall of Scammers'),
                    description: t('The URL has been added to our public database of scam sites.'),
                });
                window.dispatchEvent(new Event('scammerAdded'));
            } else {
                 toast({
                    variant: "destructive",
                    title: t('Error'),
                    description: t(result.message as any) || t('Failed to add URL to Hall of Scammers.'),
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: t('Error'),
                description: t('Failed to add URL to Hall of Scammers.'),
            });
        } finally {
            setIsReportingScammer(false);
        }
    }


    return (
        <div className="w-full">
            <h2 className="font-headline text-2xl text-center mb-6 font-bold">{t('Fraud Analysis Report')}</h2>
            <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="flex flex-col items-center md:col-span-1">
                    <CircularProgress score={confidenceScore} />
                    <p className={cn("mt-4 text-lg font-bold text-center", scoreColorClass)}>{scoreText}</p>
                </div>
                <div className="md:col-span-2 bg-card p-6 rounded-lg shadow-inner">
                    <h3 className="font-bold mb-2 text-lg">{t('AI Analysis Details:')}</h3>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{report}</p>
                </div>
            </div>
            <div className="mt-6 flex justify-between items-center">
                <Button variant="ghost" size="sm" onClick={handleReport}>
                    <Flag className="mr-2 h-4 w-4" />
                    {t('Report incorrect analysis')}
                </Button>
                {confidenceScore >= 75 && analyzedUrl && (
                    <Button variant="destructive" size="sm" onClick={handleAddToHallOfScammers} disabled={isReportingScammer}>
                        {isReportingScammer ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldX className="mr-2 h-4 w-4" />}
                        {t('Add to Hall of Scammers')}
                    </Button>
                )}
            </div>
        </div>
    );
}
