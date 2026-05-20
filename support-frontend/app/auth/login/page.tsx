'use client';
import { Button, Container, Paper, PasswordInput, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import type { AxiosError } from 'axios';
import { useAuth } from '@/hooks/useAuth';
import classes from '../../../styles/Login.module.css';

export default function Login() {
  const { login, isPending, error } = useAuth();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email'),
      password: (v) => (v.length >= 6 ? null : 'Password must be at least 6 characters'),
    },
  });

  const errorMsg = (error as AxiosError<{ message: string }>)?.response?.data?.message;

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Support System Login
      </Title>

      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => login(values))}>
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            radius="md"
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            radius="md"
            {...form.getInputProps('password')}
          />

          {errorMsg && (
            <Text c="red" size="sm" mt="sm">
              {errorMsg}
            </Text>
          )}

          <Button type="submit" fullWidth mt="xl" radius="md" loading={isPending}>
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
