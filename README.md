# English Kids — Plataforma Educativa de Inglês

English Kids é uma plataforma gamificada para crianças de 6–10 anos aprenderem inglês básico. Reúne jogo por níveis, lições próprias, perfil com avatares e uma área para professores acompanharem turmas e desempenho.

## Recursos

- Login e cadastro com papéis: aluno e professor
- 10 níveis de jogo com perguntas de múltipla escolha
- Sessão “Lessons” com 10 lições que acompanham os níveis
- Desbloqueio sequencial de níveis (acerto ≥ 60%)
- Perfil com nome, bio, idade e avatar
- Seleção de avatares dinâmica em `src/assets/avatars`
- Gestão de turmas e alunos: criação de turmas, edição de progresso e métricas

## Conteúdos dos Níveis/Lições

1. Cores
2. Números (1–10)
3. Animais
4. Objetos da escola
5. Partes do corpo
6. Dias da semana
7. Família
8. Frases com “to be” (am/is/are)
9. Pronomes pessoais
10. Expressões e frases comuns

## Instalação e Execução

- Clonar o repositório
- Instalar dependências: `npm install`
- Rodar em desenvolvimento: `npm start`
- Se precisar trocar a porta no Windows: `set PORT=3001 && npm start`

## Uso e Navegação

- Login/Cadastro: escolha “Aluno” ou “Professor” ao entrar
- Dashboard: abra os níveis do jogo; avance com ≥ 60% de acertos
- Lessons: acesse as lições pelo link “Lessons” na Navbar
- Perfil: edite nome, bio, idade e selecione um avatar
- Professor: gerencie turmas, adicione alunos e edite progresso (níveis, nota final, exercícios e lições concluídas)

## Avatares

- Coloque imagens em `src/assets/avatars` (`.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`)
- O seletor carrega automaticamente os arquivos dessa pasta

## Estrutura

- `src/components`: componentes reutilizáveis e rotas privadas
- `src/contexts`: contexto de autenticação e estado global
- `src/pages`: páginas (`Login`, `Register`, `Dashboard`, `Lessons`, `Lesson`, `Teacher`, `Profile`, `GameLevel`)
- `src/styles`: estilos CSS
- `src/assets/avatars`: imagens de avatares

## Regras do Jogo

- Perguntas de múltipla escolha com feedback imediato
- Avança para a próxima pergunta após o feedback
- Desbloqueio dos níveis com acerto mínimo de 60%
