// import React, { useState } from 'react';
// import API from '../services/api';
// import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import { FaUser, FaLock } from 'react-icons/fa';
// import 'bootstrap/dist/css/bootstrap.min.css';

// function LoginPage() {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await API.post('token/', { username, password });
//       const { access } = response.data;
//       localStorage.setItem('accessToken', access);
//       const decoded = jwtDecode(access);
//       localStorage.setItem('user_id', decoded.user_id);
//       alert('Login Successful! 🚀');
//       navigate('/');
//     } catch (error) {
//       console.error('Login failed:', error.response?.data || error.message);
//       alert('Login failed. Please check your credentials.');
//     }
//   };

//   return (
//     <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-dark text-light">
//       {/* <img
//         src="/coder.svg"
//         alt="logo"
//         style={{ width: '200px', height: '200px', marginBottom: '-50px', marginTop: '-190px' }}
//       />

//       <h5 className="text-center mb-4" style={{ color: '#ccc', maxWidth: '500px', marginBottom:'50px' }}>
//         Your personal coding prep space — smart, focused, and tailored to your role.
//       </h5> */}

//       <img
//           src="/coder.svg"
//           alt="logo"
//           className="img-fluid mb-3"
//           style={{ width: '180px', height: '180px',  marginTop:'-60px' }}
//         />
//         <h5 className="text-light" style={{ maxWidth: '500px', margin: '0 auto',  marginBottom:'50px' }}>
//           Your personal coding prep space — smart, focused, and tailored to your role.
//         </h5>

//       <div className="card shadow" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#2c2c2c' }}>
//         <div className="card-body">
//           <h4 className="card-title text-center mb-4 text-white">Login to <span style={{ color: '#6c63ff' }}>PrepForge</span></h4>
//           <form onSubmit={handleLogin}>
//             <div className="mb-3 input-group">
//               <span className="input-group-text bg-secondary text-white"><FaUser /></span>
//               <input
//                 type="text"
//                 className="form-control bg-dark text-light border-secondary"
//                 placeholder="Username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="mb-3 input-group">
//               <span className="input-group-text bg-secondary text-white"><FaLock /></span>
//               <input
//                 type="password"
//                 className="form-control bg-dark text-light border-secondary"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <button type="submit" className="btn btn-primary w-100">
//               Login
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;





import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Footer from '../components/Footer';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('token/', { username, password });
      const { access } = response.data;
      localStorage.setItem('accessToken', access);
      const decoded = jwtDecode(access);
      localStorage.setItem('user_id', decoded.user_id);
      alert('Login Successful! 🚀');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (

    <div style={{
      display: 'flex',
      flexDirection: 'column',
    //   minHeight: '100vh',
      backgroundColor: '#1e1e1e',
      marginTop: '250px'
    }}>
    <img
    src="/coder.svg"
    alt="logo"
    style={{
        width: '200px',
        height: '200px',
        margin: '0 auto 50px',
        display: 'block',
        position: 'relative',
        top: '-150px',
        marginBottom: '-100px'
    }}
    />

    <h2 style={{ textAlign: 'center', color: '#aaa', marginTop: '-10px', marginBottom:'50px' }}>
    Your personal interview prep space — smart, focused, and tailored to your role.
    </h2>
      <div style={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#2c2c2c',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>


          <h2 style={{ textAlign: 'center', color: 'white', marginBottom: '20px' }}>Login to PrepForge</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                marginBottom: '10px',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #555',
                backgroundColor: '#1a1a1a',
                color: 'white'
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                marginBottom: '10px',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #555',
                backgroundColor: '#1a1a1a',
                color: 'white'
              }}
            />
            <button type="submit" style={{
              padding: '10px',
              backgroundColor: '#6c63ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Login
            </button>
          </form>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
}

export default LoginPage;