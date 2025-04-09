'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import { Goal } from '../types';
import { useAppContext } from '../context/AppContext';
import '../styles/goalCard.css';

interface GoalCardProps {
  goal: Goal;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const { incrementGoalCount } = useAppContext();

  // 计算进度百分比
  const progressPercentage = (goal.currentCount / goal.targetCount) * 100;
  
  // 计算剩余天数（如果有截止日期）
  const getRemainingDays = () => {
    if (!goal.deadline) return null;
    
    const today = new Date();
    const deadlineDate = new Date(goal.deadline);
    const daysLeft = differenceInDays(deadlineDate, today);
    
    return daysLeft > 0 ? daysLeft : 0;
  };
  
  const remainingDays = getRemainingDays();

  // 处理打卡
  const handleCheckin = async () => {
    try {
      await incrementGoalCount(goal.id);
    } catch (error) {
      console.error('打卡失败:', error);
    }
  };
  
  // 根据完成进度和剩余时间确定状态
  const isCompleted = progressPercentage >= 100;
  const isExpired = remainingDays === 0;
  const statusColor = isCompleted ? '#58CC02' : isExpired ? '#FF4B4B' : '#FFDE59';
  const statusText = isCompleted ? '已完成' : isExpired ? '已结束' : '进行中';
  
  return (
    <motion.div 
      className="bg-white rounded-xl shadow p-4 mb-4 transform transition-all duration-300 relative overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      layout
    >
      {/* 状态标签 */}
      <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium"
        style={{ 
          backgroundColor: `${statusColor}20`,
          color: statusColor
        }}
      >
        {statusText}
      </div>
      
      <h3 className="font-bold text-lg mb-3 text-gray-800 pr-16">
        <span className="truncate block">{goal.title}</span>
      </h3>
      
      {/* 进度指示器 */}
      <div className="relative mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
            已打卡 {goal.currentCount} / {goal.targetCount} 次
          </span>
        </div>
        <div className="overflow-hidden h-2 rounded-full bg-gray-100 relative">
          <motion.div 
            className="h-full rounded-full"
            style={{ backgroundColor: statusColor }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ 
              duration: 1,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.3) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.3) 75%, rgba(255,255,255,0.3)`,
                backgroundSize: '10px 10px',
                animation: 'moveStripes 1s linear infinite'
              }}
            />
          </motion.div>
        </div>
      </div>
      
      {/* 打卡按钮 */}
      {!isCompleted && !isExpired && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleCheckin}
            className="flex-1 bg-[#58CC02] text-white py-1.5 px-3 rounded-lg font-medium hover:bg-[#46a302] transition-colors flex items-center justify-center gap-1 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            打卡
          </button>
          {remainingDays !== null && (
            <button
              className="bg-gray-100 text-gray-600 py-1.5 px-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              休假
            </button>
          )}
        </div>
      )}

      {/* 底部信息区域 */}
      {remainingDays !== null && (
        <div className="flex items-center justify-end text-sm text-gray-500 mt-4">
          <div className="flex items-center gap-1">
            <span>剩余休假天数:</span>
            <span className="font-medium" style={{ color: statusColor }}>
              {remainingDays}天
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default GoalCard;