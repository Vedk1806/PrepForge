import React from 'react';

function Footer() {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '15px 0',
      backgroundColor: '#1e1e1e',
      color: '#aaa',
      fontSize: '14px',
      marginTop: 'auto'
    }}>
      © {new Date().getFullYear()} PrepForge. All rights reserved.
    </footer>
  );
}

export default Footer;
