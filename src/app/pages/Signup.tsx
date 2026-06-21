import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import instance from "../services/axiosinstance";
import { APIs } from "../services/APIs";
import Swal from "sweetalert2";

const Signup = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values: any) => {
    try {
      await instance.post(`${APIs.authServiceApi}/signup`, values);
      Swal.fire(
        "Success",
        "Signup successful. Login details sent to your email.",
        "success",
      );
      navigate("/");
    } catch (error: any) {
      Swal.fire("Error", error?.response?.data || "Signup failed", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Formik
        initialValues={{
          name: "",
          username: "",
          email: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="w-full max-w-md bg-white p-6 rounded-xl shadow">
            <h1 className="text-2xl font-bold text-center mb-6">Signup</h1>

            <Field
              name="name"
              placeholder="Full Name"
              className="w-full border px-4 py-2 rounded"
            />
            {errors.name && touched.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}

            <Field
              name="username"
              placeholder="Username"
              className="w-full border px-4 py-2 rounded mt-4"
            />
            {errors.username && touched.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}

            <Field
              name="email"
              type="email"
              placeholder="Email"
              className="w-full border px-4 py-2 rounded mt-4"
            />
            {errors.email && touched.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}

            <Field
              name="password"
              type="password"
              placeholder="Password"
              className="w-full border px-4 py-2 rounded mt-4"
            />
            {errors.password && touched.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-2 rounded mt-6"
            >
              Signup
            </button>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/")}
                className="text-blue-600 cursor-pointer"
              >
                Login
              </span>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Signup;
