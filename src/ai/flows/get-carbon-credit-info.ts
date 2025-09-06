
'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing information on carbon credits.
 *
 * @exports getCarbonCreditInfo - A function that returns a summary of earned carbon credits.
 * @exports GetCarbonCreditInfoInput - The input type for the getCarbonCreditInfo function.
 * @exports GetCarbonCreditInfoOutput - The output type for the getCarbonCreditInfo function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const GetCarbonCreditInfoInputSchema = z.object({
    cropTypes: z.array(z.string()).describe('A list of crop types the farmer has grown.'),
});

export type GetCarbonCreditInfoInput = z.infer<typeof GetCarbonCreditInfoInputSchema>;

const GetCarbonCreditInfoOutputSchema = z.object({
  creditsEarned: z.number().describe('The estimated number of carbon credits earned.'),
  explanation: z.string().describe('A brief, encouraging explanation of how the credits were earned.'),
});

export type GetCarbonCreditInfoOutput = z.infer<typeof GetCarbonCreditInfoOutputSchema>;

export async function getCarbonCreditInfo(
  input: GetCarbonCreditInfoInput
): Promise<GetCarbonCreditInfoOutput> {
  return getCarbonCreditInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getCarbonCreditInfoPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: { schema: GetCarbonCreditInfoInputSchema },
  output: { schema: GetCarbonCreditInfoOutputSchema },
  prompt: `You are an agricultural sustainability advisor. 
Your task is to provide a simplified, motivational estimate of carbon credits for a farmer in Tamil Nadu.

Rules:
- For each crop in the list, assign a random number of credits between 5 and 15.
- Sum the credits for all crops to get the total 'creditsEarned'.
- The 'explanation' should be positive and encouraging, briefly mentioning how sustainable practices with crops like "{{#each cropTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}" contribute to earning these credits and helping the environment.
- If no crops are provided, return 0 credits and a message encouraging the farmer to log their batches to start earning.

Crops provided by the farmer:
{{#if cropTypes}}
{{#each cropTypes}}
- {{{this}}}
{{/each}}
{{else}}
No crops listed.
{{/if}}
`,
});

const getCarbonCreditInfoFlow = ai.defineFlow(
  {
    name: 'getCarbonCreditInfoFlow',
    inputSchema: GetCarbonCreditInfoInputSchema,
    outputSchema: GetCarbonCreditInfoOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
