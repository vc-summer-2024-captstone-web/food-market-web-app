import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST, PUT, DELETE } from 'src/pages/api/locations';
import { db, Market, User } from 'astro:db';
import { Permission } from '@services';

vi.mock('astro:db', async () => {
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
    Market: {},
    User: {},
    Role: [
      {
        id: '1',
        name: 'admin',
        canManageMarkets: true,
      },
      {
        id: '2',
        name: 'user',
        canManageMarkets: false,
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
      canManageMarkets: 'canManageMarkets',
    },
  };
});

describe('Locations API handlers', () => {
  describe('GET', () => {
    it('should return 404 if no markets are found', async () => {
      const result = await GET({} as any);
      expect(result.status).toBe(404);
      expect(result.body.message).toBe('No markets found');
    });

    it('should return 200 with market data if markets are found', async () => {
      const mockData = [{ id: '1', name: 'Market 1' }];
      db.select().from(Market).all.mockResolvedValue(mockData);

      const result = await GET({} as any);

      expect(result.status).toBe(200);
      expect(result.body).toEqual([{ name: 'Market 1' }]);
    });
  });
  describe('Authorization Required Endpoints', () => {
    let context: any;
    beforeEach(async () => {
      context = {
        locals: {
          session: { userId: '2', role: '2' },
        },
        request: {
          formData: async () =>
            new Map([
              ['name', 'New Market'],
              ['address', '123 Test St'],
              ['lat', 40.7128],
              ['long', -74.006],
            ]),
        },
      };
      await db
        .select()
        .from(User)
        .where.mockResolvedValue([{ id: context.locals.session.userId, role: '1' }]);

      Permission.mockImplementation(() => ({
        hasPermission: vi.fn().mockResolvedValue(true),
      }));

      await db.insert(Market).values.mockResolvedValue({
        id: '1',
        name: 'Original Market',
        address: '123 Test St',
        lat: 30.7128,
        long: -74.006,
      });
    });
    describe('POST', () => {
      it('should return 401 if session is missing', async () => {
        context.locals.session = null;
        const result = await POST(context);

        expect(result.status).toBe(401);
        expect(result.body.error).toBe('Unauthorized');
      });

      it('should return 401 if user does not have permission', async () => {
        await db
          .select()
          .from(User)
          .where.mockResolvedValue([{ id: context.locals.session.userId, role: '2' }]);
        Permission.mockImplementation(() => ({
          hasPermission: vi.fn().mockResolvedValue(false),
        }));
        const result = await POST(context);
        expect(result.status).toBe(401);
        expect(result.body.error).toBe('Unauthorized');
      });

      it('should return 400 if required fields are missing', async () => {
        context.request.formData = async () => new Map([['name', 'New Market']]);
        const result = await POST(context);
        expect(result.status).toBe(400);
        expect(result.body.error).toBe('Missing required fields');
      });

      it('should return 200 if market is created successfully', async () => {
        const result = await POST(context);
        expect(result.status).toBe(200);
        expect(result.body.message).toBe('Market created');
      });
    });

    describe('PUT', () => {
      it('should return 400 if required fields are missing', async () => {
        context.request.formData = async () => new Map([['name', 'New Market']]);

        const result = await PUT(context);

        expect(result.status).toBe(400);
        expect(result.body.error).toBe('Missing required fields');
      });

      it('should return 200 if market is updated successfully', async () => {
        const formData = new Map();
        formData.set('id', '1');
        formData.set('name', 'Updated Market');
        formData.set('address', '123 Test St');
        formData.set('lat', 40.7128);
        formData.set('long', -74.006);
        //
        context.request = { formData: async () => formData } as any;

        const result = await PUT(context);

        expect(result.status).toBe(200);
        expect(result.body.message).toBe('Market updated');
      });
    });

    describe('DELETE', () => {
      it('should return 400 if id is missing', async () => {
        const formData = new Map();

        context.request = { formData: async () => formData } as any;

        const result = await DELETE(context);

        expect(result.status).toBe(400);
        expect(result.body.error).toBe('Missing required fields');
      });

      it('should return 200 if market is deleted successfully', async () => {
        const formData = new Map();
        formData.set('id', '1');

        context.request = { formData: async () => formData } as any;

        const result = await DELETE(context);

        expect(result.status).toBe(200);
        expect(result.body.message).toBe('Market deleted');
      });
    });
  });
});
