import { db, eq, Products, User } from 'astro:db';
import multer, { MulterError } from 'multer';
import { response } from 'src/utilities';
import { APIContext } from 'astro';
import { Permission, Permissions } from 'src/services';

export async function GET(context: APIContext): Promise<Response> {
  const products = await db.select().from(Products);
  if (!products[0]) {
    return response({ message: 'No products found' }, 404);
  }
  return response(products[0], 200);
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

  const formData = context.request.formData;
  const name = formData.get('name');
  const price = formData.get('price');
  const description = formData.get('description');
  const image = formData.get('image');
  const marketId = formData.get('market');

  if (!name || !price || !description || !image || !marketId) {
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

  // get the image file with multer
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB
    },
  }).single('image');

  upload(context.request, context.response, async (error: MulterError) => {
    if (error) {
      console.error('File upload failed:', error);
      return response({ message: 'File upload failed' }, 500);
    }

    try {
      const image = context.request.file.buffer;
      db.insert(Products).values({
        name,
        price: parseFloat(price),
        description,
        image,
        marketId,
      });
      return response({ message: 'Product created' }, 200);
    } catch (error) {
      console.error('Database query failed:', error);
      return response({ message: 'Internal Server Error' }, 500);
    }
  });
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
  const formData = context.request.formData;
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

  try {
    db.update(Products)
      .set({
        name,
        price: parseFloat(price),
        description,
        image,
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

  const id = context.request.formData.get('id');

  if (!id) {
    return response({ error: 'Missing required fields' }, 400);
  }

  try {
    db.delete(Products).where(eq(Products.id, id));
    return response({ message: 'Product deleted' }, 200);
  } catch (error) {
    console.error('Database query failed:', error);
    return response({ message: 'Internal Server Error' }, 500);
  }
}
