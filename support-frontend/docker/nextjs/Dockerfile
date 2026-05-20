FROM node:22-alpine

RUN apk add --no-cache libc6-compat

RUN corepack enable && corepack prepare yarn@4.14.1 --activate

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN yarn config set enableImmutableInstalls false && \
    yarn install

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["yarn", "dev"]