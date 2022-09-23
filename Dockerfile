FROM alpine:3.16 as builder

ARG VERSION

RUN apk add --no-cache git nodejs npm

RUN git clone --branch "$VERSION" --single-branch --depth 1 \
    https://github.com/korylprince/bisd-device-checkout-client.git /client

WORKDIR /client

RUN npm install

RUN VITE_API_BASE="/checkout/api/1.4" npm run build

FROM alpine:3.16

RUN apk add --no-cache caddy

COPY --from=builder /client/dist /www

WORKDIR /www

COPY Caddyfile /

CMD ["caddy", "run", "--config", "/Caddyfile"]
