# synthetics-client

#### Try it here
https://capsynth.netlify.app/

#### Install
```bash
# make sure you're using node 12
nvm use

# npm install
npm i
```

#### Run (in dev)
```bash
# run the client locally
npm run dev
```

#### Build & Deploy
```bash
# build the client
npm run build

# deploy to ipfs
npx ipfs-deploy build
```

#### Using Cloudflare Distributed Gateway

1. Add a CNAME with your.website pointing to cloudflare-ipfs.com.
2. Add a TXT record with the name _dnslink.your.website and value dnslink=/ipfs/<your_ipfs_hash_here>
3. Go to https://www.cloudflare.com/distributed-web-gateway/ and submit your domain name for cloudflare to issue you a certificate.