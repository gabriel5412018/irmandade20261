import theme from '../config/theme'

const toneColors = {
  success: theme.colors.success,
  warning: theme.colors.warning,
  danger: theme.colors.danger,
  info: theme.colors.primary,
  neutral: theme.colors.textMuted,
}

function Badge({ children, tone = 'neutral', className = '' }) {
  const color = toneColors[tone] || toneColors.neutral

  return (
    <span
      className={`badge badge--${tone} ${className}`.trim()}
      style={{
        color,
        backgroundColor: `${color}1a`,
        border: `1px solid ${color}40`,
        borderRadius: theme.radius.full,
        fontSize: theme.typography.small,
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
      }}
    >
      {children}
    </span>
  )
}

export default Badge
