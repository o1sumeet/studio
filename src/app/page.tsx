'use client';

import {useState} from 'react';
import {generateRecipe} from '@/ai/flows/generate-recipe';
import {summarizeRecipe} from '@/ai/flows/recipe-summary';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardHeader, CardContent, CardTitle, CardDescription} from '@/components/ui/card';
import {useToast} from '@/hooks/use-toast';
import {useEffect} from 'react';
import {CheckCircle} from 'lucide-react';
import {
  Hero,
  HeroDescription,
  HeroImage,
  HeroTitle,
} from '@/components/ui/hero';

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState<{
    recipeName: string;
    ingredients: string[];
    instructions: string;
  } | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {toast} = useToast();

  useEffect(() => {
    if (recipe) {
      const fetchSummary = async () => {
        try {
          const summaryData = await summarizeRecipe({
            recipeName: recipe.recipeName,
            ingredients: recipe.ingredients.join(', '),
            instructions: recipe.instructions,
          });
          setSummary(summaryData.summary);
        } catch (error: any) {
          console.error('Failed to summarize recipe:', error);
          toast({
            variant: 'destructive',
            title: 'Error Summarizing Recipe',
            description:
              error.message || 'Failed to summarize the recipe. Please try again.',
          });
        }
      };

      fetchSummary();
    }
  }, [recipe, toast]);

  const handleGenerateRecipe = async () => {
    setLoading(true);
    setRecipe(null);
    setSummary(null);
    try {
      const recipeData = await generateRecipe({ingredients});
      setRecipe({
        recipeName: recipeData.recipeName,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions,
      });
      toast({
        title: 'Recipe Generated',
        description: 'Your recipe has been successfully generated!',
        action: <CheckCircle className="h-4 w-4 text-green-500" />,
      });
    } catch (error: any) {
      console.error('Failed to generate recipe:', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Recipe',
        description:
          error.message || 'Failed to generate a recipe. Please check your ingredients and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-12 bg-background">
      <Hero>
        <HeroTitle className="text-3xl font-bold text-primary">
          FridgeChef
        </HeroTitle>
        <HeroDescription className="text-muted-foreground">
          Enter the ingredients you have in your fridge to generate a recipe.
        </HeroDescription>
        <HeroImage src="https://picsum.photos/400/300" alt="A fridge with ingredients" />
      </Hero>
      <div className="w-full max-w-md space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Enter ingredients (e.g., chicken, broccoli, cheese)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="border-input shadow-sm focus-visible:ring-accent"
          />
        </div>
        <Button
          onClick={handleGenerateRecipe}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/80 focus-visible:ring-accent"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Recipe'}
        </Button>
        {recipe && (
          <Card className="bg-card shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-foreground">
                {recipe.recipeName}
              </CardTitle>
              {summary && <CardDescription className="text-muted-foreground">{summary}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <h3 className="text-lg font-medium text-foreground">Ingredients:</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">Instructions:</h3>
                <Textarea
                  readOnly
                  value={recipe.instructions}
                  className="w-full h-48 text-sm text-muted-foreground bg-interactive border-input shadow-sm focus-visible:ring-accent resize-none"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
