import './MostPopular.css'
import hoodie from "../images/hoodie1.jpg"


export const MostPopular = () => {
  return (
    <div className='Most-popular'>

      <div className='Most-popular-top'>
        <h2>(BestSellers)</h2>
        <p>Our Most popular pieces this season</p>
      </div>

      <div className='Most-popular-body'>

        <div className='container'>

            <div className='image'>
                <img src={hoodie}  alt='americana di na hoodie'/>

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
                <img src={hoodie}  alt='americana di na hoodie'/>

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
