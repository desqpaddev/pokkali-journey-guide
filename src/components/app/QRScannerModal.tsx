import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onScan: (code: string) => void;
}

export function QRScannerModal({ open, onOpenChange, onScan }: Props) {
  const containerId = "qr-reader";
  const scannerRef = useRef<Awaited<ReturnType<typeof createScanner>> | null>(null);
  const [manual, setManual] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const startScanner = useCallback(async () => {
    if (scannerRef.current) return;
    setErr(null);
    setStarting(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setErr("Camera API not available. Use HTTPS or enter the code manually below.");
        return;
      }
      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (!document.getElementById(containerId)) return;
      const html5 = await createScanner(containerId);
      scannerRef.current = html5;
      const onDecoded = (decoded: string) => {
        onScan(decoded);
        onOpenChange(false);
      };
      const config = {
        fps: 10,
        qrbox: { width: 240, height: 240 },
        videoConstraints: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };
      try {
        // Prefer the back camera explicitly via facingMode constraint.
        await html5.start(
          { facingMode: { exact: "environment" } },
          config,
          onDecoded,
          () => {},
        );
      } catch {
        // Fallback: enumerate cameras and pick one whose label looks like the back camera.
        const { Html5Qrcode } = await import("html5-qrcode");
        const cams = await Html5Qrcode.getCameras().catch(() => []);
        const backCamera = cams.find((cam) =>
          /back|rear|environment|trasera|traseira|arrière|hinten/i.test(cam.label),
        );
        const cameraId = backCamera?.id ?? cams[cams.length - 1]?.id ?? cams[0]?.id;
        if (cameraId) {
          await html5.start(cameraId, config, onDecoded, () => {});
        } else {
          await html5.start({ facingMode: { ideal: "environment" } }, config, onDecoded, () => {});
        }
      }
      setCameraActive(true);
    } catch (e: unknown) {
      scannerRef.current?.clear();
      scannerRef.current = null;
      const name = (e as { name?: string })?.name ?? "";
      if (name === "NotAllowedError") {
        setErr("Camera permission denied. Allow camera access in your browser settings.");
      } else if (name === "NotFoundError" || (e as Error)?.message === "no-cam") {
        setErr("No camera found on this device. Enter the code manually below.");
      } else if (name === "NotReadableError") {
        setErr("Camera is in use by another app. Close it and try again.");
      } else {
        setErr("Camera unavailable. Enter the code manually below.");
      }
    } finally {
      setStarting(false);
    }
  }, [onOpenChange, onScan]);

  useEffect(() => {
    if (!open) return;
    startScanner();
    return () => {
      setStarting(false);
      setCameraActive(false);
      scannerRef.current?.stop().catch(() => {}).finally(() => {
        scannerRef.current?.clear();
        scannerRef.current = null;
      });
    };
  }, [open, startScanner]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Scan product QR</DialogTitle>
          <DialogDescription>Point your phone camera at a product QR code.</DialogDescription>
        </DialogHeader>
        <div id={containerId} className="rounded-lg overflow-hidden bg-muted aspect-square" />
        {starting && !err && <p className="text-sm text-muted-foreground">Opening camera...</p>}
        {!starting && !cameraActive && (
          <Button type="button" onClick={startScanner} className="w-full">
            Start camera
          </Button>
        )}
        {err && <p className="text-sm text-muted-foreground">{err}</p>}
        <div className="flex gap-2">
          <Input
            placeholder="Or enter code"
            value={manual}
            onChange={(e) => setManual(e.target.value)}
          />
          <Button
            onClick={() => {
              if (manual.trim()) {
                onScan(manual.trim());
                onOpenChange(false);
              }
            }}
          >
            Open
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

async function createScanner(containerId: string) {
  const { Html5Qrcode } = await import("html5-qrcode");
  return new Html5Qrcode(containerId, { verbose: false });
}