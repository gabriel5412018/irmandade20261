import { render, screen } from '@testing-library/react'
import Badge from './Badge'

describe('Badge', () => {
  it('renderiza o texto', () => {
    render(<Badge>Confirmado</Badge>)
    expect(screen.getByText('Confirmado')).toBeInTheDocument()
  })

  it('aplica a classe do tom informado', () => {
    render(<Badge tone="success">Confirmado</Badge>)
    expect(screen.getByText('Confirmado')).toHaveClass('badge--success')
  })

  it('usa o tom neutral por padrão', () => {
    render(<Badge>Neutro</Badge>)
    expect(screen.getByText('Neutro')).toHaveClass('badge--neutral')
  })
})