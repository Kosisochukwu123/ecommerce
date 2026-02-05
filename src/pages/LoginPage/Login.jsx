import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Login = ({setUser}) => {

  const [error, setError] = useState(null);

    const style = {
        color: 'red',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh'
    }

    const innerStyle = {
        border: '1px solid black',
        padding: '20px',
        backgroundColor: 'lightgray',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        borderColor: 'gray'
    }

    const h2style = {
        marginBottom: '20px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        text : "center",
    }

    const [formData, setFormData] = useState({
      email: '',
      password: ''
    });

    const handleChange = (e) => {
      setFormData({...formData, [e.target.name]: e.target.value });

    }

    const navigate = useNavigate();

    const handleSummit = async (e) => {
      e.preventDefault();

      try {
        
         const res = await axios.post('/api/users/login', formData);
         localStorage.setItem('token', res.data.token);
         setUser(res.data);
         navigate('/');
         console.log(res.data);
      } catch (error) {
          console.log(error);
           setError(error.response?.data?.message || "login failed");
      }
    };
  return (
    <div style={style}>
    
     <div style={innerStyle}>
        <h2 style={h2style}>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
     </div>

     <form onSubmit={handleSummit} style={innerStyle}>

        <div>
            <label htmlFor="email">Email:</label>
            <input 
            value={formData.email} 
            onChange={handleChange}
            placeholder='type your email' type="email" id="email" name="email" required />
        </div>

        <div>
            <label htmlFor="password">Password:</label>
            <input 
            value={formData.password} 
            onChange={handleChange}
            placeholder='type your password' type="password" id="password" name="password" required />
        </div>

        <button type="submit">Login</button>
     </form>

    </div>
  )
}

export default Login