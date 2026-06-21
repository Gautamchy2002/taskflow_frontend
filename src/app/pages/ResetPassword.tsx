import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";

import instance from "../services/axiosinstance";
import { APIs } from "../services/APIs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <Formik
        initialValues={{ newPassword: "", confirmPassword: "" }}
        validationSchema={Yup.object({
          newPassword: Yup.string()
            .min(5, "Password must be at least 5 characters")
            .required("New password is required"),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword")], "Passwords must match")
            .required("Confirm password is required"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await instance.post(`${APIs.authServiceApi}/reset-password`, {
              token,
              newPassword: values.newPassword,
            });

            Swal.fire("Success", "Password reset successfully", "success");
            navigate("/login");
          } catch (error: any) {
            Swal.fire(
              "Error",
              error?.response?.data || "Reset failed",
              "error",
            );
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="w-full max-w-md bg-white rounded-xl shadow p-5 sm:p-8">
            <h1 className="text-2xl font-bold text-center">Reset Password</h1>
            <p className="text-sm text-gray-500 text-center mt-2 mb-6">
              Enter your new password.
            </p>

            {!token && (
              <p className="text-red-500 text-sm text-center mb-4">
                Invalid reset link. Token not found.
              </p>
            )}

            <Field
              as={Input}
              name="newPassword"
              type="password"
              placeholder="New password"
            />
            {errors.newPassword && touched.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
            )}

            <Field
              as={Input}
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              className="mt-4"
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}

            <Button disabled={isSubmitting || !token} className="w-full mt-5">
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>

            <p
              onClick={() => navigate("/login")}
              className="text-center text-sm text-blue-600 cursor-pointer mt-4"
            >
              Back to login
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPassword;
