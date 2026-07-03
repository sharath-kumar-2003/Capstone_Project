import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Console from "../utils/console";

function UserLogin() {
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const navigation = useNavigate();

  const loginUser = async (data) => {
    if (data.email.trim() !== "" && data.password.trim() !== "") {
      try {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/user/login`,
          data
        );
        console.log("LOGIN RESPONSE:", response);
        console.log("TOKEN:", response.data.token);
        Console.log(response);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            type: "user",
            data: response.data.user,
          })
        );
        navigation("/home");
      } catch (error) {
        setResponseError(error.response.data.message);
        Console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setResponseError("");
    }, 5000);
  }, [responseError]);

  return (
    <div className="quickride-login flex h-dvh w-full flex-col justify-between bg-[#F3F4F6] px-5 py-6 text-[#111827]">
      <style>
        {`@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");
        .quickride-login, .quickride-login * { font-family: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important; }`}
      </style>

      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
        <header className="mb-8">
          <div className="mb-8 text-xl font-extrabold tracking-normal text-[#111827]">
            QuickRide
          </div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
            Rider account
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-normal text-[#111827]">
            Welcome back
          </h1>
          <p className="mt-3 text-sm font-normal leading-6 text-[#6B7280]">
            Sign in to book rides, manage trips, and get moving with QuickRide.
          </p>
        </header>

        <section className="rounded-xl border border-[#D1D5DB] bg-[#FFFFFF] p-5 shadow-[0_12px_28px_rgba(17,24,39,0.07)]">
          <form className="space-y-4" onSubmit={handleSubmit(loginUser)}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#111827]"
              >
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                })}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="h-12 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm font-normal text-[#111827] outline-none transition duration-200 ease-in-out placeholder:text-[#9CA3AF] focus:border-[#111827] focus:ring-4 focus:ring-[#111827]/10"
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="mt-2 text-xs font-medium text-[#DC2626]"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#111827]"
              >
                Password
              </label>
              <input
                {...register("password", {
                  required: "Password is required",
                })}
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className="h-12 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm font-normal text-[#111827] outline-none transition duration-200 ease-in-out placeholder:text-[#9CA3AF] focus:border-[#111827] focus:ring-4 focus:ring-[#111827]/10"
              />
              {errors.password && (
                <p
                  id="password-error"
                  className="mt-2 text-xs font-medium text-[#DC2626]"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            {responseError && (
              <p className="rounded-[10px] border border-[#D1D5DB] bg-[#F9FAFB] px-3 py-2 text-center text-sm font-medium text-[#111827]">
                {responseError}
              </p>
            )}

            <div className="flex justify-end">
              <Link
                to="/user/forgot-password"
                className="text-sm font-semibold text-[#111827] transition duration-200 ease-in-out hover:text-[#374151]"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-[10px] bg-[#111827] px-4 text-sm font-semibold text-white transition duration-200 ease-in-out hover:bg-[#374151] focus:outline-none focus:ring-4 focus:ring-[#111827]/15 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm font-normal text-[#6B7280]">
            Don't have an account?{" "}
            <Link
              to={"/signup"}
              className="font-semibold text-[#111827] transition duration-200 ease-in-out hover:text-[#374151]"
            >
              Sign up
            </Link>
          </p>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-sm">
        <Link
          to={"/captain/login"}
          className="flex h-12 w-full items-center justify-center rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm font-semibold text-[#111827] transition duration-200 ease-in-out hover:border-[#9CA3AF] hover:bg-[#F9FAFB] focus:outline-none focus:ring-4 focus:ring-[#111827]/10"
        >
          Login as Captain
        </Link>
        <p className="mt-5 text-center text-xs font-normal leading-5 text-[#6B7280]">
          This site is protected by reCAPTCHA and the Google{" "}
          <span className="font-semibold text-[#111827] underline">
            Privacy Policy
          </span>{" "}
          and{" "}
          <span className="font-semibold text-[#111827] underline">
            Terms of Service
          </span>{" "}
          apply.
        </p>
      </footer>
    </div>
  );
}

export default UserLogin;
