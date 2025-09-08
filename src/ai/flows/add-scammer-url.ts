'use server';

/**
 * @fileOverview Adds a scammer URL to the database.
 * - addScammerUrl - Adds the URL to the 'scammers' collection in Firestore.
 * - AddScammerUrlInput - The input type for the addScammerUrl function.
 */

import {z} from 'genkit';
import {ai} from '@/ai/genkit';
import {db} from '@/lib/firebase';
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

const AddScammerUrlInputSchema = z.object({
  url: z.string().url().describe('The fraudulent URL to add.'),
  confidenceScore: z.number().describe('The fraud confidence score (0-100).'),
  description: z.string().describe('The AI analysis report summary.'),
});
export type AddScammerUrlInput = z.infer<typeof AddScammerUrlInputSchema>;

export async function addScammerUrl(
  input: AddScammerUrlInput
): Promise<{success: boolean; message?: string}> {
  return addScammerUrlFlow(input);
}

const addScammerUrlFlow = ai.defineFlow(
  {
    name: 'addScammerUrlFlow',
    inputSchema: AddScammerUrlInputSchema,
    outputSchema: z.object({success: z.boolean(), message: z.string().optional()}),
  },
  async input => {
    try {
      // Check if the URL already exists
      const q = query(collection(db, 'scammers'), where('url', '==', input.url));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return {success: false, message: 'URL already reported.'};
      }

      await addDoc(collection(db, 'scammers'), {
        url: input.url,
        confidenceScore: input.confidenceScore,
        description: input.description,
        reportedAt: new Date(),
      });
      return {success: true};
    } catch (error) {
      console.error('Error adding document: ', error);
      return {success: false, message: 'Failed to add URL to database.'};
    }
  }
);
