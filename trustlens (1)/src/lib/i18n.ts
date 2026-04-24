import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app_name": "TrustLens",
      "tagline": "Know What Your Apps Know About You",
      "total_apps": "Total Installed Apps",
      "safe_apps": "Safe Apps",
      "moderate_apps": "Moderate Apps",
      "risky_apps": "Risky Apps",
      "trust_score": "Trust Score",
      "risk_level": "Risk Level",
      "permissions": "Permissions",
      "analyze": "Analyze",
      "welcome": "Welcome back, {{name}}",
      "safe": "Safe",
      "moderate": "Moderate",
      "risky": "Risky",
      "dangerous": "Dangerous",
      "breach_found": "Breach Found",
      "privacy_policy": "Privacy Policy",
      "terms": "Terms & Conditions",
      "scan_now": "Scan Device",
      "new_app_alert": "New App Detected!",
      "logout": "Logout",
      "language": "Language",
      "switch_hi": "हिंदी",
      "switch_en": "English",
      "score_85": "Very Safe",
      "score_70": "Safe",
      "score_55": "Moderate",
      "score_40": "Risky",
      "score_below": "Dangerous",
      "gap_title": "Gap Analyzer",
      "sentiment": "Sentiment Analysis"
    }
  },
  hi: {
    translation: {
      "app_name": "TrustLens",
      "tagline": "जानें आपके ऐप्स आपके बारे में क्या जानते हैं",
      "total_apps": "कुल इंस्टॉल किए गए ऐप्स",
      "safe_apps": "सुरक्षित ऐप्स",
      "moderate_apps": "मध्यम ऐप्स",
      "risky_apps": "जोखिमपूर्ण ऐप्स",
      "trust_score": "सुरक्षा स्कोर",
      "risk_level": "जोखिम का स्तर",
      "permissions": "अनुमतियां",
      "analyze": "जांच करें",
      "welcome": "स्वागत है, {{name}}",
      "safe": "सुरक्षित",
      "moderate": "मध्यम",
      "risky": "जोखिमपूर्ण",
      "dangerous": "खतरनाक",
      "breach_found": "डेटा लीक मिला",
      "privacy_policy": "गोपनीयता नीति",
      "terms": "नियम और शर्तें",
      "scan_now": "डिवाइस स्कैन करें",
      "new_app_alert": "नया ऐप मिला!",
      "logout": "लॉगआउट",
      "language": "भाषा",
      "switch_hi": "हिंदी",
      "switch_en": "English",
      "score_85": "बहुत सुरक्षित",
      "score_70": "सुरक्षित",
      "score_55": "मध्यम",
      "score_40": "जोखिमपूर्ण",
      "score_below": "खतरनाक",
      "gap_title": "गैप एनालाइज़र",
      "sentiment": "भावना विश्लेषण"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
