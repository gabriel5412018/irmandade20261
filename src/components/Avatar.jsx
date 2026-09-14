import theme from '../config/theme'

function Avatar({ name, src, size = 48, className = '' }) {
  const initials = name
    ? name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?'

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'avatar'}
        className={`avatar ${className}`.trim()}
        style={{
          width: size,
          height: size,
          borderRadius: theme.radius.full,
          objectFit: 'cover',
        }}
      />
    )
  }

  return (
    <div
      className={`avatar avatar--fallback ${className}`.trim()}
      style={{
        width: size,
        height: size,
        borderRadius: theme.radius.full,
        backgroundColor: theme.colors.primaryLight,
        color: theme.colors.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size / 2.6,
        fontWeight: 600,
      }}
    >
      {initials}
    </div>
  )
}

export default Avatar
