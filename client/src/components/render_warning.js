import React, { useEffect, useState } from 'react';
import { userService } from '../services/api';

const RenderWarning = () => {
  const [backendDead, setBackendDead] = useState(false);

  useEffect(() => {
    userService.getProfile()
      .then(() => setBackendDead(false))
      .catch(() => setBackendDead(true));
  }, []);

  if (!backendDead) return null;

  return (
    <>
    <div style={{
      background: '#fff3cd',
      color: '#856404',
      padding: '10px',
      textAlign: 'center',
      borderBottom: '1px solid #ffeeba',
      fontSize: '1rem',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 9999
    }}>
      Note: The backend is hosted on Render and may take up to 30 seconds to wake up. We are spinning up a new instance for you. Thank you for your patience!
    </div>
  </>
  );
};

export default RenderWarning;
