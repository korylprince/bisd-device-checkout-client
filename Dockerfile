FROM alpine:3.8 as builder

ARG VERSION

RUN apk add --no-cache git nodejs

RUN git clone --branch "$VERSION" --single-branch --depth 1 \
    https://github.com/korylprince/bisd-device-checkout-client.git /client

WORKDIR /client

RUN npm install

RUN API_BASE="/checkout/api/1.2" npm run build-prod

FROM alpine:3.8

RUN apk add --no-cache caddy

COPY --from=builder /client/dist /www

WORKDIR /www

RUN echo ":8080" > /Caddyfile && echo "log /dev/stdout" >> /Caddyfile

CMD ["caddy", "-conf", "/Caddyfile"]
