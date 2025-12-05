import './MostPopular.css'
import piece1 from "../../images/Top-Piece1.png"
import piece2 from "../../images/Top-Piece2.png"


export const MostPopular = () => {
  return (
    <div className='Most-popular'>

      <div className='Most-popular-top'>
        <h2  data-aos="zoom-in">(BestSellers)</h2>
        <p  data-aos="zoom-in">Our Most popular pieces this season</p>
      </div>

      <div className='Most-popular-body'>

        <div className='container'>

            <div className='image'>
                <img src={piece1}  alt='americana di na hoodie'/>

            </div>
            <div className='name'>
               <p>americana di na hoodie</p>
            </div>

            <div className='amount'>
                <p>$300</p>
            </div>
        </div>

        <div className='container'>

            <div className='image'>
                <img src={piece2}  alt='americana di na hoodie'/>

            </div>
            <div className='name'>
               <p>americana di na hoodie</p>
            </div>

            <div className='amount'>
                <p>$300</p>
            </div>
        </div>


      </div>

    </div>
  )
}
