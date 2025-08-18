'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Collapse,
  LinearProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { Epic, Priority, TaskStatus } from '@/types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import StoryCard from './StoryCard';

interface EpicCardProps {
  epic: Epic;
}

const priorityColors: Record<Priority, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  LOW: 'default',
  MEDIUM: 'info',
  HIGH: 'warning',
  URGENT: 'error',
};

const statusColors: Record<TaskStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  TODO: 'default',
  IN_PROGRESS: 'primary',
  DONE: 'success',
  CANCELLED: 'error',
};

export default function EpicCard({ epic }: EpicCardProps) {
  const [expanded, setExpanded] = useState(false);

  const totalStories = epic.stories?.length || 0;
  const completedStories = epic.stories?.filter(story => story.status === 'DONE').length || 0;
  const progress = totalStories > 0 ? (completedStories / totalStories) * 100 : 0;

  const totalTasks = epic.stories?.reduce((sum, story) => sum + (story.tasks?.length || 0), 0) || 0;
  const completedTasks = epic.stories?.reduce((sum, story) => 
    sum + (story.tasks?.filter(task => task.completed).length || 0), 0) || 0;

  return (
    <Card sx={{ mb: 2, borderLeft: '4px solid', borderLeftColor: 'primary.main' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                📋 {epic.title}
              </Typography>
              
              <Chip
                label={epic.priority}
                size="small"
                color={priorityColors[epic.priority]}
                variant="outlined"
              />
              
              <Chip
                label={epic.status}
                size="small"
                color={statusColors[epic.status]}
                variant="filled"
              />
            </Box>
            
            {epic.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {epic.description}
              </Typography>
            )}

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  진행률: {completedStories}/{totalStories} 스토리 완료
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {progress.toFixed(0)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                📚 스토리: {totalStories}개
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ✅ 작업: {completedTasks}/{totalTasks}개 완료
              </Typography>
            </Box>
            
            <Typography variant="caption" color="text.secondary">
              생성일: {format(new Date(epic.createdAt), 'yyyy년 MM월 dd일', { locale: ko })}
            </Typography>
          </Box>

          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2, pl: 2, borderLeft: '2px solid', borderLeftColor: 'grey.300' }}>
            {epic.stories && epic.stories.length > 0 ? (
              epic.stories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                이 에픽에는 아직 스토리가 없습니다.
              </Typography>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}