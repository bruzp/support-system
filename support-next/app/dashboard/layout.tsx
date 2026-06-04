'use client';

import { AppShell } from '@mantine/core';
import { ReactNode } from 'react';
import { NavbarSimple } from '../../components/layout/NavbarSimple';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AppShell
      padding="md"
      navbar={{
        width: 300,
        breakpoint: 'sm',
      }}
    >
      <AppShell.Navbar>
        <NavbarSimple />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
