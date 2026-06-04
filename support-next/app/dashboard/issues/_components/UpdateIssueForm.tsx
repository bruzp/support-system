'use client';

import { Button, Checkbox, Group, Select, Stack, Textarea, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { UseFormReturnType } from '@mantine/form';
import { IssueStorePayload, IssueUpdatePayload } from '@/hooks/useIssues';
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS, STATUS_OPTIONS } from './IssueForm';

type IssueFormValues = IssueStorePayload | IssueUpdatePayload;

type IssueFormProps = {
  form: UseFormReturnType<any>;
  onSubmit: (values: IssueFormValues) => void;
  isPending: boolean;
  submitLabel?: string;
  showUserId?: boolean;
}

export function UpdateIssueForm({
  form,
  onSubmit,
  isPending,
  submitLabel = 'Submit',
  showUserId = false,
}: IssueFormProps) {
  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="md">
        {showUserId && (
          <TextInput
            label="User ID"
            placeholder="e.g. 1"
            required
            {...form.getInputProps('user_id')}
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

        <Checkbox
          label="Escalated"
          {...form.getInputProps('is_escalated', {
            type: 'checkbox',
          })}
        />

        <DateTimePicker
          withSeconds
          label="Escalated At"
          placeholder="Pick escalated date/time"
          {...form.getInputProps('escalated_at')}
        />

        <DateTimePicker
          withSeconds
          label="Acknowledged At"
          placeholder="Pick acknowledged date/time"
          {...form.getInputProps('acknowledged_at')}
        />

        <DateTimePicker
          withSeconds
          label="Resolved At"
          placeholder="Pick resolved date/time"
          {...form.getInputProps('resolved_at')}
        />

        <DateTimePicker
          withSeconds
          label="Due At"
          placeholder="Pick due date/time"
          {...form.getInputProps('due_at')}
        />

        <Textarea
          label="Summary"
          placeholder="Short issue summary"
          minRows={3}
          autosize
          {...form.getInputProps('summary')}
        />

        <Textarea
          label="Suggested Action"
          placeholder="Suggested resolution or action"
          minRows={3}
          autosize
          {...form.getInputProps('suggested_action')}
        />

        <Group justify="flex-end" mt="sm">
          <Button type="submit" loading={isPending}>
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
