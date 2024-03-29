import { Searcher } from 'fast-fuzzy';

function fuzzyMatch(input: string, options: string[]) {
  const searcher = new Searcher(options);
  const matches = searcher.search(input, { threshold: 0.5 });
  return matches;
}

export default fuzzyMatch;
