# perfildev

Portfólio pessoal de **Douglas Augusto** — Desenvolvedor Full Stack (Java, Spring Boot, Go, React).

Site estático multi-página, sem build step, publicado via GitHub Pages.

## Páginas

- `index.html` — Início: apresentação, destaques e projetos em evidência.
- `projetos.html` — Projetos: lista completa puxada em tempo real da API do GitHub.
- `sobre.html` — Sobre mim: perfil, experiência, formação e contato (com opção de salvar como PDF).

## Stack

HTML5, CSS3 (variáveis nativas, sem framework) e JavaScript puro. Os projetos são carregados
dinamicamente via `fetch` na API pública do GitHub (`/users/DouglasAugusto01/repos`), então a
página de projetos sempre reflete os repositórios públicos atuais.

## Rodando localmente

Basta abrir `index.html` no navegador, ou servir a pasta com qualquer servidor estático:

```bash
npx serve .
```

## Deploy

Publicado via GitHub Pages a partir da branch `main` (pasta raiz).
