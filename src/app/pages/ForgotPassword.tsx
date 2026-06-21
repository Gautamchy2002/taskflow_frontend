import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import instance from "../services/axiosinstance";
import { APIs } from "../services/APIs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ForgotPassword = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <Formik
        initialValues={{ email: "" }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await instance.post(
              `${APIs.authServiceApi}/forgot-password`,
              values,
            );
            Swal.fire("Success", "Reset link sent to your email", "success");
          } catch (error: any) {
            Swal.fire(
              "Error",
              error?.response?.data || "Failed to send link",
              "error",
            );
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="w-full max-w-md bg-white rounded-xl shadow p-5 sm:p-8">
            <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
            <p className="text-sm text-gray-500 text-center mt-2 mb-6">
              Enter your email to receive a reset link.
            </p>

            <Field as={Input} name="email" placeholder="Email address" />
            {errors.email && touched.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}

            <Button disabled={isSubmitting} className="w-full mt-5">
              {isSubmitting ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
