import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-image-for-fraud.ts';
import '@/ai/flows/analyze-video-for-fraud.ts';
import '@/ai/flows/investigate-url-for-fraud.ts';
import '@/ai/flows/generate-fraud-report.ts';
import '@/ai/flows/get-scam-recommendations.ts';
import '@/ai/flows/add-scammer-url.ts';
import '@/ai/flows/get-scammer-urls.ts';
