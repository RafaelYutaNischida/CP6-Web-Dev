import type { SiteConfig } from '../types'

/**
 * Textos editáveis do portfólio.
 *
 * Campos vazios ('' ou []) NÃO são preenchidos com dados inventados: a interface
 * mostra um aviso "Preencher em src/config/site.ts" no lugar. Edite aqui e pronto.
 */
export const GITHUB_USER: string = import.meta.env.VITE_GITHUB_USER || 'RafaelYutaNischida'

export const SITE: SiteConfig = {
  // Nome derivado do usuário do GitHub informado. Confirme a grafia.
  name: 'Rafael Yuta Nischida',
  // TODO: título profissional (ex.: o cargo ou área em que você atua)
  role: 'Estudante Engenharia de Software',
  // TODO: frase curta de apresentação exibida na hero
  tagline: 'Desenvolvendo soluções por meio da tecnologia e da inovação.',
  // TODO: parágrafos da seção Sobre Mim
  bio: [
    'Sou estudante de Engenharia de Software na FIAP e estou desenvolvendo minha carreira.',
    'Tenho interesse na área de Dados. Nos meus projetos, já trabalhei com banco de dados e APIs.',
    'Atualmente busco oportunidade de um primeiro emprego na área.',
  ],
  // TODO: e-mail público de contato (exibido no rodapé; opcional)
  email: 'rafaelyutanischida@gmail.com',
  // TODO: cidade/país (opcional)
  location: '',
  // TODO: foto opcional. Use WebP/AVIF e informe as dimensões reais.
  // avatar: { src: '/avatar.webp', width: 480, height: 480, alt: 'Foto de Rafael' },
  social: [
    { label: 'GitHub', url: `https://github.com/${GITHUB_USER}` },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/rafael-nischida-8b5b0239b/' }
    // TODO: adicione LinkedIn e outras redes
    // { label: 'LinkedIn', url: 'https://www.linkedin.com/in/...' },
  ],
  // TODO: habilidades por grupo. Ex.: [{ group: 'Front-end', items: ['React'] }]
  skills: [
  { group: 'Dados', items: ['Python', 'Pandas', 'SQL Server'] },
  { group: 'Ferramentas', items: ['Git', 'Vercel'] },
  ],
  // TODO: formação acadêmica
  // Ex.: { title: 'Curso', organization: 'Instituição', period: '2023 – atual' }
  education: [{
    title: 'Engenharia de Software',
    organization: 'FIAP',
    period: '2026 - 2029',
  }],
  // TODO: experiências profissionais (só as reais)
  experience: [{
    title: 'Projetos acadêmicos publicados no GitHub',
    organization: 'FIAP',
    period: '2026',
  }],
}

/** Quantos projetos em destaque aparecem por padrão quando nenhum foi selecionado no dashboard. */
export const DEFAULT_FEATURED_COUNT = 6
