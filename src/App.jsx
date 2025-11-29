import './App.css'
import OpenPageAnimation from './OpenPageAnimation/OpenPageAnimation.jsx'
import Nav from './Nav/Nav.jsx'
import { Header } from './Header/Header.jsx'
import { Body } from './Body/Body.jsx'
import { MostPopular } from './MostPopular/MostPopular.jsx'


function App() {
 

  return (
    <>
      <OpenPageAnimation />

      <Nav/>

      <Header/>

      <MostPopular/>

      <Body/>

  
    </>
  )
}

export default App
