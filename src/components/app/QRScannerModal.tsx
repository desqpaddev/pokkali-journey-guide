import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
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
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [manual, setManual] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setErr(null);
    setStarting(true);
    const start = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setErr("Camera API not available. Use HTTPS or enter the code manually below.");
          return;
        }
        await new Promise((resolve) => requestAnimationFrame(resolve));
        if (cancelled || !document.getElementById(containerId)) return;
        const html5 = new Html5Qrcode(containerId, { verbose: false });
        scannerRef.current = html5;
        const onDecoded = (decoded: string) => {
          if (cancelled) return;
          onScan(decoded);
          onOpenChange(false);
        };
        const config = { fps: 10, qrbox: { width: 240, height: 240 } };
        const cams = await Html5Qrcode.getCameras().catch(() => []);
        const backCamera = cams.find((cam) => /back|rear|environment/i.test(cam.label));
        const cameraId = backCamera?.id ?? cams[0]?.id;

        if (cameraId) {
          await html5.start(cameraId, config, onDecoded, () => {});
        } else {
          await html5.start({ facingMode: { ideal: "environment" } }, config, onDecoded, () => {});
        }
      } catch (e: unknown) {
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
        if (!cancelled) setStarting(false);
      }
    };
    start();
    return () => {
      cancelled = true;
      setStarting(false);
      scannerRef.current?.stop().catch(() => {}).finally(() => {
        scannerRef.current?.clear();
        scannerRef.current = null;
      });
    };
  }, [open, onOpenChange, onScan]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Scan product QR</DialogTitle>
          <DialogDescription>Point your phone camera at a product QR code.</DialogDescription>
        </DialogHeader>
        <div id={containerId} className="rounded-lg overflow-hidden bg-muted aspect-square" />
        {starting && !err && <p className="text-sm text-muted-foreground">Opening camera...</p>}
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