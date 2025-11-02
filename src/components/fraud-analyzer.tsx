"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, Link as LinkIcon, Loader2, FileVideo, X, ShieldAlert, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { analyzeImageForFraud } from "@/ai/flows/analyze-image-for-fraud";
import { analyzeVideoForFraud } from "@/ai/flows/analyze-video-for-fraud";
import { investigateURLForFraud } from "@/ai/flows/investigate-url-for-fraud";
import { generateFraudReport, type GenerateFraudReportOutput } from "@/ai/flows/generate-fraud-report";
import AnalysisReport from "@/components/analysis-report";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import Image from "next/image";
import { useI18n } from "@/components/i18n-provider";

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  mediaFile: z.instanceof(File).optional(),
}).refine(data => !!data.mediaFile, {
  message: "Please upload an image or video to start the analysis.",
  path: ["mediaFile"],
});

type FormValues = z.infer<typeof formSchema>;

const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
};

export default function FraudAnalyzer() {
  const [analysisState, setAnalysisState] = useState<{
    isLoading: boolean;
    finalReport: GenerateFraudReportOutput | null;
    error: string | null;
    analyzedUrl?: string;
  }>({
    isLoading: false,
    finalReport: null,
    error: null,
  });
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const { toast } = useToast();
  const { t, language } = useI18n();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const { control, handleSubmit, setValue, watch, formState } = form;
  const watchedFile = watch("mediaFile");

  const onSubmit = async (data: FormValues) => {
    setAnalysisState({ isLoading: true, finalReport: null, error: null, analyzedUrl: data.url || undefined });

    let imageAnalysis = '';
    let urlAnalysis = '';
    
    try {
      const analysisPromises = [];

      if (data.mediaFile) {
        analysisPromises.push(async () => {
          const dataUri = await fileToDataUri(data.mediaFile!);
          if (data.mediaFile!.type.startsWith('image/')) {
            const result = await analyzeImageForFraud({ photoDataUri: dataUri });
            imageAnalysis = result.analysis;
          } else if (data.mediaFile!.type.startsWith('video/')) {
            const result = await analyzeVideoForFraud({ videoDataUri: dataUri });
            imageAnalysis = result.report;
          }
        });
      }
      
      if (data.url) {
        analysisPromises.push(async () => {
          const result = await investigateURLForFraud({ url: data.url! });
          urlAnalysis = result.analysis;
        });
      }

      await Promise.all(analysisPromises.map(p => p()));
      
      const report = await generateFraudReport({ imageAnalysis, urlAnalysis, language });
      setAnalysisState(prev => ({ ...prev, finalReport: report }));

    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setAnalysisState(prev => ({ ...prev, error: errorMessage }));
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: errorMessage,
      });
    } finally {
      setAnalysisState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        setValue("mediaFile", file, { shouldValidate: true });
        if (file.type.startsWith("image/")) {
            setFilePreview(URL.createObjectURL(file));
        } else {
            setFilePreview(null);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload an image or video file.",
        });
      }
    }
  };

  const clearFile = () => {
    setValue("mediaFile", undefined, { shouldValidate: true });
    setFilePreview(null);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-primary" />
          {t('Start New Analysis')}
        </CardTitle>
        <CardDescription>
          {t('Provide a URL, and/or upload an image/video of a crypto broker or ad. Our AI will analyze them for signs of fraud.')}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Broker or Promotion URL</FormLabel>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="https://example.com" className="pl-10" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="mediaFile"
              render={() => (
                <FormItem>
                  <FormLabel className="font-bold">Image or Video Upload</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*,video/*" />
                        <label htmlFor="file-upload" className={cn(
                            "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-card",
                            "border-border text-muted-foreground"
                        )}>
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-10 h-10 mb-3" />
                                <p className="mb-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs">Image or Video (PNG, JPG, MP4, etc.)</p>
                            </div>
                        </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {watchedFile && (
                <div className="mt-4 relative w-fit mx-auto p-2 border rounded-lg bg-muted/50">
                    {filePreview && <Image src={filePreview} alt="Preview" width={160} height={160} className="max-h-40 w-auto rounded-md" />}
                    {!filePreview && <FileVideo className="h-20 w-20 text-muted-foreground" />}
                    <div className="text-sm mt-2 text-center truncate max-w-xs">{watchedFile.name}</div>
                    <Button variant="ghost" size="icon" className="absolute -top-3 -right-3 h-7 w-7 bg-card rounded-full" onClick={clearFile}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
            
            {formState.errors.mediaFile && (
                <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{formState.errors.mediaFile.message}</AlertDescription></Alert>
            )}

          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={analysisState.isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
              {analysisState.isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldAlert className="mr-2 h-4 w-4" />}
              {t('Analyze for Fraud')}
            </Button>
          </CardFooter>
        </form>
      </Form>
      
      {analysisState.isLoading && (
        <div className="p-6 border-t flex flex-col items-center justify-center gap-4 min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-semibold text-foreground">AI Analysis in Progress...</p>
            <p className="text-sm text-muted-foreground text-center">This may take a moment. Please don't close this page.</p>
        </div>
      )}

      {analysisState.error && !analysisState.isLoading && (
        <div className="p-6 border-t">
           <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Error During Analysis</AlertTitle>
              <AlertDescription>{analysisState.error}</AlertDescription>
            </Alert>
        </div>
      )}

      {analysisState.finalReport && !analysisState.isLoading && (
        <div className="p-6 border-t bg-background/50">
            <AnalysisReport 
                report={analysisState.finalReport.report} 
                confidenceScore={analysisState.finalReport.confidenceScore} 
                analyzedUrl={analysisState.analyzedUrl}
            />
        </div>
      )}
    </Card>
  );
}
