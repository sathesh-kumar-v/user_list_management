import React, { useState, useEffect } from 'react'; // Import useEffect and useState
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/actions/authActions';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Import Ant Design components for UI
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Spin,
  Alert,
  Checkbox,
} from 'antd'; // Import Checkbox
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  // State to manage the "Remember Me" checkbox
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem('rememberMe') === 'true', // Initialize from localStorage
  );
  // State for the remembered email
  const [rememberedEmail, setRememberedEmail] = useState(
    localStorage.getItem('rememberedEmail') || '', // Initialize from localStorage
  );

  // Effect to update localStorage when rememberMe state changes
  useEffect(() => {
    if (rememberMe) {
      // If rememberMe is true, and there's a rememberedEmail, store it
      // This handles cases where user checks remember me *before* typing email
      // The actual email storing on successful login handles the current email
    } else {
      // If rememberMe is false, clear the remembered email from localStorage
      localStorage.removeItem('rememberedEmail');
    }
    // Always store the state of the rememberMe checkbox
    localStorage.setItem('rememberMe', rememberMe);
  }, [rememberMe]);

  // Handle form submission
  const handleSubmit = async (values) => {
    // If rememberMe is checked, store the current email
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', values.email);
    } else {
      // If not checked, remove any previously remembered email
      localStorage.removeItem('rememberedEmail');
    }

    const success = await dispatch(login(values.email, values.password));
    if (success) {
      navigate('/');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Card
        style={{ width: 400, boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}
        hoverable
      >
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
          Login
        </Title>
        <Formik
          // Set initial email value from rememberedEmail, default to reqres.in test email if none remembered
          initialValues={{
            email: rememberedEmail || 'eve.holt@reqres.in',
            password: 'cityslicka',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, errors, touched, getFieldProps }) => (
            <Form onFinish={handleSubmit} layout="vertical">
              <Form.Item
                label="Email"
                name="email"
                validateStatus={errors.email && touched.email ? 'error' : ''}
                help={errors.email && touched.email ? errors.email : ''}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Email"
                  {...getFieldProps('email')}
                />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                validateStatus={
                  errors.password && touched.password ? 'error' : ''
                }
                help={
                  errors.password && touched.password ? errors.password : ''
                }
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  {...getFieldProps('password')}
                />
              </Form.Item>

              {/* Remember Me Checkbox */}
              <Form.Item style={{ marginBottom: 0 }}>
                {' '}
                {/* Use Form.Item for proper Ant Design alignment */}
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                >
                  Remember me
                </Checkbox>
              </Form.Item>

              <Form.Item style={{ marginTop: 24 }}>
                {' '}
                {/* Add margin top to separate from checkbox */}
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                >
                  Log In
                </Button>
              </Form.Item>
              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  style={{ marginTop: 15 }}
                />
              )}
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default LoginPage;
