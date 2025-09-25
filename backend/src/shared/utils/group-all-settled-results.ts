import { groupBy } from './group-by';

export type AllSettledResults<F, R> = {
  fulfilled: F[];
  rejected: R[];
};

// todo: remove, probably unused
export function groupAllSettledResults<F, R>(
  results: PromiseSettledResult<F>[],
): AllSettledResults<F, R> {
  const { fulfilled = [], rejected = [] } = groupBy(results, 'status');
  return {
    rejected: rejected.map((result) => (result as PromiseRejectedResult).reason),
    fulfilled: fulfilled.map((result) => (result as PromiseFulfilledResult<F>).value),
  };
}
