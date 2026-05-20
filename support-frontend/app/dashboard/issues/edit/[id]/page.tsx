'use client';

import { format } from '@formkit/tempo';
import { Loader, Group, Paper, Title, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import type { AxiosError } from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { IssueUpdatePayload, useIssue, useUpdateIssue } from '@/hooks/useIssues';
import { UpdateIssueForm } from '../../_components/UpdateIssueForm';

export default function EditIssuePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const issueId = Number(params.id);

  const { data: issue, isLoading, isError } = useIssue(issueId);
  const { mutate: updateIssue, isPending } = useUpdateIssue(issueId);

  const form = useForm<IssueUpdatePayload>({
    initialValues: {
      title: '',
      description: '',
      priority: 'medium',
      category: 'general',
      status: 'open',

      is_escalated: false,

      escalated_at: null,
      acknowledged_at: null,
      resolved_at: null,
      due_at: null,

      summary: '',
      suggested_action: '',
    },

    validate: {
      title: (v) => (v.trim().length > 0 ? null : 'Title is required'),
      description: (v) => (v.trim().length > 0 ? null : 'Description is required'),
    },
  });

  // Pre-fill form once the issue loads
  useEffect(() => {
    if (issue) {
      form.setValues({
        title: issue.title,
        description: issue.description,
        priority: issue.priority,
        category: issue.category,
        status: issue.status,

        is_escalated: issue.is_escalated,

        escalated_at: issue.escalated_at ? new Date(issue.escalated_at) : null,

        acknowledged_at: issue.acknowledged_at ? new Date(issue.acknowledged_at) : null,

        resolved_at: issue.resolved_at ? new Date(issue.resolved_at) : null,

        due_at: issue.due_at ? new Date(issue.due_at) : null,

        summary: issue.summary?.summary ?? '',
        suggested_action: issue.summary?.suggested_action ?? '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issue]);

  const handleSubmit = (values: IssueUpdatePayload) => {
    const payload: IssueUpdatePayload = {
      ...values,

      escalated_at: values.escalated_at ? format(values.escalated_at, 'YYYY-MM-DD HH:mm:ss') : null,

      acknowledged_at: values.acknowledged_at
        ? format(values.acknowledged_at, 'YYYY-MM-DD HH:mm:ss')
        : null,

      resolved_at: values.resolved_at ? format(values.resolved_at, 'YYYY-MM-DD HH:mm:ss') : null,

      due_at: values.due_at ? format(values.due_at, 'YYYY-MM-DD HH:mm:ss') : null,
    };

    updateIssue(payload, {
      onSuccess: () => {
        notifications.show({ message: 'Issue updated successfully.', color: 'green' });
        router.push('/dashboard/issues');
      },
      onError: (err) => {
        const axiosErr = err as AxiosError<{ message: string }>;
        notifications.show({
          message: axiosErr.response?.data?.message ?? 'Failed to update issue.',
          color: 'red',
        });
      },
    });
  };

  if (isLoading) {
    return (
      <Group justify="center" py="xl">
        <Loader />
      </Group>
    );
  }

  if (isError || !issue) {
    return (
      <Text c="red" ta="center" py="xl">
        Issue not found or failed to load.
      </Text>
    );
  }

  return (
    <>
      <Title order={2} mb="lg">
        Edit Issue #{issue.id}
      </Title>
      <Paper withBorder shadow="xs" p="xl" radius="md">
        <UpdateIssueForm
          form={form}
          onSubmit={handleSubmit}
          isPending={isPending}
          submitLabel="Save Changes"
        />
      </Paper>
    </>
  );
}
