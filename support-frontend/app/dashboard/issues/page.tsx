import { TableSort } from './_components/Table';
import { Box, Title } from '@mantine/core';

export default function IssuesPage() {
  return (
    <Box>
      <Title order={2} fw={500} mb="md">Issues</Title>
      <TableSort />
    </Box>
  );
}
