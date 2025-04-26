// Recipe summary flow to provide a summarized version of a recipe.
'use server';

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const RecipeSummaryInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  ingredients: z.string().describe('A list of ingredients for the recipe.'),
  instructions: z.string().describe('The full instructions for the recipe.'),
});
export type RecipeSummaryInput = z.infer<typeof RecipeSummaryInputSchema>;

const RecipeSummaryOutputSchema = z.object({
  summary: z.string().describe('A short summary of the recipe.'),
});
export type RecipeSummaryOutput = z.infer<typeof RecipeSummaryOutputSchema>;

export async function summarizeRecipe(input: RecipeSummaryInput): Promise<RecipeSummaryOutput> {
  return recipeSummaryFlow(input);
}

const recipeSummaryPrompt = ai.definePrompt({
  name: 'recipeSummaryPrompt',
  input: {
    schema: RecipeSummaryInputSchema,
  },
  output: {
    schema: RecipeSummaryOutputSchema,
  },
  prompt: `You are an expert recipe summarizer.  Given the recipe name, ingredients, and instructions, create a short summary of the recipe.

Recipe Name: {{{recipeName}}}
Ingredients: {{{ingredients}}}
Instructions: {{{instructions}}}

Summary: `,
});

const recipeSummaryFlow = ai.defineFlow<
  typeof RecipeSummaryInputSchema,
  typeof RecipeSummaryOutputSchema
>(
  {
    name: 'recipeSummaryFlow',
    inputSchema: RecipeSummaryInputSchema,
    outputSchema: RecipeSummaryOutputSchema,
  },
  async input => {
    const {output} = await recipeSummaryPrompt(input);
    return output!;
  }
);
