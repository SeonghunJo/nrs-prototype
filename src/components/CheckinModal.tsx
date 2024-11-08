import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Task } from '../types';

interface CheckinModalProps {
  task: Task;
  onCheckin: (status: 'completed' | 'in-progress' | 'blocked', comment: string) => void;
  onClose: () => void;
}

export function CheckinModal({ task, onCheckin, onClose }: CheckinModalProps) {
  const [status, setStatus] = useState<'completed' | 'in-progress' | 'blocked'>(
    task.checkin?.status || 'in-progress'
  );
  const [comment, setComment] = useState(task.checkin?.comment || '');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">일일 체크인</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">작업: {task.title}</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'completed', label: '완료', color: 'bg-green-100 text-green-800' },
              { value: 'in-progress', label: '진행중', color: 'bg-blue-100 text-blue-800' },
              { value: 'blocked', label: '블록됨', color: 'bg-red-100 text-red-800' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setStatus(option.value as any)}
                className={`p-2 rounded-lg text-sm font-medium ${
                  status === option.value ? option.color : 'bg-gray-100 text-gray-800'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            코멘트
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="오늘의 진행 상황이나 블로커에 대해 설명해주세요"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            취소
          </button>
          <button
            onClick={() => onCheckin(status, comment)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
          >
            체크인하기
          </button>
        </div>
      </div>
    </div>
  );
}