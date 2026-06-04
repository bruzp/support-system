'use client';

import { Group } from '@mantine/core';
import { IconBellRinging, IconLogout, IconFileReport } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import classes from '../../styles/NavbarSimple.module.css';

const navItems = [
  { link: '/dashboard', label: 'Dashboard', icon: IconBellRinging },
  { link: '/dashboard/issues', label: 'Issues', icon: IconFileReport },
];

export function NavbarSimple() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const links = navItems.map((item) => {
    const isActive =
      item.link === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.link);

    return (
      <Link
        href={item.link}
        key={item.label}
        className={classes.link}
        data-active={isActive || undefined}
      >
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </Link>
    );
  });

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <h2>Support System</h2>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <button
          type="button"
          className={classes.link}
          onClick={logout}
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
