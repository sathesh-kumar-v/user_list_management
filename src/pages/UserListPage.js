import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, deleteUser, setSearchQuery, setCurrentPage } from '../redux/actions/userActions';
import { logout } from '../redux/actions/authActions';
import UserModal from '../components/UserModal'; // Modal component for user creation/editing
import { useNavigate } from 'react-router-dom';
import '@ant-design/v5-patch-for-react-19';

// Import Ant Design components for UI layout, display, and interaction
import {
  Layout, Menu, theme, Input, Button, Table, Space, Avatar,
  Pagination, Card, Row, Col, Typography, Spin, Alert, Modal as AntdModal, Flex,
} from 'antd';
// Import Ant Design Icons
import {
  UserOutlined, SearchOutlined, PlusOutlined, TableOutlined, AppstoreOutlined,
  EditOutlined, DeleteOutlined, LogoutOutlined
} from '@ant-design/icons';

const { Header, Content } = Layout; // Destructure Layout components
const { Title, Text } = Typography; // Destructure Typography components
const { Search } = Input; // Destructure Search component from Input

const UserListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Select user-related states from Redux store
  const { users, loading, error, currentPage, totalPages, searchQuery } = useSelector((state) => state.users);

  // State for controlling the UserModal visibility and current user for editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Null for create, user object for edit
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card' view mode

  // Get Ant Design theme tokens for consistent styling
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Fetch users when the component mounts or current page changes
  useEffect(() => {
    dispatch(getUsers(currentPage));
  }, [dispatch, currentPage]);

  // Handle user logout
