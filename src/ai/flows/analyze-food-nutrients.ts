'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing the nutritional content of a selected food item and quantity.
 *
 * analyzeFoodNutrients - A function that triggers the food analysis flow.
 * AnalyzeFoodNutrientsInput - The input type for the analyzeFoodNutrients function.
 * AnalyzeFoodNutrientsOutput - The return type for the analyzeFoodNutrients function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFoodNutrientsInputSchema = z.object({
  foodItem: z.string().describe('The name of the food item to analyze.'),
  quantity: z.string().describe('The quantity of the food item (e.g., 100g, 1 plate, 1 piece).'),
});
export type AnalyzeFoodNutrientsInput = z.infer<typeof AnalyzeFoodNutrientsInputSchema>;

const AnalyzeFoodNutrientsOutputSchema = z.object({
  calorieCount: z.number().describe('The total calorie count of the food item and quantity.'),
  macronutrientBreakdown: z.object({
    carbohydrates: z.number().describe('The amount of carbohydrates in grams.'),
    proteins: z.number().describe('The amount of protein in grams.'),
    fats: z.number().describe('The amount of fat in grams.'),
  }).describe('A breakdown of the macronutrients in the food item.'),
  micronutrientDetails: z.string().optional().describe('Optional details about micronutrients (vitamins, minerals).'),
  servingSize: z.string().describe('The serving size / quantity selected by the user.'),
  healthInsights: z.string().describe('Health insights or tips related to the selected food item.'),
});
export type AnalyzeFoodNutrientsOutput = z.infer<typeof AnalyzeFoodNutrientsOutputSchema>;

export async function analyzeFoodNutrients(input: AnalyzeFoodNutrientsInput): Promise<AnalyzeFoodNutrientsOutput> {
  return analyzeFoodNutrientsFlow(input);
}

const analyzeFoodNutrientsPrompt = ai.definePrompt({
  name: 'analyzeFoodNutrientsPrompt',
  input: {schema: AnalyzeFoodNutrientsInputSchema},
  output: {schema: AnalyzeFoodNutrientsOutputSchema},
  prompt: `You are a nutrition expert. Analyze the following food item and quantity to provide nutritional information.

Food Item: {{{foodItem}}}
Quantity: {{{quantity}}}

Provide the following information:
- Calorie Count: The total calorie count.
- Macronutrient Breakdown: Carbohydrates, proteins, and fats in grams.
- Micronutrient Details: (Optional) Details about vitamins and minerals.
- Serving Size: The quantity selected by the user.
- Health Insights: Health insights or tips related to the food item.

Format your response as a JSON object matching the following schema:
${JSON.stringify(AnalyzeFoodNutrientsOutputSchema.describe('schema for output of prompt'))}`,
});

const analyzeFoodNutrientsFlow = ai.defineFlow(
  {
    name: 'analyzeFoodNutrientsFlow',
    inputSchema: AnalyzeFoodNutrientsInputSchema,
    outputSchema: AnalyzeFoodNutrientsOutputSchema,
  },
  async input => {
    const {output} = await analyzeFoodNutrientsPrompt(input);
    return output!;
  }
);

