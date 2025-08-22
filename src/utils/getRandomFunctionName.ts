export interface FunctionNameParts {
  verb: string;
  topic: string;
  noun: string;
}

const getRandomFunctionName = (
  functionVerbs: string[],
  functionNouns: string[],
  topics: string[][],
  topicWord?: string
): FunctionNameParts => {
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  const randomTopicWord = topicWord || randomTopic[Math.floor(Math.random() * randomTopic.length)];
  const randomVerb = functionVerbs[Math.floor(Math.random() * functionVerbs.length)];
  const randomNoun = functionNouns[Math.floor(Math.random() * functionNouns.length)];
  
  return {
    verb: randomVerb,
    topic: randomTopicWord,
    noun: randomNoun
  };
};

export default getRandomFunctionName;