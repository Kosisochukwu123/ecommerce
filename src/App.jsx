import "./App.css";
import Home from "./pages/Home.jsx";
import MenPage from './pages/MensPage/Mens.jsx'
import WomenPage from './pages/WomensPage/Womens.jsx'
import OurStoryPage from './pages/OurStoryPage/OurStoryPage.jsx'
import ContactPage from './pages/ContactPage/ContactPage.jsx'
import {Routes, Route} from 'react-router'
import OpenPageAnimation from "./components/OpenPageAnimation/OpenPageAnimation"
import ScrollToTop from "./components/ScrollToTop";
import CursorFollower from "./components/CursorFollower";

function App() {

  return (
    <>

    <OpenPageAnimation />
    <ScrollToTop />
    <CursorFollower />

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/For-Men" element={ <MenPage/>} />
      <Route path="/For-Women" element={ <WomenPage/>} />
      <Route path="/Our-Story" element={ <OurStoryPage/>} />
      <Route path="/Contact" element={ <ContactPage/>} />
    </Routes>

     
    </>
  );
}

export default App;
