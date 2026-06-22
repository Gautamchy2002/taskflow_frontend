import React, { useState } from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { MoonLoader } from "react-spinners";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import instance from "@/app/services/axiosinstance";
import { APIs } from "@/app/services/APIs";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
}

interface CreateTaskProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getTasks: () => void;
  editData: Task | null;
}

const CreateTask: React.FC<CreateTaskProps> = ({
  open,
  setOpen,
  getTasks,
  editData,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <motion.div
        initial={{ y: "-100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "-100vh", opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <DialogContent
          className="w-[95vw] sm:w-[90vw] md:w-[85vw] !max-w-3xl p-0 max-h-[90vh] overflow-hidden flex flex-col [&>button]:hidden"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="p-4 border-b flex justify-between items-start shrink-0">
            <div>
              <h2 className="text-lg font-semibold">
                {editData ? "Edit Task" : "Add New Task"}
              </h2>
              <p className="text-sm text-gray-500">
                {editData
                  ? "Update your task details"
                  : "Create a new task for your TaskFlow list"}
              </p>
            </div>
          </div>

          <Formik
            initialValues={{
              title: editData?.title || "",
              description: editData?.description || "",
              status: editData?.status || "PENDING",
              priority: editData?.priority || "MEDIUM",
              dueDate: editData?.dueDate ? editData.dueDate.slice(0, 16) : "",
            }}
            validationSchema={Yup.object({
              title: Yup.string().required("Title is required"),
              description: Yup.string().required("Description is required"),
              status: Yup.string().required("Status is required"),
              priority: Yup.string().required("Priority is required"),
              dueDate: Yup.string().required("Due date is required"),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              setLoading(true);

              try {
                const payload = {
                  title: values.title,
                  description: values.description,
                  status: values.status,
                  priority: values.priority,
                  dueDate: values.dueDate,
                };

                if (editData) {
                  await instance.put(
                    `${APIs.taskServiceApi}/update/${editData.id}`,
                    payload,
                  );

                  Swal.fire("Success", "Task updated successfully", "success");
                } else {
                  await instance.post(`${APIs.taskServiceApi}/create`, payload);

                  Swal.fire("Success", "Task created successfully", "success");
                }

                setOpen(false);
                getTasks();
              } catch (error: any) {
                Swal.fire(
                  "Error",
                  error?.response?.data || "Something went wrong",
                  "error",
                );
              } finally {
                setLoading(false);
                setSubmitting(false);
              }
            }}
          >
            {({ values, setFieldValue }) => (
              <Form className="flex flex-col min-h-0">
                <div className="p-4 space-y-5 overflow-y-auto flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as={Input}
                        name="title"
                        placeholder="Enter task title"
                        className="mt-2 bg-gray-100"
                      />
                      <ErrorMessage
                        name="title"
                        component="p"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Due Date <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as={Input}
                        name="dueDate"
                        type="datetime-local"
                        className="mt-2 bg-gray-100"
                      />
                      <ErrorMessage
                        name="dueDate"
                        component="p"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as={Input}
                      name="description"
                      placeholder="Enter task description"
                      className="mt-2 bg-gray-100"
                    />
                    <ErrorMessage
                      name="description"
                      component="p"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="w-full">
                      <label className="text-sm font-medium">
                        Status <span className="text-red-500">*</span>
                      </label>

                      <Select
                        value={values.status}
                        onValueChange={(value) =>
                          setFieldValue("status", value)
                        }
                      >
                        <SelectTrigger className="mt-2 bg-gray-100 w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="IN_PROGRESS">
                            In Progress
                          </SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                      </Select>

                      <ErrorMessage
                        name="status"
                        component="p"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div className="w-full">
                      <label className="text-sm font-medium">
                        Priority <span className="text-red-500">*</span>
                      </label>

                      <Select
                        value={values.priority}
                        onValueChange={(value) =>
                          setFieldValue("priority", value)
                        }
                      >
                        <SelectTrigger className="mt-2 bg-gray-100 w-full">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                        </SelectContent>
                      </Select>

                      <ErrorMessage
                        name="priority"
                        component="p"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 p-4 border-t bg-white shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-slate-900 text-white flex items-center justify-center"
                  >
                    {loading ? (
                      <MoonLoader size={18} color="#fff" />
                    ) : editData ? (
                      "Update Task"
                    ) : (
                      "Add Task"
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
};

export default CreateTask;
