function Spinner({ scale }) {
  const size = scale ? `${scale / 100 * 24}px` : '20px';
  return (
    <div className="flex items-center justify-center">
      <div
        className="rounded-full border-2 border-[#2A2A2A] border-t-white animate-spin-mono"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
export default Spinner;
