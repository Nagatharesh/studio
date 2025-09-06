
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting the best crops based on location and soil properties.
 *
 * @exports suggestBestCrops - A function that takes location and soil properties as input and returns a list of suggested crops.
 * @exports SuggestBestCropsInput - The input type for the suggestBestCrops function.
 * @exports SuggestBestCropsOutput - The output type for the suggestBestCrops function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const SuggestBestCropsInputSchema = z.object({
  location: z
    .string()
    .describe('The geographical location where the crops will be planted.'),
  soilProperties: z
    .string()
    .describe('The properties of the soil, including pH, nutrient levels, and drainage.'),
});

export type SuggestBestCropsInput = z.infer<typeof SuggestBestCropsInputSchema>;

const SuggestBestCropsOutputSchema = z.object({
  suggestedCrops: z
    .array(z.string())
    .describe('A list of suggested crops based on the location and soil properties.'),
});

export type SuggestBestCropsOutput = z.infer<typeof SuggestBestCropsOutputSchema>;

export async function suggestBestCrops(input: SuggestBestCropsInput): Promise<SuggestBestCropsOutput> {
  return suggestBestCropsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBestCropsPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: SuggestBestCropsInputSchema},
  output: {schema: SuggestBestCropsOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the farmer's location and soil properties, suggest the best crops to plant.

Location: {{{location}}}
Soil Properties: {{{soilProperties}}}

Suggest the best crops in a list:
`,
});

const suggestBestCropsFlow = ai.defineFlow(
  {
    name: 'suggestBestCropsFlow',
    inputSchema: SuggestBestCropsInputSchema,
    outputSchema: SuggestBestCropsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
