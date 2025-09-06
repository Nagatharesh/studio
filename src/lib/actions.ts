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
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred while fetching suggestions.' };
  }
}

const diseaseDetectionSchema = z.object({
  photoDataUri: z.string().url('Must be a valid data URI.'),
});

export async function getDiseaseDiagnosis(
  data: DetectDiseaseInput
): Promise<{ diagnosis?: DetectDiseaseOutput; error?: string }> {
  const validation = diseaseDetectionSchema.safeParse(data);
  if (!validation.success) {
    return { error: 'Invalid image data.' };
  }

  try {
    const result = await detectDisease(data);
    return { diagnosis: result };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred during diagnosis.' };
  }
}
