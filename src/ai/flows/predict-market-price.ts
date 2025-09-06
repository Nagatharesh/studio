
'use server';

/**
 * @fileOverview This file defines a Genkit flow for predicting market prices for crops.
 *
 * @exports predictMarketPrice - A function that takes a crop name and returns a price prediction.
 * @exports PredictMarketPriceInput - The input type for the predictMarketPrice function.
 * @exports PredictMarketPriceOutput - The output type for the predictMarketPrice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const PredictMarketPriceInputSchema = z.object({
  cropName: z.string().describe('The name of the crop to predict the price for.'),
});

export type PredictMarketPriceInput = z.infer<
  typeof PredictMarketPriceInputSchema
>;

const PredictMarketPriceOutputSchema = z.object({
  predictedPriceRange: z
    .string()
    .describe('The predicted price range, e.g., "₹7,800 - ₹8,500 / quintal".'),
  trend: z
    .string()
    .describe('The market trend, e.g., "Stable", "Likely to Increase", "Likely to Decrease".'),
  recommendation: z
    .string()
    .describe('A brief recommendation for the farmer.'),
});

export type PredictMarketPriceOutput = z.infer<
  typeof PredictMarketPriceOutputSchema
>;

export async function predictMarketPrice(
  input: PredictMarketPriceInput
): Promise<PredictMarketPriceOutput> {
  return predictMarketPriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictMarketPricePrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: { schema: PredictMarketPriceInputSchema },
  output: { schema: PredictMarketPriceOutputSchema },
  prompt: `You are an expert agricultural market analyst for Tamil Nadu.
Your task is to predict the market price for a given crop.

For the given crop, generate a realistic but randomized predicted price range in Rupees per quintal suitable for the Tamil Nadu market.
Also, provide a randomized market trend (e.g., "Stable", "Likely to Increase", "Likely to Decrease") and a brief, corresponding recommendation for the farmer.
Do not use the same values every time; introduce variability for a more dynamic prototype.

Crop Name: {{{cropName}}}
`,
});

const predictMarketPriceFlow = ai.defineFlow(
  {
    name: 'predictMarketPriceFlow',
    inputSchema: PredictMarketPriceInputSchema,
    outputSchema: PredictMarketPriceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
