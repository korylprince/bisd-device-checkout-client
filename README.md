# Info

This is the front end interface for [bisd-device-checkout-server](https://github.com/korylprince/bisd-device-checkout-server), a small portal to assist in device checkout at Bullard ISD.

# Install

```
git clone https://github.com/korylprince/bisd-device-checkout-client.git
cd bisd-device-checkout-client
npm install
```

# Development

```
API_SERVER="http://localhost:8080" VITE_API_BASE="<api_location>" npm run dev
```

# Build for Production

```
VITE_API_BASE="<api_location>" npm run build
```

# Linting

```
npm run lint
```

# Libraries

(Of particular note)

* [vue](https://vuejs.org/)
* [vue-material](http://vuematerial.io)
* [vee-validate](https://baianat.github.io/vee-validate/)
* [axios](https://github.com/axios/axios)

See package.json for all dependencies.
