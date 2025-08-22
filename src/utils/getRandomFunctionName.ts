import functionVerbs from "../database/functionVerbs";
import functionNouns from "../database/functionNouns";
import getRandomTopicWords from "./getRanomTopicWords";

export interface FunctionNameParts {
  verb: string;
  topic: string;
  noun: string;
}

const getRandomFunctionName = (topicWord?: string): FunctionNameParts => {
  const randomTopicWord = topicWord || getRandomTopicWords()[0]
  const randomVerb = functionVerbs[Math.floor(Math.random() * functionVerbs.length)];
  const randomNoun = functionNouns[Math.floor(Math.random() * functionNouns.length)];
  
  return {
    verb: randomVerb,
    topic: randomTopicWord,
    noun: randomNoun
  };
};

export default getRandomFunctionName;