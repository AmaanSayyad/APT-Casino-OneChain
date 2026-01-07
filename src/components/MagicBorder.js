export default function MagicBorder({ children }) {
  return (
    <div className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 p-[1px] rounded-lg transition-all duration-300">
      {children}
    </div>
  )
}