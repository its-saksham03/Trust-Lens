import React from 'react';
import { useTranslation } from 'react-i18next';

export function PrivacyPolicy() {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-gray-700">
      <h1 className="text-3xl font-black text-gray-900 border-b pb-4">Privacy Policy</h1>
      <p className="font-bold">Effective Date: April 22, 2026</p>
      
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">1. Data We Collect</h2>
        <p>TrustLens collects minimal data required to provide privacy intelligence:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Identity Data:</strong> Name and email via Google/GitHub Auth.</li>
          <li><strong>App Metadata:</strong> Packages installed on your device (for analysis only).</li>
          <li><strong>Analysis Data:</strong> Results of AI scans and your trust scores.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">2. DPDP & GDPR Compliance</h2>
        <p>We adhere to the Digital Personal Data Protection (DPDP) Act of India and GDPR. You have the right to access, correct, and delete your data at any time via the Profile settings.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">3. Data Sharing</h2>
        <p>TrustLens does NOT share your personal data with third-party advertisers. App metadata is processed using Gemini AI to generate security reports.</p>
      </section>

      <section className="space-y-3 text-sm text-gray-400">
        <p>© 2026 TrustLens Privacy Intelligence. All rights reserved.</p>
      </section>
    </div>
  );
}

export function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-gray-700">
      <h1 className="text-3xl font-black text-gray-900 border-b pb-4">Terms & Conditions</h1>
      <p className="font-bold">Last Updated: April 22, 2026</p>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">1. Disclaimer</h2>
        <p>TrustLens provides privacy intelligence for informational purposes only. While our AI engine is highly accurate, we cannot guarantee absolute safety. Decisions regarding app uninstallation are the sole responsibility of the user.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">2. Usage Rights</h2>
        <p>Users are granted a non-exclusive license to use TrustLens for personal privacy monitoring. Commercial scraping of our trust scores is strictly prohibited.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">3. Limitation of Liability</h2>
        <p>TrustLens is not liable for any data loss, device issues, or privacy breaches occurring on your device through third-party applications analyzed by our platform.</p>
      </section>
    </div>
  );
}
