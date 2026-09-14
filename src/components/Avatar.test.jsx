import { render, screen } from '@testing-library/react'
import Avatar from './Avatar'

describe('Avatar', () => {
  it('exibe as iniciais quando não há foto', () => {
    render(<Avatar name="João Pedro" />)
    expect(screen.getByText('JP')).toBeInTheDocument()
  })

  it('exibe a imagem quando há src', () => {
    render(<Avatar name="João Pedro" src="https://exemplo.com/foto.jpg" />)
    const img = screen.getByAltText('João Pedro')
    expect(img).toHaveAttribute('src', 'https://exemplo.com/foto.jpg')
  })

  it('usa "?" quando o nome é vazio', () => {
    render(<Avatar name="" />)
    expect(screen.getByText('?')).toBeInTheDocument()
  })
})