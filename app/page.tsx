import { ZapItApp } from "@/components/ZapItApp";
import { ZapProvider } from "@/store/zap-store";

export default function Home() {
  return (
    <ZapProvider>
      <ZapItApp />
    </ZapProvider>
  );
}
