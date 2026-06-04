'use client';

import { Button, Group, Select, Stack, Textarea, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useUsers } from '@/hooks/useUsers';

type IssueFormProps<T extends Record<string, any>> = {
  form: UseFormReturnType<T>;
  onSubmit: (values: T) => void;
  isPending: boolean;
  submitLabel?: string;
  showUserId?: boolean;
}

export const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export const CATEGORY_OPTIONS = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature_request', label: 'Feature Request' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'security', label: 'Security' },
  { value: 'billing', label: 'Billing' },
  { value: 'general', label: 'General' },
];

export function IssueForm<T extends Record<string, any>>({
  form,
  onSubmit,
  isPending,
  submitLabel = 'Submit',
  showUserId = false,
}: IssueFormProps<T>) {
  const { data: users, isLoading: usersLoading } = useUsers();

  const userOptions = (users ?? []).map((u) => ({
    value: String(u.id),
    label: u.name,
  }));

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="md">
        {showUserId && (
          <Select
            label="User"
            placeholder="Select a user"
            data={userOptions}
            disabled={usersLoading}
            required
            value={form.values.user_id ? String(form.values.user_id) : null}
            onChange={(val) => form.setFieldValue('user_id' as any, (val ? Number(val) : 0) as any)}
            error={form.errors.user_id}
          />
        )}

        <TextInput
          label="Title"
          placeholder="Brief summary of the issue"
          required
          {...form.getInputProps('title')}
        />

        <Textarea
          label="Description"
          placeholder="Describe the issue in detail"
          required
          minRows={4}
          autosize
          {...form.getInputProps('description')}
        />

        <Group grow>
          <Select
            label="Priority"
            placeholder="Select priority"
            data={PRIORITY_OPTIONS}
            required
            {...form.getInputProps('priority')}
          />
          <Select
            label="Category"
            placeholder="Select category"
            data={CATEGORY_OPTIONS}
            required
            {...form.getInputProps('category')}
          />
          <Select
            label="Status"
            placeholder="Select status"
            data={STATUS_OPTIONS}
            required
            {...form.getInputProps('status')}
          />
        </Group>

        <Group justify="flex-end" mt="sm">
          <Button type="submit" loading={isPending}>
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
