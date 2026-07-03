import { Link } from "react-router-dom";
import Spinner from "./Spinner";

function Button({ path, title, icon, type, classes, fun, loading, loadingMessage, disabled }) {
  const baseClasses = `flex justify-center items-center gap-2 py-3.5 px-5 font-semibold text-sm w-full rounded-[14px] cursor-pointer transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed`;
  
  const defaultStyle = `bg-white text-[#0A0A0A] hover:bg-[#E5E5E5] active:bg-[#CFCFCF]`;

  return (
    <>
      {type == "link" ? (
        <Link
          to={path}
          className={`${baseClasses} ${classes || defaultStyle}`}
        >
          {title} {icon}
        </Link>
      ) : (
        <button
          type={type || null}
          className={`${baseClasses} ${classes || defaultStyle} ${loading && "cursor-not-allowed"}`}
          onClick={fun}
          disabled={loading || disabled}
        >
          {loading ? <span className="flex gap-2 items-center"><Spinner />{loadingMessage}</span> : title}
        </button>
      )}
    </>
  );
}

export default Button;
