'use client';

import {
  Card,
  CardContent,
  Typography,
  Checkbox,
  IconButton,
  Box,
  Chip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudSync as SyncIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { Task, Priority, TaskStatus } from '@/types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
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

export default function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(task);
    handleClose();
  };

  const handleDelete = () => {
    onDelete(task.id);
    handleClose();
  };

  const handleSync = async () => {
    try {
      const response = await fetch('/api/jira/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: task.id, action: 'create_task' }),
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
    }
    handleClose();
  };

  return (
    <Card
      sx={{
        mb: 2,
        opacity: task.completed ? 0.7 : 1,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Checkbox
            checked={task.completed}
            onChange={(e) => onToggleComplete(task.id, e.target.checked)}
            sx={{ mt: -1 }}
          />
          
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  flex: 1,
                }}
              >
                {task.title}
              </Typography>
              
              <Chip
                label={task.priority}
                size="small"
                color={priorityColors[task.priority]}
                variant="outlined"
              />
              
              <Chip
                label={task.status}
                size="small"
                color={statusColors[task.status]}
                variant="filled"
              />
            </Box>
            
            {task.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  textDecoration: task.completed ? 'line-through' : 'none',
                }}
              >
                {task.description}
              </Typography>
            )}
            
            <Typography variant="caption" color="text.secondary">
              생성일: {format(new Date(task.createdAt), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
            </Typography>
          </Box>
          
          <IconButton onClick={handleClick} size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>
      </CardContent>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          수정
        </MenuItem>
        <MenuItem onClick={handleSync}>
          <SyncIcon sx={{ mr: 1 }} fontSize="small" />
          Jira 동기화
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          삭제
        </MenuItem>
      </Menu>
    </Card>
  );
}