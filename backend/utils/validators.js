export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export const validateMoodScore = (score) => {
  return Number.isInteger(score) && score >= 1 && score <= 10;
};

export const validateEmotionType = (emotion) => {
  const validEmotions = ['happy', 'sad', 'anxious', 'stressed', 'motivated', 'tired', 'neutral'];
  return validEmotions.includes(emotion.toLowerCase());
};