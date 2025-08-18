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
import { Story, Priority, TaskStatus } from '@/types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface StoryCardProps {
  story: Story;
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

export default function StoryCard({ story }: StoryCardProps) {
  const [expanded, setExpanded] = useState(false);

  const totalTasks = story.tasks?.length || 0;
  const completedTasks = story.tasks?.filter(task => task.completed).length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card sx={{ mb: 1, ml: 2, borderLeft: '3px solid', borderLeftColor: 'secondary.main' }}>
      <CardContent sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                📖 {story.title}
              </Typography>
              
              <Chip
                label={story.priority}
                size="small"
                color={priorityColors[story.priority]}
                variant="outlined"
              />
              
              <Chip
                label={story.status}
                size="small"
                color={statusColors[story.status]}
                variant="filled"
              />
            </Box>
            
            {story.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {story.description}
              </Typography>
            )}

            {totalTasks > 0 && (
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    작업 진행률: {completedTasks}/{totalTasks}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {progress.toFixed(0)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            )}
            
            <Typography variant="caption" color="text.secondary">
              생성일: {format(new Date(story.createdAt), 'MM월 dd일 HH:mm', { locale: ko })}
            </Typography>
          </Box>

          {totalTasks > 0 && (
            <IconButton size="small" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
        </Box>

        {totalTasks > 0 && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 1, pl: 1 }}>
              {story.tasks?.map((task) => (
                <Box key={task.id} sx={{ py: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ 
                    textDecoration: task.completed ? 'line-through' : 'none',
                    opacity: task.completed ? 0.6 : 1
                  }}>
                    {task.completed ? '✅' : '⏳'} {task.title}
                  </Typography>
                  <Chip
                    label={task.priority}
                    size="small"
                    color={priorityColors[task.priority]}
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.65rem' }}
                  />
                </Box>
              ))}
            </Box>
          </Collapse>
        )}
      </CardContent>
    </Card>
  );
}