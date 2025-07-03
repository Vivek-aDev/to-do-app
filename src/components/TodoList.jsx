import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, List, Modal, Select, Space, Checkbox, Empty } from 'antd';
import { addTask, deleteTask, updateTask, toggleCompletion, sortTasks } from '../redux/tasksSlice';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

export default function TodoList({ darkMode }) {
  const dispatch = useDispatch();
  const allTasks = useSelector((state) => state.tasks);
  const [input, setInput] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editInput, setEditInput] = useState('');
  const [currentFilter, setCurrentFilter] = useState('newest');

  const handleAdd = () => {
    if (!input.trim()) return;
    dispatch(addTask({ id: uuidv4(), text: input }));
    setInput('');
    dispatch(sortTasks({ type: currentFilter }));
  };

  const handleUpdate = () => {
    if (!editInput.trim()) return;
    dispatch(updateTask({ id: editingTask.id, text: editInput }));
    setEditingTask(null);
    setEditInput('');
    dispatch(sortTasks({ type: currentFilter }));
  };

  const handleSort = (value) => {
    setCurrentFilter(value);
    dispatch(sortTasks({ type: value }));
  };

  const tasks = (() => {
    switch (currentFilter) {
      case 'completed':
        return allTasks.filter((t) => t.completed);
      case 'incompleted':
        return allTasks.filter((t) => !t.completed);
      case 'oldest':
        return [...allTasks].sort((a, b) => a.createdAt - b.createdAt);
      case 'newest':
        return [...allTasks].sort((a, b) => b.createdAt - a.createdAt);
      default:
        return allTasks;
    }
  })();

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space.Compact style={{ width: '100%' }}>
        <Input
          placeholder="Add a task"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={handleAdd}
        />
        <Button type="primary" onClick={handleAdd}>Add</Button>
      </Space.Compact>

      <div style={{ textAlign: 'right' }}>
        <Select
          value={currentFilter}
          style={{ width: 200 }}
          onChange={handleSort}
          options={[
            { label: 'Newest', value: 'newest' },
            { label: 'Oldest', value: 'oldest' },
            { label: 'Completed', value: 'completed' },
            { label: 'Incomplete', value: 'incompleted' },
          ]}
        />
      </div>

      {currentFilter === 'completed' && tasks.length === 0 ? (
        <Empty description="No task completed yet" />
      ) : (
        <List
          bordered
          dataSource={tasks}
          renderItem={(task) => (
            <List.Item
              style={{ backgroundColor: darkMode ? '#222' : '#fff', color: darkMode ? '#eee' : '#000' }}
              actions={[
                <EditOutlined key="edit" onClick={() => { setEditingTask(task); setEditInput(task.text); }} />,
                <DeleteOutlined key="delete" onClick={() => dispatch(deleteTask(task.id))} />,
              ]}
            >
              <Checkbox
                checked={task.completed}
                onChange={() => dispatch(toggleCompletion(task.id))}
              >
                <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.text}</span>
              </Checkbox>
            </List.Item>
          )}
        />
      )}

      <Modal
        title="Edit Task"
        open={!!editingTask}
        onOk={handleUpdate}
        onCancel={() => setEditingTask(null)}
      >
        <Input
          value={editInput}
          onChange={(e) => setEditInput(e.target.value)}
          onPressEnter={handleUpdate}
        />
      </Modal>
    </Space>
  );
}