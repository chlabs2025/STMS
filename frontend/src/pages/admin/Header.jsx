

const Header = ({ title }) => {

  return (
    <header className="bg-white px-8 py-3 flex items-center justify-between h-[64px] border-b border-gray-200 transition-colors duration-300">
      <div className="flex items-center gap-3 w-full">
        <span className="text-orange-600 text-xl font-bold">»</span>
        <h2 className="text-xl font-bold tracking-wide truncate text-orange-600 uppercase text-sm">{title}</h2>
      </div>


    </header>
  )
}

export default Header

