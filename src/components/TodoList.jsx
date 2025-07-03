import React, { useState, useMemo, createContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Input,
  List,
  Modal,
  Select,
  Space,
  Checkbox,
  Empty,
  notification,
} from "antd";
import {
  addTask,
  deleteTask,
  updateTask,
  toggleCompletion,
} from "../redux/tasksSlice";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

const NotificationContext = createContext({ name: "Default" });

export default function TodoList({ darkMode }) {
  const dispatch = useDispatch();
  const allTasks = useSelector((state) => state.tasks);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("Low");
  const [editingTask, setEditingTask] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [currentFilter, setCurrentFilter] = useState("newest");

  const [api, contextHolder] = notification.useNotification();

  const contextValue = useMemo(() => ({ name: "Ant Design" }), []);

  const openNotification = (msg) => {
    api.info({
      message: "Task Notification",
      description: (
        <NotificationContext.Consumer>
          {() => `${msg}`}
        </NotificationContext.Consumer>
      ),
      placement: "topRight",
    });
  };

  const handleAdd = () => {
    if (!input.trim()) return;
    dispatch(addTask({ id: uuidv4(), text: input, priority }));
    setInput("");
    setPriority("Low");
    openNotification(`${input} added successfully`);
  };

  const handleUpdate = () => {
    if (!editInput.trim()) return;
    dispatch(updateTask({ id: editingTask.id, text: editInput }));
    setEditingTask(null);
    setEditInput("");
    openNotification(`${editInput} updated successfully`);
  };

  const handleSort = (value) => {
    setCurrentFilter(value);
  };

  let tasks = [...allTasks];
  switch (currentFilter) {
    case "completed":
      tasks = tasks.filter((t) => t.completed);
      break;
    case "incompleted":
      tasks = tasks.filter((t) => !t.completed);
      break;
    case "oldest":
      tasks.sort((a, b) => a.createdAt - b.createdAt);
      break;
    case "newest":
      tasks.sort((a, b) => b.createdAt - a.createdAt);
      break;
    default:
      break;
  }

  return (
    <NotificationContext.Provider value={contextValue}>
      {contextHolder}
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space.Compact style={{ width: "100%" }}>
          <Input
            placeholder="Add a task"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={handleAdd}
          />
          <Select
            value={priority}
            onChange={(value) => setPriority(value)}
            options={[
              { label: "Low", value: "Low" },
              { label: "Medium", value: "Medium" },
              { label: "High", value: "High" },
            ]}
          />
          <Button type="primary" onClick={handleAdd}>
            Add
          </Button>
        </Space.Compact>

        <div style={{ textAlign: "right" }}>
          <Select
            value={currentFilter}
            style={{ width: 200 }}
            onChange={handleSort}
            options={[
              { label: "Newest", value: "newest" },
              { label: "Oldest", value: "oldest" },
              { label: "Completed", value: "completed" },
              { label: "Incomplete", value: "incompleted" },
            ]}
          />
        </div>

        {tasks.length === 0 ? (
          <Empty description="No tasks found" />
        ) : (
          <List
            bordered
            dataSource={tasks}
            renderItem={(task) => (
              <List.Item
                style={{
                  backgroundColor: darkMode ? "#222" : "#fff",
                  color: darkMode ? "#eee" : "#000",
                }}
                actions={[
                  <EditOutlined
                    key="edit"
                    onClick={() => {
                      setEditingTask(task);
                      setEditInput(task.text);
                    }}
                  />,
                  <DeleteOutlined
                    key="delete"
                    onClick={() => {
                      dispatch(deleteTask(task.id));
                      openNotification(`${task.text} deleted successfully`);
                    }}
                  />,
                ]}
              >
                <Checkbox
                  checked={task.completed}
                  onChange={() => {
                    dispatch(toggleCompletion(task.id));
                    openNotification("Task completion status toggled");
                  }}
                >
                  <span
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                    }}
                  >
                    {task.text}
                    <strong style={{ marginLeft: 8 }}>
                      ({task.priority || "Low"})
                    </strong>
                  </span>
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
    </NotificationContext.Provider>
  );
}
