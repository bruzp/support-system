'use client';

import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Loader,
  Modal,
  Pagination,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Issue,
  IssueFilters,
  IssuePriority,
  IssueStatus,
  useDeleteIssue,
  useIssues,
} from '@/hooks/useIssues';

const STATUS_COLOR: Record<IssueStatus, string> = {
  open: 'blue',
  in_progress: 'yellow',
  on_hold: 'orange',
  resolved: 'green',
  closed: 'gray',
};

const PRIORITY_COLOR: Record<IssuePriority, string> = {
  low: 'gray',
  medium: 'blue',
  high: 'orange',
  critical: 'red',
};

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const CATEGORY_OPTIONS = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature_request', label: 'Feature Request' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'security', label: 'Security' },
  { value: 'billing', label: 'Billing' },
  { value: 'general', label: 'General' },
];

export function TableSort() {
  const router = useRouter();

  const [filters, setFilters] = useState<IssueFilters>({
    page: 1,
  });

  const { data, isLoading, isError } = useIssues(filters);

  const issues = data?.data ?? [];
  const meta = data?.meta;

  const { mutate: deleteIssue, isPending: isDeleting } = useDeleteIssue();

  const [opened, { open, close }] = useDisclosure(false);
  const [targetIssue, setTargetIssue] = useState<Issue | null>(null);

  const handleDeleteClick = (issue: Issue) => {
    setTargetIssue(issue);
    open();
  };

  const handleDeleteConfirm = () => {
    if (!targetIssue) {
      return;
    }

    deleteIssue(targetIssue.id, {
      onSuccess: () => {
        notifications.show({
          message: 'Issue deleted.',
          color: 'green',
        });

        close();
      },

      onError: () => {
        notifications.show({
          message: 'Failed to delete issue.',
          color: 'red',
        });

        close();
      },
    });
  };

  const setFilter = (key: keyof IssueFilters) => (value: string | null) =>
    setFilters((prev) => ({
      ...prev,
      page: 1,
      [key]: value,
    }));

  const rows = issues.map((issue) => (
    <Table.Tr key={issue.id}>
      <Table.Td>{issue.id}</Table.Td>

      <Table.Td>{issue.title}</Table.Td>

      <Table.Td>
        <Badge color={PRIORITY_COLOR[issue.priority]} variant="light">
          {issue.priority}
        </Badge>
      </Table.Td>

      <Table.Td>
        <Badge color={STATUS_COLOR[issue.status]} variant="light">
          {issue.status.replace('_', ' ')}
        </Badge>
      </Table.Td>

      <Table.Td style={{ textTransform: 'capitalize' }}>
        {issue.category.replace('_', ' ')}
      </Table.Td>

      <Table.Td>{issue.user?.name || ''}</Table.Td>

      <Table.Td>
        <Group gap="xs" justify="center">
          <Tooltip label="Edit">
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => router.push(`/dashboard/issues/edit/${issue.id}`)}
            >
              <IconEdit size={16} stroke={1.5} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Delete">
            <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteClick(issue)}>
              <IconTrash size={16} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Modal opened={opened} onClose={close} title="Delete issue" centered>
        <Stack>
          <Text size="sm">
            Are you sure you want to delete <strong>{targetIssue?.title}</strong>?
          </Text>

          <Group justify="flex-end">
            <Button variant="default" onClick={close} disabled={isDeleting}>
              Cancel
            </Button>

            <Button color="red" onClick={handleDeleteConfirm} loading={isDeleting}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>

      <ScrollArea>
        <Group mb="md" align="flex-end">
          <Select
            placeholder="All statuses"
            data={STATUS_OPTIONS}
            value={filters.status ?? null}
            onChange={setFilter('status')}
            clearable
            style={{ flex: 1 }}
          />

          <Select
            placeholder="All priorities"
            data={PRIORITY_OPTIONS}
            value={filters.priority ?? null}
            onChange={setFilter('priority')}
            clearable
            style={{ flex: 1 }}
          />

          <Select
            placeholder="All categories"
            data={CATEGORY_OPTIONS}
            value={filters.category ?? null}
            onChange={setFilter('category')}
            clearable
            style={{ flex: 1 }}
          />

          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => router.push('/dashboard/issues/add')}
          >
            Add
          </Button>
        </Group>

        {isLoading && (
          <Group justify="center" py="xl">
            <Loader />
          </Group>
        )}

        {isError && (
          <Text c="red" ta="center" py="xl">
            Failed to load issues.
          </Text>
        )}

        {!isLoading && !isError && (
          <>
            <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ width: 60 }}>ID</Table.Th>

                  <Table.Th>Title</Table.Th>

                  <Table.Th style={{ width: 110 }}>Priority</Table.Th>

                  <Table.Th style={{ width: 130 }}>Status</Table.Th>

                  <Table.Th style={{ width: 140 }}>Category</Table.Th>

                  <Table.Th style={{ width: 140 }}>Created By</Table.Th>

                  <Table.Th
                    style={{
                      width: 100,
                      textAlign: 'center',
                    }}
                  >
                    Actions
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {rows.length > 0 ? (
                  rows
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={6}>
                      <Text fw={500} ta="center">
                        No issues found
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>

            <Group justify="center" mt="lg">
              <Pagination
                total={meta?.last_page ?? 1}
                value={meta?.current_page ?? 1}
                onChange={(page) =>
                  setFilters((prev) => ({
                    ...prev,
                    page,
                  }))
                }
              />
            </Group>
          </>
        )}
      </ScrollArea>
    </>
  );
}
