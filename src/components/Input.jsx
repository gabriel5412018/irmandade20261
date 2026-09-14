import theme from '../config/theme'

function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error,
  className = '',
  ...props
}) {
  return (
    <label className={`input-field ${className}`.trim()}>
      {label && <span className="input-field__label">{label}</span>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          border: `1px solid ${error ? theme.colors.danger : theme.colors.border}`,
        }}
        {...props}
      />
      {error && <span className="input-field__error">{error}</span>}
    </label>
  )
}

export default Input
