'use client';

import {useState, useRef, useEffect} from 'react';
import {generateRecipe} from '@/ai/flows/generate-recipe';
import {summarizeRecipe} from '@/ai/flows/recipe-summary';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardHeader, CardContent, CardTitle} from '@/components/ui/card';
import {useToast} from '@/hooks/use-toast';
import {Utensils} from 'lucide-react';
import {
  Hero,
  HeroDescription,
  HeroTitle,
} from '@/components/ui/hero';
import {Avatar, AvatarImage} from "@/components/ui/avatar";

const quotes = [
  "\"Cooking is at once child's play and adult's joy. And cooking done with care is an act of love.\" - Craig Claiborne",
  "\"The only real stumbling block is fear of failure. In cooking, you've got to have a what-the-hell attitude.\" - Julia Child",
  "\"Anyone who's a chef, who loves food, ultimately knows that all that matters is: 'Is it good? Does it give pleasure?'\" - Anthony Bourdain",
  "\"Cooking is a subject you can never know enough about. There is always something new to discover.\" - Jacques Pepin",
  "\"A recipe has no soul. You, as the cook, must bring soul to the recipe.\" - Thomas Keller",
];

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
  const [quote, setQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

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
          <span className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center gradient-text text-shadow">
            {quote}
          </span>
        </HeroDescription>
      </Hero>
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src="https://picsum.photos/50/50" alt="User Avatar" />
          </Avatar>
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

        {/* Recipe Response */}
        {recipe && (
          <div className="flex items-start space-x-2">
            <Avatar>
              <AvatarImage src="https://picsum.photos/51/51" alt="Chef Avatar" />
            </Avatar>
            <Card ref={recipeCardRef} className="w-full glass p-4 space-y-4 shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="p-0 flex flex-row items-center space-x-4">
                <Utensils className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl font-semibold gradient-text">
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
          </div>
        )}

        {/* Instructions Response */}
        {recipe && (
          <div className="flex items-start space-x-2">
            <Avatar>
              <AvatarImage src="https://picsum.photos/52/52" alt="Chef Avatar" />
            </Avatar>
            <Card ref={instructionCardRef} className="w-full glass p-4 space-y-4 shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="p-0 flex flex-row items-center space-x-4">
                <Utensils className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl font-semibold gradient-text">Instructions</CardTitle>
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
          </div>
        )}

        {/* Summary Response */}
        {summary && (
          <div className="flex items-start space-x-2">
            <Avatar>
              <AvatarImage src="https://picsum.photos/53/53" alt="Chef Avatar" />
            </Avatar>
            <Card ref={summaryCardRef} className="w-full glass p-4 space-y-4 shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="p-0 flex flex-row items-center space-x-4">
                <Utensils className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl font-semibold gradient-text">Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-sm text-muted-foreground">{summary}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
