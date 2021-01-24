test:
		DEBUG=axios npm run test

lint:
		npm run lint

prebulish:
		npm publish --dry-run

run1:
		DEBUG=page-loader npx node 'bin/page-loader.js' --output /tmp https://github.com/

run2:
		DEBUG=page-loader npx node 'bin/page-loader.js' --output /var https://github.com/

run3:
		DEBUG=page-loader npx node 'bin/page-loader.js' --output /tmp https://wrong.site/