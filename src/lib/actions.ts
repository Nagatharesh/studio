
'use server';

import {
  suggestBestCrops,
  type SuggestBestCropsInput,
} from '@/ai/flows/suggest-best-crops';
import {
  detectDisease,
  type DetectDiseaseInput,
  type DetectDiseaseOutput,
} from '@/ai/flows/detect-disease';
import {
  checkWarehouseAvailability,
  type CheckWarehouseAvailabilityInput,
  type CheckWarehouseAvailabilityOutput,
} from '@/ai/flows/check-warehouse-availability';
import {
    getForumResponse as getForumResponseFlow,
    type GetForumResponseInput,
    type GetForumResponseOutput
} from '@/ai/flows/get-forum-response';
import {
    predictMarketPrice,
    type PredictMarketPriceInput,
    type PredictMarketPriceOutput,
} from '@/ai/flows/predict-market-price';
import {
    getWeatherForecast as getWeatherForecastFlow,
    type GetWeatherForecastInput,
    type GetWeatherForecastOutput
} from '@/ai/flows/get-weather-forecast';
import {
    getCarbonCreditInfo as getCarbonCreditInfoFlow,
    type GetCarbonCreditInfoInput,
    type GetCarbonCreditInfoOutput
} from '@/ai/flows/get-carbon-credit-info';
import { z } from 'zod';

const cropSuggestionSchema = z.object({
  location: z.string().min(3, 'Location must be at least 3 characters.'),
  soilProperties: z.string().min(10, 'Soil properties must be at least 10 characters.'),
});

export async function getCropSuggestions(
  data: SuggestBestCropsInput
): Promise<{ suggestions?: string[]; error?: string }> {
  const validation = cropSuggestionSchema.safeParse(data);
  if (!validation.success) {
    const issues = validation.error.issues.map((i) => i.message).join(' ');
    return { error: `Invalid input: ${issues}` };
  }

  try {
    const result = await suggestBestCrops(data);
    return { suggestions: result.suggestedCrops };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'An unexpected error occurred while fetching suggestions.' };
  }
}

const diseaseDetectionSchema = z.object({
  photoDataUri: z.string().startsWith('data:image', {message: 'Must be a valid data URI.'}),
});

export async function getDiseaseDiagnosis(
  data: DetectDiseaseInput
): Promise<{ diagnosis?: DetectDiseaseOutput; error?: string }> {
  const validation = diseaseDetectionSchema.safeParse(data);
  if (!validation.success) {
    const issues = validation.error.issues.map((i) => i.message).join(' ');
    return { error: `Invalid input: ${issues}` };
  }

  try {
    const result = await detectDisease(data);
    return { diagnosis: result };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'An unexpected error occurred during diagnosis.' };
  }
}

const warehouseAvailabilitySchema = z.object({
  location: z.string().min(3, 'Location must be at least 3 characters.'),
});

export async function checkWarehouseSpace(
  data: CheckWarehouseAvailabilityInput
): Promise<{ status?: CheckWarehouseAvailabilityOutput; error?: string }> {
  const validation = warehouseAvailabilitySchema.safeParse(data);
  if (!validation.success) {
    const issues = validation.error.issues.map((i) => i.message).join(' ');
    return { error: `Invalid input: ${issues}` };
  }

  try {
    const result = await checkWarehouseAvailability(data);
    return { status: result };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'An unexpected error occurred while checking availability.' };
  }
}


const forumResponseSchema = z.object({
    message: z.string().min(5, 'Message must be at least 5 characters.'),
});

export async function getForumResponse(
    data: GetForumResponseInput
): Promise<{ response?: GetForumResponseOutput; error?: string }> {
    const validation = forumResponseSchema.safeParse(data);
    if (!validation.success) {
        const issues = validation.error.issues.map((i) => i.message).join(' ');
        return { error: `Invalid input: ${issues}` };
    }

    try {
        const result = await getForumResponseFlow(data);
        return { response: result };
    } catch (e: any) {
        console.error(e);
        return { error: e.message || 'An unexpected error occurred while fetching the response.' };
    }
}

const marketPricePredictionSchema = z.object({
    cropName: z.string().min(3, 'Crop name must be at least 3 characters.'),
});

export async function getMarketPricePrediction(
    data: PredictMarketPriceInput
): Promise<{ prediction?: PredictMarketPriceOutput; error?: string }> {
    const validation = marketPricePredictionSchema.safeParse(data);
    if (!validation.success) {
        const issues = validation.error.issues.map((i) => i.message).join(' ');
        return { error: `Invalid input: ${issues}` };
    }

    try {
        const result = await predictMarketPrice(data);
        return { prediction: result };
    } catch (e: any) {
        console.error(e);
        return { error: e.message || 'An unexpected error occurred while fetching the prediction.' };
    }
}

const weatherForecastSchema = z.object({
    location: z.string().min(3, 'Location must be at least 3 characters.'),
});

export async function getWeatherForecast(
    data: GetWeatherForecastInput
): Promise<{ forecast?: GetWeatherForecastOutput; error?: string }> {
    const validation = weatherForecastSchema.safeParse(data);
    if (!validation.success) {
        const issues = validation.error.issues.map((i) => i.message).join(' ');
        return { error: `Invalid input: ${issues}` };
    }

    try {
        const result = await getWeatherForecastFlow(data);
        return { forecast: result };
    } catch (e: any) {
        console.error(e);
        return { error: e.message || 'An unexpected error occurred while fetching the forecast.' };
    }
}

const carbonCreditInfoSchema = z.object({
    cropTypes: z.array(z.string()),
});

export async function getCarbonCreditInfo(
    data: GetCarbonCreditInfoInput
): Promise<{ info?: GetCarbonCreditInfoOutput; error?: string }> {
    const validation = carbonCreditInfoSchema.safeParse(data);
    if (!validation.success) {
        const issues = validation.error.issues.map((i) => i.message).join(' ');
        return { error: `Invalid input: ${issues}` };
    }

    try {
        const result = await getCarbonCreditInfoFlow(data);
        return { info: result };
    } catch (e: any) {
        console.error(e);
        return { error: e.message || 'An unexpected error occurred while fetching carbon credit info.' };
    }
}
