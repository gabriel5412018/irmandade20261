import theme from '../config/theme'

function Card({ children, title, className = '', ...props }) {
  return (
    <div
      className={`card ${className}`.trim()}
      style={{
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.md,
        boxShadow: theme.shadow.sm,
        padding: theme.spacing.lg,
      }}
      {...props}
    >
      {title && <h3 className="card__title">{title}</h3>}
      {children}
    </div>
  )
}

export default Card
