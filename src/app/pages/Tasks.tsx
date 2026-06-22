import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { MoonLoader } from "react-spinners";
import { Edit, Plus } from "lucide-react";

import instance from "../services/axiosinstance";
import { APIs } from "../services/APIs";
import CreateTask from "./CreateTask";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Task | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);

  const hasFetched = useRef(false);

  const getTasks = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`${APIs.taskServiceApi}/get`);
      setTasks(response.data || []);
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data || "Failed to fetch tasks",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Delete task?",
      text: "This task will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    setDeletingId(id);

    try {
      await instance.delete(`${APIs.taskServiceApi}/delete/${id}`);
      Swal.fire("Deleted", "Task deleted successfully", "success");
      getTasks();
    } catch (error: any) {
      Swal.fire("Error", error?.response?.data || "Delete failed", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const normalizeValue = (value: string) => {
    return value?.toUpperCase().replace(/\s+/g, "_");
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const taskStatus = normalizeValue(task.status);
      const selectedStatus = normalizeValue(statusFilter);

      const taskPriority = normalizeValue(task.priority);
      const selectedPriority = normalizeValue(priorityFilter);

      const statusMatch =
        statusFilter === "ALL" || taskStatus === selectedStatus;

      const priorityMatch =
        priorityFilter === "ALL" || taskPriority === selectedPriority;

      return statusMatch && priorityMatch;
    });
  }, [tasks, statusFilter, priorityFilter]);

  const totalItems = filteredTasks.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = totalItems === 0 ? 0 : pageIndex * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, totalItems);

  const paginatedTasks = filteredTasks.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize,
  );

  const getStatusBadge = (status: string) => {
    const value = normalizeValue(status);

    if (value === "COMPLETED") {
      return "bg-green-100 text-green-700 border border-green-200";
    }

    if (value === "IN_PROGRESS") {
      return "bg-blue-100 text-blue-700 border border-blue-200";
    }

    return "bg-yellow-100 text-yellow-700 border border-yellow-200";
  };

  const getPriorityBadge = (priority: string) => {
    const value = normalizeValue(priority);

    if (value === "HIGH") {
      return "bg-red-100 text-red-700 border border-red-200";
    }

    if (value === "LOW") {
      return "bg-green-100 text-green-700 border border-green-200";
    }

    return "bg-orange-100 text-orange-700 border border-orange-200";
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    getTasks();
  }, []);

  useEffect(() => {
    setPageIndex(0);
  }, [statusFilter, priorityFilter, pageSize]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-sm text-gray-500">
            Manage your personal tasks and reminders
          </p>
        </div>

        <Button
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus size={16} />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Priority</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <MoonLoader size={40} />
        </div>
      ) : totalItems === 0 ? (
        <p className="text-center text-gray-500 py-10">No tasks found</p>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto border rounded-xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell className="max-w-[260px] truncate">
                      {task.description}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusBadge(
                          task.status,
                        )}`}
                      >
                        {task.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${getPriorityBadge(
                          task.priority,
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleString()
                        : "-"}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => {
                            setEditData(task);
                            setOpen(true);
                          }}
                        >
                          <Edit size={16} />
                        </Button>

                        <Button
                          variant="destructive"
                          onClick={() => deleteTask(task.id)}
                          disabled={deletingId === task.id}
                          className="min-w-[72px]"
                        >
                          {deletingId === task.id ? (
                            <MoonLoader size={16} color="#fff" />
                          ) : (
                            "Delete"
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-4">
            {paginatedTasks.map((task) => (
              <div key={task.id} className="border rounded-xl p-4 shadow-sm">
                <div className="flex justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {task.description}
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      setEditData(task);
                      setOpen(true);
                    }}
                  >
                    <Edit size={16} />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${getStatusBadge(
                      task.status,
                    )}`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${getPriorityBadge(
                      task.priority,
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-3">
                  Due:{" "}
                  {task.dueDate ? new Date(task.dueDate).toLocaleString() : "-"}
                </p>

                <Button
                  variant="destructive"
                  className="w-full mt-4"
                  onClick={() => deleteTask(task.id)}
                  disabled={deletingId === task.id}
                >
                  {deletingId === task.id ? (
                    <MoonLoader size={16} color="#fff" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-5">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>

              <Select
                value={String(pageSize)}
                onValueChange={(value) => setPageSize(Number(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <span className="text-sm text-gray-600">
              {startItem}-{endItem} of {totalItems}
            </span>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPageIndex((prev) => prev - 1)}
                disabled={pageIndex === 0}
                className="w-24"
              >
                Previous
              </Button>

              <Button
                variant="outline"
                onClick={() => setPageIndex((prev) => prev + 1)}
                disabled={pageIndex + 1 >= totalPages}
                className="w-24"
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {open && (
        <>
          <div className="fixed inset-0 backdrop-blur-sm bg-black/10 z-10" />

          <CreateTask
            open={open}
            setOpen={setOpen}
            getTasks={getTasks}
            editData={editData}
          />
        </>
      )}
    </div>
  );
};

export default Tasks;
