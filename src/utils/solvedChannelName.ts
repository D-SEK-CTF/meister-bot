import { solvedSuffix } from '../const';

/**
 *
 * @param challName The name of the challenge
 * @returns The name of the solved challenge
 */
function solvedChannelName(challName: string): string {
  return `${challName}${solvedSuffix}`;
}

export { solvedChannelName };
