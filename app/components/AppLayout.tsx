'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DayView from './DayView';
import WeekView from './WeekView';
import GoalTracker from './GoalTracker';
import { useAppContext } from '../context/AppContext';
import { ViewType } from '../types';

const AppLayout: React.FC = () => {
  const { state, setView } = useAppContext();
  const [activeTab, setActiveTab] = useState<'todo' | 'goals'>('todo');
  
  // 处理视图切换
  const handleViewChange = (view: ViewType) => {
    setView(view);
  };
  
  // 处理标签切换
  const handleTabChange = (tab: 'todo' | 'goals') => {
    setActiveTab(tab);
  };
  
  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen flex flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-[#58CC02] text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Telos</h1>
      </header>
      
      {/* 主内容区域 */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'todo' ? (
            <motion.div
              key="todo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* TodoList视图切换 */}
              <div className="flex bg-white p-2 mb-4 shadow-sm">
                <button
                  className={`flex-1 py-2 rounded-md transition-colors ${state.currentView === 'day' ? 'bg-[#58CC02] text-white' : 'text-gray-700'}`}
                  onClick={() => handleViewChange('day')}
                >
                  日视图
                </button>
                <button
                  className={`flex-1 py-2 rounded-md transition-colors ${state.currentView === 'week' ? 'bg-[#58CC02] text-white' : 'text-gray-700'}`}
                  onClick={() => handleViewChange('week')}
                >
                  周视图
                </button>
              </div>
              
              {/* 当前视图内容 */}
              <AnimatePresence mode="wait">
                {state.currentView === 'day' ? (
                  <motion.div
                    key="day-view"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DayView />
                  </motion.div>
                ) : (
                  <motion.div
                    key="week-view"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <WeekView />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GoalTracker />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* 底部导航栏 */}
      <footer className="bg-white shadow-md p-2">
        <div className="flex justify-around">
          <button
            className={`flex flex-col items-center p-2 rounded-md ${activeTab === 'todo' ? 'text-[#58CC02]' : 'text-gray-500'}`}
            onClick={() => handleTabChange('todo')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xs mt-1">任务</span>
          </button>
          <button
            className={`flex flex-col items-center p-2 rounded-md ${activeTab === 'goals' ? 'text-[#58CC02]' : 'text-gray-500'}`}
            onClick={() => handleTabChange('goals')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs mt-1">目标</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;