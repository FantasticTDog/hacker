import topics from "../database/topics";

export const getRandomTopicWords = () => {
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  const shuffled = [...randomTopic].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

export default getRandomTopicWords;