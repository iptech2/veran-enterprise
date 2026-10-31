
import { useEffect, useState } from "react";
import { FaDownload, FaTimes } from "react-icons/fa";

export default function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isInstalled =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isInstalled) return;

    const dismissed =
      sessionStorage.getItem("veran-install-dismissed");

    if (dismissed) return;

    const ios = /iphone|ipad|ipod/i.test(
      window.navigator.userAgent
    );

    setIsIOS(ios);

    const handleBeforeInstall = (event) => {
      event.preventDefault();
      setInstallEvent(event);
    };

    const handleInstalled = () => {
      setShowPrompt(false);
      setInstallEvent(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstall
    );

    window.addEventListener("appinstalled", handleInstalled);

    // Show the banner even when Chrome does not provide
    // the native installation prompt.
    setShowPrompt(true);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstall
      );

      window.removeEventListener(
        "appinstalled",
        handleInstalled
      );
    };
  }, []);

  const handleInstall = async () => {
    if (installEvent) {
      await installEvent.prompt();

      const choice = await installEvent.userChoice;

      if (choice.outcome === "accepted") {
        setShowPrompt(false);
      }

      setInstallEvent(null);
      return;
    }

    setShowGuide(true);
  };

  const dismissPrompt = () => {
    setShowPrompt(false);

    sessionStorage.setItem(
      "veran-install-dismissed",
      "true"
    );
  };

  if (!showPrompt) return null;

  return (
    <>
      <div
        className="container-fluid px-3 py-2"
        style={{
          background: "#e8f5ec",
          borderBottom: "1px solid #c8e6d0",
          position: "relative",
          zIndex: 1050
        }}
      >
        <div className="container">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{
                  width: 43,
                  height: 43,
                  background: "#198754",
                  color: "white",
                  flexShrink: 0
                }}
              >
                <FaDownload size={19} />
              </div>

              <div>
                <div className="fw-bold text-dark">
                  Install Veran Enterprise
                </div>

                <small className="text-secondary">
                  Access Veran easily from your device.
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                onClick={handleInstall}
                className="btn btn-success btn-sm fw-bold px-3"
              >
                Install
              </button>

              <button
                type="button"
                onClick={dismissPrompt}
                className="btn btn-link text-secondary p-1"
                aria-label="Close installation banner"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showGuide && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{
            background: "rgba(0,0,0,0.6)",
            zIndex: 2000
          }}
        >
          <div
            className="bg-white rounded-4 p-4 shadow w-100"
            style={{ maxWidth: 400 }}
          >
            <h5 className="fw-bold">
              Install Veran Enterprise
            </h5>

            {isIOS ? (
              <>
                <p>1. Open Veran in Safari.</p>
                <p>2. Tap the Share button.</p>
                <p>3. Select "Add to Home Screen".</p>
                <p>4. Tap "Add".</p>
              </>
            ) : (
              <>
                <p>
                  Open Veran in Google Chrome and follow
                  these steps:
                </p>
                <p>
                  1. Open the three-dot menu in Chrome.
                </p>
                <p>
                  2. Select "Install Veran Enterprise"
                  or "Install page as app", if available.
                </p>
                <p>
                  3. Follow the installation instructions.
                </p>
              </>
            )}

            <button
              className="btn btn-success w-100"
              onClick={() => setShowGuide(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}


