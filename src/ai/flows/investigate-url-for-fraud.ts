'use server';
/**
 * @fileOverview A URL investigation AI agent for fraud detection.
 *
 * - investigateURLForFraud - A function that handles the URL investigation process.
 * - InvestigateURLForFraudInput - The input type for the investigateURLForFraud function.
 * - InvestigateURLForFraudOutput - The return type for the investigateURLForFraud function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InvestigateURLForFraudInputSchema = z.object({
  url: z.string().url().describe('The URL of the broker or promotion to investigate.'),
});
export type InvestigateURLForFraudInput = z.infer<typeof InvestigateURLForFraudInputSchema>;

const InvestigateURLForFraudOutputSchema = z.object({
  analysis: z.string().describe('The analysis of the URL, including potential scam indicators.'),
  confidenceScore: z.number().min(0).max(1).describe('A confidence score (0-1) for the assessment.'),
});
export type InvestigateURLForFraudOutput = z.infer<typeof InvestigateURLForFraudOutputSchema>;

export async function investigateURLForFraud(input: InvestigateURLForFraudInput): Promise<InvestigateURLForFraudOutput> {
  return investigateURLForFraudFlow(input);
}

const prompt = ai.definePrompt({
  name: 'investigateURLForFraudPrompt',
  input: {schema: InvestigateURLForFraudInputSchema},
  output: {schema: InvestigateURLForFraudOutputSchema},
  prompt: `You are an expert in identifying fraudulent brokers and promotions in the crypto space.
  Analyze the provided URL and identify potential scam indicators, considering the website's content,
  registration details, and user reviews. Provide a confidence score (0-1) for your assessment.

  URL: {{{url}}}
  \n
  Respond clearly.`, 
});

const investigateURLForFraudFlow = ai.defineFlow(
  {
    name: 'investigateURLForFraudFlow',
    inputSchema: InvestigateURLForFraudInputSchema,
    outputSchema: InvestigateURLForFraudOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
