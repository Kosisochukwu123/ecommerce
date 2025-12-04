import "./Legalpage.css";
import Footer from "./Footer/Footer";
import Nav from "./Nav/Nav";
import Socials from "./Socials/Socials";

export default function Terms() {
  return (
    <>
      <Nav />

      <div className="terms-container">
        <h1>Terms & Services</h1>

        <p>
          Welcome to our Terms & Services page. By accessing or using our
          website, you agree to follow the rules and conditions listed here.
        </p>

        <h2>Use of Service</h2>
        <p>
          You agree not to misuse the website, violate laws, or disrupt other
          users.
        </p>

        <h2>Purchases</h2>
        <p>
          All purchases made through our platform are final unless otherwise
          stated.
        </p>

        <h2>Limitations</h2>
        <p>
          We are not responsible for damages caused by misuse or unauthorized
          modifications.
        </p>
      </div>

      <Socials />
      <Footer />
    </>
  );
}
