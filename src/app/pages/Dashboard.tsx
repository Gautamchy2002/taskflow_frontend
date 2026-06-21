import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { CheckCircle, Clock, ListTodo, Timer } from "lucide-react";
import { MoonLoader } from "react-spinners";
import Swal from "sweetalert2";

import type { RootState } from "../services/redux/store";
import instance from "../services/axiosinstance";
import { APIs } from "../services/APIs";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
}

const Dashboard = () => {
  const authData = useSelector((state: RootState) => state.authData.authData);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false);
  const getTasks = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`${APIs.taskServiceApi}/get`);
      setTasks(response.data || []);
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data || "Failed to load dashboard",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;
    getTasks();
  }, []);

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(
    (task) => task.status?.toUpperCase() === "PENDING",
  ).length;
  const completedTasks = tasks.filter(
    (task) => task.status?.toUpperCase() === "COMPLETED",
  ).length;
  const overdueTasks = tasks.filter(
    (task) =>
      task.dueDate &&
      new Date(task.dueDate) < new Date() &&
      task.status?.toUpperCase() !== "COMPLETED",
  ).length;

  const cards = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: <ListTodo size={24} />,
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
    {
      title: "Pending",
      value: pendingTasks,
      icon: <Clock size={24} />,
      bg: "bg-yellow-50",
      text: "text-yellow-700",
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: <CheckCircle size={24} />,
      bg: "bg-green-50",
      text: "text-green-700",
    },
    {
      title: "Overdue",
      value: overdueTasks,
      icon: <Timer size={24} />,
      bg: "bg-red-50",
      text: "text-red-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-2xl p-5 sm:p-8 shadow">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Welcome back, {authData?.username}
        </h1>
        <p className="text-gray-300 mt-2 text-sm sm:text-base">
          Manage your tasks, priorities and deadlines from one place.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <MoonLoader size={42} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {cards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-2xl shadow p-5 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <h2 className="text-3xl font-bold mt-1">{card.value}</h2>
                </div>

                <div className={`${card.bg} ${card.text} p-3 rounded-xl`}>
                  {card.icon}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <h2 className="text-lg font-semibold mb-4">Recent Tasks</h2>

            {tasks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No tasks found</p>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border rounded-xl p-4"
                  >
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-gray-500">
                        Due:{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleString()
                          : "-"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <span className="px-3 py-1 text-xs rounded-full bg-gray-100">
                        {task.status}
                      </span>
                      <span className="px-3 py-1 text-xs rounded-full bg-gray-100">
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
