// 定义应用中使用的类型

// 任务类型
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string; // ISO格式的日期字符串
  startTime?: string; // 开始时间（可选，格式：HH:mm）
  details?: string; // 事件详情（可选）
  goalId?: string; // 关联的目标ID（可选）
  order: number; // 用于拖拽排序
}

// 目标类型
export enum GoalType {
  CHECKIN = 'checkin',
  CUSTOM = 'custom'
}

export interface Goal {
  id: string;
  title: string; // 目标标题（字符串形式）
  type: GoalType;
  targetCount: number; // 目标完成次数
  currentCount: number; // 当前完成次数
  deadline?: string; // 截止日期（可选）
  color: string; // 目标卡片颜色
  lastUpdate?: string; // 最后更新时间
}

// 视图类型
export type ViewType = 'day' | 'week';

// 应用状态类型
export interface AppState {
  tasks: Task[];
  goals: Goal[];
  currentView: ViewType;
  selectedDate: string; // ISO格式的日期字符串
}