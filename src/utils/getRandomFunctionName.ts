import functionVerbs from "../database/functionVerbs";
import functionNouns from "../database/functionNouns";
import topics from "../database/topics";

export interface FunctionNameParts {
  verb: string;
  topic: string;
  noun: string;
}

const getRandomFunctionName = (topicWord?: string): FunctionNameParts => {
  let randomTopicWord = topicWord;
  
  if (!randomTopicWord) {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    randomTopicWord = randomTopic[Math.floor(Math.random() * randomTopic.length)];
  }
  
  const randomVerb = functionVerbs[Math.floor(Math.random() * functionVerbs.length)];
  const randomNoun = functionNouns[Math.floor(Math.random() * functionNouns.length)];
  
  return {
    verb: randomVerb,
    topic: randomTopicWord,
    noun: randomNoun
  };
};

export default getRandomFunctionName;