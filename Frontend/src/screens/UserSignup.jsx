import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Console from "../utils/console";

function UserSignup() {
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const navigation = useNavigate();
  const signupUser = async (data) => {
    const userData = {
      fullname: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
      email: data.email,
      password: data.password,
      phone: data.phone
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/user/register`,
        userData
      );
      Console.log(response);
      localStorage.setItem("token", response.data.token);
      navigation("/home");
    } catch (error) {
      setResponseError(error.response.data[0].msg);
      Console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setResponseError("");
    }, 5000);
  }, [responseError]);

  return (
    <div className="quickride-signup flex h-dvh w-full flex-col justify-between overflow-y-auto bg-[#F3F4F6] px-5 py-6 text-[#111827]">
      <style>
        {`@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");
        .quickride-signup, .quickride-signup * { font-family: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important; }`}
      </style>

      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-4">
        <header className="mb-7">
          <div className="mb-7 text-xl font-extrabold tracking-normal text-[#111827]">
            QuickRide
          </div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
            Rider account
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-normal text-[#111827]">
            Create your account
          </h1>
          <p className="mt-3 text-sm font-normal leading-6 text-[#6B7280]">
            Join QuickRide to book reliable rides and keep your trip details in one place.
          </p>
        </header>

        <section className="rounded-xl border border-[#D1D5DB] bg-white p-5 shadow-[0_12px_28px_rgba(17,24,39,0.07)]">
          <form className="space-y-4" onSubmit={handleSubmit(signupUser)}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="firstname"
                  className="mb-2 block text-sm font-semibold text-[#111827]"
                >
                  First name
                </label>
                <input
                  {...register("firstname")}
                  id="firstname"
                  type="text"
                  autoComplete="given-name"
                  placeholder="First name"
                  aria-invalid={errors.firstname ? "true" : "false"}
                  className="h-12 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm font-normal text-[#111827] outline-none transition duration-200 ease-in-out placeholder:text-[#9CA3AF] focus:border-[#111827] focus:ring-4 focus:ring-[#111827]/10"
                />
                {errors.firstname && (
                  <p className="mt-2 text-xs font-medium text-[#111827]">
                    {errors.firstname.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastname"
                  className="mb-2 block text-sm font-semibold text-[#111827]"
                >
                  Last name
                </label>
                <input
                  {...register("lastname")}
                  id="lastname"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Last name"
                  aria-invalid={errors.lastname ? "true" : "false"}
                  className="h-12 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm font-normal text-[#111827] outline-none transition duration-200 ease-in-out placeholder:text-[#9CA3AF] focus:border-[#111827] focus:ring-4 focus:ring-[#111827]/10"
                />
                {errors.lastname && (
                  <p className="mt-2 text-xs font-medium text-[#111827]">
                    {errors.lastname.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-[#111827]"
              >
                Phone number
              </label>
              <input
                {...register("phone")}
                id="phone"
                type="number"
                autoComplete="tel"
                placeholder="Phone number"
                aria-invalid={errors.phone ? "true" : "false"}
                className="h-12 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm font-normal text-[#111827] outline-none transition duration-200 ease-in-out placeholder:text-[#9CA3AF] focus:border-[#111827] focus:ring-4 focus:ring-[#111827]/10"
              />
              {errors.phone && (
                <p className="mt-2 text-xs font-medium text-[#111827]">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#111827]"
              >
                Email
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                aria-invalid={errors.email ? "true" : "false"}
                className="h-12 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm font-normal text-[#111827] outline-none transition duration-200 ease-in-out placeholder:text-[#9CA3AF] focus:border-[#111827] focus:ring-4 focus:ring-[#111827]/10"
              />
              {errors.email && (
                <p className="mt-2 text-xs font-medium text-[#111827]">
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
                {...register("password")}
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Create a password"
                aria-invalid={errors.password ? "true" : "false"}
                className="h-12 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm font-normal text-[#111827] outline-none transition duration-200 ease-in-out placeholder:text-[#9CA3AF] focus:border-[#111827] focus:ring-4 focus:ring-[#111827]/10"
              />
              {errors.password && (
                <p className="mt-2 text-xs font-medium text-[#111827]">
                  {errors.password.message}
                </p>
              )}
            </div>

            {responseError && (
              <p className="rounded-[10px] border border-[#D1D5DB] bg-[#F9FAFB] px-3 py-2 text-center text-sm font-medium text-[#111827]">
                {responseError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-[10px] bg-[#111827] px-4 text-sm font-semibold text-white transition duration-200 ease-in-out hover:bg-[#374151] focus:outline-none focus:ring-4 focus:ring-[#111827]/15 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm font-normal text-[#6B7280]">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="font-semibold text-[#111827] transition duration-200 ease-in-out hover:text-[#374151]"
            >
              Login
            </Link>
          </p>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-sm">
        <Link
          to={"/captain/signup"}
          className="flex h-12 w-full items-center justify-center rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm font-semibold text-[#111827] transition duration-200 ease-in-out hover:border-[#9CA3AF] hover:bg-[#F9FAFB] focus:outline-none focus:ring-4 focus:ring-[#111827]/10"
        >
          Sign Up as Captain
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

export default UserSignup;
