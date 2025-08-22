import { useMemo } from 'react';
import { useGameStore } from '../stores/gameStore';

export const useProbability = () => {
  const { functionVerbs, functionNouns, topics } = useGameStore();
  
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
  }, [functionVerbs, functionNouns, topics]);
};
