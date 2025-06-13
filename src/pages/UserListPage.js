import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, deleteUser, setSearchQuery, setCurrentPage} from '../redux/actions/userActions';
import { logout } from '../redux/actions/authActions';
import UserModal from '../components/UserModal';
import { useNavigate } from 'react-router-dom';
import '@ant-design/v5-patch-for-react-19';
import './UserListPage.css';
import { Layout, theme, Input, Button, Table, Space, Avatar, Pagination, Card, Row, Col, Typography, Spin, Alert, Modal as AntdModal, Flex,} from 'antd';
import { UserOutlined, PlusOutlined, TableOutlined, AppstoreOutlined, EditOutlined, DeleteOutlined, LogoutOutlined,} from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

const UserListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error, currentPage, totalPages, searchQuery } =
    useSelector((state) => state.users);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [viewMode, setViewMode] = useState('table');

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    dispatch(getUsers(currentPage));
  }, [dispatch, currentPage]);

  const handleLogout = () => {
    AntdModal.confirm({
      title: 'Confirm Logout',
      content: 'Are you sure you want to log out?',
      onOk() {
        dispatch(logout());
        navigate('/login');
      },
      onCancel() {
        console.log('Modal Cancel clicked.');
      },
      okText: 'Logout',
      cancelText: 'Cancel',
    });
  };

  const handleCreateUser = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    console.log('handleEditUser called with user:', user);
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (id) => {
    AntdModal.confirm({
      title: 'Confirm Delete',
      content:
        'Are you sure you want to delete this user? This action cannot be undone.',
      onOk() {
        dispatch(deleteUser(id));
      },
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
    });
  };

  const handleSearch = (value) => {
    dispatch(setSearchQuery(value));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery) {
      return users;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.first_name?.toLowerCase().includes(lowerCaseQuery) ||
        user.last_name?.toLowerCase().includes(lowerCaseQuery),
    );
  }, [users, searchQuery]);

  const columns = [
    {
      title: '',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (text) => <Avatar src={text} icon={<UserOutlined />} />,
      align: 'center',
      width: 250,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'left',
      width: 300,
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
      align: 'left',
      width: 300,
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
      align: 'left',
      width: 300,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
      align: 'left',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 24px',
          background: '#001529',
        }}
      >
        <Space align="center">
          <Text style={{ color: 'white', marginRight: 8 }}>Elon Musk</Text>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            shape="circle"
            style={{ marginLeft: 8 }}
          />
        </Space>
      </Header>

      {/* Main content area */}
      <Content
        style={{
          margin: '24px 16px 0',
          padding: 24,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: 20 }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Users
          </Title>
          <Space>
            <Search
              placeholder="Search by name..."
              onSearch={handleSearch}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              style={{ width: 200 }}
              value={searchQuery}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateUser}
            >
              Create User
            </Button>
          </Space>
        </Flex>

        <Space style={{ marginBottom: 16 }}>
          <Button
            type={viewMode === 'table' ? 'primary' : 'default'}
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

        {loading && (
          <Spin
            tip="Loading users..."
            size="large"
            style={{ display: 'block', textAlign: 'left', marginTop: 50 }}
          />
        )}
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 15 }}
          />
        )}

        {!loading && !error && (
          <>
            {viewMode === 'table' && (
              <Table
                columns={columns}
                dataSource={filteredUsers}
                rowKey="id"
                pagination={false}
                loading={loading}
              />
            )}

            {viewMode === 'card' && (
              <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                {filteredUsers.map((user) => (
                  <Col xs={24} sm={12} md={8} lg={6} xl={4} key={user.id}>
                    <div className="user-card-wrapper">
                      <Card
                        hoverable
                        className="user-card"
                        cover={
                          <div className="avatar-container">
                            <Avatar
                              size={100}
                              src={user.avatar}
                              icon={<UserOutlined />}
                              style={{
                                display: 'block',
                                margin: '20px auto 10px',
                              }}
                            />
                          </div>
                        }
                      >
                        <div className="user-card-actions">
                          <Button
                            shape="circle"
                            size="large"
                            type="primary"
                            icon={<EditOutlined />}
                            className="edit-icon"
                            style={{
                              backgroundColor: '#40a9ff',
                              borderColor: '#40a9ff',
                              color: 'white',
                              boxShadow: '0 0 8px rgba(64, 169, 255, 0.6)',
                            }}
                            onClick={() => handleEditUser(user)}
                          />
                          <Button
                            shape="circle"
                            size="large"
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            className="delete-icon"
                            style={{
                              backgroundColor: '#ff4d4f',
                              borderColor: '#ff4d4f',
                              color: 'white',
                              boxShadow: '0 0 8px rgba(255, 77, 79, 0.6)',
                            }}
                            onClick={() => handleDeleteUser(user.id)}
                          />
                        </div>

                        <Card.Meta
                          title={
                            <Title
                              level={5}
                              style={{ marginBottom: 0, textAlign: 'center' }}
                            >
                              {user.first_name} {user.last_name}
                            </Title>
                          }
                          description={
                            <Text
                              type="secondary"
                              style={{ display: 'block', textAlign: 'center' }}
                            >
                              {user.email}
                            </Text>
                          }
                        />
                      </Card>
                    </div>
                  </Col>
                ))}
              </Row>
            )}

            <Flex justify="end" style={{ marginTop: 20 }}>
              <Pagination
                current={currentPage}
                pageSize={6}
                total={totalPages * 6}
                onChange={handlePageChange}
              />
            </Flex>
          </>
        )}

        {isModalOpen && (
          <UserModal user={currentUser} onClose={() => setIsModalOpen(false)} />
        )}
      </Content>
    </Layout>
  );
};

export default UserListPage;
