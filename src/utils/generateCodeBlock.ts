import getRandomTopicWords from "./getRanomTopicWords";
import getRandomFunctionName from "./getRandomFunctionName";
import formatFunctionName from "./formatFunctionName";
import generateRandomSnippet from "./generateRandomSnippet";

const generateCodeBlock = (visibleText: string, blockLength: number) => {
  const topicWords = getRandomTopicWords();
  const codeBlock: string[] = [];

  // Check if this is the very first function (when visibleText is empty)
  const isFirstFunction = visibleText.length === 0;

  // Generate a function name and add it to the block
  const functionParts = getRandomFunctionName(topicWords[0]);
  const functionName = formatFunctionName(functionParts);
  const functionString = `${
    isFirstFunction ? '' : '\n'
  }function ${functionName}() {`;

  codeBlock.push(functionString);

  for (let i = 0; i < blockLength; i++) {
    const snippet = generateRandomSnippet(topicWords);
    codeBlock.push(snippet);
  }

  // Close the function
  codeBlock.push('}');

  const codeBlockString = codeBlock.join('\n');
  return { codeBlockString, functionName };
};

export default generateCodeBlock;