import type { APIContext } from 'astro';
import { db, Market } from 'astro:db';
import { response } from '@utilities';
import { createId } from '@paralleldrive/cuid2';

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

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const name = formData.get('name') as string;
  const address = formData.get('address') as string;
  const lat = formData.get('lat') as number;
  const long = formData.get('long') as number;

  if (!name || !address || !lat || !long) {
    return response(
      {
        error: 'Missing required fields',
        fields: {
          name: !!name,
          address: !!address,
          lat: !!lat,
          long: !!long,
        },
      },
      400
    );
  }

  try {
    db.insert(Market).values({
      id: createId(),
      name,
      address,
      lat: parseFloat(lat),
      long: parseFloat(long),
    });
    return response({ message: 'Market created' }, 200);
  } catch (error) {
    console.error('Database query failed:', error);
    return response({ message: 'Internal Server Error' }, 500);
  }
}

export async function PUT(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const address = formData.get('address') as string;
  const lat = formData.get('lat') as number;
  const long = formData.get('long') as number;

  if (!id || !name || !address || !lat || !long) {
    return response(
      {
        error: 'Missing required fields',
        fields: {
          id: !!id,
          name: !!name,
          address: !!address,
          lat: !!lat,
          long: !!long,
        },
      },
      400
    );
  }

  try {
    db.update(Market)
      .set({
        name,
        address,
        lat: parseFloat(lat),
        long: parseFloat(long),
      })
      .where({ id });
    return response({ message: 'Market updated' }, 200);
  } catch (error) {
    console.error('Database query failed:', error);
    return response({ message: 'Internal Server Error' }, 500);
  }
}

export async function DELETE(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const id = formData.get('id') as string;

  if (!id) {
    return response(
      {
        error: 'Missing required fields',
        fields: {
          id: !!id,
        },
      },
      400
    );
  }

  try {
    db.delete(Market).where({ id });
    return response({ message: 'Market deleted' }, 200);
  } catch (error) {
    console.error('Database query failed:', error);
    return response({ message: 'Internal Server Error' }, 500);
  }
}
