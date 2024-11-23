import { db, Products, User, eq } from 'astro:db';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import { GET, POST, PUT, DELETE } from 'src/pages/api/products';
import { Permission } from '@services';
import { response } from '@utilities';

vi.mock('astro:db', () => {
  return {
    db: {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      all: vi.fn().mockResolvedValue([]),
      where: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockResolvedValue(null),
      one: vi.fn().mockResolvedValue(null),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
    },
    eq: vi.fn((...args) => args),
    Products: {},
    User: {},
    Market: {
      id: '1',
      name: 'test-market',
    },
    Role: [
      {
        id: '1',
        name: 'admin',
        canManageProducts: 'canManageProducts',
      },
      {
        id: '2',
        name: 'user',
        canManageProducts: 'canManageProducts',
      },
    ],
  };
});

vi.mock('@utilities', () => ({
  response: vi.fn((body, status) => ({ body, status })),
}));
vi.mock('@paralleldrive/cuid2', () => ({
  createId: vi.fn(() => 'mocked-id'),
}));
vi.mock('@services', () => {
  return {
    Permission: vi.fn(() => ({
      hasPermission: vi.fn().mockResolvedValue(true),
    })),
    Permissions: {
      canManageProducts: 'canManageProducts',
    },
  };
});

describe('Product API handlers', () => {
  let context: any;
  let fileBuffer: Buffer;
  beforeEach(async () => {
    Permission.mockImplementation(() => ({
      hasPermission: vi.fn().mockResolvedValue(true),
    }));
    const filePath = join(__dirname, 'assets/test-image.png');
    fileBuffer = await fs.readFile(filePath);
    const imageFile = new File([fileBuffer], 'test-image.png', { type: 'image/png', lastModified: Date.now() });
    context = {
      locals: {
        session: { userId: '2', role: '1' },
      },
      request: {
        formData: async () =>
          new Map([
            ['name', 'Test Product'],
            ['price', '10'],
            ['description', 'Test Description'],
            ['image', imageFile],
            ['market', '1'],
          ]),
      },
    };
    await db
      .select()
      .from(User)
      .where.mockResolvedValue([{ id: context.locals.session.userId, role: '1' }]);
  });
  describe('GET', () => {
    it('should return all products', async () => {
      const mockProducts = [
        {
          name: 'Product 1',
          price: 10,
          description: 'Test Description',
          image: fileBuffer,
          market: '1',
        },
      ];
      await db.select().from(Products).all.mockResolvedValue(mockProducts);

      const result = await GET({} as any);

      expect(result.status).toBe(200);

      expect(result.body).toEqual(mockProducts);
    });

    it('should handle no products found', async () => {
      await db.select().from(Products).all.mockResolvedValue([]);
      await GET(context);

      expect(response).toHaveBeenCalledWith({ message: 'No products found' }, 404);
    });

    it('should handle database errors', async () => {
      db.select().from.mockImplementationOnce(() => {
        throw new Error('DB error');
      });

      await GET(context);

      expect(response).toHaveBeenCalledWith({ message: 'Internal Server Error' }, 500);
    });
  });
  describe('POST', () => {
    it('should create a new product', async () => {
      Permission.mockImplementation(() => ({
        hasPermission: vi.fn().mockResolvedValue(true),
      }));

      await POST(context);

      expect(response).toHaveBeenCalledWith({ message: 'Product created' }, 200);
    });

    it('should handle missing required fields', async () => {
      const formData = new Map();
      formData.set('name', 'Test Product');
      context.request = {
        formData: async () => formData,
      } as any;

      await POST(context);

      expect(response).toHaveBeenCalledWith(
        {
          error: 'Missing required fields',
          fields: {
            name: true,
            price: false,
            description: false,
            image: false,
            market: false,
          },
        },
        400
      );
    });

    it('should handle database errors', async () => {
      db.insert().values.mockImplementationOnce(() => {
        throw new Error('DB error');
      });

      await POST(context);

      expect(response).toHaveBeenCalledWith({ message: 'Internal Server Error' }, 500);
    });
  });
  describe('PUT', () => {
    it('should update a product', async () => {
      context.request = {
        formData: async () =>
          new Map([
            ['id', '1'],
            ['name', 'Updated Product'],
            ['price', '10'],
            ['description', 'Test Description'],
            ['image', new File([fileBuffer], 'test-image.png', { type: 'image/png', lastModified: Date.now() })],
            ['market', '1'],
          ]),
      };
      await PUT(context);
      expect(response).toHaveBeenCalledWith({ message: 'Product updated' }, 200);
    });

    it('should handle missing required fields', async () => {
      const formData = new Map();
      formData.set('name', 'Updated Product');
      context.request = {
        formData: async () => formData,
      } as any;

      await PUT(context);

      expect(response).toHaveBeenCalledWith(
        {
          error: 'Missing required fields',
          fields: {
            id: false,
            name: true,
            price: false,
            description: false,
            image: false,
            market: false,
          },
        },
        400
      );
    });

    it('should handle database errors', async () => {
      db.update().set.mockImplementationOnce(() => {
        throw new Error('DB error');
      });

      await PUT(context);

      expect(response).toHaveBeenCalledWith({ message: 'Internal Server Error' }, 500);
    });
  });

  describe('DELETE', () => {
    it('should delete a product', async () => {
      context.request = {
        formData: async () => new Map([['id', '1']]),
      };

      await DELETE(context);

      expect(response).toHaveBeenCalledWith({ message: 'Product deleted' }, 200);
    });

    it('should handle missing required fields', async () => {
      context.request = {
        formData: async () => new Map(),
      };

      await DELETE(context);

      expect(response).toHaveBeenCalledWith({ error: 'Missing required fields' }, 400);
    });

    it('should handle database errors', async () => {
      context.request = {
        formData: async () => new Map([['id', '']]),
      };

      await DELETE(context);

      expect(response).toHaveBeenCalledWith({ message: 'Internal Server Error' }, 500);
    });
  });
});
