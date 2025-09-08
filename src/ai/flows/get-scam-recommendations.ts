'use server';

/**
 * @fileOverview Provides recommendations for users who have been scammed.
 *
 * - getScamRecommendations - A function that provides scam recommendations.
 * - GetScamRecommendationsInput - The input type for the getScamRecommendations function.
 * - GetScamRecommendationsOutput - The return type for the getScamRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetScamRecommendationsInputSchema = z.object({
  situation: z.string().describe('The user\'s description of how they were scammed.'),
});
export type GetScamRecommendationsInput = z.infer<typeof GetScamRecommendationsInputSchema>;

const GetScamRecommendationsOutputSchema = z.object({
  recommendations: z.string().describe('A list of actionable steps and advice for the user.'),
});
export type GetScamRecommendationsOutput = z.infer<typeof GetScamRecommendationsOutputSchema>;

export async function getScamRecommendations(input: GetScamRecommendationsInput): Promise<GetScamRecommendationsOutput> {
  return getScamRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getScamRecommendationsPrompt',
  input: {schema: GetScamRecommendationsInputSchema},
  output: {schema: GetScamRecommendationsOutputSchema},
  prompt: `You are an expert in cryptocurrency fraud and recovery. A user has been scammed.
  Based on their situation, provide a clear, step-by-step set of recommendations on what to do next.
  Include advice on reporting the scam, trying to recover funds, and securing their accounts.

  User's situation: {{{situation}}}
  `,
});

const getScamRecommendationsFlow = ai.defineFlow(
  {
    name: 'getScamRecommendationsFlow',
    inputSchema: GetScamRecommendationsInputSchema,
    outputSchema: GetScamRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
