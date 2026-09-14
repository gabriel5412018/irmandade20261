import theme from '../config/theme'

const variants = {
  primary: {
    background: theme.colors.primary,
    color: '#ffffff',
    border: theme.colors.primary,
  },
  secondary: {
    background: theme.colors.surface,
    color: theme.colors.text,
    border: theme.colors.border,
  },
  success: {
    background: theme.colors.success,
    color: '#ffffff',
    border: theme.colors.success,
  },
  danger: {
    background: theme.colors.danger,
    color: '#ffffff',
    border: theme.colors.danger,
  },
}

function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  ...props
}) {
  const style = variants[variant] || variants.primary

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`button button--${variant} ${className}`.trim()}
      style={{
        backgroundColor: style.background,
        color: style.color,
        border: `1px solid ${style.border}`,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
