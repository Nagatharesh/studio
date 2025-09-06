
'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing voice-based assistance to farmers in Tamil.
 *
 * @exports getVoiceAssistance - A function that takes a text query and returns an audio response.
 * @exports GetVoiceAssistanceInput - The input type for the getVoiceAssistance function.
 * @exports GetVoiceAssistanceOutput - The output type for the getVoiceAssistance function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';
import wav from 'wav';

const GetVoiceAssistanceInputSchema = z.object({
  query: z.string().describe('The farmer\'s question in text format.'),
});
export type GetVoiceAssistanceInput = z.infer<
  typeof GetVoiceAssistanceInputSchema
>;

const GetVoiceAssistanceOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe('The base64 encoded WAV audio data URI of the response.'),
});
export type GetVoiceAssistanceOutput = z.infer<
  typeof GetVoiceAssistanceOutputSchema
>;

export async function getVoiceAssistance(
  input: GetVoiceAssistanceInput
): Promise<GetVoiceAssistanceOutput> {
  return getVoiceAssistanceFlow(input);
}

// Define a separate prompt for generating the text response in Tamil
const tamilResponsePrompt = ai.definePrompt({
  name: 'getTamilResponsePrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: { schema: GetVoiceAssistanceInputSchema },
  output: { schema: z.object({ response: z.string() }) },
  prompt: `You are an expert agricultural advisor for farmers in Tamil Nadu.
Your role is to provide helpful, encouraging, and concise advice in the Tamil language.

A farmer has asked the following question:
"{{{query}}}"

Based on the question, provide a helpful and supportive response IN TAMIL.
`,
});

// Helper function to convert PCM audio buffer to WAV format
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const getVoiceAssistanceFlow = ai.defineFlow(
  {
    name: 'getVoiceAssistanceFlow',
    inputSchema: GetVoiceAssistanceInputSchema,
    outputSchema: GetVoiceAssistanceOutputSchema,
  },
  async (input) => {
    // 1. Generate the text response in Tamil
    const { output: textOutput } = await tamilResponsePrompt(input);
    if (!textOutput?.response) {
      throw new Error('Failed to generate a text response.');
    }
    const tamilResponse = textOutput.response;

    // 2. Convert the Tamil text to speech
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, // A suitable voice
          },
        },
      },
      prompt: tamilResponse,
    });

    if (!media) {
      throw new Error('Failed to generate audio from the text response.');
    }

    // 3. Convert the audio from PCM to WAV format
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
