import { useMemo } from 'react';
import { MetaTags } from '../types';
import { calculateSEOScore } from '../utils/seoUtils';

export function useSEOScore(tags: MetaTags) {
  const result = useMemo(() => calculateSEOScore(tags), [tags]);
  return result;
}
