'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Fab, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import Layout from '@/components/layout/Layout';
import EpicCard from '@/components/ui/EpicCard';
import { Epic, Story, Priority } from '@/types';

export default function HierarchyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [epics, setEpics] = useState<Epic[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createType, setCreateType] = useState<'epic' | 'story'>('epic');
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [selectedEpicId, setSelectedEpicId] = useState('');

  const fetchData = async () => {
    try {
      const [epicsResponse, storiesResponse] = await Promise.all([
        fetch('/api/epics'),
        fetch('/api/stories'),
      ]);

      if (epicsResponse.ok && storiesResponse.ok) {
        const [epicsData, storiesData] = await Promise.all([
          epicsResponse.json(),
          storiesResponse.json(),
        ]);
        setEpics(epicsData);
        setStories(storiesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    fetchData();
  }, [session, status, router]);

  const handleCreate = () => {
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setSelectedEpicId('');
    setCreateDialogOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    try {
      const endpoint = createType === 'epic' ? '/api/epics' : '/api/stories';
      const body = createType === 'epic' 
        ? { title: title.trim(), description: description.trim() || undefined, priority }
        : { title: title.trim(), description: description.trim() || undefined, priority, epicId: selectedEpicId || undefined };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const newItem = await response.json();
        
        if (createType === 'epic') {
          setEpics([newItem, ...epics]);
        } else {
          setStories([newItem, ...stories]);
          // Epic의 stories 배열도 업데이트
          if (selectedEpicId) {
            setEpics(epics.map(epic => 
              epic.id === selectedEpicId 
                ? { ...epic, stories: [...(epic.stories || []), newItem] }
                : epic
            ));
          }
        }
        
        setCreateDialogOpen(false);
      }
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  if (status === 'loading' || loading || !session) {
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
    <Layout>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          프로젝트 계층 구조
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          Epic → Story → Task 계층으로 프로젝트를 체계적으로 관리하세요. 
          각 Epic은 여러 Story를 포함하고, 각 Story는 여러 Task를 포함할 수 있습니다.
        </Alert>

        {epics.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              color: 'text.secondary',
            }}
          >
            <Typography variant="h6" gutterBottom>
              아직 생성된 Epic이 없습니다
            </Typography>
            <Typography variant="body2">
              새 Epic을 추가하여 프로젝트 구조를 만들어보세요!
            </Typography>
          </Box>
        ) : (
          <Box>
            {epics.map((epic) => (
              <EpicCard key={epic.id} epic={epic} />
            ))}
          </Box>
        )}

        <Fab
          color="primary"
          aria-label="create epic or story"
          onClick={handleCreate}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
        >
          <AddIcon />
        </Fab>

        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>새 {createType === 'epic' ? 'Epic' : 'Story'} 생성</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>생성할 항목</InputLabel>
                <Select
                  value={createType}
                  label="생성할 항목"
                  onChange={(e) => setCreateType(e.target.value as 'epic' | 'story')}
                >
                  <MenuItem value="epic">Epic (대규모 기능)</MenuItem>
                  <MenuItem value="story">Story (기능 단위)</MenuItem>
                </Select>
              </FormControl>

              <TextField
                autoFocus
                label="제목"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              
              <TextField
                label="설명"
                fullWidth
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              
              <FormControl fullWidth>
                <InputLabel>우선순위</InputLabel>
                <Select
                  value={priority}
                  label="우선순위"
                  onChange={(e) => setPriority(e.target.value as Priority)}
                >
                  <MenuItem value="LOW">낮음</MenuItem>
                  <MenuItem value="MEDIUM">보통</MenuItem>
                  <MenuItem value="HIGH">높음</MenuItem>
                  <MenuItem value="URGENT">긴급</MenuItem>
                </Select>
              </FormControl>

              {createType === 'story' && (
                <FormControl fullWidth>
                  <InputLabel>소속 Epic</InputLabel>
                  <Select
                    value={selectedEpicId}
                    label="소속 Epic"
                    onChange={(e) => setSelectedEpicId(e.target.value)}
                  >
                    <MenuItem value="">없음 (독립 Story)</MenuItem>
                    {epics.map((epic) => (
                      <MenuItem key={epic.id} value={epic.id}>
                        {epic.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>취소</Button>
            <Button 
              onClick={handleSave} 
              variant="contained" 
              disabled={!title.trim()}
            >
              생성
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}