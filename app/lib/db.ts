import { openDB, DBSchema } from 'idb';
import { Task, Goal } from '../types';

// 定义数据库结构
interface TelosDB extends DBSchema {
  tasks: {
    key: string;
    value: Task;
    indexes: { 'by-date': string; 'by-goal': string };
  };
  goals: {
    key: string;
    value: Goal;
  };
}

// 数据库名称和版本
const DB_NAME = 'telos-db';
const DB_VERSION = 1;

// 初始化数据库
export async function initDB() {
  return openDB<TelosDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // 创建任务存储
      const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
      taskStore.createIndex('by-date', 'date');
      taskStore.createIndex('by-goal', 'goalId');

      // 创建目标存储
      db.createObjectStore('goals', { keyPath: 'id' });
    },
  });
}

// 获取数据库实例
export async function getDB() {
  return initDB();
}

// 任务相关操作
export async function getTasks(date?: string) {
  const db = await getDB();
  if (date) {
    return db.getAllFromIndex('tasks', 'by-date', date);
  }
  return db.getAll('tasks');
}

export async function getTasksByDateRange(startDate: string, endDate: string) {
  const db = await getDB();
  const allTasks = await db.getAll('tasks');
  return allTasks.filter(task => {
    return task.date >= startDate && task.date <= endDate;
  });
}

export async function addTask(task: Task) {
  const db = await getDB();
  return db.add('tasks', task);
}

export async function updateTask(task: Task) {
  const db = await getDB();
  return db.put('tasks', task);
}

export async function deleteTask(id: string) {
  const db = await getDB();
  return db.delete('tasks', id);
}

export async function updateTasksOrder(tasks: Task[]) {
  const db = await getDB();
  const tx = db.transaction('tasks', 'readwrite');
  for (const task of tasks) {
    tx.store.put(task);
  }
  return tx.done;
}

// 目标相关操作
export async function getGoals() {
  const db = await getDB();
  return db.getAll('goals');
}

export async function addGoal(goal: Goal) {
  const db = await getDB();
  return db.add('goals', goal);
}

export async function updateGoal(goal: Goal) {
  const db = await getDB();
  return db.put('goals', goal);
}

export async function deleteGoal(id: string) {
  const db = await getDB();
  // 删除目标时，同时更新关联的任务
  const tx = db.transaction(['goals', 'tasks'], 'readwrite');
  await tx.objectStore('goals').delete(id);
  
  // 获取关联到此目标的所有任务
  const tasksToUpdate = await db.getAllFromIndex('tasks', 'by-goal', id);
  
  // 移除任务与目标的关联
  for (const task of tasksToUpdate) {
    task.goalId = undefined;
    await tx.objectStore('tasks').put(task);
  }
  
  return tx.done;
}