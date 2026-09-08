import React from "react";
import { CosmicLoader } from "@/components/ui/cosmic-loader";

export default function RootLoading() {
  return (
    <CosmicLoader
      size="screen"
      status="Connecting to AI Atlas Intelligence"
      substatus="Querying verified models, capability taxonomies, and live platform states..."
    />
  );
}
