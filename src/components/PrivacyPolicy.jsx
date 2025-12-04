import "./Legalpage.css";
import Footer from "./Footer/Footer";
import Nav from "./Nav/Nav";
import Socials from "./Socials/Socials";

export default function PrivacyPolicy() {
  return (
    <div>
      <Nav />
      <div className="policy-container">
        <h1>Privacy Policy</h1>

        <p>
          Your privacy is important to us. This policy explains how we collect,
          use, and safeguard your information.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We may collect personal data such as name, email, and browsing
          activity to improve our services.
        </p>

        <h2>How We Use Information</h2>
        <p>
          Your information is used to enhance user experience and process
          orders.
        </p>

        <h2>Security</h2>
        <p>
          We implement security measures to protect your data but cannot
          guarantee absolute safety.
        </p>
      </div>
      <Socials />
      <Footer />
    </div>
  );
}
