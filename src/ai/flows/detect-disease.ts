'use server';

/**
 * @fileOverview This file defines a Genkit flow for detecting crop diseases from an image.
 *
 * @exports detectDisease - A function that takes an image data URI and returns a diagnosis and remedy.
 * @exports DetectDiseaseInput - The input type for the detectDisease function.
 * @exports DetectDiseaseOutput - The output type for the detectDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant leaf, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type DetectDiseaseInput = z.infer<typeof DetectDiseaseInputSchema>;

const DetectDiseaseOutputSchema = z.object({
  disease: z.string().describe('The name of the detected disease. If none, "Healthy".'),
  remedy: z.string().describe('The suggested remedy for the detected disease. If healthy, provide a general plant care tip.'),
});

export type DetectDiseaseOutput = z.infer<typeof DetectDiseaseOutputSchema>;

export async function detectDisease(input: DetectDiseaseInput): Promise<DetectDiseaseOutput> {
  return detectDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectDiseasePrompt',
  input: {schema: DetectDiseaseInputSchema},
  output: {schema: DetectDiseaseOutputSchema},
  prompt: `You are an expert plant pathologist. Analyze the provided image of a crop leaf. 

Based on visual characteristics, identify potential diseases. For this prototype, if the leaf appears yellow or has yellow spots, diagnose it as 'Possible Fungal Infection' and suggest a remedy involving neem oil. If the leaf looks green and healthy, classify it as 'Healthy' and provide a positive care tip.

Image: {{media url=photoDataUri}}`,
});

const detectDiseaseFlow = ai.defineFlow(
  {
    name: 'detectDiseaseFlow',
    inputSchema: DetectDiseaseInputSchema,
    outputSchema: DetectDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
