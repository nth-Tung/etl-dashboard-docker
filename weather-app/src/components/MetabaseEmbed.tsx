import React from "react";

const MetabaseEmbed = ({ src }: { src: string }) => (
  <div className="w-full max-w-4xl h-[600px] mt-8">
    <iframe
      src={src}
      title="Metabase Dashboard"
      width="100%"
      height="100%"
      frameBorder="0"
      allowFullScreen={true}
      style={{ border: "none", minHeight: "600px" }}
    />
  </div>
);

export default MetabaseEmbed;
