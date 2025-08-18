'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Typography, CircularProgress, Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import Layout from '@/components/layout/Layout';
import TaskCard from '@/components/ui/TaskCard';
import TaskDialog from '@/components/ui/TaskDialog';
import JiraStatus from '@/components/ui/JiraStatus';
import { Task } from '@/types';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
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
    
    fetchTasks();
  }, [session, status, router]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (editingTask) {
        const response = await fetch(`/api/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });
        
        if (response.ok) {
          const updatedTask = await response.json();
          setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t));
        }
      } else {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });
        
        if (response.ok) {
          const newTask = await response.json();
          setTasks([newTask, ...tasks]);
        }
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          completed,
          status: completed ? 'DONE' : 'TODO'
        }),
      });
      
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setTasks(tasks.filter(t => t.id !== taskId));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
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
    <Layout onCreateTask={handleCreateTask}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          내 작업 목록
        </Typography>
        
        <JiraStatus />
        
        {tasks.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              color: 'text.secondary',
            }}
          >
            <Typography variant="h6" gutterBottom>
              작업이 없습니다
            </Typography>
            <Typography variant="body2">
              새 작업을 추가하여 시작하세요!
            </Typography>
          </Box>
        ) : (
          <Box>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </Box>
        )}
      </Box>

      <Fab
        color="primary"
        aria-label="add task"
        onClick={handleCreateTask}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
      >
        <AddIcon />
      </Fab>

      <TaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
        title={editingTask ? '작업 수정' : '새 작업 추가'}
      />
    </Layout>
  );
}