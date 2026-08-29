# Install MonteMove on your iPhone via AltStore (no paid dev account needed)

This guide gets the app running on your physical iPhone using a **free Apple ID**.
Free-account limits: the app must be re-signed every **7 days** and you can have
**3 sideloaded apps** max. AltServer refreshes automatically when your PC and
phone are on the same Wi‑Fi.

---

## 1. Prepare your Windows PC (one-time)

1. Install **iTunes** and **iCloud** from **apple.com** (NOT the Microsoft Store):
   - https://www.apple.com/itunes/download/win64/
   - https://updates.cdn-apple.com/2020/windows/001-39935-20200911-1A21AA5E-F882-11EA-8955-B45DA4B2ED27/iCloudSetup.exe
2. Download **AltServer** for Windows: https://altstore.io
3. Install and run AltServer (it sits in the system tray).
4. Connect your iPhone via USB → tap **Trust This Computer**.
5. AltServer tray icon → **Install AltStore** → your iPhone.
6. Enter your Apple ID + password (or app-specific password if 2FA is on).
7. On the iPhone: open **AltStore** once → Settings → sign in with the same Apple ID.

## 2. Build the unsigned .ipa (GitHub Actions, free)

Because this PC has no Xcode, the iOS binary is built in the cloud:

1. Create a GitHub repository and push this project:
   ```powershell
   git init
   git add .
   git commit -m "MonteMove v1"
   git remote add origin https://github.com/YOURNAME/montemove.git
   git push -u origin main
   ```
2. Open the repo on github.com → **Actions** tab → wait for
   **"iOS unsigned IPA (for AltStore)"** to finish (~15–25 min).
3. Download the artifact **montemove-unsigned-ipa** and unzip it — you get
   `montemove-unsigned.ipa`.
4. Copy the `.ipa` to your iPhone (AirDrop won't work from Windows — email it to
   yourself, put it in iCloud Drive, or use a cable + Files app).

## 3. Install via AltStore

1. On the iPhone open **AltStore** → **My Apps** → tap **+** (top-left).
2. Pick `montemove-unsigned.ipa` from Files.
3. AltStore re-signs it with **your Apple ID** and installs it. Done!

First launch: Settings → General → **VPN & Device Management** → tap your
Apple ID → **Trust**.

## 4. Keeping it alive

- Keep **AltServer running** on the PC with the same Wi‑Fi as the phone.
- Every ~7 days AltStore refreshes the signature (open AltStore once if
  notifications were dismissed).
- If the certificate expires anyway: My Apps → refresh, or reinstall the IPA —
  data is preserved.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| AltServer can't see the iPhone | Reinstall iTunes + iCloud from apple.com, use another cable/port |
| "Untrusted developer" | Settings → General → VPN & Device Management → Trust |
| Install fails: max apps | Free accounts cap at 3 sideloaded apps — remove one first |
| App crashes on launch | Make sure you used the latest workflow artifact |
| Refresh fails every 7 days | Open AltStore manually while both devices are online |
