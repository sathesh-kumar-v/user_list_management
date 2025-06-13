// src/components/UserModal.js

import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message, Spin, Alert } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, updateUser } from '../redux/actions/userActions';

// Define validation schema for the user form
const validationSchema = Yup.object().shape({
  first_name: Yup.string().required('First Name is required'),
  last_name: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  avatar: Yup.string().url('Invalid URL').required('Profile Image Link is required'),
});

const UserModal = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.users);
  const isEditing = !!user;

  useEffect(() => {
    console.log("UserModal received user prop:", user);
  }, [user]);

  const initialValues = {
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    avatar: user?.avatar || 'https://reqres.in/img/faces/3-image.jpg',
  };

  const handleSubmit = async (values) => {
    try {
      let actionResult;
      if (isEditing) {
        actionResult = await dispatch(updateUser(user.id, values));
      } else {
        actionResult = await dispatch(createUser(values));
      }

      if (actionResult && !actionResult.error) {
        message.success(`User ${isEditing ? 'updated' : 'created'} successfully!`);
        onClose();
      } else {
        message.error(actionResult?.message || error || 'An unknown error occurred.');
      }
    } catch (err) {
      console.error("Submission error:", err);
      message.error(error || 'An error occurred during submission.');
    }
  };

  return (
    <Modal
      title={isEditing ? 'Edit User' : 'Create New User'}
      open={true}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      maskClosable={!loading}
    >
      <Spin spinning={loading} tip="Submitting...">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ handleSubmit, errors, touched, getFieldProps, initialValues: formikInitialValues }) => { // <--- CORRECTED: Added initialValues to destructuring
            // You can now have statements here because we're using an explicit return block
            console.log("Formik's actual initialValues:", formikInitialValues);

            return ( // <--- CORRECTED: Explicit return
              <Form onFinish={handleSubmit} layout="vertical">
                <Form.Item
                  label="First Name"
                  name="first_name"
                  validateStatus={errors.first_name && touched.first_name ? 'error' : ''}
                  help={errors.first_name && touched.first_name ? errors.first_name : ''}
                  required
                >
                  <Input {...getFieldProps('first_name')} />
                </Form.Item>
                <Form.Item
                  label="Last Name"
                  name="last_name"
                  validateStatus={errors.last_name && touched.last_name ? 'error' : ''}
                  help={errors.last_name && touched.last_name ? errors.last_name : ''}
                  required
                >
                  <Input {...getFieldProps('last_name')} />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  validateStatus={errors.email && touched.email ? 'error' : ''}
                  help={errors.email && touched.email ? errors.email : ''}
                  required
                >
                  <Input {...getFieldProps('email')} />
                </Form.Item>
                <Form.Item
                  label="Profile Image Link"
                  name="avatar"
                  validateStatus={errors.avatar && touched.avatar ? 'error' : ''}
                  help={errors.avatar && touched.avatar ? errors.avatar : ''}
                  required
                >
                  <Input {...getFieldProps('avatar')} />
                </Form.Item>
                <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                  <Button onClick={onClose} style={{ marginRight: 8 }}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    {isEditing ? 'Update' : 'Create'}
                  </Button>
                </Form.Item>
                {error && <Alert message="Error" description={error} type="error" showIcon />}
              </Form>
            );
          }}
        </Formik>
      </Spin>
    </Modal>
  );
};

export default UserModal;