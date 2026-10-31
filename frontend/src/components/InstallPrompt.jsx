
import { useEffect, useState } from "react";
import { FaDownload, FaTimes } from "react-icons/fa";

export default function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    const isInstalled =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isInstalled) return;

    const dismissed =
      sessionStorage.getItem("veran-install-dismissed");

    if (dismissed) return;

    const ios =
      /iphone|ipad|ipod/i.test(window.navigator.userAgent);

    setIsIOS(ios);

    const handleBeforeInstall = (event) => {
      event.preventDefault();

      setInstallEvent(event);
      setShowPrompt(true);
    };

    const handleInstalled = () => {
      setShowPrompt(false);
      setInstallEvent(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstall
    );

    window.addEventListener(
      "appinstalled",
      handleInstalled
    );

    // iOS does not support beforeinstallprompt.
    if (ios) {
      setShowPrompt(true);
    }

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

    if (isIOS) {
      setShowIOSGuide(true);
    }
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
                  Get faster access from your phone.
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

      {showIOSGuide && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{
            background: "rgba(0,0,0,0.6)",
            zIndex: 2000
          }}
        >
          <div className="bg-white rounded-4 p-4 shadow w-100"
            style={{ maxWidth: 380 }}
          >
            <h5 className="fw-bold">
              Install Veran on your iPhone
            </h5>

            <p>
              1. Tap the Share button in Safari.
            </p>

            <p>
              2. Select "Add to Home Screen".
            </p>

            <p>
              3. Tap "Add" to install Veran.
            </p>

            <button
              className="btn btn-success w-100"
              onClick={() => setShowIOSGuide(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
