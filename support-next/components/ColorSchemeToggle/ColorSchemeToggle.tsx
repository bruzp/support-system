'use client';

import { Button, Group, useMantineColorScheme } from '@mantine/core';
import Link from 'next/link';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();

  return (
    <Group justify="center" mt="xl">
      <Button onClick={() => setColorScheme('light')}>Light</Button>
      <Button onClick={() => setColorScheme('dark')}>Dark</Button>
      <Button onClick={() => setColorScheme('auto')}>Auto</Button>
      <Button component={Link} href="/auth/login">
        Login
      </Button>
    </Group>
  );
}
