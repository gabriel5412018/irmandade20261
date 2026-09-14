import { render, screen } from '@testing-library/react'
import EscalaVisual from './EscalaVisual'

describe('EscalaVisual', () => {
  it('mostra aviso quando não há celebração', () => {
    render(
      <EscalaVisual
        celebracao=""
        data=""
        horario=""
        descricao=""
        funcoes={[]}
      />,
    )
    expect(
      screen.getByText('Preencha os dados da escala para montar a visualização.'),
    ).toBeInTheDocument()
  })

  it('exibe título com celebração, data e horário', () => {
    render(
      <EscalaVisual
        celebracao="Santa Missa"
        data="06/09/2026"
        horario="19:00"
        descricao=""
        funcoes={[]}
      />,
    )
    expect(
      screen.getByText('Santa Missa 06/09/2026 - 19:00H'),
    ).toBeInTheDocument()
  })

  it('exibe a descrição quando informada', () => {
    render(
      <EscalaVisual
        celebracao="Santa Missa"
        data="06/09/2026"
        horario="19:00"
        descricao="1° Domingo Mês - Noite"
        funcoes={[]}
      />,
    )
    expect(
      screen.getByText('1° Domingo Mês - Noite'),
    ).toBeInTheDocument()
  })

  it('exibe funções e irmãos com papel no formato "papel - nome"', () => {
    render(
      <EscalaVisual
        celebracao="Santa Missa"
        data="06/09/2026"
        horario="19:00"
        descricao=""
        funcoes={[
          {
            id: '1',
            nome: 'AMBÃO',
            irmaos: [{ id: '1', nome: 'Fábio', papel: 'LI' }],
          },
        ]}
      />,
    )
    expect(screen.getByText('AMBÃO:')).toBeInTheDocument()
    expect(screen.getByText('LI - Fábio')).toBeInTheDocument()
  })

  it('exibe irmão sem papel apenas com o nome', () => {
    render(
      <EscalaVisual
        celebracao="Santa Missa"
        data="06/09/2026"
        horario="19:00"
        descricao=""
        funcoes={[
          {
            id: '1',
            nome: 'CRUZ',
            irmaos: [{ id: '1', nome: 'João Pedro', papel: null }],
          },
        ]}
      />,
    )
    expect(screen.getByText('João Pedro')).toBeInTheDocument()
  })

  it('indica quando uma função não tem irmãos', () => {
    render(
      <EscalaVisual
        celebracao="Santa Missa"
        data="06/09/2026"
        horario="19:00"
        descricao=""
        funcoes={[{ id: '1', nome: 'SALÃO', irmaos: [] }]}
      />,
    )
    expect(screen.getByText('Sem irmãos escalados')).toBeInTheDocument()
  })
})