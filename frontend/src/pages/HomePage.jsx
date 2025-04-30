// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import API from '../services/api';

// function HomePage() {
//   const [roles, setRoles] = useState([]);

//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const response = await API.get('roles/');
//         setRoles(response.data);
//       } catch (error) {
//         console.error('Error fetching roles:', error);
//       }
//     };

//     fetchRoles();
//   }, []);

//   return (
//     <div style={{
//       height: '100vh', // Ensures the container fits the viewport
//       display: 'flex',
//       flexDirection: 'column',
//       backgroundColor: '#1e1e1e',
//       color: 'white'
//     }}>
//       <div style={{
//         flexGrow: 1,
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 0, // Remove padding to avoid overflow
//         height: '100%' // Ensure this fills the parent
//       }}>
//         <div style={{
//           width: '100%',
//           maxWidth: '800px',
//           textAlign: 'center'
//         }}>
//           <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
//             Welcome to PrepForge
//           </h1>
//           <h2 style={{ marginBottom: '20px' }}>Available Roles</h2>
//           {/* <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
//             {roles.map((role) => (
//               <li key={role.id} style={{ margin: '10px 0' }}>
//                 <Link to={`/questions/${role.id}`} style={{ textDecoration: 'none', color: '#6c63ff' }}>
//                   {role.name}
//                 </Link>
//               </li>
//             ))}
//           </ul> */}
//           <select
//             onChange={(e) => {
//             const selectedRoleId = e.target.value;
//             if (selectedRoleId) navigate(`/questions/${selectedRoleId}`);
//             }}
//                 defaultValue=""
//                  style={{ padding: '10px', borderRadius: '5px' }}
//          >
//         <option value="" disabled>Select a Role</option>
//         {roles.map((role) => (
//             <option key={role.id} value={role.id}>
//             {role.name}
//             </option>
//         ))}
//         </select>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default HomePage;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function HomePage() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await API.get('roles/');
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1e1e1e',
      color: 'white'
    }}>
      <div style={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        height: '100%'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '800px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
            Welcome to PrepForge
          </h1>
          <h2 style={{ marginBottom: '20px' }}>Available Roles</h2>

          <select
            onChange={(e) => setSelectedRole(e.target.value)}
            value={selectedRole}
            style={{ padding: '10px', borderRadius: '5px', marginBottom: '15px', minWidth: '200px' }}
          >
            <option value="" disabled>Select a Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>

          {selectedRole && (
            <div>
              <button
                onClick={() => navigate(`/questions/${selectedRole}`)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c63ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Proceed
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default HomePage;
