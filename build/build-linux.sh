cd front
pnpm install
npm run build
cd ..
cd back
npm run build
cd ..
pm2 restart all