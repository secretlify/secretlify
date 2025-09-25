import { groupAllSettledResults } from './group-all-settled-results';

describe(groupAllSettledResults.name, () => {
  it('groups Promise.allSettled() results by status', async () => {
    const promises = await Promise.allSettled([Promise.resolve(1), Promise.reject(2)]);

    const { rejected, fulfilled } = groupAllSettledResults(promises);

    expect(fulfilled).toHaveLength(1);
    expect(fulfilled[0]).toEqual(1);
    expect(rejected).toHaveLength(1);
    expect(rejected[0]).toEqual(2);
  });

  it('returns an empty array in the rejected field if all promises were resolved', async () => {
    const promises = await Promise.allSettled([Promise.resolve(1), Promise.resolve(2)]);

    const { rejected, fulfilled } = groupAllSettledResults(promises);

    expect(fulfilled).toHaveLength(2);
    expect(fulfilled[0]).toEqual(1);
    expect(fulfilled[1]).toEqual(2);
    expect(rejected).toHaveLength(0);
    expect(rejected).toEqual([]);
  });

  it('returns an empty array in the fulfilled field if all promises were rejected', async () => {
    const promises = await Promise.allSettled([Promise.reject(1), Promise.reject(2)]);

    const { rejected, fulfilled } = groupAllSettledResults(promises);

    expect(fulfilled).toHaveLength(0);
    expect(fulfilled).toEqual([]);
    expect(rejected).toHaveLength(2);
    expect(rejected[0]).toEqual(1);
    expect(rejected[1]).toEqual(2);
  });
});
