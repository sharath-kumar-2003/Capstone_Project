import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import background from "/get_started_illustration.jpg";
import { Link, useNavigate } from "react-router-dom";

function GetStarted() {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      if (JSON.parse(userData).type == "user") {
        navigate("/home");
      } else if (JSON.parse(userData).type == "captain") {
        navigate("/captain/home");
      }
    }
  }, []);

  return (
    <div className="quickride-landing relative flex h-full w-full overflow-hidden bg-[#111827] text-white">
      <style>
        {`@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");
        .quickride-landing, .quickride-landing * { font-family: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important; }`}
      </style>

      <img
        src={background}
        alt="QuickRide city travel"
        className="absolute inset-0 h-full w-full object-cover grayscale"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/85" />

      <main className="relative z-10 flex h-full w-full flex-col justify-between px-5 py-6">
        <header className="flex items-center justify-between">
          <div className="text-xl font-extrabold tracking-normal text-white">
            QuickRide
          </div>
          <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
            Ride now
          </div>
        </header>

        <section className="pb-2">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-white/70">
            Reliable city rides
          </p>
          <h1 className="max-w-xs text-4xl font-bold leading-[1.05] tracking-normal text-white">
            Move through the city with confidence.
          </h1>
          <p className="mt-4 max-w-xs text-sm font-normal leading-6 text-white/75">
            Book clean, dependable rides with a simple app built for everyday travel.
          </p>
        </section>

        <footer className="rounded-xl border border-white/10 bg-white p-4 text-[#111827] shadow-[0_16px_36px_rgba(0,0,0,0.22)]">
          <div className="mb-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-[10px] bg-[#F3F4F6] px-2 py-3">
              <p className="text-base font-bold text-[#111827]">Fast</p>
              <p className="mt-1 text-[11px] font-medium text-[#6B7280]">pickup</p>
            </div>
            <div className="rounded-[10px] bg-[#F3F4F6] px-2 py-3">
              <p className="text-base font-bold text-[#111827]">Clear</p>
              <p className="mt-1 text-[11px] font-medium text-[#6B7280]">fares</p>
            </div>
            <div className="rounded-[10px] bg-[#F3F4F6] px-2 py-3">
              <p className="text-base font-bold text-[#111827]">Safe</p>
              <p className="mt-1 text-[11px] font-medium text-[#6B7280]">trips</p>
            </div>
          </div>

          <Link
            to="/login"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#111827] px-4 text-sm font-semibold text-white transition duration-200 ease-in-out hover:bg-[#374151] focus:outline-none focus:ring-4 focus:ring-[#111827]/15"
          >
            Continue
            <ArrowRight size={18} strokeWidth={2} />
          </Link>
        </footer>
      </main>
    </div>
  );
}

export default GetStarted;
