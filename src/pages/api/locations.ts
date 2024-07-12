import type { APIContext } from 'astro';
import { db, Market } from 'astro:db';
import { response } from '@utilities';

export async function GET(context: APIContext): Promise<Response> {
  try {
    const results = await db.select().from(Market).all();
    if (results.length === 0) {
      return response({ message: 'No markets found' }, 404);
    }
    const markets = results.map(({ id, ...market }) => market);
    return response(markets, 200);
  } catch (error) {
    console.error('Database query failed:', error);
    return response({ message: 'Internal Server Error' }, 500);
  }
}
