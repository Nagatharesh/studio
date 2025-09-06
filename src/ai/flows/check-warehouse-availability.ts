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
  input: { schema: CheckWarehouseAvailabilityInputSchema },
  output: { schema: CheckWarehouseAvailabilityOutputSchema },
  prompt: `You are a warehouse logistics coordinator for a large agricultural network in Tamil Nadu.
Your task is to check warehouse availability based on the provided location.

For this prototype, use the following rules:
- If location is "Erode", the "Erode Central Warehouse" is full. Suggest "Coimbatore Storage" as an alternative.
- If location is "Thanjavur", the "Thanjavur Delta Warehouse" has "Limited Space".
- For any other location, the main warehouse in that area is "Available". For example, if the location is "Madurai", respond for "Madurai AgriStorage".

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
