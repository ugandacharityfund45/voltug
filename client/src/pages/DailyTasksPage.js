import React, { useEffect, useState } from 'react';
import { getDailyTasks, completeTask } from '../services/dailyTaskService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../styles/DailyTasksPage.css';

const TOTAL_TASKS = 16;
const TASKS_PER_PAGE = 2;

const DailyTasksPage = ({ onNavigate }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const { user, setUser } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getDailyTasks();
        const fetchedTasks = Array.isArray(data.tasks) ? data.tasks : [];

        if (fetchedTasks.length < TOTAL_TASKS) {
          toast.info('Some tasks are missing.');
        }

        setTasks(fetchedTasks);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    if (tasks.length === 0) return;

    const currentTasks = tasks.slice(
      pageIndex * TASKS_PER_PAGE,
      pageIndex * TASKS_PER_PAGE + TASKS_PER_PAGE
    );

    const allCompleted = currentTasks.every(task => task.completed);

    if (allCompleted && pageIndex < Math.ceil(tasks.length / TASKS_PER_PAGE) - 1) {
      const timer = setTimeout(() => {
        setPageIndex(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [tasks, pageIndex]);

  const handleComplete = async (taskId) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    if (task.completed) {
      toast.info('✅ Task already completed!');
      return;
    }

    try {
      const res = await completeTask(taskId);

      setTasks(prev =>
        prev.map(t =>
          t._id === taskId ? { ...t, completed: true } : t
        )
      );

      setUser(prev => ({
        ...prev,
        walletBalance: (prev.walletBalance || 0) + (res.task.reward || 0),
      }));

      toast.success(`✅ ${res.message} (You earned ${res.task.reward} UGX)`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error completing task');
    }
  };

  if (loading) return <p className="loader">Loading daily tasks...</p>;

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / TOTAL_TASKS) * 100);
  const totalPages = Math.ceil(tasks.length / TASKS_PER_PAGE);
  const visibleTasks = tasks.slice(
    pageIndex * TASKS_PER_PAGE,
    pageIndex * TASKS_PER_PAGE + TASKS_PER_PAGE
  );

  return (
    <div className="daily-tasks-container">

      {/* 💰 Deposit Now Banner — always visible */}
      <div className="deposit-banner fixed-banner">
        <p>
          💰 Keep your wallet active! 
          {user?.walletBalance > 0
            ? ` Current Balance: ${user.walletBalance} UGX`
            : ' Make your deposit to earning more!'}
        </p>
        <button onClick={() => onNavigate?.('deposit')} className="deposit-btn">
          Deposit Now
        </button>
      </div>

      <h2>🎯 Daily Tasks ({TOTAL_TASKS} Tasks Total)</h2>

      <div className="progress-bar-container">
        <span>✅ {completedCount} of {TOTAL_TASKS} tasks completed today</span>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="tasks-scroll-container">
        {visibleTasks.map((task, index) => (
          <div
            key={task._id}
            className={`task-card ${task.completed ? 'completed' : ''}`}
          >
            <div className="task-info">
              <h3>{pageIndex * TASKS_PER_PAGE + index + 1}. {task.taskName}</h3>
              <p>Reward: <b>{task.reward} UGX</b></p>
            </div>
            <button
              onClick={() => handleComplete(task._id)}
              disabled={task.completed}
              className={task.completed ? 'btn-disabled' : 'btn-active'}
            >
              {task.completed ? 'Completed' : 'Complete'}
            </button>
          </div>
        ))}
      </div>

      <div className="task-pagination">
        <button onClick={() => setPageIndex(prev => Math.max(prev - 1, 0))} disabled={pageIndex === 0}>⬅ Prev</button>
        <span>{pageIndex + 1} / {totalPages}</span>
        <button onClick={() => setPageIndex(prev => Math.min(prev + 1, totalPages - 1))} disabled={pageIndex >= totalPages - 1}>Next ➡</button>
      </div>

      <div className="wallet-info">
        <p>💰 Today's tasks commission : <b>UGX {user.walletBalance || 0} </b></p>
        <p>Progress: <b>{progressPercent}%</b></p>
      </div>
    </div>
  );
};

export default DailyTasksPage;
