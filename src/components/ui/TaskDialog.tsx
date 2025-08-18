'use client';

import {
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
  Box,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Task, Priority, TaskStatus, Story } from '@/types';

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => void;
  task?: Task | null;
  title: string;
}

const priorities: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'];

const priorityLabels: Record<Priority, string> = {
  LOW: '낮음',
  MEDIUM: '보통',
  HIGH: '높음',
  URGENT: '긴급',
};

const statusLabels: Record<TaskStatus, string> = {
  TODO: '할 일',
  IN_PROGRESS: '진행 중',
  DONE: '완료',
  CANCELLED: '취소',
};

export default function TaskDialog({ open, onClose, onSave, task, title }: TaskDialogProps) {
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [storyId, setStoryId] = useState('');
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    if (task) {
      setTaskTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setStatus(task.status);
      setStoryId(task.storyId || '');
    } else {
      setTaskTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setStatus('TODO');
      setStoryId('');
    }
  }, [task, open]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/stories');
        if (response.ok) {
          const data = await response.json();
          setStories(data);
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    if (open) {
      fetchStories();
    }
  }, [open]);

  const handleSave = () => {
    if (!taskTitle.trim()) return;

    onSave({
      title: taskTitle.trim(),
      description: description.trim() || undefined,
      priority,
      status,
      storyId: storyId || undefined,
    });

    handleClose();
  };

  const handleClose = () => {
    setTaskTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setStatus('TODO');
    setStoryId('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            autoFocus
            label="작업 제목"
            fullWidth
            variant="outlined"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
          />
          
          <TextField
            label="설명"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>우선순위</InputLabel>
              <Select
                value={priority}
                label="우선순위"
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                {priorities.map((p) => (
                  <MenuItem key={p} value={p}>
                    {priorityLabels[p]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>상태</InputLabel>
              <Select
                value={status}
                label="상태"
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                {statuses.map((s) => (
                  <MenuItem key={s} value={s}>
                    {statusLabels[s]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <FormControl fullWidth>
            <InputLabel>소속 Story</InputLabel>
            <Select
              value={storyId}
              label="소속 Story"
              onChange={(e) => setStoryId(e.target.value)}
            >
              <MenuItem value="">없음 (독립 작업)</MenuItem>
              {stories.map((story) => (
                <MenuItem key={story.id} value={story.id}>
                  {story.title} {story.epic && `(Epic: ${story.epic.title})`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={!taskTitle.trim()}
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}