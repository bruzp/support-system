'use client';

import { Paper, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import type { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { IssueStorePayload, useCreateIssue } from '@/hooks/useIssues';
import { IssueForm } from '../_components/IssueForm';

export default function AddIssuePage() {
  const router = useRouter();
  const { mutate: createIssue, isPending } = useCreateIssue();

  const form = useForm<IssueStorePayload>({
    initialValues: {
      user_id: 0,
      title: '',
      description: '',
      priority: 'medium',
      category: 'general',
      status: 'open',
    },
    validate: {
      user_id: (v) => (v > 0 ? null : 'User ID is required'),
      title: (v) => (v.trim().length > 0 ? null : 'Title is required'),
      description: (v) => (v.trim().length > 0 ? null : 'Description is required'),
    },
  });

  const handleSubmit = (values: IssueStorePayload) => {
    createIssue(values, {
      onSuccess: () => {
        notifications.show({ message: 'Issue created successfully.', color: 'green' });
        router.push('/dashboard/issues');
      },
      onError: (err) => {
        const axiosErr = err as AxiosError<{ message: string }>;
        notifications.show({
          message: axiosErr.response?.data?.message ?? 'Failed to create issue.',
          color: 'red',
        });
      },
    });
  };

  return (
    <>
      <Title order={2} mb="lg">
        Add Issue
      </Title>
      <Paper withBorder shadow="xs" p="xl" radius="md">
        <IssueForm
          form={form}
          onSubmit={handleSubmit}
          isPending={isPending}
          submitLabel="Create Issue"
          showUserId
        />
      </Paper>
    </>
  );
}
