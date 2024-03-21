export const useChatUtils = () => {
  // Acronym the name of the song
  const AcronymName = (nameLenght, length) => {
    if (nameLenght && nameLenght.length > 10) {
      return nameLenght.slice(0, length) + "...";
    } else {
      return nameLenght;
    }
  };
  return { AcronymName };
};
