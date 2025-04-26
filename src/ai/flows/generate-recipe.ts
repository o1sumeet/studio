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
  prompt: `You are a highly skilled chef, known for creating innovative and delicious recipes using a variety of ingredients. 
Given the following ingredients, generate a detailed and easy-to-follow recipe, optimized for home cooks.

Ingredients: {{{ingredients}}}

When creating the recipe, consider the following:

*   **Recipe Name:**  Give the recipe a creative and mouth-watering name.
*   **Ingredients:** List all ingredients with precise quantities, using specific measurements (e.g., "1 tbsp olive oil", not just "olive oil"). If an ingredient is not suitable, find a substitute from the provided ingredients.
*   **Instructions:** Provide clear, step-by-step instructions.  Include cooking times and temperatures where necessary. Explain any special techniques.
*   **Ingredient Consideration**: Be creative with the use of the ingredients.
*   **Quantity**: Ensure the recipe appropriately uses the given ingredient quantities.
*   **Creativity**: Develop new and exciting recipes.
*   **Unsuitable Ingredients**:  Do not include ingredients that don't fit the recipe.

Ensure the recipe is creative, makes effective use of the available ingredients, and results in a well-balanced and flavorful dish. Clear and simple instructions are key.

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
