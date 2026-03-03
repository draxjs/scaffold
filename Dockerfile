#BULDER
FROM node:24-slim as builder

# Native deps for node-gyp (better-sqlite3, etc.)
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

#BACKEND Dependencies
COPY ./back/package.json /workspace/back/package.json
COPY ./back/package-lock.json /workspace/back/package-lock.json

WORKDIR /workspace/back
RUN npm install


#FRONTEND Dependencies
COPY ./front/package.json /workspace/front/package.json
COPY ./front/package-lock.json /workspace/front/package-lock.json

WORKDIR /workspace/front
RUN npm install

#CP APPs BACKEND & FRONTEND
COPY ./back /workspace/back
COPY ./front /workspace/front

#BACKEND BUILD
WORKDIR /workspace/back
RUN npm run build

#FRONTEND BUILD
WORKDIR /workspace/front
RUN npm run build

#RUNNER
FROM node:24-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends bash \
  && rm -rf /var/lib/apt/lists/*

# Native deps for node-gyp (better-sqlite3, etc.)
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

RUN npm install pm2 -g

COPY --from=builder /workspace/out /app

WORKDIR /app
RUN npm install --only=production

ENTRYPOINT ["pm2-runtime", "start", "index.js"]
