import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button', () => {
  it('renderiza o conteúdo dos filhos', () => {
    render(<Button>Entrar</Button>)
    expect(
      screen.getByRole('button', { name: 'Entrar' }),
    ).toBeInTheDocument()
  })

  it('aplica a variante primary por padrão', () => {
    render(<Button>Primário</Button>)
    const button = screen.getByRole('button', { name: 'Primário' })
    expect(button).toHaveClass('button--primary')
  })

  it('aplica a variante danger', () => {
    render(<Button variant="danger">Excluir</Button>)
    const button = screen.getByRole('button', { name: 'Excluir' })
    expect(button).toHaveClass('button--danger')
  })

  it('chama onClick ao clicar', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Clique</Button>)
    await user.click(screen.getByRole('button', { name: 'Clique' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('não chama onClick quando desabilitado', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Desabilitado
      </Button>,
    )
    await user.click(screen.getByRole('button', { name: 'Desabilitado' }))
    expect(onClick).not.toHaveBeenCalled()
  })
})