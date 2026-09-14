function EscalaVisual({ celebracao, data, horario, descricao, funcoes }) {
  if (!celebracao) {
    return (
      <p className="screen__muted">
        Preencha os dados da escala para montar a visualização.
      </p>
    )
  }

  return (
    <div className="escala-visual">
      <h3 className="escala-visual__titulo">
        {celebracao}
        {data && ` ${data}`}
        {horario && ` - ${horario}H`}
      </h3>
      {descricao && <p className="escala-visual__desc">{descricao}</p>}
      <div className="escala-visual__funcoes">
        {funcoes.map((f) => (
          <div key={f.id} className="escala-visual__funcao">
            <p className="escala-visual__funcao-nome">{f.nome}:</p>
            <ul className="escala-visual__lista">
              {f.irmaos.length === 0 && (
                <li className="screen__muted">Sem irmãos escalados</li>
              )}
              {f.irmaos.map((i) => (
                <li key={i.id}>
                  {i.papel ? `${i.papel} - ${i.nome}` : i.nome}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EscalaVisual