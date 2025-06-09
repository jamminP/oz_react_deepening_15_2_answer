import React, { useState } from 'react';
import BoardDetailModal from './BoardDetailModal';
import { useBoardStore } from '../store';
import BoardConfirmModal from './BoardConfirmModal';
import BoardEditModal from './BoardEditModal';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';

const typeToKorean = (type) => {
  switch (type) {
    case 'todo':
      return '할 일';
    case 'inprogress':
      return '진행 중';
    case 'done':
      return '완료';
    default:
      return type;
  }
};

const Boards = ({ type }) => {
  const { data } = useBoardStore();
  const filteredData = data.filter((item) => item.type === type);
  const [item, setItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [confirmIsOpen, setConfirmIsOpen] = useState(false);
  const [editIsOpen, setEditIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { setNodeRef, isOver } = useDroppable({
    id: type,
    data: {
      type,
      accepts: ['todo', 'inprogress', 'done'],
    },
  });

  const handleModalOpen = (item) => {
    setItem(item);
    setIsOpen(true);
  };
  const handleModalClose = () => {
    setItem(null);
    setIsOpen(false);
  };

  const handleConfirmModalOpen = (id) => {
    setSelectedId(id);
    handleModalClose();
    setConfirmIsOpen(true);
  };
  const handleConfirmModalClose = () => {
    setConfirmIsOpen(false);
    setSelectedId(null);
  };

  const handleEditModalOpen = () => {
    setEditIsOpen(true);
    setIsOpen(false);
  };
  const handleEditModalClose = () => {
    setEditIsOpen(false);
  };

  return (
    <div
      className={`select-none w-full flex flex-col h-full ${
        isOver ? 'bg-slate-200 rounded-md ring-2 ring-slate-400 ring-inset' : ''
      }`}
      ref={setNodeRef}
    >
      <div className="w-full h-[60px] bg-stone-200 rounded-sm flex items-center justify-center">
        <p className="text-lg font-semibold">{typeToKorean(type)}</p>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <SortableContext items={filteredData.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          {filteredData.map((item) => (
            <SortableItem key={item.id} id={item.id} item={item} onClick={() => handleModalOpen(item)} />
          ))}
          {filteredData.length === 0 && (
            <div className="flex-1 min-h-[200px] border-2 border-dashed border-slate-300 rounded-md flex items-center justify-center text-slate-400">
              이 영역으로 항목을 드래그하세요
            </div>
          )}
        </SortableContext>
      </div>
      {isOpen && (
        <BoardDetailModal
          onClose={handleModalClose}
          onConfirm={handleConfirmModalOpen}
          onEdit={handleEditModalOpen}
          item={item}
        />
      )}
      {confirmIsOpen && <BoardConfirmModal onClose={handleConfirmModalClose} id={selectedId} />}
      {editIsOpen && <BoardEditModal onClose={handleEditModalClose} item={item} />}
    </div>
  );
};

export default Boards;
