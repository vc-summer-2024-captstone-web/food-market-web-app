import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Card from '../src/components/Card.astro';

test('Card with slots', async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(Card, {
    props: {
      title: 'This is a card',
      body: 'Card content',
      href: 'https://example.com/',
    },
  });
  expect(result).toContain('This is a card');
  expect(result).toContain('Card content');
  expect(result).toContain('href="https://example.com/"');
});
