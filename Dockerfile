FROM node:22.14.0

WORKDIR /app

# Instala o PNPM
RUN corepack enable && corepack prepare pnpm@latest --activate

# Evita bloqueios no registro do NPM
RUN npm config set registry https://registry.npmjs.org

COPY package.json pnpm-lock.yaml ./

# Instala as dependências
RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
