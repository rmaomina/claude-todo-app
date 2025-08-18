'use client';

import { AppBar as MuiAppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { Add as AddIcon, ExitToApp as LogoutIcon, AccountTree as HierarchyIcon, List as TasksIcon } from '@mui/icons-material';

interface AppBarProps {
  onCreateTask?: () => void;
}

export default function AppBar({ onCreateTask }: AppBarProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <MuiAppBar position="static" elevation={0} sx={{ backgroundColor: 'primary.main' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 500 }}>
          Claude Todo App
        </Typography>
        
        {session && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              color="inherit"
              startIcon={<TasksIcon />}
              onClick={() => router.push('/')}
              sx={{ 
                backgroundColor: pathname === '/' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: 'white' 
              }}
            >
              작업 목록
            </Button>
            
            <Button
              color="inherit"
              startIcon={<HierarchyIcon />}
              onClick={() => router.push('/hierarchy')}
              sx={{ 
                backgroundColor: pathname === '/hierarchy' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: 'white' 
              }}
            >
              계층 구조
            </Button>

            {onCreateTask && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={onCreateTask}
                sx={{ backgroundColor: 'white', color: 'primary.main', '&:hover': { backgroundColor: 'grey.100' } }}
              >
                새 작업
              </Button>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar 
                src={session.user?.image || undefined} 
                alt={session.user?.name || 'User'}
                sx={{ width: 32, height: 32 }}
              />
              <Typography variant="body2" sx={{ color: 'white' }}>
                {session.user?.name}
              </Typography>
            </Box>
            
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ color: 'white' }}
            >
              로그아웃
            </Button>
          </Box>
        )}
      </Toolbar>
    </MuiAppBar>
  );
}