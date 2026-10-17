import { InMemoryRepository } from './in-memory-repository';
import type { Category } from '../../domain/category';
import { CATEGORY_SECTION } from '../../domain/category/category-section';

describe('Category repository migration', () => {
  it('[DATA-SEC-01.1] legacy categories without section load as general without losing data', async () => {
    const repository = new InMemoryRepository<Category>();
    await repository.save({ id: 'legacy', name: 'Vieja', kind: 'list', colorToken: 'my', icon: 'list' });
    const items = await repository.list();
    expect(items[0].section).toBeUndefined();
    expect(items[0].name).toBe('Vieja');
  });

  it('explicit sections survive a round trip', async () => {
    const repository = new InMemoryRepository<Category>();
    await repository.save({ id: 'gym', name: 'Gym', kind: 'daily', colorToken: 'event', icon: 'list', section: CATEGORY_SECTION.ROUTINE });
    const items = await repository.list();
    expect(items[0].section).toBe(CATEGORY_SECTION.ROUTINE);
  });
});
