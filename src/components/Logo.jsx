export default function Logo({ size = 'md', className = '' }) {
  // Logo "mycuma infinity" textuel — reproduit l'esprit des maquettes
  const sz = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-base' : 'text-xl'
  return (
    <div className={`font-bold ${sz} flex items-baseline gap-1 ${className}`}>
      <span className="relative inline-flex items-center">
        <span className="text-white bg-gradient-to-br from-ok to-green-700 rounded-full px-2 py-0.5 text-sm leading-none">my</span>
        <span className="text-ok ml-1 italic">cuma</span>
      </span>
      <span className="text-accent font-light italic">infinity</span>
    </div>
  )
}
