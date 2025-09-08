'use server';

/**
 * @fileOverview Compiles findings from image and URL analysis into a user-friendly report.
 *
 * - generateFraudReport - A function that generates a fraud report.
 * - GenerateFraudReportInput - The input type for the generateFraudReport function.
 * - GenerateFraudReportOutput - The return type for the generateFraudReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFraudReportInputSchema = z.object({
  imageAnalysis: z
    .string()
    .optional()
    .describe('Analysis of the uploaded image, if any.'),
  urlAnalysis: z.string().optional().describe('Analysis of the provided URL, if any.'),
  language: z.enum(['en', 'es']).optional().describe('The language for the report. Can be "en" for English or "es" for Spanish.'),
});
export type GenerateFraudReportInput = z.infer<typeof GenerateFraudReportInputSchema>;

const GenerateFraudReportOutputSchema = z.object({
  report: z.string().describe('A user-friendly report highlighting potential risks.'),
  confidenceScore: z.number().describe('A confidence score for the assessment (0-100).'),
});
export type GenerateFraudReportOutput = z.infer<typeof GenerateFraudReportOutputSchema>;

export async function generateFraudReport(input: GenerateFraudReportInput): Promise<GenerateFraudReportOutput> {
  return generateFraudReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFraudReportPrompt',
  input: {schema: GenerateFraudReportInputSchema},
  output: {schema: GenerateFraudReportOutputSchema},
  prompt: `You are an AI assistant specialized in generating fraud reports based on the analysis of images and URLs.

  The final report must be in the language specified in the 'language' field. If no language is specified, default to English.

  Compile a user-friendly report based on the following information, highlighting potential risks and providing a confidence score for the assessment (0-100).

  Image Analysis: {{{imageAnalysis}}}
  URL Analysis: {{{urlAnalysis}}}

  Consider the image and URL analysis to give a fraud report, highlighting potential risks and providing a confidence score for the assessment.
  The confidence score should reflect the likelihood of fraud, with 0 being very unlikely and 100 being very likely.
  If both imageAnalysis and urlAnalysis is empty, return a report saying that no analysis was provided, and a confidence score of 0.
  `,
});

const generateFraudReportFlow = ai.defineFlow(
  {
    name: 'generateFraudReportFlow',
    inputSchema: GenerateFraudReportInputSchema,
    outputSchema: GenerateFraudReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
