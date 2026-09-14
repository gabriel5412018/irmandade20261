import theme from '../config/theme'

function Textarea({
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
  required = false,
  className = '',
  ...props
}) {
  return (
    <label className={`textarea-field ${className}`.trim()}>
      {label && <span className="textarea-field__label">{label}</span>}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        style={{
          border: `1px solid ${theme.colors.border}`,
        }}
        {...props}
      />
    </label>
  )
}

export default Textarea
