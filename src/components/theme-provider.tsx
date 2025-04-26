import * as React from 'react';

interface ThemeProviderProps extends React.PropsWithChildren {}

export function ThemeProvider({children, ...props}: ThemeProviderProps) {
  return <>{children}</>;
}

