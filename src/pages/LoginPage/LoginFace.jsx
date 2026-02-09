import React from 'react'
import "./LoginPage.css"
import { Link } from 'react-router-dom'

const LoginFace = () => {
  return (
    <div className='Login-home'>
        <button>
          <Link to="/login"> Get started</Link>
        </button>
    </div>
  )
}

export default LoginFace