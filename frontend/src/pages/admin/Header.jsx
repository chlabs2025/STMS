const Header = ({ title }) => {
  return (
    <header className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 px-6 py-4 flex items-center h-[80px] shadow-lg border-b border-gray-300/30">
      <div className="flex items-center gap-3 w-full">
        <span className="text-[#ff741f] text-xl font-bold">»</span>
        <h2 className="text-xl font-semibold tracking-wide truncate text-[#ff741f]">{title}</h2>
      </div>
    </header>
  )
}

export default Header

