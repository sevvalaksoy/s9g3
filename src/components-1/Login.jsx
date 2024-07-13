import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import axios from 'axios';

const initialForm = {
  email: '',
  password: '',
};

export default function Login() {
  const [form, setForm] = useState({
    ...initialForm,
    email: localStorage.getItem('email') || '',
  });

  const history = useHistory();

  const handleChange = (event) => {
    let { name, value, type } = event.target;
    value = type === 'checkbox' ? event.target.checked : value;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (form.email.length == 0 || form.password.length == 0) return;

    axios
      .get('https://6540a96145bedb25bfc247b4.mockapi.io/api/login')
      .then((res) => {
        const user = res.data.find(
          (item) => item.password == form.password && item.email == form.email
        );
        if (user) {
          localStorage.setItem('email', user.email);
          setForm(initialForm);
          history.push('/main');
          toast.success(`Merhaba ${user.name}, tekrar hoş geldin.`);
        } else {
          history.push('/error');
          toast.error('Girdiğiniz bilgilerle bir kullanıcı bulamadık.');
        }
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="exampleEmail">Email</Label>
        <Input
          autoFocus={localStorage.getItem('email') ? false : true}
          id="exampleEmail"
          name="email"
          placeholder="Enter your email"
          type="email"
          onChange={handleChange}
          value={form.email}
          data-testid="email-input"
        />
      </FormGroup>
      <FormGroup>
        <Label for="examplePassword">Password</Label>
        <Input
          autoFocus={localStorage.getItem('email') ? true : false}
          id="examplePassword"
          name="password"
          placeholder="Enter your password "
          type="password"
          onChange={handleChange}
          value={form.password}
          data-testid="password-input"
        />
      </FormGroup>
      <FormGroup className="text-center p-4">
        <Button
          disabled={form.email.length == 0 || form.password.length == 0}
          color="primary"
        >
          Sign In
        </Button>
      </FormGroup>
    </Form>
  );
}
