import { db, eq, Products, User } from 'astro:db';
import { APIContext } from 'astro';
import { response } from '@utilities';
import { Permission, Permissions } from '@services';
import { createId } from '@paralleldrive/cuid2';

export async function GET(context: APIContext): Promise<Response> {
  try {
    const products = await db.select().from(Products).all();
    if (!products.length > 0) {
      return response({ message: 'No products found' }, 404);
    }
    return response(products, 200);
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
  const canManageProducts = await permissions.hasPermission(Permissions.canManageProducts);
  if (!canManageProducts) {
    return response({ error: 'Unauthorized' }, 401);
  }
  const formData = await context.request.formData();
  const name = formData.get('name');
  const price = formData.get('price');
  const description = formData.get('description');
  const image = formData.get('image');
  const marketId = formData.get('market');
  if (!name || !price || !description || !marketId || !image) {
    return response(
      {
        error: 'Missing required fields',
        fields: {
          name: !!name,
          price: !!price,
          description: !!description,
          image: !!image,
          market: !!marketId,
        },
      },
      400
    );
  }
  if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
    return response({ message: 'Invalid image format' }, 400);
  }
  if (image.size > 2 * 1024 * 1024) {
    return response({ message: `Image is too large. Max size is 2MB, received ${image.size}` }, 400);
  }
  const buffer = Array.from(new Int8Array(await image.arrayBuffer()).values());

  try {
    await db.insert(Products).values({
      id: createId(),
      name,
      price: parseFloat(price),
      description,
      image: `data:${image.type};base64,${Buffer.from(buffer).toString('base64')}`,
      marketId,
    });
    return response({ message: 'Product created' }, 200);
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
  const canManageProducts = await permissions.hasPermission(Permissions.canManageProducts);
  if (!canManageProducts) {
    return response({ error: 'Unauthorized' }, 401);
  }
  const formData = await context.request.formData();
  const id = formData.get('id');
  const name = formData.get('name');
  const price = formData.get('price');
  const description = formData.get('description');
  const image = formData.get('image');
  const marketId = formData.get('market');

  if (!id || !name || !price || !description || !image || !marketId) {
    return response(
      {
        error: 'Missing required fields',
        fields: {
          id: !!id,
          name: !!name,
          price: !!price,
          description: !!description,
          image: !!image,
          market: !!marketId,
        },
      },
      400
    );
  }
  if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
    return response({ message: 'Invalid image format' }, 400);
  }
  if (image.size > 2 * 1024 * 1024) {
    return response({ message: `Image is too large. Max size is 2MB, received ${image.size}` }, 400);
  }
  const buffer = Array.from(new Int8Array(await image.arrayBuffer()).values());
  try {
    await db
      .update(Products)
      .set({
        name,
        price: parseFloat(price),
        description,
        image: `data:${image.type};base64,${Buffer.from(buffer).toString('base64')}`,
        marketId,
      })
      .where(eq(Products.id, id));

    return response({ message: 'Product updated' }, 200);
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
  const canManageProducts = await permissions.hasPermission(Permissions.canManageProducts);
  if (!canManageProducts) {
    return response({ error: 'Unauthorized' }, 401);
  }
  const formData = await context.request.formData();
  const id = formData.get('id');

  if (!id) {
    return response({ error: 'Missing required fields' }, 400);
  }

  try {
    await db.delete(Products).where(eq(Products.id, id)).then();
    return response({ message: 'Product deleted' }, 200);
  } catch (error) {
    console.error('Database query failed:', error);
    return response({ message: 'Internal Server Error' }, 500);
  }
}
