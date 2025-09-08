'use server';
/**
 * @fileOverview Analyzes a video for potential fraud indicators.
 *
 * - analyzeVideoForFraud - Analyzes the video and returns a report.
 * - AnalyzeVideoForFraudInput - The input type for the analyzeVideoForFraud function.
 * - AnalyzeVideoForFraudOutput - The return type for the analyzeVideoForFraud function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeVideoForFraudInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video of a broker's interface or advertisement, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type AnalyzeVideoForFraudInput = z.infer<
  typeof AnalyzeVideoForFraudInputSchema
>;

const AnalyzeVideoForFraudOutputSchema = z.object({
  report: z.string().describe('A report highlighting potential fraud risks.'),
  confidenceScore: z
    .number()
    .describe(
      'A confidence score (0-1) indicating the likelihood of fraud.'
    ),
});

export type AnalyzeVideoForFraudOutput = z.infer<
  typeof AnalyzeVideoForFraudOutputSchema
>;

export async function analyzeVideoForFraud(
  input: AnalyzeVideoForFraudInput
): Promise<AnalyzeVideoForFraudOutput> {
  return analyzeVideoForFraudFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeVideoForFraudPrompt',
  input: {schema: AnalyzeVideoForFraudInputSchema},
  output: {schema: AnalyzeVideoForFraudOutputSchema},
  prompt: `You are an expert fraud analyst specializing in identifying fraudulent brokers and advertisements in the crypto space.

You will analyze the provided video for red flags and inconsistencies, providing a detailed report and a confidence score.

Analyze the following video for any signs of fraud:

{{media url=videoDataUri}}`,
});

const analyzeVideoForFraudFlow = ai.defineFlow(
  {
    name: 'analyzeVideoForFraudFlow',
    inputSchema: AnalyzeVideoForFraudInputSchema,
    outputSchema: AnalyzeVideoForFraudOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
