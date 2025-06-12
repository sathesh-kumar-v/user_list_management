import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';

const UserList = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome to User List Page!</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default UserList;
