'use client';

import { signIn, getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { GitHub as GitHubIcon } from '@mui/icons-material';

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push('/');
      } else {
        setChecking(false);
      }
    };
    
    checkSession();
  }, [router]);

  const handleGitHubSignIn = async () => {
    setLoading(true);
    try {
      await signIn('github', { callbackUrl: '/' });
    } catch (error) {
      console.error('Sign in error:', error);
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Claude Todo App
              </Typography>
              <Typography variant="body1" color="text.secondary">
                GitHub 계정으로 로그인하여 작업 관리를 시작하세요
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <GitHubIcon />}
              onClick={handleGitHubSignIn}
              disabled={loading}
              sx={{
                backgroundColor: '#24292e',
                color: 'white',
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#1a1e22',
                },
                '&:disabled': {
                  backgroundColor: '#6c757d',
                },
              }}
            >
              {loading ? '로그인 중...' : 'GitHub으로 로그인'}
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                로그인하면 서비스 이용약관과 개인정보 처리방침에 동의하는 것으로 간주됩니다.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}