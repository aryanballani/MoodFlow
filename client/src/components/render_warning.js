import React, { useEffect, useState } from 'react';
import { userService } from '../services/api';
import '../styles/render_warning.css';

const RenderWarning = () => {
  const [backendDead, setBackendDead] = useState(false);

  useEffect(() => {
    userService.getProfile()
      .then(() => setBackendDead(false))
      .catch(() => setBackendDead(true));
  }, []);

  if (!backendDead) return null;

  return (
    <div className="render-warning-banner">
      Note: The backend is hosted on Render and may take up to 30 seconds to wake up. We are spinning up a new instance for you. Thank you for your patience!
    </div>
  );
};

export default RenderWarning;
