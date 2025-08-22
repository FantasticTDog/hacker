import { useMemo } from 'react';
import functionVerbs from '../database/functionVerbs';
import functionNouns from '../database/functionNouns';
import topics from '../database/topics';

export const useProbability = () => {
  return useMemo(() => {
    const verbCount = functionVerbs.length;
    console.log('verbCount', verbCount);
    const nounCount = functionNouns.length;
    console.log('nounCount', nounCount);
    const topicCount = topics.flatMap(arr => arr).length;
    console.log('topicCount', topicCount);
    const totalCombinations = verbCount * nounCount * topicCount;
    const probability = 1 / totalCombinations;
    const percentage = Number((probability * 100).toFixed(8));

    return {
      percentage,
      totalCombinations,
    };
  }, []);
};
