'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, addDays, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Task, Goal, ViewType, AppState } from '../types';
import * as db from '../lib/db';

// 创建上下文
interface AppContextType {
  state: AppState;
  addTask: (title: string, date: string, goalId?: string) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  updateTasksOrder: (tasks: Task[]) => Promise<void>;
  addGoal: (goalData: Omit<Goal, 'id'>) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  incrementGoalCount: (id: string) => Promise<void>;
  setView: (view: ViewType) => void;
  setSelectedDate: (date: string) => void;
  getWeekRange: () => { start: string; end: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// 默认状态
const defaultState: AppState = {
  tasks: [],
  goals: [],
  currentView: 'day',
  selectedDate: format(new Date(), 'yyyy-MM-dd'),
};

// 多邻国主题色
const DUOLINGO_GREEN = '#58CC02';

// 提供者组件
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(defaultState);
  const [initialized, setInitialized] = useState(false);

  // 初始化数据
  useEffect(() => {
    const initData = async () => {
      try {
        // 初始化数据库
        await db.initDB();
        
        // 加载任务和目标
        await loadData();
        
        setInitialized(true);
      } catch (error) {
        console.error('初始化数据失败:', error);
      }
    };

    if (!initialized) {
      initData();
    }
  }, [initialized]);

  // 加载数据
  const loadData = async () => {
    try {
      // 获取所有目标
      const goals = await db.getGoals();
      
      // 获取当前视图的任务
      let tasks: Task[] = [];
      const { start, end } = getWeekRange();
      
      // 无论当前视图如何，都加载整周的任务
      tasks = await db.getTasksByDateRange(start, end);
      
      setState(prev => ({
        ...prev,
        tasks,
        goals,
      }));
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  };

  // 获取周视图的日期范围
  const getWeekRange = () => {
    const date = parseISO(state.selectedDate);
    const start = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const end = format(endOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    return { start, end };
  };

  // 添加任务
  const addTask = async (title: string, date: string, goalId?: string, startTime?: string, details?: string) => {
    try {
      // 获取当前日期的任务，计算新任务的顺序
      const tasksForDate = await db.getTasks(date);
      const order = tasksForDate.length;
      
      const newTask: Task = {
        id: uuidv4(),
        title,
        completed: false,
        date,
        goalId,
        startTime,
        details,
        order,
      };
      
      await db.addTask(newTask);
      await loadData();
    } catch (error) {
      console.error('添加任务失败:', error);
    }
  };

  // 更新任务
  const updateTask = async (task: Task) => {
    try {
      await db.updateTask(task);
      await loadData();
    } catch (error) {
      console.error('更新任务失败:', error);
    }
  };

  // 删除任务
  const deleteTask = async (id: string) => {
    try {
      await db.deleteTask(id);
      await loadData();
    } catch (error) {
      console.error('删除任务失败:', error);
    }
  };

  // 切换任务完成状态
  const toggleTaskCompletion = async (id: string) => {
    try {
      const task = state.tasks.find(t => t.id === id);
      if (task) {
        const updatedTask = { ...task, completed: !task.completed };
        await db.updateTask(updatedTask);
        
        // 如果任务关联了目标，并且任务被标记为完成，增加目标完成次数
        if (updatedTask.completed && updatedTask.goalId) {
          await incrementGoalCount(updatedTask.goalId);
        }
        
        await loadData();
      }
    } catch (error) {
      console.error('切换任务状态失败:', error);
    }
  };

  // 更新任务顺序（拖拽排序）
  const updateTasksOrder = async (tasks: Task[]) => {
    try {
      await db.updateTasksOrder(tasks);
      await loadData();
    } catch (error) {
      console.error('更新任务顺序失败:', error);
    }
  };

  // 添加目标
  const addGoal = async (goalData: Omit<Goal, 'id'>) => {
    try {
      const newGoal: Goal = {
        id: uuidv4(),
        ...goalData
      };
      
      await db.addGoal(newGoal);
      await loadData();
    } catch (error) {
      console.error('添加目标失败:', error);
    }
  };

  // 更新目标
  const updateGoal = async (goal: Goal) => {
    try {
      await db.updateGoal(goal);
      await loadData();
    } catch (error) {
      console.error('更新目标失败:', error);
    }
  };

  // 删除目标
  const deleteGoal = async (id: string) => {
    try {
      await db.deleteGoal(id);
      await loadData();
    } catch (error) {
      console.error('删除目标失败:', error);
    }
  };

  // 增加目标完成次数
  const incrementGoalCount = async (id: string) => {
    try {
      const goal = state.goals.find(g => g.id === id);
      if (goal && goal.currentCount < goal.targetCount) {
        const updatedGoal = { ...goal, currentCount: goal.currentCount + 1 };
        await db.updateGoal(updatedGoal);
        await loadData();
      }
    } catch (error) {
      console.error('增加目标完成次数失败:', error);
    }
  };

  // 设置视图类型
  const setView = async (view: ViewType) => {
    setState(prev => ({ ...prev, currentView: view }));
    await loadData();
  };

  // 设置选中日期
  const setSelectedDate = (date: string) => {
    setState(prev => ({ ...prev, selectedDate: date }));
    loadData();
  };

  const contextValue: AppContextType = {
    state,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    updateTasksOrder,
    addGoal,
    updateGoal,
    deleteGoal,
    incrementGoalCount,
    setView,
    setSelectedDate,
    getWeekRange,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// 自定义钩子，用于在组件中访问上下文
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};