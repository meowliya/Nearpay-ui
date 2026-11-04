import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { QRCodeSVG } from "qrcode.react";
import { formatCurrency } from "./lib/format";

type Screen = "Home" | "History" | "Contacts" | "Profile";
type Flow = "pay" | "receive" | "scan" | "signin" | "onboard" | null;
type Transaction = typeof transactions[number];
type IncomingRequest = {
  id: number;
  name: string;
  handle: string;
  amount: number;
  color: string;
  initials: string;
  note: string;
};
type IconName =
  | "home"
  | "history"
  | "contacts"
  | "profile"
  | "arrow"
  | "send"
  | "download"
  | "scan"
  | "plus"
  | "search"
  | "bell"
  | "chevron"
  | "close"
  | "check"
  | "clock"
  | "coffee"
  | "shopping"
  | "dots"
  | "qr"
  | "settings"
  | "help"
  | "logout"
  | "copy"
  | "shield";

type IconProps = { name: IconName; size?: number; className?: string };

const contacts = [
  { name: "Azam", handle: "@azam01", color: "lavender", initials: "A", online: true },
  { name: "Sidra", handle: "@sidra01", color: "mint", initials: "S", online: true },
  { name: "Khan", handle: "@khan01", color: "blue", initials: "K", online: false },
  { name: "Ali", handle: "@ali01", color: "peach", initials: "A", online: true },
  { name: "Zoya", handle: "@zoya01", color: "yellow", initials: "Z", online: false },
  { name: "Arman", handle: "@arman01", color: "lavender", initials: "A", online: false },
];

const transactions = [
  { name: "Azam", handle: "@azam01", amount: -50, date: "Today · 2 min ago", color: "lavender", initials: "A", note: "Coffee" },
  { name: "Sidra", handle: "@sidra01", amount: 120, date: "Today · 15 min ago", color: "mint", initials: "S", note: "Lunch" },
  { name: "Khan", handle: "@khan01", amount: -200, date: "Yesterday · 1:00 pm", color: "blue", initials: "K", note: "Groceries" },
  { name: "Ali", handle: "@ali01", amount: 300, date: "Oct 10 · 5:30 pm", color: "peach", initials: "A", note: "Movie tickets" },
  { name: "Zoya", handle: "@zoya01", amount: -70, date: "Oct 09 · 3:20 pm", color: "yellow", initials: "Z", note: "Snacks" },
  { name: "Arman", handle: "@arman01", amount: -150, date: "Oct 08 · 11:10 am", color: "lavender", initials: "A", note: "Bookshop" },
];

const initialRequests: IncomingRequest[] = [
  { id: 1, name: "Sidra", handle: "@sidra01", amount: 85, color: "mint", initials: "S", note: "Lunch yesterday" },
];

function Icon({ name, size = 20, className }: IconProps) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5m4-1v5l3 2" /></>,
    contacts: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 8v6m-3-3h6" /></>,
    profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    arrow: <><path d="M5 12h14m-7-7 7 7-7 7" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5m-5 5V3" /></>,
    scan: <><path d="M4 8V5a1 1 0 0 1 1-1h3m8 0h3a1 1 0 0 1 1 1v3m0 8v3a1 1 0 0 1-1 1h-3m-8 0H5a1 1 0 0 1-1-1v-3" /><path d="M8 12h8" /></>,
    plus: <><path d="M12 5v14m-7-7h14" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    coffee: <><path d="M10 2v2m4-2v2M4 7h15l-1.5 13h-12L4 7Zm15 3h1a2 2 0 1 1 0 4h-1" /></>,
    shopping: <><path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 8H6" /><circle cx="10" cy="21" r="1" /><circle cx="18" cy="21" r="1" /></>,
    dots: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
    qr: <><path d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3z" /><path d="M14 14h3v3h-3zm5 0h2m-7 5h3m2-2v4" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.4.8l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.4-.8l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.7l-1.4-1.1L7.9 9.9l1.7.7a8 8 0 0 1 1.4-.8l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.4.8l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.6Z" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-1 .9-1.7 1.2-1.7 2.7m0 3v.1" /></>,
    logout: <><path d="M10 17l5-5-5-5m5 5H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></>,
    copy: <><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
  };
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function Avatar({ initials, color, size = "normal" }: { initials: string; color: string; size?: "normal" | "small" | "large" }) {
  return <span className={`avatar avatar-${color} avatar-${size}`} aria-hidden="true">{initials}</span>;
}

