'use client';

import {useState, useRef, useEffect} from 'react';
import {generateRecipe} from '@/ai/flows/generate-recipe';
import {summarizeRecipe} from '@/ai/flows/recipe-summary';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardHeader, CardContent, CardTitle, CardDescription} from '@/components/ui/card';
import {useToast} from '@/hooks/use-toast';
import {CheckCircle, Sun, Moon} from 'lucide-react';
import {useTheme} from 'next-themes';
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
  const recipeCardRef = useRef<HTMLDivElement>(null);
  const summaryCardRef = useRef<HTMLDivElement>(null);
  const instructionCardRef = useRef<HTMLDivElement>(null);
  const {theme, setTheme} = useTheme();

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

      // Scroll into view after summary is fetched
      recipeCardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [recipe, toast]);

  useEffect(() => {
    if (summary) {
      instructionCardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [summary]);

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleGenerateRecipe();
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
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      <div className="w-full max-w-md space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Enter ingredients (e.g., chicken, broccoli, cheese)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="border-input shadow-sm focus-visible:ring-interactive"
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button
          onClick={handleGenerateRecipe}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/80 focus-visible:ring-interactive"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Recipe'}
        </Button>
        {recipe && (
          <Card ref={recipeCardRef} className="glass p-6 space-y-4 shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="p-0">
              <CardTitle className="text-2xl font-semibold gradient-text">
                {recipe.recipeName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-0">
              <div>
                <h3 className="text-lg font-medium text-foreground">Ingredients:</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
        {recipe && (
          <Card ref={instructionCardRef} className="glass p-6 space-y-4 shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="p-0">
              <CardTitle className="text-2xl font-semibold gradient-text">Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-0">
              <div>
                <Textarea
                  readOnly
                  value={recipe.instructions}
                  className="w-full h-48 text-sm text-muted-foreground bg-interactive border-input shadow-sm focus-visible:ring-interactive resize-none"
                />
              </div>
            </CardContent>
          </Card>
        )}
        {summary && (
          <Card ref={summaryCardRef} className="glass p-6 space-y-4 shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="p-0">
              <CardTitle className="text-2xl font-semibold gradient-text">Summary</CardTitle>
              <CardDescription className="text-muted-foreground">{summary}</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
