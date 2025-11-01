
interface props {
    children: React.ReactNode
}

export default function Layout({ children } : props) {
  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient gradient-title">Industry Insights</h1>
      </div>
        {children}
    </div>
  );
}