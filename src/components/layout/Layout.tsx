'use client';

import { Box, Container } from '@mui/material';
import { ReactNode } from 'react';
import AppBar from './AppBar';

interface LayoutProps {
  children: ReactNode;
  onCreateTask?: () => void;
}

export default function Layout({ children, onCreateTask }: LayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar onCreateTask={onCreateTask} />
      <Container 
        maxWidth="lg" 
        sx={{ 
          flex: 1, 
          py: 3,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {children}
      </Container>
    </Box>
  );
}