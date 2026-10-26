import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for CreativeRizz, the design portfolio of Rizwan Khan.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="privacy-page">
      <nav className="privacy-nav"><Link href="/">← Back to portfolio</Link><span>CREATIVERIZZ</span></nav>
      <article className="privacy-content">
        <p className="privacy-kicker">CREATIVERIZZ · WEBSITE POLICY</p>
        <h1>Privacy Policy</h1>
        <p className="privacy-updated">Last updated: October 26, 2026</p>
        <p>This Privacy Policy explains how Rizwan Khan (“I”, “me”, or “my”), operating the CreativeRizz portfolio website at <a href="https://creativerizz.in">creativerizz.in</a> (“Website”), handles information when you visit the Website or contact me about design services.</p>

        <h2>1. Information you provide</h2>
        <p>If you use the contact form, you may provide your name, email address, phone number, and the purpose of your enquiry. Please do not submit sensitive personal information through the form.</p>

        <h2>2. How information is used</h2>
        <p>I use contact details only to respond to enquiries, discuss potential projects or collaborations, and communicate about a request you submitted. I do not sell your personal information.</p>

        <h2>3. Service providers</h2>
        <p>The Website may rely on third-party services to operate:</p>
        <ul>
          <li><strong>Web3Forms:</strong> processes contact-form submissions so your enquiry can be delivered by email. Information you submit may be processed by Web3Forms under its own privacy terms.</li>
          <li><strong>Vercel:</strong> hosts the Website and may process technical information needed to deliver, protect, and operate it. Vercel Analytics may also be used to understand aggregate Website usage.</li>
          <li><strong>Pinterest:</strong> the Website may display Pins or links from my Work Showcase board. If Pinterest content or links are loaded or opened, Pinterest may collect information according to its own privacy policy and settings.</li>
        </ul>
        <p>Third-party providers handle information under their own policies and terms. Review their current privacy documentation for details.</p>

        <h2>4. Pinterest content</h2>
        <p>The portfolio may display design images, titles, descriptions, and links associated with my Pinterest Work Showcase board. The intended use is to showcase my own design work and link visitors to the original Pins. I do not intend to access other users’ private boards or use the integration to create, edit, or delete Pins.</p>

        <h2>5. Cookies and analytics</h2>
        <p>The Website and its hosting or embedded services may use cookies, similar technologies, or technical logs for essential operation, security, performance, and analytics. The exact data collected can depend on the services and your browser settings. You can manage cookies through your browser, although some features may not work as expected if they are blocked.</p>

        <h2>6. Data retention and security</h2>
        <p>Enquiry information is retained only for as long as reasonably needed to respond, maintain relevant project communications, comply with legal obligations, or resolve disputes. Reasonable measures are used to protect information, but no internet transmission or storage method can be guaranteed completely secure.</p>

        <h2>7. Your choices and rights</h2>
        <p>You may contact me to request access to, correction of, or deletion of personal information you submitted, subject to applicable legal requirements and any information I need to retain. You can also choose not to use the contact form.</p>

        <h2>8. Children’s privacy</h2>
        <p>This Website is a professional portfolio and is not intended to solicit personal information from children. If you believe a child has submitted personal information, contact me so I can review the request.</p>

        <h2>9. Changes to this policy</h2>
        <p>This policy may be updated as the Website or its services change. The “Last updated” date above indicates the latest revision. Continued use of the Website after an update means you can review the revised policy here.</p>

        <h2>10. Contact</h2>
        <p>For privacy questions or requests, email <a href="mailto:creativerizz.in@gmail.com">creativerizz.in@gmail.com</a>.</p>
        <p className="privacy-disclaimer">This policy is a practical starting point for this portfolio website, not legal advice. Review it against the services and data practices actually enabled on the live Website and any legal requirements that apply to you.</p>
      </article>
      <footer className="privacy-footer"><span>RIZWAN KHAN · CREATIVE RIZZ</span><Link href="/">Return to home ↗</Link></footer>
    </main>
  );
}
