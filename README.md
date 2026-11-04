# NearPay frontend

NearPay is a responsive React + TypeScript frontend concept for a nearby-payments experience. It is a **standalone demo**: there is no backend, authentication, payment processor, or real transaction. Balances, contacts, requests, and activity are sample data; demo interactions live only in browser memory and reset on refresh.

## Run locally

Use Node.js 20.19+ or 22.12+ and npm. From this repository's directory:

```sh
npm install
npm run dev
```

Open the localhost URL printed by Vite (normally `http://localhost:5173`). Start with **Explore the demo**, then try Home, transaction history, contacts, profile, and the send/receive/scan flows. The send flow has a review and confirmation step; confirming changes only the sample activity shown in the page.

## Test and build

```sh
npm test
npm run build
```

`npm test` runs the UI and currency-formatting tests once. `npm run build` type-checks the app and creates a production bundle in `dist/`. To serve the built bundle locally, run `npm run preview`.

## Browser capabilities

- **Receive QR:** creates a scannable code containing only a `nearpay-demo://` sample address. It cannot initiate or receive a payment.
- **Scan:** camera scanning requires camera permission and browser support for the Barcode Detection API (currently available only in some browsers). If camera access or QR detection is unavailable, paste a code in the manual field. The code is only displayed for review.
- **Nearby devices:** uses the browser's Bluetooth device chooser when Web Bluetooth is available. Device discovery requires a compatible browser and HTTPS or `localhost`; selecting a device does not connect to a payment reader.
- **Sign in / create account:** UI preview only. Credentials are not stored or transmitted, and no account is created.

The GitHub repository for this frontend is [meowliya/Nearpay-ui](https://github.com/meowliya/Nearpay-ui). The configured `origin` points to that repository.
