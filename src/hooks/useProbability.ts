import { useMemo } from 'react';
import functionVerbs from '../database/functionVerbs';
import functionNouns from '../database/functionNouns';
import topics from '../database/topics';

export const useProbability = () => {
  return useMemo(() => {
    const verbCount = functionVerbs.length;
    const nounCount = functionNouns.length;
    const topicCount = topics.flatMap(arr => arr).length;
    const totalCombinations = verbCount * nounCount * topicCount;
    const probability = 1 / totalCombinations;
    const percentage = Number((probability * 100).toFixed(8));

    return {
      percentage,
      totalCombinations,
    };
  }, []);
};
