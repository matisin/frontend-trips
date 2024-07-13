ARG NODE_ENV=dev
FROM node:18.20.0-alpine as base
LABEL author="matias medina" maintainer="matias.medina.s2@gmail.com"
ENV TZ=America/Santiago

RUN npm i -g pnpm@8.3.0
ENV PNPM_HOME=/usr/local/bin

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN pnpm add -g serve

WORKDIR /workspace
COPY tsconfig.json \
     package.json \
     pnpm-lock.yaml \
     .eslintrc.cjs \
     cypress.config.ts \
     env.d.ts \
     index.html \
     tsconfig.app.json \
     tsconfig.node.json \
     tsconfig.vitest.json \
     vite.config.ts \
     vitest.config.ts ./

COPY public ./public
COPY cypress ./cypress
EXPOSE 5173

FROM base as dev

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY src ./src
RUN pnpm build
CMD ["pnpm","dev","--port","5173", "--host"]

FROM base as production

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
COPY --from=dev /workspace/dist ./dist
CMD ["serve","-l","5173","-s", "dist"]

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}

ENV BUILD prod

