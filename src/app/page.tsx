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
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInput,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import {Skeleton} from '@/components/ui/skeleton';

const quotes = [
  "\"Cooking is at once child's play and adult's joy. And cooking done with care is an act of love.\" - Craig Claiborne",
  "\"The only real stumbling block is fear of failure. In cooking, you've got to have a what-the-hell attitude.\" - Julia Child",
  "\"Anyone who's a chef, who loves food, ultimately knows that all that matters is: 'Is it good? Does it give pleasure?'\" - Anthony Bourdain",
  "\"Cooking is a subject you can never know enough about. There is always something new to discover.\" - Jacques Pepin",
  "\"A recipe has no soul. You, as the cook, must bring soul to the recipe.\" - Thomas Keller",
];

interface ChatHistoryItem {
  id: string;
  ingredients: string;
  recipeName?: string;
}

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState<{
    recipeName: string;
    ingredients: string[];
    instructions: string;
  } | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false); // New state for loading chat history
  const {toast} = useToast();
  const recipeCardRef = useRef<HTMLDivElement>(null);
  const summaryCardRef = useRef<HTMLDivElement>(null);
  const instructionCardRef = useRef<HTMLDivElement>(null);
  const [quote, setQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load chat history from local storage on component mount
    const storedChatHistory = localStorage.getItem('chatHistory');
    if (storedChatHistory) {
      setChatHistory(JSON.parse(storedChatHistory));
    }
  }, []);

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

      const newChatHistoryItem: ChatHistoryItem = {
        id: Date.now().toString(),
        ingredients: ingredients,
        recipeName: recipeData.recipeName,
      };

      const updatedChatHistory = [...chatHistory, newChatHistoryItem];
      setChatHistory(updatedChatHistory);

      // Save chat history to local storage
      localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));

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
      setIngredients(''); // Clear the input field
      if (inputRef.current) {
        inputRef.current.focus(); // Refocus on the input
      }
    }
  };

  const loadChat = (item: ChatHistoryItem) => {
    setIngredients(item.ingredients);

    const loadRecipe = async () => {
        setLoadingChat(true); // Start loading
        setRecipe(null);
        setSummary(null);
        try {
          const recipeData = await generateRecipe({ingredients: item.ingredients});
    
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
          setLoadingChat(false); // End loading
        }
      };

      loadRecipe();
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar className="w-64 border-r flex-none overflow-y-auto">
        <SidebarHeader>
          <SidebarTrigger />
          <SidebarInput placeholder="Search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {chatHistory.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton onClick={() => loadChat(item)}>
                  {item.recipeName || item.ingredients}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <div className="flex-1 flex flex-col p-4">
        <Hero>
          <HeroTitle className="text-3xl font-bold text-primary">
            FridgeChef
          </HeroTitle>
          <HeroDescription className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center gradient-text text-shadow">
            {quote}
          </HeroDescription>
        </Hero>
        <div className="space-y-4">
          {/* Recipe Response */}
          {loadingChat ? ( // Show skeleton while loading chat
              <Card className="w-full glass p-4 space-y-4 shadow-xl transition-all duration-300">
                  <CardHeader className="p-0 flex flex-row items-center space-x-4">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <CardTitle className="text-xl font-semibold">
                          <Skeleton className="h-6 w-32" />
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 p-0">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-64" />
                      <Skeleton className="h-4 w-32" />
                  </CardContent>
              </Card>
          ) : recipe && (
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
        <div className="w-full max-w-2xl space-y-4 mt-auto sticky bottom-0 bg-background p-4">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="https://picsum.photos/50/50" alt="User Avatar" />
            </Avatar>
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Enter ingredients (e.g., chicken, broccoli, cheese)"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="border-input shadow-sm focus-visible:ring-interactive pr-10"
                onKeyDown={handleKeyDown}
                ref={inputRef}
              />
              <Button
                onClick={handleGenerateRecipe}
                className="absolute right-1 top-1 rounded-md bg-primary text-primary-foreground hover:bg-primary/80 focus-visible:ring-interactive h-8 w-8 p-0"
                disabled={loading}
              >
                {loading ? '...' : <Utensils className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
