import { describe, it, expect, vi } from 'vitest';
import { GET, POST, PUT, DELETE } from 'src/pages/api/locations';
import { db, Market } from 'astro:db';
import { response } from '@utilities';
import { createId } from '@paralleldrive/cuid2';

vi.mock('astro:db', () => {
  const db = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    all: vi.fn().mockReturnThis().mockResolvedValue([]),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  };
  return { db, Market: {} };
});
vi.mock('@utilities', () => ({
  response: vi.fn((body, status) => ({ body, status })),
}));
vi.mock('@paralleldrive/cuid2', () => ({
  createId: vi.fn(() => 'mocked-id'),
}));

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

  describe('POST', () => {
    it('should return 400 if required fields are missing', async () => {
      const formData = new Map();
      formData.set('name', 'Test Market');
      formData.set('address', '123 Test St');

      const context = {
        request: { formData: async () => formData },
      } as any;

      const result = await POST(context);

      expect(result.status).toBe(400);
      expect(result.body.error).toBe('Missing required fields');
    });

    it('should return 200 if market is created successfully', async () => {
      const formData = new Map();
      formData.set('name', 'Test Market');
      formData.set('address', '123 Test St');
      formData.set('lat', 40.7128);
      formData.set('long', -74.006);

      const context = {
        request: { formData: async () => formData },
      } as any;

      const result = await POST(context);

      expect(result.status).toBe(200);
      expect(result.body.message).toBe('Market created');
    });
  });

  describe('PUT', () => {
    it('should return 400 if required fields are missing', async () => {
      const formData = new Map();
      formData.set('id', '1');
      formData.set('name', 'Updated Market');

      const context = {
        request: { formData: async () => formData },
      } as any;

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

      const context = {
        request: { formData: async () => formData },
      } as any;

      const result = await PUT(context);

      expect(result.status).toBe(200);
      expect(result.body.message).toBe('Market updated');
    });
  });

  describe('DELETE', () => {
    it('should return 400 if id is missing', async () => {
      const formData = new Map();

      const context = {
        request: { formData: async () => formData },
      } as any;

      const result = await DELETE(context);

      expect(result.status).toBe(400);
      expect(result.body.error).toBe('Missing required fields');
    });

    it('should return 200 if market is deleted successfully', async () => {
      const formData = new Map();
      formData.set('id', '1');

      const context = {
        request: { formData: async () => formData },
      } as any;

      const result = await DELETE(context);

      expect(result.status).toBe(200);
      expect(result.body.message).toBe('Market deleted');
    });
  });
});
