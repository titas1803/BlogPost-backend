export const successJSON = (message: string, content?: Object) => {
  return {
    success: true,
    message,
    ...content
  };
};