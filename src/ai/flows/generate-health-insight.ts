'use server';

/**
 * @fileOverview A flow to generate health insights for a given food item.
 *
 * - generateHealthInsight - A function that generates health insights.
 * - GenerateHealthInsightInput - The input type for the generateHealthInsight function.
 * - GenerateHealthInsightOutput - The return type for the generateHealthInsight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHealthInsightInputSchema = z.object({
  foodItem: z.string().describe('The name of the food item.'),
  quantity: z.string().describe('The quantity of the food item (e.g., 100g, 1 plate).'),
  calorieCount: z.number().describe('The calorie count of the food item.'),
  carbohydrates: z.number().describe('The amount of carbohydrates in the food item.'),
  proteins: z.number().describe('The amount of proteins in the food item.'),
  fats: z.number().describe('The amount of fats in the food item.'),
});

export type GenerateHealthInsightInput = z.infer<typeof GenerateHealthInsightInputSchema>;

const GenerateHealthInsightOutputSchema = z.object({
  healthInsight: z.string().describe('A health insight or tip related to the food item.'),
});

export type GenerateHealthInsightOutput = z.infer<typeof GenerateHealthInsightOutputSchema>;

export async function generateHealthInsight(input: GenerateHealthInsightInput): Promise<GenerateHealthInsightOutput> {
  return generateHealthInsightFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHealthInsightPrompt',
  input: {schema: GenerateHealthInsightInputSchema},
  output: {schema: GenerateHealthInsightOutputSchema},
  prompt: `You are a nutritionist providing health insights about food items.

  Based on the following nutritional information, provide a concise and helpful health insight about the food item.

  Food Item: {{foodItem}}
  Quantity: {{quantity}}
  Calories: {{calorieCount}}
  Carbohydrates: {{carbohydrates}}g
  Proteins: {{proteins}}g
  Fats: {{fats}}g
  
  Insight:`,
});

const generateHealthInsightFlow = ai.defineFlow(
  {
    name: 'generateHealthInsightFlow',
    inputSchema: GenerateHealthInsightInputSchema,
    outputSchema: GenerateHealthInsightOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
