import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-best-crops.ts';
import '@/ai/flows/detect-disease.ts';
import '@/ai/flows/check-warehouse-availability.ts';
