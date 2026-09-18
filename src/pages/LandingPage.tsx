import { Link } from 'react-router-dom'

const RECURSOS = [
  {
    titulo: 'Suas obras, todas juntas',
    texto:
      'Cadastre cada obra com cliente, endereço, valor contratado e prazo. Acompanhe o progresso de todas em uma tela só.',
  },
  {
    titulo: 'Financeiro sem planilha',
    texto:
      'Lance entradas e despesas por obra e veja na hora quanto entrou, quanto saiu e qual é o saldo.',
  },
  {
    titulo: 'Equipe e diárias',
    texto:
      'Cadastre funcionários, registre dias trabalhados e vales. O sistema calcula o valor a pagar sozinho.',
  },
  {
    titulo: 'Progresso visual',
    texto:
      'Marque o andamento por etapa — fundação, alvenaria, acabamento — e mostre pro cliente o quanto já foi feito.',
  },
]

const PLANOS = [
  {
    nome: 'Básico',
    descricao: 'Pra quem está começando a organizar as obras.',
    itens: ['Até 3 obras', 'Controle financeiro', 'Cadastro de funcionários', 'Controle de despesas'],
  },
  {
    nome: 'Profissional',
    descricao: 'Pra quem já toca várias obras ao mesmo tempo.',
    itens: ['Mais obras', 'Financeiro completo', 'Vales', 'Relatórios', 'Progresso das obras'],
    destaque: true,
  },
  {
    nome: 'Empresa',
    descricao: 'Pra construtoras com equipe maior.',
    itens: ['Obras ilimitadas', 'Recursos avançados', 'Relatórios completos', 'Mais usuários'],
  },
]

const FAQ = [
  {
    pergunta: 'Preciso saber mexer em computador?',
    resposta:
      'Não. O ObraFácil foi pensado pra quem usa o celular no canteiro de obra — os formulários são simples e diretos.',
  },
  {
    pergunta: 'Meus dados ficam visíveis pra outras empresas?',
    resposta:
      'Não. Cada empresa só enxerga suas próprias obras, gastos e funcionários. Isso é garantido no próprio banco de dados.',
  },
  {
    pergunta: 'Posso cancelar quando quiser?',
    resposta: 'Sim, a assinatura é mensal e sem fidelidade.',
  },
]

export default function LandingPage() {
  return (
    <div className="bg-concrete text-ink">
      {/* Header */}
      <header className="border-b border-blueprint/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          <span className="font-display text-xl font-semibold text-blueprint">
            ObraFácil
          </span>
          <div className="flex items-center gap-3">
            <Link to="/entrar" className="px-4 py-2 text-sm font-medium text-blueprint hover:text-amber-dark">
              Entrar
            </Link>
            <Link to="/cadastro" className="btn-primary !px-4 !py-2 text-sm">
              Começar agora
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="font-display text-4xl font-semibold leading-tight text-blueprint md:text-5xl">
              Controle suas obras, seus gastos e sua equipe em um só lugar.
            </h1>
            <p className="mt-5 max-w-md text-lg text-ink/70">
              Feito para construtores, empreiteiros e pedreiros que precisam
              de organização no canteiro — sem complicação de planilha.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/cadastro" className="btn-primary">
                Começar agora
              </Link>
              <Link to="/entrar" className="btn-secondary">
                Já tenho conta
              </Link>
            </div>
          </div>
          <div className="border border-blueprint/15 bg-white p-6">
            <p className="text-sm font-medium text-blueprint/60">Casa da Maria</p>
            <p className="mt-1 font-display text-2xl font-semibold text-blueprint">
              R$ 180.000
            </p>
            <div className="mt-4 h-2 w-full bg-blueprint/10">
              <div className="h-2 w-[62%] bg-amber" />
            </div>
            <p className="mt-2 text-sm text-ink/60">62% concluída</p>
            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-blueprint/10 pt-4 text-sm">
              <div>
                <dt className="text-ink/50">Gasto até agora</dt>
                <dd className="font-medium text-blueprint">R$ 97.500</dd>
              </div>
              <div>
                <dt className="text-ink/50">Saldo previsto</dt>
                <dd className="font-medium text-greenwork">R$ 82.500</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section className="border-y border-blueprint/10 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <h2 className="font-display text-3xl font-semibold text-blueprint">
            Tudo que você precisa pra tocar a obra
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {RECURSOS.map((r) => (
              <div key={r.titulo} className="border-l-2 border-amber pl-5">
                <h3 className="font-display text-lg font-semibold text-blueprint">
                  {r.titulo}
                </h3>
                <p className="mt-1 text-ink/70">{r.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <h2 className="font-display text-3xl font-semibold text-blueprint">
          Como funciona
        </h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            'Escolha um plano e crie sua conta.',
            'Cadastre suas obras, funcionários e materiais.',
            'Lance gastos e recebimentos direto do celular, na obra.',
          ].map((passo, i) => (
            <li key={passo} className="border border-blueprint/10 bg-white p-5">
              <span className="font-display text-2xl font-semibold text-amber-dark">
                {i + 1}
              </span>
              <p className="mt-2 text-ink/80">{passo}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Planos */}
      <section className="border-t border-blueprint/10 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <h2 className="font-display text-3xl font-semibold text-blueprint">
            Planos
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PLANOS.map((plano) => (
              <div
                key={plano.nome}
                className={`flex flex-col border p-6 ${
                  plano.destaque
                    ? 'border-blueprint bg-blueprint text-white'
                    : 'border-blueprint/15'
                }`}
              >
                <h3 className="font-display text-xl font-semibold">
                  {plano.nome}
                </h3>
                <p className={`mt-1 text-sm ${plano.destaque ? 'text-white/70' : 'text-ink/60'}`}>
                  {plano.descricao}
                </p>
                <ul className="mt-5 flex-1 space-y-2 text-sm">
                  {plano.itens.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span aria-hidden>—</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/cadastro"
                  className={`mt-6 px-4 py-2.5 text-center text-sm font-medium ${
                    plano.destaque
                      ? 'bg-amber text-blueprint hover:bg-amber-dark'
                      : 'border border-blueprint text-blueprint hover:bg-blueprint hover:text-white'
                  }`}
                >
                  Escolher {plano.nome}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <h2 className="font-display text-3xl font-semibold text-blueprint">
          Perguntas frequentes
        </h2>
        <div className="mt-8 divide-y divide-blueprint/10 border-t border-blueprint/10">
          {FAQ.map((f) => (
            <details key={f.pergunta} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-blueprint">
                {f.pergunta}
                <span className="text-amber-dark group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-2 text-ink/70">{f.resposta}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blueprint/10 bg-blueprint py-10 text-white/70">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <p className="font-display text-lg font-semibold text-white">
            ObraFácil
          </p>
          <p className="mt-2 text-sm">
            Controle de obras para construtores e empreiteiros.
          </p>
        </div>
      </footer>
    </div>
  )
}
