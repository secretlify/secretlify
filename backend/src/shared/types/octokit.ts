import { Octokit as Kit } from 'octokit';

/**
 * For some reason there's a difference when using the Octokit type
 * and when the instance is used (it has more properties because of the installed plugins).
 * Thus, I had to add this ugly workaround, to use the octokit.paginate() method.
 */

function getOctokitInstance() {
  return new Kit();
}

export type Octokit = ReturnType<typeof getOctokitInstance>;
