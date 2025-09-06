
'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking warehouse availability.
 *
 * @exports checkWarehouseAvailability - A function that takes a location and returns warehouse status and suggestions.
 * @exports CheckWarehouseAvailabilityInput - The input type for the checkWarehouseAvailability function.
 * @exports CheckWarehouseAvailabilityOutput - The output type for the checkWarehouseAvailability function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const CheckWarehouseAvailabilityInputSchema = z.object({
  location: z.string().describe('The location of the warehouse to check.'),
});

export type CheckWarehouseAvailabilityInput = z.infer<
  typeof CheckWarehouseAvailabilityInputSchema
>;

const CheckWarehouseAvailabilityOutputSchema = z.object({
  warehouseName: z.string().describe('The name of the checked warehouse.'),
  availability: z
    .string()
    .describe('The availability status, e.g., "Available", "Limited Space", "Full".'),
  suggestion: z
    .string()
    .optional()
    .describe('A suggested alternative if the warehouse is full.'),
});

export type CheckWarehouseAvailabilityOutput = z.infer<
  typeof CheckWarehouseAvailabilityOutputSchema
>;

export async function checkWarehouseAvailability(
  input: CheckWarehouseAvailabilityInput
): Promise<CheckWarehouseAvailabilityOutput> {
  return checkWarehouseAvailabilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkWarehouseAvailabilityPrompt',
  model: googleAI.model('gemini-1.5-flash-preview-0514'),
  input: { schema: CheckWarehouseAvailabilityInputSchema },
  output: { schema: CheckWarehouseAvailabilityOutputSchema },
  prompt: `You are a warehouse logistics coordinator for a large agricultural network in Tamil Nadu.
Your task is to check warehouse availability based on the provided location.

You must follow these rules exactly and provide output in the specified JSON format.
- If the provided location is "Erode", you must respond with: warehouseName="Erode Central Warehouse", availability="Full", and suggestion="Coimbatore Storage".
- If the provided location is "Thanjavur", you must respond with: warehouseName="Thanjavur Delta Warehouse", availability="Limited Space", and no suggestion.
- For ANY OTHER location provided, you must create a plausible warehouse name by taking the location name and appending "AgriStorage" (e.g., if the location is "Madurai", the warehouseName becomes "Madurai AgriStorage"). For these locations, you must set the availability to "Available" and provide no suggestion.

The user has requested the status for the following location:
Location: {{{location}}}

This is the final and most important instruction: provide the output in the specified format and nothing else.
`,
});

const checkWarehouseAvailabilityFlow = ai.defineFlow(
  {
    name: 'checkWarehouseAvailabilityFlow',
    inputSchema: CheckWarehouseAvailabilityInputSchema,
    outputSchema: CheckWarehouseAvailabilityOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
