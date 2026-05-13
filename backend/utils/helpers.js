export const generateWellnessScore = (moodLogs) => {
  if (!moodLogs || moodLogs.length === 0) return 0;
  
  const average = moodLogs.reduce((sum, log) => sum + log.moodScore, 0) / moodLogs.length;
  return Math.round(average * 10) / 10;
};

export const getEmotionTrend = (moodLogs) => {
  if (moodLogs.length < 2) return 'stable';
  
  const recent = moodLogs.slice(-5);
  const avgRecent = recent.reduce((sum, log) => sum + log.moodScore, 0) / recent.length;
  const avgPrevious = moodLogs.slice(-10, -5).reduce((sum, log) => sum + log.moodScore, 0) / 5;
  
  if (avgRecent > avgPrevious + 1) return 'improving';
  if (avgRecent < avgPrevious - 1) return 'declining';
  return 'stable';
};

export const calculateBurnoutRisk = (moodLogs, taskCompletionRate) => {
  let riskScore = 0;
  
  if (moodLogs.length > 0) {
    const avgMood = moodLogs.reduce((sum, log) => sum + log.moodScore, 0) / moodLogs.length;
    if (avgMood < 4) riskScore += 40;
    else if (avgMood < 6) riskScore += 20;
  }
  
  if (taskCompletionRate < 30) riskScore += 30;
  else if (taskCompletionRate < 50) riskScore += 15;
  
  return Math.min(100, riskScore);
};