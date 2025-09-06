
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

Follow these rules exactly:
- If the location is "Erode", you must set the warehouseName to "Erode Central Warehouse", set availability to "Full", and set suggestion to "Coimbatore Storage".
- If the location is "Thanjavur", you must set the warehouseName to "Thanjavur Delta Warehouse" and set availability to "Limited Space".
- For ANY OTHER location, you must create a plausible warehouse name by appending "AgriStorage" to the location (e.g., "Madurai" becomes "Madurai AgriStorage"), and you must set its availability to "Available".

The user has provided the following location:
Location: {{{location}}}
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