function App() {
  const [screen, setScreen] = useState<Screen>("Home");
  const [flow, setFlow] = useState<Flow>("onboard");
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Paid" | "Received">("All");
  const [notice, setNotice] = useState("");
  const [paymentStep, setPaymentStep] = useState<"details" | "review" | "success">("details");
  const [demoTransactions, setDemoTransactions] = useState(transactions);
  const [incomingRequests, setIncomingRequests] = useState(initialRequests);
  const [scanText, setScanText] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [foundDevice, setFoundDevice] = useState("");
  const [deviceError, setDeviceError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanTimerRef = useRef<number | null>(null);
  const numericAmount = Number(amount);
  const amountError = amount !== "" && (!Number.isFinite(numericAmount) || numericAmount <= 0 || numericAmount > 100000);

  const visibleContacts = useMemo(
    () => contacts.filter((contact) => `${contact.name} ${contact.handle}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );
  const visibleTransactions = useMemo(
    () => demoTransactions.filter((transaction) =>
      (filter === "All" || (filter === "Paid" ? transaction.amount < 0 : transaction.amount > 0))
      && `${transaction.name} ${transaction.handle} ${transaction.note}`.toLowerCase().includes(query.toLowerCase()),
    ),
    [demoTransactions, filter, query],
  );

  function startFlow(nextFlow: Exclude<Flow, null>, contact = contacts[0]) {
    setSelectedContact(contact);
    setAmount("");
    setNote("");
    setPaymentStep("details");
    setAuthMessage("");
    setFlow(nextFlow);
  }

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  function closeFlow() {
    stopCamera();
    setFlow(null);
    setPaymentStep("details");
  }

  function stopCamera() {
    if (scanTimerRef.current !== null) window.clearTimeout(scanTimerRef.current);
    scanTimerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraActive(false);
  }

  useEffect(() => () => {
    if (scanTimerRef.current !== null) window.clearTimeout(scanTimerRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  function reviewDemo() {
    if (!amount || amountError) return;
    setPaymentStep("review");
  }

  function confirmDemo() {
    if (!amount || amountError) return;
    setDemoTransactions((current) => [{
      ...selectedContact,
      amount: -Number(amount),
      date: "Just now",
      note: note || "Demo payment",
      handle: selectedContact.handle,
      name: selectedContact.name,
    }, ...current]);
    setPaymentStep("success");
  }

  function respondToRequest(request: IncomingRequest, accept: boolean) {
    setIncomingRequests((current) => current.filter((item) => item.id !== request.id));
    if (accept) {
      setDemoTransactions((current) => [{
        ...request,
        amount: -request.amount,
        date: "Just now",
        note: `Accepted request · ${request.note}`,
      }, ...current]);
      showNotice(`Demo request marked paid. No money was moved.`);
    } else {
      showNotice("Demo request declined.");
    }
  }

  async function startCamera() {
    setCameraError("");
    const BrowserBarcodeDetector = (window as Window & {
      BarcodeDetector?: new (options?: { formats: string[] }) => {
        detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
      };
    }).BarcodeDetector;
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera access is not available here. Enter a demo code below instead.");
      return;
    }
    if (!BrowserBarcodeDetector) {
      setCameraError("This browser does not support QR detection. Enter a demo code below instead.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      if (!videoRef.current) {
        stopCamera();
        return;
      }
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setCameraActive(true);
      const detector = new BrowserBarcodeDetector({ formats: ["qr_code"] });
      const scan = async () => {
        if (!videoRef.current || !streamRef.current) return;
        try {
          const codes = await detector.detect(videoRef.current);
          if (codes[0]?.rawValue) {
            setScanText(codes[0].rawValue);
            stopCamera();
            showNotice("Code scanned. Review it before continuing; nothing will be paid.");
            return;
          }
        } catch {
          setCameraError("Could not read the QR code. Try adjusting the camera or enter the code below.");
        }
        scanTimerRef.current = window.setTimeout(scan, 350);
      };
      scanTimerRef.current = window.setTimeout(scan, 350);
    } catch (error) {
      stopCamera();
      const name = error instanceof Error ? error.name : "";
      setCameraError(name === "NotAllowedError"
        ? "Camera permission was denied. Allow access in browser settings or enter a code below."
        : "Could not start the camera. Check that it is available or enter a code below.");
    }
  }

  async function discoverDevice() {
    setDeviceError("");
    setFoundDevice("");
    const bluetooth = (navigator as Navigator & {
      bluetooth?: {
        requestDevice: (options: { acceptAllDevices: boolean }) => Promise<{ name?: string | null }>;
      };
    }).bluetooth;
    if (!bluetooth) {
      setDeviceError("Bluetooth discovery is not supported in this browser. Use a compatible browser on HTTPS or localhost.");
      return;
    }
    try {
      const device = await bluetooth.requestDevice({ acceptAllDevices: true });
      setFoundDevice(device.name || "Nearby device");
    } catch (error) {
      if (error instanceof Error && error.name === "NotFoundError") return;
      setDeviceError(error instanceof Error && error.name === "SecurityError"
        ? "Bluetooth discovery requires HTTPS or localhost."
        : "Could not discover a device. Check Bluetooth and browser permissions.");
    }
  }

  const navItems: { label: Screen; icon: IconName }[] = [
    { label: "Home", icon: "home" },
    { label: "History", icon: "history" },
    { label: "Contacts", icon: "contacts" },
    { label: "Profile", icon: "profile" },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); setScreen("Home"); }}>
          <span className="brand-mark">N</span><span>Near<span className="brand-light">Pay</span></span>
        </a>
        <div className="sidebar-label">MENU</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button key={item.label} className={`nav-link ${screen === item.label ? "active" : ""}`} onClick={() => { setScreen(item.label); setQuery(""); }}>
              <Icon name={item.icon} size={19} /><span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <div className="tip-icon"><Icon name="shield" size={18} /></div>
            <strong>Nearby, simply.</strong>
            <p>A friendly preview of payments made close by.</p>
            <button className="text-button" onClick={() => showNotice("This frontend demo does not connect to a payment service.")}>Learn more <Icon name="arrow" size={14} /></button>
          </div>
          <div className="sidebar-user">
            <Avatar initials="S" color="green" size="small" />
            <div><strong>Shahan</strong><span>@shahan01</span></div>
            <button className="icon-button" aria-label="More account options" onClick={() => setScreen("Profile")}><Icon name="dots" size={18} /></button>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark">N</span> Near<span className="brand-light">Pay</span></div>
          <div className="breadcrumb"><span>Workspace</span><Icon name="chevron" size={14} /><strong>{screen}</strong></div>
          <div className="topbar-actions">
            <span className="demo-pill"><i /> Demo mode</span>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => showNotice("You're all caught up.")}><Icon name="bell" size={19} /><i /></button>
            <Avatar initials="S" color="green" size="small" />
          </div>
        </header>

        <div className="page-content">
          {screen === "Home" && <HomeScreen onFlow={startFlow} onNavigate={setScreen} items={demoTransactions} onScan={() => startFlow("scan")} onDiscover={discoverDevice} foundDevice={foundDevice} deviceError={deviceError} />}
          {screen === "History" && (
            <HistoryScreen
              query={query}
              onQuery={setQuery}
              filter={filter}
              onFilter={setFilter}
              items={visibleTransactions}
            />
          )}
          {screen === "Contacts" && (
            <ContactsScreen
              query={query}
              onQuery={setQuery}
              items={visibleContacts}
              onPay={(contact) => startFlow("pay", contact)}
            />
          )}
          {screen === "Profile" && <ProfileScreen onReceive={() => startFlow("receive")} onNotice={showNotice} onSignIn={() => startFlow("signin")} onScan={() => startFlow("scan")} onDiscover={discoverDevice} foundDevice={foundDevice} deviceError={deviceError} />}
          {(screen === "Home" || screen === "History") && incomingRequests.length > 0 && (
            <section className="panel incoming-requests">
              <div className="section-heading">
                <div><h2>Incoming requests</h2><p>Review carefully. Marking paid only updates this demo.</p></div>
                <span className="request-count">{incomingRequests.length}</span>
              </div>
              {incomingRequests.map((request) => (
                <div className="incoming-request-row" key={request.id}>
                  <Avatar initials={request.initials} color={request.color} size="small" />
                  <div className="transaction-info"><strong>{request.name} requested {formatCurrency(request.amount)}</strong><span>{request.note} · {request.handle}</span></div>
                  <button className="button button-outline request-action" onClick={() => respondToRequest(request, false)}>Decline</button>
                  <button className="button button-primary request-action" onClick={() => respondToRequest(request, true)}>Mark paid</button>
                </div>
              ))}
            </section>
          )}
        </div>
        <footer className="page-footer"><span>NearPay preview</span><span>Local demo content · No real payments</span></footer>
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <button key={item.label} className={screen === item.label ? "active" : ""} onClick={() => { setScreen(item.label); setQuery(""); }}>
            <Icon name={item.icon} size={19} /><span>{item.label}</span>
          </button>
        ))}
      </nav>

      {flow && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeFlow(); }}>
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button className="icon-button modal-close" aria-label="Close dialog" onClick={closeFlow}><Icon name="close" /></button>
            {flow === "onboard" ? (
              <>
                <div className="modal-kicker"><span className="kicker-icon"><Icon name="shield" size={17} /></span> A FRIENDLY PREVIEW</div>
                <h2 id="modal-title">Welcome to NearPay</h2>
                <p className="modal-description">Explore a local-only payments interface. All balances, people, and activity are sample data; nothing here moves money.</p>
                <div className="onboarding-points"><span><Icon name="check" size={15} /> Try a simulated send and review</span><span><Icon name="qr" size={15} /> View or scan a demo QR code</span><span><Icon name="shield" size={15} /> No account or payment service connected</span></div>
                <button className="button button-primary button-full" onClick={closeFlow}>Explore the demo <Icon name="arrow" size={16} /></button>
                <button className="button button-secondary button-full" onClick={() => startFlow("signin")}>Sign in / create account</button>
              </>
            ) : flow === "signin" ? (
              <>
                <div className="modal-kicker"><span className="kicker-icon"><Icon name="profile" size={17} /></span> ACCOUNT PREVIEW</div>
                <h2 id="modal-title">Sign in or create an account</h2>
                <p className="modal-description">Account access is not connected in this demo. You can explore without entering personal details.</p>
                <form onSubmit={(event) => { event.preventDefault(); setAuthMessage("Sign-in is not connected. Your details were not saved or sent."); }}>
                  <label className="field-label" htmlFor="demo-email">Email address</label>
                  <input className="text-input" id="demo-email" type="email" placeholder="you@example.com" autoComplete="email" required />
                  <label className="field-label" htmlFor="demo-password">Password</label>
                  <input className="text-input" id="demo-password" type="password" placeholder="Enter a demo password" autoComplete="current-password" required />
                  <button className="button button-primary button-full" type="submit">Continue</button>
                </form>
                {authMessage && <p className="auth-message" role="status">{authMessage}</p>}
                <p className="demo-warning"><Icon name="shield" size={16} /> Demo only. Credentials are not stored or transmitted.</p>
                <button className="button button-outline button-full" onClick={closeFlow}>Continue as guest</button>
              </>
            ) : flow === "pay" ? (
              <>
                <div className="modal-kicker"><span className="kicker-icon"><Icon name="send" size={17} /></span> PAYMENT PREVIEW · {paymentStep === "details" ? "1 OF 2" : paymentStep === "review" ? "2 OF 2" : "COMPLETE"}</div>
                <h2 id="modal-title">{paymentStep === "details" ? "Send a demo payment" : paymentStep === "review" ? "Review before confirming" : "Demo complete"}</h2>
                {paymentStep === "success" ? (
                  <>
                    <div className="payment-success"><span><Icon name="check" size={24} /></span><strong>{formatCurrency(Number(amount))}</strong><p>Demo activity for {selectedContact.name} was updated.</p></div>
                    <p className="demo-warning"><Icon name="shield" size={16} /> No money was sent or received. This is illustrative activity only.</p>
                    <button className="button button-primary button-full" onClick={closeFlow}>Done</button>
                  </>
                ) : paymentStep === "review" ? (
                  <>
                    <p className="modal-description">Check the recipient and amount. Confirmation updates only the sample activity list.</p>
                    <div className="payment-review"><Avatar initials={selectedContact.initials} color={selectedContact.color} /><div><strong>{selectedContact.name}</strong><span>{selectedContact.handle}</span></div><b>{formatCurrency(Number(amount))}</b></div>
                    {note && <p className="review-note">“{note}”</p>}
                    <p className="demo-warning"><Icon name="shield" size={16} /> Demo only. No real payment can be made here.</p>
                    <button className="button button-primary button-full" onClick={confirmDemo}>Confirm demo payment</button>
                    <button className="button button-outline button-full" onClick={() => setPaymentStep("details")}>Back to edit</button>
                  </>
                ) : <>
                <p className="modal-description">Choose a demo contact and enter an amount to preview the confirmation step.</p>
                <div className="recipient-card">
                  <Avatar initials={selectedContact.initials} color={selectedContact.color} />
                  <div><strong>{selectedContact.name}</strong><span>{selectedContact.handle} · Demo contact</span></div>
                </div>
                <label className="field-label" htmlFor="pay-contact">Choose another person</label>
                <select id="pay-contact" className="text-input" value={selectedContact.handle} onChange={(event) => setSelectedContact(contacts.find((contact) => contact.handle === event.target.value) ?? contacts[0])}>
                  {contacts.map((contact) => <option value={contact.handle} key={contact.handle}>{contact.name} ({contact.handle})</option>)}
                </select>
                <label className="field-label" htmlFor="amount">Amount</label>
                <div className="amount-input"><span>₹</span><input id="amount" type="number" min="1" max="100000" placeholder="0" value={amount} onChange={(event) => setAmount(event.target.value)} aria-invalid={amountError} aria-describedby={amountError ? "amount-error" : undefined} autoFocus /><span className="amount-currency">INR</span></div>
                {amountError && <p className="field-error" id="amount-error">Enter an amount between ₹1 and ₹1,00,000.</p>}
                <label className="field-label" htmlFor="note">Note <span>Optional</span></label>
                <input className="text-input" id="note" maxLength={40} placeholder="What’s it for?" value={note} onChange={(event) => setNote(event.target.value)} />
                <p className="demo-warning"><Icon name="shield" size={16} /> Demo only. No real money will be transferred.</p>
                <button className="button button-primary button-full" disabled={!amount || amountError} onClick={reviewDemo}>Review payment <Icon name="arrow" size={17} /></button>
                </>}
              </>
            ) : flow === "receive" ? (
              <>
                <div className="modal-kicker"><span className="kicker-icon"><Icon name="qr" size={17} /></span> RECEIVE MONEY</div>
                <h2 id="modal-title">Your demo QR code</h2>
                <p className="modal-description">Share this sample code with someone nearby. It is not connected to a payment service.</p>
                <div className="receive-qr"><QRCodeSVG value="nearpay-demo://pay/shahan01" size={150} level="M" includeMargin aria-label="Scannable NearPay demo QR code" /></div>
                <div className="qr-identity"><Avatar initials="S" color="green" size="small" /><div><strong>Shahan</strong><span>@shahan01 · Demo account</span></div><button className="icon-button" aria-label="Copy demo handle" onClick={() => showNotice("Demo handle copied (preview only).")}><Icon name="copy" size={17} /></button></div>
                <p className="demo-warning"><Icon name="shield" size={16} /> This scannable code is illustrative and cannot request or receive funds.</p>
                <button className="button button-secondary button-full" onClick={closeFlow}>Done</button>
              </>
            ) : flow === "scan" ? (
              <>
                <div className="modal-kicker"><span className="kicker-icon"><Icon name="scan" size={17} /></span> QR SCANNER PREVIEW</div>
                <h2 id="modal-title">Scan a NearPay code</h2>
                <p className="modal-description">Allow camera access to scan a QR code, or paste a demo code below.</p>
                <div className={`scanner-frame ${cameraActive ? "scanner-active" : ""}`}>
                  <video ref={videoRef} autoPlay muted playsInline aria-label="QR scanner camera preview" />
                  {!cameraActive && <div><Icon name="scan" size={31} /><span>Camera preview</span></div>}
                  <span className="scanner-corners" />
                </div>
                <button className="button button-outline button-full" onClick={cameraActive ? stopCamera : startCamera}>{cameraActive ? "Stop camera" : "Use camera to scan"}</button>
                {cameraError && <p className="scanner-error" role="alert">{cameraError}</p>}
                <div className="scanner-or">or enter code manually</div>
                <label className="field-label" htmlFor="scan-code">Demo code</label>
                <input className="text-input" id="scan-code" value={scanText} onChange={(event) => setScanText(event.target.value)} placeholder="nearpay-demo://..." />
                {scanText && <p className="scan-review" role="status">Code ready to review: <code>{scanText}</code></p>}
                <button className="button button-primary button-full" disabled={!scanText.trim()} onClick={() => { showNotice("Code reviewed locally. No payment was made."); closeFlow(); }}>Review code</button>
                <p className="demo-warning"><Icon name="shield" size={16} /> Scanning only reads a code. It never sends money.</p>
              </>
            ) : null}
          </section>
        </div>
      )}
      {notice && <div className="toast" role="status"><span className="toast-check"><Icon name="check" size={15} /></span>{notice}<button className="icon-button" aria-label="Dismiss notification" onClick={() => setNotice("")}><Icon name="close" size={15} /></button></div>}
    </div>
  );
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function HomeScreen({ onFlow, onNavigate, items, onScan, onDiscover, foundDevice, deviceError }: {
  onFlow: (flow: Exclude<Flow, null>, contact?: typeof contacts[number]) => void;
  onNavigate: (screen: Screen) => void;
  items: Transaction[];
  onScan: () => void;
  onDiscover: () => void;
  foundDevice: string;
  deviceError: string;
}) {
  return (
    <>
      <PageHeading eyebrow="TUESDAY, 3 NOVEMBER" title="Good evening, Shahan" description="Your money, a little closer." action={<button className="button button-outline desktop-action" onClick={() => onFlow("receive")}><Icon name="qr" size={17} /> My QR code</button>} />
      <div className="home-grid">
        <div className="home-main-column">
          <section className="balance-card">
            <div className="balance-top"><span><span className="balance-dot" /> DEMO WALLET BALANCE <span className="info-dot">i</span></span><span className="balance-label">Illustrative only</span></div>
            <div className="balance-amount">{formatCurrency(2500)}<span>.00</span></div>
            <div className="balance-bottom"><span>Sample balance for interface preview</span><span className="wallet-art"><span>₹</span></span></div>
            <span className="balance-orb orb-one" /><span className="balance-orb orb-two" />
          </section>

          <section className="quick-actions">
            <button className="quick-action primary-quick" onClick={() => onFlow("pay")}><span className="quick-icon"><Icon name="send" /></span><strong>Pay nearby</strong><span>Send a request</span></button>
            <button className="quick-action" onClick={() => onFlow("receive")}><span className="quick-icon"><Icon name="download" /></span><strong>Receive</strong><span>Share your QR</span></button>
            <button className="quick-action" onClick={onScan}><span className="quick-icon"><Icon name="scan" /></span><strong>Scan a code</strong><span>Use camera or code</span></button>
          </section>

          <section className="panel nearby-panel">
            <div className="section-heading"><div><h2>Nearby devices</h2><p>Find a browser-visible Bluetooth device</p></div><button className="connect-button" onClick={onDiscover}><Icon name="plus" size={14} /> Find devices</button></div>
            <div className="nearby-list">
              {contacts.slice(0, 3).map((contact) => (
                <div className="nearby-person" key={contact.handle}>
                  <Avatar initials={contact.initials} color={contact.color} size="small" />
                  <div className="nearby-person-info"><strong>{contact.name}</strong><span>Sample contact · not discovered</span></div>
                  <button className="connect-button" onClick={() => onFlow("pay", contact)}>Request <Icon name="arrow" size={14} /></button>
                </div>
              ))}
            </div>
            <p className="nearby-disclaimer">Discovery only; no payment reader or payment service is connected.</p>
            {foundDevice && <p className="device-result" role="status"><i /> Found {foundDevice} · not connected</p>}
            {deviceError && <p className="scanner-error" role="alert">{deviceError}</p>}
          </section>
        </div>
        <div className="home-side-column">
          <section className="panel activity-panel">
            <div className="section-heading"><div><h2>Recent activity</h2><p>Your demo transaction list</p></div><button className="link-button" onClick={() => onNavigate("History")}>See all <Icon name="arrow" size={14} /></button></div>
            <div className="activity-list">
              {items.slice(0, 4).map((item, index) => <TransactionRow key={`${item.name}-${item.date}-${index}`} item={item} compact />)}
            </div>
            <div className="sample-note"><Icon name="shield" size={15} /> All activity shown is illustrative demo data.</div>
          </section>
          <section className="panel discover-panel">
            <div className="discover-art"><span className="discover-card">₹</span><span className="discover-sparkle sparkle-a">✳</span><span className="discover-sparkle sparkle-b">✳</span></div>
            <div className="eyebrow">PAYMENT, SIMPLIFIED</div><h2>Right here.<br />Right nearby.</h2><p>Explore a preview of connecting with people around you.</p>
            <button className="link-button" onClick={() => onFlow("pay")}>Try a demo request <Icon name="arrow" size={14} /></button>
          </section>
        </div>
      </div>
    </>
  );
}

function TransactionRow({ item, compact = false }: { item: typeof transactions[number]; compact?: boolean }) {
  return (
    <div className={`transaction-row ${compact ? "transaction-compact" : ""}`}>
      <Avatar initials={item.initials} color={item.color} size="small" />
      <div className="transaction-info"><strong>{item.name}</strong><span>{item.note} <span className="transaction-separator">·</span> {item.date}</span></div>
      <div className="transaction-amount"><strong className={item.amount > 0 ? "amount-in" : ""}>{item.amount > 0 ? "+" : "−"}{formatCurrency(Math.abs(item.amount))}</strong><span className="status-pill">Demo</span></div>
    </div>
  );
}

function HistoryScreen({ query, onQuery, filter, onFilter, items }: { query: string; onQuery: (value: string) => void; filter: "All" | "Paid" | "Received"; onFilter: (filter: "All" | "Paid" | "Received") => void; items: typeof transactions }) {
  return (
    <>
      <PageHeading eyebrow="YOUR ACTIVITY" title="Transaction history" description="A clear view of your demo activity." />
      <section className="panel full-panel">
        <div className="history-toolbar">
          <div className="filter-tabs" role="tablist" aria-label="Filter transactions">
            {(["All", "Paid", "Received"] as const).map((option) => <button key={option} role="tab" aria-selected={filter === option} className={filter === option ? "selected" : ""} onClick={() => onFilter(option)}>{option}</button>)}
          </div>
          <SearchBox value={query} onChange={onQuery} placeholder="Search activity..." />
        </div>
        <div className="history-date"><span>DEMO ACTIVITY</span><span>All amounts in INR</span></div>
        {items.length > 0 ? <div className="history-list">{items.map((item) => <TransactionRow key={`${item.name}-${item.date}`} item={item} />)}</div> : <EmptyState title="No activity found" description="Try a different search or activity filter." />}
        <div className="history-disclaimer"><Icon name="shield" size={16} /> This history is sample content for the frontend preview. It is not financial data.</div>
      </section>
    </>
  );
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="search-box"><Icon name="search" size={17} /><input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /><span className="search-shortcut">⌘ K</span></label>;
}

function ContactsScreen({ query, onQuery, items, onPay }: { query: string; onQuery: (value: string) => void; items: typeof contacts; onPay: (contact: typeof contacts[number]) => void }) {
  return (
    <>
      <PageHeading eyebrow="YOUR PEOPLE" title="Contacts" description="People in this demo, ready to connect." action={<button className="button button-primary desktop-action" onClick={() => document.getElementById("contact-search")?.focus()}><Icon name="plus" size={17} /> Add contact</button>} />
      <section className="panel full-panel">
        <label className="search-box contacts-search"><Icon name="search" size={17} /><input id="contact-search" type="search" value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search name or username..." /></label>
        <div className="contacts-count">{items.length} {items.length === 1 ? "person" : "people"} <span>·</span> Demo contacts</div>
        {items.length > 0 ? (
          <div className="contacts-grid">
            {items.map((contact) => (
              <article className="contact-card" key={contact.handle}>
                <Avatar initials={contact.initials} color={contact.color} size="large" />
                <div className="contact-details"><strong>{contact.name}</strong><span>{contact.handle}</span><small><i className={contact.online ? "" : "offline"} />{contact.online ? "Nearby in demo" : "Not currently nearby"}</small></div>
                <button className="contact-pay" aria-label={`Prepare demo request for ${contact.name}`} onClick={() => onPay(contact)}><Icon name="send" size={16} /></button>
              </article>
            ))}
          </div>
        ) : <EmptyState title="No contacts found" description="Try another name or username." />}
      </section>
      <p className="page-footnote"><Icon name="shield" size={15} /> Contact details and nearby status are illustrative. No device discovery is active.</p>
    </>
  );
}

function ProfileScreen({ onReceive, onNotice, onSignIn, onScan, onDiscover, foundDevice, deviceError }: {
  onReceive: () => void;
  onNotice: (message: string) => void;
  onSignIn: () => void;
  onScan: () => void;
  onDiscover: () => void;
  foundDevice: string;
  deviceError: string;
}) {
  const rows: { icon: IconName; label: string; detail: string }[] = [
    { icon: "qr", label: "My QR code", detail: "Share your demo code" },
    { icon: "scan", label: "Scan a code", detail: "Use camera or enter a code" },
    { icon: "settings", label: "Bluetooth settings", detail: "Discover a browser-visible device" },
    { icon: "settings", label: "App settings", detail: "Manage your preferences" },
    { icon: "help", label: "Help & support", detail: "Get help with NearPay" },
    { icon: "shield", label: "About NearPay", detail: "Version 1.0 · Frontend preview" },
  ];
  return (
    <>
      <PageHeading eyebrow="YOUR ACCOUNT" title="Profile" description="Your account and app preferences." />
      <div className="profile-layout">
        <section className="panel profile-card">
          <div className="profile-identity"><Avatar initials="S" color="green" size="large" /><div><h2>Shahan</h2><span>@shahan01</span><div className="verified-demo"><i /> Demo account</div></div><button className="button button-outline profile-signin" onClick={onSignIn}>Sign in / create account</button></div>
          <div className="profile-balance"><div><span>DEMO WALLET BALANCE</span><strong>{formatCurrency(2500)}<small>.00</small></strong><p>Illustrative balance only</p></div><span className="wallet-art profile-wallet"><span>₹</span></span></div>
          <div className="profile-menu">{rows.map((row) => <button className="profile-menu-item" key={row.label} onClick={row.label === "My QR code" ? onReceive : row.label === "Scan a code" ? onScan : row.label === "Bluetooth settings" ? onDiscover : () => onNotice(`${row.label} is not connected in this demo.`)}><span className="profile-menu-icon"><Icon name={row.icon} size={18} /></span><span className="profile-menu-text"><strong>{row.label}</strong><small>{row.detail}</small></span><Icon name="chevron" size={17} className="menu-chevron" /></button>)}</div>
          {foundDevice && <p className="device-result" role="status"><i /> Found {foundDevice} · not connected</p>}
          {deviceError && <p className="scanner-error" role="alert">{deviceError}</p>}
          <button className="button button-logout" onClick={() => onNotice("Sign out is unavailable in this demo account.")}><Icon name="logout" size={17} /> Log out</button>
        </section>
        <aside className="profile-aside">
          <div className="profile-note-icon"><Icon name="shield" size={20} /></div><h3>Just a preview</h3><p>This frontend is a visual demo. No account is authenticated, and wallet values or activity shown here are not real financial information.</p>
          <div className="profile-note-divider" /><div className="profile-note-row"><span>Account</span><strong>Sample profile</strong></div><div className="profile-note-row"><span>Device access</span><strong>Not active</strong></div><div className="profile-note-row"><span>Payments</span><strong>Not connected</strong></div>
        </aside>
      </div>
    </>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="empty-state"><span><Icon name="search" size={21} /></span><strong>{title}</strong><p>{description}</p></div>;
}

export default App;
