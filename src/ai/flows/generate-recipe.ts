'use server';

/**
 * @fileOverview Recipe generation flow that suggests recipes based on available ingredients.
 *
 * - generateRecipe - A function that generates recipe suggestions based on input ingredients.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GenerateRecipeOutput - The return type for the generateRecipe function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateRecipeInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of ingredients available in the fridge.'),
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const GenerateRecipeOutputSchema = z.object({
  recipeName: z.string().describe('The name of the generated recipe.'),
  ingredients: z.array(z.string()).describe('The list of ingredients required for the recipe.'),
  instructions: z.string().describe('The cooking instructions for the recipe.'),
});
export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export async function generateRecipe(input: GenerateRecipeInput): Promise<GenerateRecipeOutput> {
  return generateRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: {
    schema: z.object({
      ingredients: z
        .string()
        .describe('A comma-separated list of ingredients available in the fridge.'),
    }),
  },
  output: {
    schema: z.object({
      recipeName: z.string().describe('The name of the generated recipe.'),
      ingredients: z.array(z.string()).describe('The list of ingredients required for the recipe.'),
      instructions: z.string().describe('The cooking instructions for the recipe.'),
    }),
  },
  prompt: `You are a world-class chef known for your innovative and delicious recipes. 
Given the following ingredients, create a detailed and easy-to-follow recipe, formatted clearly for a home cook.

Ingredients: {{{ingredients}}}

Consider these points when creating the recipe:

*   **Recipe Name:**  Give the recipe a creative and appetizing name.
*   **Ingredients:** List all ingredients with precise quantities. Be specific (e.g., "1 tbsp olive oil", not just "olive oil").
*   **Instructions:** Provide clear, step-by-step instructions.  Include cooking times and temperatures where necessary.  Explain techniques.
*   **Ingredient Consideration**: Be creative with ingredients and what you make.
*   **Quantity**: Make sure your recipe takes into account the ingredient quatities.

Make sure the recipe is creative, utilizes the provided ingredients effectively, and results in a balanced and flavorful dish. Focus on clear instructions that anyone can follow.

Format:
Recipe Name: [recipe name]
Ingredients: [ingredient1 (quantity), ingredient2 (quantity), ...]
Instructions: [step1, step2, ...]`,
});

const generateRecipeFlow = ai.defineFlow<
  typeof GenerateRecipeInputSchema,
  typeof GenerateRecipeOutputSchema
>({
  name: 'generateRecipeFlow',
  inputSchema: GenerateRecipeInputSchema,
  outputSchema: GenerateRecipeOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
