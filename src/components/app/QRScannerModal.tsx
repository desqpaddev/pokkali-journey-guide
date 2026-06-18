import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const start = async () => {
      try {
        const html5 = new Html5Qrcode(containerId, { verbose: false });
        scannerRef.current = html5;
        await html5.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decoded) => {
            if (cancelled) return;
            onScan(decoded);
            onOpenChange(false);
          },
          () => {},
        );
      } catch (e) {
        setErr("Camera unavailable. Enter the code manually below.");
      }
    };
    start();
    return () => {
      cancelled = true;
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
        </DialogHeader>
        <div id={containerId} className="rounded-lg overflow-hidden bg-muted aspect-square" />
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