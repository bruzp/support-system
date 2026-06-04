import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import QueryProvider from '@/providers/QueryProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript nonce="8930c8b9" />
      </head>
      <body>
        <QueryProvider>
          <MantineProvider>
            <Notifications />
            {children}
          </MantineProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
