# NearPay frontend

NearPay is a responsive React + TypeScript frontend for a nearby-payments experience. The interface includes a welcome flow, guest access, Home, Activity, Contacts, Profile, payment review, QR sharing/scanning, and local sign-out.

**Current integration status:** account and payment services are not connected. Names, balances, contacts, and activity are illustrative; payment actions only update activity in the current browser session. Sign-in does not store or transmit credentials. Signing out clears session activity and returns to welcome.

## Run locally

Use Node.js 20.19+ or 22.12+ and npm. From this repository's directory:

```sh
npm install
npm run dev
```

Open the localhost URL printed by Vite (normally `http://localhost:5173`). Try navigating between pages, reviewing a payment, searching contacts, sharing/scanning a QR code, and signing out from Profile.

## Test and build

```sh
npm test
npm run build
```

`npm test` runs the UI and currency-formatting tests once. `npm run build` type-checks the app and creates a production bundle in `dist/`. To serve the built bundle locally, run `npm run preview`.

## Browser capabilities

- **Receive QR:** creates a scannable code with a NearPay address. It cannot initiate or receive a payment while payment services are disconnected.
- **Scan:** camera scanning requires camera permission and browser support for the Barcode Detection API. If camera access or QR detection is unavailable, paste a code in the manual field. The code is only displayed for review.
- **Nearby devices:** uses the browser's Bluetooth device chooser when Web Bluetooth is available. Device discovery requires a compatible browser and HTTPS or `localhost`; selecting a device does not connect a payment reader.
- **Sign in:** the interface is present, but account access is not available until an authentication service is connected.

The GitHub repository for this frontend is [meowliya/Nearpay-ui](https://github.com/meowliya/Nearpay-ui).
