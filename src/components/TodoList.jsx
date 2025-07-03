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
  Typography,
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

const { Title, Text } = Typography;
const NotificationContext = createContext({ name: "Default" });

export default function TodoList({ darkMode }) {
  const dispatch = useDispatch();
  const allTasks = useSelector((state) => state.tasks);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("Low");
  const [editingTask, setEditingTask] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [currentFilter, setCurrentFilter] = useState("newest");
  const [warningMessage, setWarningMessage] = useState("");

  const [api, contextHolder] = notification.useNotification();
  const contextValue = useMemo(() => ({ name: "Ant Design" }), []);

  const openNotification = (msg) => {
    api.success({ message: msg, placement: "topRight" });
  };

  const handleAdd = () => {
    if (!input.trim()) {
      setWarningMessage("Task input cannot be empty!");
      return;
    }
    setWarningMessage("");
    dispatch(addTask({ id: uuidv4(), text: input, priority }));
    setInput("");
    setPriority("Low");
    openNotification(`${input} added`);
  };

  const handleUpdate = () => {
    if (!editInput.trim()) return;
    dispatch(updateTask({ id: editingTask.id, text: editInput }));
    setEditingTask(null);
    setEditInput("");
    openNotification(`${editInput} updated`);
  };

  const handleSort = (value) => setCurrentFilter(value);

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
      <div
        style={{ width: "100%", padding: 24, maxWidth: 600, margin: "0 auto" }}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          My Tasks
        </Title>

        <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
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
        {warningMessage && (
          <div style={{ color: "red", marginTop: 8 }}>{warningMessage}</div>
        )}

        <div style={{ textAlign: "right", marginBottom: 16 }}>
          <Select
            value={currentFilter}
            style={{ width: 120 }}
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
            dataSource={tasks}
            renderItem={(task) => (
              <List.Item
                style={{
                  backgroundColor: darkMode ? "#fff" : "#fff",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  marginBottom: 8,
                  padding: 12,
                }}
                actions={[
                  <EditOutlined
                    style={{ color: "#1E90FF" }}
                    key="edit"
                    onClick={() => {
                      setEditingTask(task);
                      setEditInput(task.text);
                    }}
                  />,
                  <DeleteOutlined
                    style={{ color: "red" }}
                    key="delete"
                    onClick={() => {
                      dispatch(deleteTask(task.id));
                      openNotification(`${task.text} deleted`);
                    }}
                  />,
                ]}
              >
                <Space direction="vertical">
                  <Checkbox
                    checked={task.completed}
                    onChange={() => {
                      dispatch(toggleCompletion(task.id));
                      openNotification(`${task.text} status changed`);
                    }}
                  >
                    <Text
                      delete={task.completed}
                      style={{ color: task.completed ? "red" : "inherit" }}
                    >
                      {task.text}
                    </Text>
                  </Checkbox>
                  <Text type="secondary">
                    Priority: {task.priority || "Low"}
                  </Text>
                </Space>
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
      </div>
    </NotificationContext.Provider>
  );
}