const handleLogout = () => {
  console.log("Logout button clicked. Attempting to show confirmation modal."); // <--- ADD THIS LINE
  AntdModal.confirm({
    title: 'Confirm Logout',
    content: 'Are you sure you want to log out?',
    onOk() {
      console.log("Modal OK clicked. Dispatching logout and navigating."); // <--- ADD THIS LINE
      dispatch(logout()); // Dispatch logout action
      navigate('/login'); // Redirect to login page
    },
    onCancel() { // Add onCancel to see if user cancels
      console.log("Modal Cancel clicked.");
    },
    okText: 'Logout',
    cancelText: 'Cancel',
  });
};

  // Open modal for creating a new user
  const handleCreateUser = () => {
    setCurrentUser(null); // Reset current user for creation
    setIsModalOpen(true); // Open the modal
  };

  // Open modal for editing an existing user
  const handleEditUser = (user) => {
    console.log("handleEditUser called with user:", user);
    setCurrentUser(user); // Set the user to be edited
    setIsModalOpen(true); // Open the modal
  };

  // Handle user deletion
  const handleDeleteUser = (id) => {
    // Use Ant Design's confirmation modal before deleting
    AntdModal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this user? This action cannot be undone.',
      onOk() { // Callback for 'OK' button
        dispatch(deleteUser(id)); // Dispatch delete user action
      },
      okText: 'Delete',
      okType: 'danger', // Make the OK button red for danger action
      cancelText: 'Cancel',
    });
  };

  // Handle search input change
  const handleSearch = (value) => {
    dispatch(setSearchQuery(value)); // Update search query in Redux store
  };

  // Handle pagination page change
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page)); // Update current page in Redux store
  };

  // Client-side search logic using useMemo for performance optimization
  const filteredUsers = useMemo(() => {
    if (!searchQuery) {
      return users; // If no search query, return all users
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    // Filter users by first_name or last_name (case-insensitive)
    return users.filter(user =>
      user.first_name?.toLowerCase().includes(lowerCaseQuery) ||
      user.last_name?.toLowerCase().includes(lowerCaseQuery)
    );
  }, [users, searchQuery]); // Recalculate only when users or searchQuery change


  // Define columns for Ant Design Table component
  const columns = [
    {
      title: '', // Empty header for avatar column
      dataIndex: 'avatar',
      key: 'avatar',
      render: (text) => <Avatar src={text} icon={<UserOutlined />} />, // Render avatar using Ant Design Avatar
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
      align: 'center',
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
      align: 'center',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => ( // Render action buttons for each row
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditUser(record)}>Edit</Button>
          <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleDeleteUser(record.id)}>Delete</Button>
        </Space>
      ),
      align: 'center',
    },
  ];

  return (
    // Ant Design Layout for overall page structure
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header of the page */}
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: '#001529' }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>Users</Title>
        <Space align="center"> {/* <--- ADD align="center" HERE */}
          {/* Search input with Ant Design Search component */}
          <Search
            placeholder="Search by name..."
            onSearch={handleSearch} // Trigger search on pressing Enter or clicking search icon
            onChange={(e) => dispatch(setSearchQuery(e.target.value))} // Update search query on input change
            style={{ width: 200 }}
            value={searchQuery} // Controlled component for search input
          />
          {/* Button to create a new user */}
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateUser}>Create User</Button>
          {/* Button to logout */}
          <Button type="default" icon={<LogoutOutlined />} onClick={handleLogout}>Logout</Button>
        </Space>
      </Header>
      {/* Main content area */}
      <Content style={{ margin: '24px 16px 0', padding: 24, minHeight: 280, background: colorBgContainer, borderRadius: borderRadiusLG }}>
        {/* Toggle buttons for view mode (Table/Card) */}
        <Space style={{ marginBottom: 16 }}>
          <Button
            type={viewMode === 'table' ? 'primary' : 'default'} // Highlight active view mode
            icon={<TableOutlined />}
            onClick={() => setViewMode('table')}
          >
            Table View
          </Button>
          <Button
            type={viewMode === 'card' ? 'primary' : 'default'}
            icon={<AppstoreOutlined />}
            onClick={() => setViewMode('card')}
          >
            Card View
          </Button>
        </Space>

        {/* Loading spinner */}
        {loading && <Spin tip="Loading users..." size="large" style={{ display: 'block', textAlign: 'center', marginTop: 50 }} />}
        {/* Error message display */}
        {error && <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: 15 }} />}

        {/* Render content only when not loading and no error */}
        {!loading && !error && (
          <>
            {/* Table View */}
            {viewMode === 'table' && (
              <Table
                columns={columns} // Table columns definition
                dataSource={filteredUsers} // Data to display in the table
                rowKey="id" // Unique key for each row
                pagination={false} // Disable Ant Design's built-in pagination as we use custom pagination
                loading={loading} // Show loading state if data is being fetched
              />
            )}

            {/* Card View */}
            {viewMode === 'card' && (
              <Row gutter={[16, 16]} style={{ marginTop: 20 }}> {/* Ant Design Grid Row with gutter */}
                {filteredUsers.map((user) => (
                  <Col xs={24} sm={12} md={8} lg={6} xl={4} key={user.id}> {/* Responsive Grid Column */}
                    <Card
                      hoverable
                      // Card cover showing user avatar
                      cover={
                        <Avatar
                          size={100}
                          src={user.avatar}
                          icon={<UserOutlined />}
                          style={{ margin: '20px auto 10px', display: 'block' }} // Center avatar
                        />
                      }
                      // Actions at the bottom of the card
                      actions={[
                        <Button type="link" icon={<EditOutlined />} onClick={() => handleEditUser(user)}>Edit</Button>,
                        <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeleteUser(user.id)}>Delete</Button>,
                      ]}
                    >
                      {/* Card meta section for title and description */}
                      <Card.Meta
                        title={<Title level={5} style={{ marginBottom: 0 }}>{user.first_name} {user.last_name}</Title>}
                        description={<Text type="secondary">{user.email}</Text>}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            )}

            {/* Pagination controls */}
            <Flex justify="end" style={{ marginTop: 20 }}>
            <Pagination
              current={currentPage} // Current active page
              pageSize={6} // Number of items per page (based on Reqres API default)
              total={totalPages * 6} // Total number of items (total_pages * items_per_page)
              onChange={handlePageChange} // Callback for page change
            /></Flex>
          </>
        )}

        {/* UserModal component, shown when isModalOpen is true */}
        {isModalOpen && (
          <UserModal
            user={currentUser} // Pass current user for editing, or null for creation
            onClose={() => setIsModalOpen(false)} // Callback to close the modal
          />
        )}
      </Content>
    </Layout>
  );
};

export default UserListPage;