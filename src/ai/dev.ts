import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-best-crops.ts';
import '@/ai/flows/detect-disease.ts';
import '@/ai/flows/check-warehouse-availability.ts';
import '@/ai/flows/get-forum-response.ts';
import '@/ai/flows/predict-market-price.ts';
import '@/ai/flows/get-weather-forecast.ts';
import '@/ai/flows/get-carbon-credit-info.ts';
import '@/ai/flows/get-voice-assistance.ts';
