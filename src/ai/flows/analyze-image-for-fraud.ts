'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing images for potential fraud.
 * It takes an image as input and returns an analysis of potential red flags.
 *
 * @exports analyzeImageForFraud - The main function to analyze an image for fraud.
 * @exports AnalyzeImageForFraudInput - The input type for the analyzeImageForFraud function.
 * @exports AnalyzeImageForFraudOutput - The output type for the analyzeImageForFraud function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeImageForFraudInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a broker's interface or advertisement, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeImageForFraudInput = z.infer<typeof AnalyzeImageForFraudInputSchema>;

const AnalyzeImageForFraudOutputSchema = z.object({
  analysis: z.string().describe('The analysis of the image for potential fraud.'),
  confidenceScore: z
    .number()
    .describe('A confidence score (0-1) for the fraud assessment.'),
});
export type AnalyzeImageForFraudOutput = z.infer<typeof AnalyzeImageForFraudOutputSchema>;

export async function analyzeImageForFraud(
  input: AnalyzeImageForFraudInput
): Promise<AnalyzeImageForFraudOutput> {
  return analyzeImageForFraudFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeImageForFraudPrompt',
  input: {schema: AnalyzeImageForFraudInputSchema},
  output: {schema: AnalyzeImageForFraudOutputSchema},
  prompt: `You are an expert fraud analyst specializing in identifying fraudulent brokers and advertisements in the crypto space. Analyze the image provided for any red flags, inconsistencies, or deceptive patterns commonly associated with scams. Provide a detailed analysis and a confidence score (0-1) for your assessment.

Image: {{media url=photoDataUri}}`,
});

const analyzeImageForFraudFlow = ai.defineFlow(
  {
    name: 'analyzeImageForFraudFlow',
    inputSchema: AnalyzeImageForFraudInputSchema,
    outputSchema: AnalyzeImageForFraudOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
