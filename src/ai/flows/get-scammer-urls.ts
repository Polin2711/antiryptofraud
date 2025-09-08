'use server';

/**
 * @fileOverview Retrieves the list of scammer URLs from the database.
 * - getScammerUrls - Fetches URLs from the 'scammers' collection in Firestore.
 * - ScammerUrl - The type for a single scammer URL object.
 */

import {ai} from '@/ai/genkit';
import {db} from '@/lib/firebase';
import {collection, getDocs, orderBy, query} from 'firebase/firestore';
import {z} from 'zod';

const ScammerUrlSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  reportedAt: z.string(),
  confidenceScore: z.number(),
  description: z.string(),
});
export type ScammerUrl = z.infer<typeof ScammerUrlSchema>;

const GetScammerUrlsOutputSchema = z.array(ScammerUrlSchema);

export async function getScammerUrls(): Promise<ScammerUrl[]> {
  return getScammerUrlsFlow();
}

const getScammerUrlsFlow = ai.defineFlow(
  {
    name: 'getScammerUrlsFlow',
    inputSchema: z.void(),
    outputSchema: GetScammerUrlsOutputSchema,
  },
  async () => {
    try {
      const q = query(
        collection(db, 'scammers'),
        orderBy('reportedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const urls: ScammerUrl[] = [];
      const seenUrls = new Set<string>();

      querySnapshot.forEach(doc => {
        const data = doc.data();
        if (data.url && !seenUrls.has(data.url) && data.confidenceScore && data.description && data.reportedAt) {
          urls.push({
            id: doc.id,
            url: data.url,
            confidenceScore: data.confidenceScore,
            description: data.description,
            reportedAt: (data.reportedAt.toDate() as Date).toISOString(),
          });
          seenUrls.add(data.url);
        }
      });
      return urls;
    } catch (error) {
      console.error('Error getting documents: ', error);
      return [];
    }
  }
);
