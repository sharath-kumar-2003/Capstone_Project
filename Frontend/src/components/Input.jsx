function Input({ label, type, name, placeholder, defaultValue, register, error, options, disabled }) {
  const inputClasses = `w-full bg-[#171717] border border-[#2A2A2A] px-4 py-3 rounded-[14px] outline-none text-sm text-white placeholder:text-[#5E5E5E] transition-all duration-200 ease-in-out focus:border-white focus:shadow-[0_0_0_3px_rgba(255,255,255,0.06)] my-1 ${disabled ? "cursor-not-allowed select-none text-[#5E5E5E] opacity-60" : ""}`;

  return (
    <div className="my-2">
      {label && (
        <h1 className="font-semibold text-sm text-[#CFCFCF] mb-1">{label}</h1>
      )}
      {type == "select" ? (
        <select
          {...register(name)}
          defaultValue={defaultValue}
          className={`${inputClasses} appearance-none`}
        >
          {options.map((option) => {
            return (
              <option key={option} value={option.toLowerCase()} className="bg-[#171717] text-white">
                {option}
              </option>
            );
          })}
        </select>
      ) : (
        <input
          {...register(name)}
          type={type || "text"}
          placeholder={placeholder || label}
          className={inputClasses}
          disabled={disabled}
          defaultValue={defaultValue}
        />
      )}
      {error && <p className="text-xs text-[#9A9A9A] mt-1">{error.message}</p>}
    </div>
  );
}

export default Input;
