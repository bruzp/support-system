'use client';

import { Box, Text, Title } from '@mantine/core';

export default function DashboardPage() {
  return (
    <Box>
      <Title order={2} fw={500} mb={4}>Dashboard</Title>
      <Text c="dimmed" size="sm">
        Here you can manage your support tickets and view analytics.
      </Text>
    </Box>
  );
}