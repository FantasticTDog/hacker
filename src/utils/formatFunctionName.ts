import { FunctionNameParts } from './getRandomFunctionName';

export const formatFunctionName = (parts: FunctionNameParts): string => {
  const capitalizedTopic = parts.topic.charAt(0).toUpperCase() + parts.topic.slice(1);
  const capitalizedNoun = parts.noun.charAt(0).toUpperCase() + parts.noun.slice(1);
  
  return `${parts.verb}${capitalizedTopic}${capitalizedNoun}`;
};
