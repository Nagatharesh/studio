'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a response in a community forum.
 *
 * @exports getForumResponse - A function that takes a user's message and returns a helpful response.
 * @exports GetForumResponseInput - The input type for the getForumResponse function.
 * @exports GetForumResponseOutput - The output type for the getForumResponse function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetForumResponseInputSchema = z.object({
  message: z.string().describe('The user message in the forum.'),
});

export type GetForumResponseInput = z.infer<typeof GetForumResponseInputSchema>;

const GetForumResponseOutputSchema = z.object({
  response: z.string().describe('The generated response from the agricultural officer bot.'),
});

export type GetForumResponseOutput = z.infer<typeof GetForumResponseOutputSchema>;

export async function getForumResponse(input: GetForumResponseInput): Promise<GetForumResponseOutput> {
  return getForumResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getForumResponsePrompt',
  input: { schema: GetForumResponseInputSchema },
  output: { schema: GetForumResponseOutputSchema },
  prompt: `You are an expert agricultural officer bot in a community forum for farmers in Tamil Nadu.
Your role is to provide helpful, encouraging, and concise advice.

A farmer has asked the following question:
"{{{message}}}"

Based on the question, provide a helpful and supportive response.
Keep the tone friendly and professional.
`,
});

const getForumResponseFlow = ai.defineFlow(
  {
    name: 'getForumResponseFlow',
    inputSchema: GetForumResponseInputSchema,
    outputSchema: GetForumResponseOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
