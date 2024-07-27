import type { APIContext } from 'astro';
import { db, eq, Market, User } from 'astro:db';
import { response } from '@utilities';
import { createId } from '@paralleldrive/cuid2';
import { Permission, Permissions } from '@services';

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
  const session = context.locals.session;
  if (!session) {
    return response({ error: 'Unauthorized' }, 401);
  }
  const results = await db
    .select({
      id: User.id,
      role: User.role,
    })
    .from(User)
    .where(eq(User.id, session.userId));
  const user = await results[0];
  if (!user) {
    return response({ error: 'Unauthorized' }, 401);
  }
  const permissions = new Permission(user.role);
  if (!permissions) {
    return response({ error: 'Unauthorized' }, 401);
  }
  const canManageMarkets = await permissions.hasPermission(Permissions.canManageMarkets);
  if (!canManageMarkets) {
    return response({ error: 'Unauthorized' }, 401);
  }

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
  const session = context.locals.session;
  if (!session) {
    return response({ error: 'Unauthorized' }, 401);
  }
  const results = await db
    .select({
      id: User.id,
      role: User.role,
    })
    .from(User)
    .where(eq(User.id, session.userId));
  const user = await results[0];
  if (!user) {
    return response({ error: 'Unauthorized' }, 401);
  }
  const permissions = new Permission(user.role);
  if (!permissions) {
    return response({ error: 'Unauthorized' }, 401);
  }
  const canManageMarkets = await permissions.hasPermission(Permissions.canManageMarkets);
  if (!canManageMarkets) {
    return response({ error: 'Unauthorized' }, 401);
  }
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
    await db
      .update(Market)
      .set({
        name,
        address,
        lat: parseFloat(lat),
        long: parseFloat(long),
      })
      .where(eq(Market.id, id));
    return response({ message: 'Market updated' }, 200);
  } catch (error) {
    console.error('Database query failed:', error);
    return response({ message: 'Internal Server Error' }, 500);
  }
}

export async function DELETE(context: APIContext): Promise<Response> {
  const session = context.locals.session;
  if (!session) {
    return response({ error: 'Unauthorized' }, 401);
  }
  const results = await db
    .select({
      id: User.id,
      role: User.role,
    })
    .from(User)
    .where(eq(User.id, session.userId));
  const user = await results[0];
  if (!user) {
    return response({ error: 'Unauthorized' }, 401);
  }
  const permissions = new Permission(user.role);
  if (!permissions) {
    return response({ error: 'Unauthorized' }, 401);
  }
  const canManageMarkets = await permissions.hasPermission(Permissions.canManageMarkets);
  if (!canManageMarkets) {
    return response({ error: 'Unauthorized' }, 401);
  }

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
    await db.delete(Market).where(eq(Market.id, id));
    return response({ message: 'Market deleted' }, 200);
  } catch (error) {
    console.error('Database query failed:', error);
    return response({ message: 'Internal Server Error' }, 500);
  }
}
