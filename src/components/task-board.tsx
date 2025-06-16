'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStatus } from '@prisma/client';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import TaskActions from './task-actions';

const statusList: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

export default function TaskBoard({
  tasks,
  projectId,
  projectOwnerId,
}: {
  tasks: Task[];
  projectId: string;
  projectOwnerId: string;
}) {
  const [board, setBoard] = useState<Record<TaskStatus, Task[]>>({
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
  });

  useEffect(() => {
    const grouped = statusList.reduce((acc, status) => {
      acc[status] = tasks.filter((t) => t.status === status);
      return acc;
    }, {} as Record<TaskStatus, Task[]>);
    setBoard(grouped);
  }, [tasks]);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const sourceList = [...board[source.droppableId as TaskStatus]];
    const taskIndex = sourceList.findIndex((t) => t.id === draggableId);
    const [movedTask] = sourceList.splice(taskIndex, 1);

    const destinationList = [...board[destination.droppableId as TaskStatus]];
    movedTask.status = destination.droppableId as TaskStatus;
    destinationList.splice(destination.index, 0, movedTask);

    setBoard({
      ...board,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destinationList,
    });

    await fetch(`/api/tasks/${draggableId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: movedTask.status }),
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statusList.map((status) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-800 p-4 rounded-xl border border-gray-700 min-h-[200px] space-y-2"
              >
                <h3 className="font-bold mb-3 text-white tracking-wide text-sm uppercase">
                  {status.replace('_', ' ')}
                </h3>

                {board[status].map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => {
                      const assignee = (task as any).assignee;
                      const isOwner = assignee?.id === projectOwnerId;

                      return (
                        <div
                          className="bg-gray-900 border border-gray-700 p-3 rounded-lg flex flex-col gap-2 shadow-sm hover:shadow transition"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="font-semibold text-white">{task.title}</div>

                          {assignee ? (
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                                {assignee.name[0].toUpperCase()}
                              </div>
                              <span className="truncate">{assignee.name}</span>
                              <span
                                className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${
                                  isOwner
                                    ? 'bg-blue-200 text-blue-800'
                                    : 'bg-green-200 text-green-800'
                                }`}
                              >
                                {isOwner ? 'Owner' : 'Member'}
                              </span>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500 italic">Unassigned</div>
                          )}

                          <div className="mt-2 flex justify-end gap-2">
                            <TaskActions
                              taskId={task.id}
                              currentTitle={task.title}
                              currentDescription={task.description || ''}
                              currentStatus={task.status}
                            />
                          </div>
                        </div>
                      );
                    }}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
