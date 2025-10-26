"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, LifeBuoy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getScamRecommendations } from '@/ai/flows/get-scam-recommendations';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useI18n } from './i18n-provider';

const formSchema = z.object({
  situation: z.string().min(50, { message: 'Please describe your situation in at least 50 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ScamHelp() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useI18n();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      situation: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setRecommendations(null);
    setError(null);
    try {
      const result = await getScamRecommendations({ situation: data.situation });
      setRecommendations(result.recommendations);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Failed to get recommendations',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <LifeBuoy className="h-6 w-6 text-primary" />
            {t('Got Scammed? Get Help')}
        </CardTitle>
        <CardDescription>
            {t('Describe your situation below. Our AI will provide recommendations on what to do next.')}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="situation"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder={t('Explain what happened...')}
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LifeBuoy className="mr-2 h-4 w-4" />}
              {t('Get Recommendations')}
            </Button>
          </CardFooter>
        </form>
      </Form>
      {isLoading && (
        <div className="p-6 border-t flex flex-col items-center justify-center gap-4 min-h-[150px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-semibold text-foreground">Generating Recommendations...</p>
        </div>
      )}
      {error && !isLoading && (
         <div className="p-6 border-t">
            <Alert variant="destructive">
                <LifeBuoy className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
         </div>
      )}
      {recommendations && !isLoading && (
        <div className="p-6 border-t">
            <h3 className="font-bold mb-4 text-lg">Our Recommendations:</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                {recommendations}
            </div>
        </div>
      )}
    </Card>
  );
}
