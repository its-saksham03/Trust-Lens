import { checkPermissionMismatch } from './permissionEngine';

export const calculateTrustScore = (appData: any) => {
  // Simple mock heuristics based on prompt
  const analyzeDataCollection = (data: any) => 80;
  const analyzePermissions = (data: any) => 75;
  const analyzePolicy = (data: any) => 85;
  const analyzeSecurity = (data: any) => 90;
  const analyzeCompliance = (data: any) => 80;
  const analyzeSentiment = (data: any) => 70;
  const analyzeAIConfidence = (data: any) => 95;
  const analyzeReputation = (data: any) => 85;

  const dataScore = analyzeDataCollection(appData) * 0.20;
  const permScore = analyzePermissions(appData) * 0.18;
  const policyScore = analyzePolicy(appData) * 0.15;
  const securityScore = analyzeSecurity(appData) * 0.15;
  const complianceScore = analyzeCompliance(appData) * 0.12;
  const sentimentScore = analyzeSentiment(appData) * 0.08;
  const aiScore = analyzeAIConfidence(appData) * 0.07;
  const reputationScore = analyzeReputation(appData) * 0.05;

  let totalScore = Math.round(dataScore + permScore + policyScore + securityScore + complianceScore + sentimentScore + aiScore + reputationScore);

  const mismatchCheck = checkPermissionMismatch(appData.permissions || [], appData.category || '');
  let riskLevel = '';
  
  if (mismatchCheck.severity === 'dangerous') {
    riskLevel = 'risky'; // Override per prompt
    if(totalScore > 54) totalScore = 45; // Force drop
  }

  // Calculate standard risk level
  if(!riskLevel) {
    if (totalScore >= 85) riskLevel = 'very_safe';
    else if (totalScore >= 70) riskLevel = 'safe';
    else if (totalScore >= 55) riskLevel = 'moderate';
    else if (totalScore >= 40) riskLevel = 'risky';
    else riskLevel = 'dangerous';
  }

  return {
    overallScore: totalScore,
    riskLevel,
    dataCollectionScore: 80,
    permissionsScore: 75,
    policyScore: 85,
    securityScore: 90,
    complianceScore: 80,
    sentimentScore: 70,
    aiConfidenceScore: 95,
    reputationScore: 85,
    gapAnalysis: mismatchCheck.severity,
  };
};
