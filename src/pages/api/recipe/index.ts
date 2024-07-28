import type { APIContext } from 'astro';
import { db, Recipes, eq } from 'astro:db';
import { response } from 'src/utilities';
import { createId } from '@paralleldrive/cuid2';

const { RECIPE_APPLICATION_ID, RECIPE_APPLICATION_KEY } = import.meta.env;

export async function GET(context: APIContext): Promise<Response> {
  const searchParams = context.url.searchParams;
  const searchQuery = searchParams.get('query');

  const dbRecipes = await db.select().from(Recipes).where(eq(Recipes.query, searchQuery));
  if (dbRecipes[0]) {
    return response(await dbRecipes[0].data.hits, 200);
  }

  const url = new URL(`https://api.edamam.com/search`);
  const params = {
    app_id: RECIPE_APPLICATION_ID,
    app_key: RECIPE_APPLICATION_KEY,
    from: 0,
    to: 100,
    q: searchQuery,
  };

  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key as keyof typeof params]));

  const res = await fetch(url.toString());
  const data = await res.json();
  if (data.error) {
    console.error('Recipe API error:', data.error);
    return response({ message: 'No recipes found' }, 404);
  }

  await db.insert(Recipes).values({
    id: createId(),
    query: searchQuery,
    data,
  });
  return response(data.hits, 200);
}
