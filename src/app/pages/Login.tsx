import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import instance from "../services/axiosinstance";
import { APIs } from "../services/APIs";
import { setAuthData } from "../services/redux/slice/authSlice";
import Swal from "sweetalert2";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values: any) => {
    try {
      const response = await instance.post(
        `${APIs.authServiceApi}/login`,
        values,
      );

      dispatch(
        setAuthData({
          authData: {
            username: response.data.username,
            email: response.data.email,
            roles: response.data.roles,
          },
          accessToken: response.data.token,
          refreshToken: response.data.refreshToken,
        }),
      );

      navigate("/dashboard");
    } catch (error: any) {
      Swal.fire("Error", error?.response?.data || "Login failed", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="w-full max-w-md bg-white p-6 rounded-xl shadow">
            <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

            <Field
              name="username"
              placeholder="Username"
              className="w-full border px-4 py-2 rounded"
            />
            {errors.username && touched.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
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

            <p
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-blue-600 cursor-pointer mt-2 text-right"
            >
              Forgot Password?
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded mt-6"
            >
              Login
            </button>

            <p className="text-center text-sm mt-4">
              Don&apos;t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-blue-600 cursor-pointer"
              >
                Signup
              </span>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
