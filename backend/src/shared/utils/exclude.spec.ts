import { exclude } from './exclude';

describe(exclude.name, () => {
  it('returns an array of numbers that are not present in the second array', () => {
    const arr1 = [1, 2, 3, 4, 5];
    const arr2 = [2, 5, 8, 10];

    const excluded = exclude(arr1, arr2);

    expect(excluded).toEqual([1, 3, 4]);
  });

  it('returns an array of strings that are not present in the second array', () => {
    const arr1 = ['Hello', 'there'];
    const arr2 = ['Hello', 'from', 'the', 'other', 'side'];

    const excluded = exclude(arr1, arr2);

    expect(excluded).toEqual(['there']);
  });
});
