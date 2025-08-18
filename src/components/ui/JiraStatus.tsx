'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  CloudSync as SyncIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface JiraProject {
  id: string;
  key: string;
  name: string;
}

interface JiraStatusData {
  configured: boolean;
  projects?: JiraProject[];
  domain?: string;
  error?: string;
  details?: string;
  message?: string;
}

interface JiraStatusProps {
  taskId?: string;
  showSyncButton?: boolean;
}

export default function JiraStatus({ taskId, showSyncButton = false }: JiraStatusProps) {
  const [status, setStatus] = useState<JiraStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const fetchJiraStatus = async () => {
    try {
      const response = await fetch('/api/jira/sync');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error fetching Jira status:', error);
      setStatus({
        configured: false,
        error: 'Failed to check Jira configuration',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJiraStatus();
  }, []);

  const handleSync = async (action: string) => {
    if (!taskId) return;

    setSyncing(true);
    try {
      const response = await fetch('/api/jira/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, action }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`성공적으로 Jira에 동기화되었습니다! Jira Key: ${result.jiraKey}`);
      } else {
        const error = await response.json();
        alert(`동기화 실패: ${error.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error syncing to Jira:', error);
      alert('동기화 중 오류가 발생했습니다.');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} />
            <Typography variant="body2">Jira 연동 상태 확인 중...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {status?.configured ? (
                  <>
                    <CheckIcon color="success" />
                    <Typography variant="h6">Jira 연동됨</Typography>
                    <Chip 
                      label={status.domain} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </>
                ) : (
                  <>
                    <ErrorIcon color="error" />
                    <Typography variant="h6">Jira 연동 안됨</Typography>
                  </>
                )}
              </Box>

              <Button
                size="small"
                variant="outlined"
                startIcon={<InfoIcon />}
                onClick={() => setShowDetails(true)}
              >
                상세 정보
              </Button>
            </Box>

            {showSyncButton && status?.configured && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={syncing ? <CircularProgress size={16} /> : <SyncIcon />}
                  onClick={() => handleSync('create_task')}
                  disabled={syncing}
                >
                  Task 동기화
                </Button>
              </Box>
            )}
          </Box>

          {!status?.configured && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {status?.message || status?.error || 'Jira 연동이 설정되지 않았습니다.'}
            </Alert>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDetails} onClose={() => setShowDetails(false)} maxWidth="md" fullWidth>
        <DialogTitle>Jira 연동 상태</DialogTitle>
        <DialogContent>
          {status?.configured ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                연결된 Jira 인스턴스
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                도메인: {status.domain}
              </Typography>

              {status.projects && status.projects.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                    사용 가능한 프로젝트 (상위 5개)
                  </Typography>
                  <List dense>
                    {status.projects.map((project) => (
                      <ListItem key={project.id}>
                        <ListItemText
                          primary={project.name}
                          secondary={`Key: ${project.key}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              <Alert severity="info" sx={{ mt: 2 }}>
                Jira 연동이 활성화되어 있습니다. 작업을 Jira로 동기화할 수 있습니다.
              </Alert>
            </Box>
          ) : (
            <Box>
              <Alert severity="error" sx={{ mb: 2 }}>
                {status?.error || 'Jira 연동 설정이 완료되지 않았습니다.'}
              </Alert>

              <Typography variant="h6" gutterBottom>
                설정 방법
              </Typography>
              <Typography variant="body2" component="div">
                1. Jira 계정에서 API 토큰을 생성하세요:<br />
                <code>https://id.atlassian.com/manage-profile/security/api-tokens</code>
                <br /><br />
                2. 환경 변수를 설정하세요:
                <Box component="pre" sx={{ backgroundColor: 'grey.100', p: 2, mt: 1, borderRadius: 1 }}>
{`JIRA_DOMAIN=your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-api-token`}
                </Box>
              </Typography>

              {status?.details && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <strong>상세 오류:</strong> {status.details}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}