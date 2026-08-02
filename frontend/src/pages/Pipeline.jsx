import React, { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from 'react-toastify';
import API from '../services/api';

const columns = [
  { key: 'New', title: 'New' },
  { key: 'Contacted', title: 'Contacted' },
  { key: 'Qualified', title: 'Qualified' },
  { key: 'Won', title: 'Closed' },
];

const columnStyles = {
  New: 'border-blue-200 bg-blue-50',
  Contacted: 'border-yellow-200 bg-yellow-50',
  Qualified: 'border-purple-200 bg-purple-50',
  Won: 'border-green-200 bg-green-50',
};

export default function Pipeline() {
  const [leadsByStatus, setLeadsByStatus] = useState({
    New: [],
    Contacted: [],
    Qualified: [],
    Won: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const response = await API.get('/leads/64f0c3a1f0d1c2a3b4c5d6e7');
        const grouped = { New: [], Contacted: [], Qualified: [], Won: [] };

        (response.data.data || []).forEach((lead) => {
          const status = grouped[lead.status] ? lead.status : 'New';
          grouped[status].push(lead);
        });

        setLeadsByStatus(grouped);
      } catch (error) {
        console.error('Failed to load pipeline', error);
        toast.error('Unable to load pipeline');
      } finally {
        setIsLoading(false);
      }
    };

    loadLeads();
  }, []);

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceStatus = source.droppableId;
    const targetStatus = destination.droppableId;

    const lead = leadsByStatus[sourceStatus][source.index];
    if (!lead) return;

    const previousState = leadsByStatus;

    const nextState = { ...leadsByStatus };
    const sourceItems = [...nextState[sourceStatus]];
    const destItems = [...nextState[targetStatus]];
    sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, { ...lead, status: targetStatus });
    nextState[sourceStatus] = sourceItems;
    nextState[targetStatus] = destItems;
    setLeadsByStatus(nextState);

    try {
      await API.put(`/leads/${lead._id}`, { status: targetStatus });
      toast.success(`Moved to ${targetStatus}`);
    } catch (error) {
      setLeadsByStatus(previousState);
      toast.error('Unable to update lead status');
    }
  };

  const totalCount = useMemo(() => Object.values(leadsByStatus).reduce((sum, column) => sum + column.length, 0), [leadsByStatus]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Pipeline</h1>
        <p className="text-sm text-gray-600">Drag leads between stages to update their progress.</p>
      </div>

      <div className="mb-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
        Total leads: {totalCount}
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
          Loading pipeline...
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {columns.map((column) => (
              <Droppable key={column.key} droppableId={column.key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-w-[280px] flex-1 rounded-xl border p-4 ${columnStyles[column.key]} ${snapshot.isDraggingOver ? 'ring-2 ring-blue-400' : ''}`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">{column.title}</h2>
                      <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium text-gray-600">
                        {leadsByStatus[column.key]?.length || 0}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {(leadsByStatus[column.key] || []).map((lead, index) => (
                        <Draggable key={lead._id} draggableId={lead._id} index={index}>
                          {(dragProvided) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                            >
                              <p className="font-medium text-gray-900">{lead.name}</p>
                              <p className="mt-1 text-sm text-gray-600">{lead.email}</p>
                              <p className="mt-2 inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                                {lead.status}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
