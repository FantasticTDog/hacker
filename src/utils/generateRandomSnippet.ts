import codeSnippets from "../database/codeSnippets";

const generateRandomSnippet = (topicWords: string[]) => {
  const randomSnippet =
    codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
  return randomSnippet.apply(null, topicWords);
};

export default generateRandomSnippet;