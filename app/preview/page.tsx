import { notFound } from "next/navigation";
import { PreviewWorkspace } from "./PreviewWorkspace";

export default function PreviewPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return <PreviewWorkspace />;
}
