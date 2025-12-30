FROM node:20.19-alpine3.20 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV SKIP_ENV_VALIDATION="true"
ENV DOCKER_OUTPUT=1
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_IS_CLOUD="true"

ARG USESEND_META_TITLE
ARG USESEND_META_DESCRIPTION
ARG USESEND_META_ICON
ARG USESEND_APP_NAME
ARG USESEND_DOCS_URL
ARG USESEND_BASE_URL
ARG SUPPORT_EMAIL
ARG USESEND_DKIM_SELECTOR
ARG USESEND_SUBDOMAIN_PREFIX

ENV USESEND_META_TITLE=${USESEND_META_TITLE}
ENV USESEND_META_DESCRIPTION=${USESEND_META_DESCRIPTION}
ENV USESEND_META_ICON=${USESEND_META_ICON}
ENV USESEND_APP_NAME=${USESEND_APP_NAME}
ENV USESEND_DOCS_URL=${USESEND_DOCS_URL}
ENV USESEND_BASE_URL=${USESEND_BASE_URL}
ENV SUPPORT_EMAIL=${SUPPORT_EMAIL}
ENV USESEND_DKIM_SELECTOR=${USESEND_DKIM_SELECTOR}
ENV USESEND_SUBDOMAIN_PREFIX=${USESEND_SUBDOMAIN_PREFIX}

RUN corepack enable

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
# Replace <your-major-version> with the major version installed in your repository. For example:
# RUN yarn global add turbo@^2
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY ./apps/web ./apps/web
COPY ./packages ./packages
RUN pnpm add turbo@^2.5.2 -g

# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Assuming "web" is the name entered in the project's package.json: { name: "web" }
RUN pnpm turbo prune web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build arguments for version information
# Placed after install to preserve dependency cache when version changes
ARG APP_VERSION=unknown
ARG GIT_SHA=unknown

# Set version as environment variables for Next.js build
ENV NEXT_PUBLIC_APP_VERSION=$APP_VERSION
ENV NEXT_PUBLIC_GIT_SHA=$GIT_SHA

# Build the project
COPY --from=builder /app/out/full/ .

RUN pnpm turbo run build --filter=web...

FROM base AS runner
WORKDIR /app

COPY --from=installer /app/apps/web/next.config.js .
COPY --from=installer /app/apps/web/package.json .
COPY --from=installer /app/pnpm-lock.yaml .


# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer  /app/apps/web/.next/standalone ./
COPY --from=installer  /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer  /app/apps/web/public ./apps/web/public

# Copy prisma files
COPY --from=installer  /app/apps/web/prisma/schema.prisma ./apps/web/prisma/schema.prisma
COPY --from=installer  /app/apps/web/prisma/migrations ./apps/web/prisma/migrations
COPY --from=installer  /app/apps/web/node_modules/prisma ./node_modules/prisma
COPY --from=installer  /app/apps/web/node_modules/@prisma ./node_modules/@prisma

# Symlink the prisma binary
RUN mkdir node_modules/.bin
RUN ln -s /app/node_modules/prisma/build/index.js ./node_modules/.bin/prisma

# set this so it throws error where starting server
ENV SKIP_ENV_VALIDATION="false"

COPY  ./docker/start.sh ./start.sh

CMD ["sh", "start.sh"]
