'use server';

import {
  suggestBestCrops,
  type SuggestBestCropsInput,
} from '@/ai/flows/suggest-best-crops';
import { z } from 'zod';

const formSchema = z.object({
  location: z.string().min(3, 'Location must be at least 3 characters.'),
  soilProperties: z.string().min(10, 'Soil properties must be at least 10 characters.'),
});

export async function getCropSuggestions(
  data: SuggestBestCropsInput
): Promise<{ suggestions?: string[]; error?: string }> {
  const validation = formSchema.safeParse(data);
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
