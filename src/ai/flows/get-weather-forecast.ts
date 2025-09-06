'use server';

/**
 * @fileOverview This file defines a Genkit flow for getting a weather forecast.
 *
 * @exports getWeatherForecast - A function that takes a location and returns weather information.
 * @exports GetWeatherForecastInput - The input type for the getWeatherForecast function.
 * @exports GetWeatherForecastOutput - The output type for the getWeatherForecast function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const GetWeatherForecastInputSchema = z.object({
  location: z.string().describe('The location to get the weather forecast for.'),
});

export type GetWeatherForecastInput = z.infer<typeof GetWeatherForecastInputSchema>;

const GetWeatherForecastOutputSchema = z.object({
  forecast: z.string().describe('A brief summary of the weather for the next 3 days (e.g., "Sunny with chance of evening showers").'),
  temperature: z.string().describe('The predicted temperature range (e.g., "28°C - 34°C").'),
  recommendation: z.string().describe('A short, actionable recommendation for a farmer based on the forecast.'),
});

export type GetWeatherForecastOutput = z.infer<typeof GetWeatherForecastOutputSchema>;

export async function getWeatherForecast(
  input: GetWeatherForecastInput
): Promise<GetWeatherForecastOutput> {
  return getWeatherForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getWeatherForecastPrompt',
  model: googleAI.model('gemini-1.5-flash-preview-0514'),
  input: { schema: GetWeatherForecastInputSchema },
  output: { schema: GetWeatherForecastOutputSchema },
  prompt: `You are a helpful agricultural weather assistant for Tamil Nadu.
Provide a realistic, randomized 3-day weather forecast for the given location.
The forecast should include a brief summary, a temperature range in Celsius, and a simple, actionable tip for a farmer.

Example for "Madurai":
- forecast: "Mainly sunny, with a possibility of late afternoon thunderstorms."
- temperature: "30°C - 37°C"
- recommendation: "Consider irrigating early in the morning to reduce evaporation."

Do not use the same data every time; introduce variability.

Location: {{{location}}}
`,
});

const getWeatherForecastFlow = ai.defineFlow(
  {
    name: 'getWeatherForecastFlow',
    inputSchema: GetWeatherForecastInputSchema,
    outputSchema: GetWeatherForecastOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
