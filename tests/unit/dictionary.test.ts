import { describe, it, expect } from 'vitest';
import { levenshtein, matchCategory } from '../../src/data/dictionary';

describe('levenshtein', () => {
  it('computes classic distance', () => {
    expect(levenshtein('kitten', 'sitting')).toBe(3);
    expect(levenshtein('', 'abc')).toBe(3);
    expect(levenshtein('abc', '')).toBe(3);
    expect(levenshtein('same', 'same')).toBe(0);
  });
});

describe('matchCategory', () => {
  it('matches exact categories', () => {
    expect(matchCategory('cat')).toBe('cat');
    expect(matchCategory('Airplane')).toBe('airplane');
    expect(matchCategory('THE MONA LISA')).toBe('the mona lisa');
  });

  it('resolves synonyms', () => {
    expect(matchCategory('plane')).toBe('airplane');
    expect(matchCategory('tv')).toBe('television');
    expect(matchCategory('kitty')).toBe('cat');
    expect(matchCategory('doggy')).toBe('dog');
    expect(matchCategory('sofa')).toBe('couch');
    expect(matchCategory('phone')).toBe('cell phone');
  });

  it('handles plurals via singular strip', () => {
    expect(matchCategory('cats')).toBe('cat');
    expect(matchCategory('dogs')).toBe('dog');
  });

  it('fuzzy-matches typos', () => {
    expect(matchCategory('aple')).toBe('apple');
    expect(matchCategory('bannanna')).toBe('banana');
  });

  it('returns null for unrelated words (text fallback)', () => {
    expect(matchCategory('qwerty')).toBeNull();
    expect(matchCategory('zzzzzzz')).toBeNull();
  });
});
