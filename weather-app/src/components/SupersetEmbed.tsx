import React from 'react';

interface SupersetEmbedProps {
  src: string;
}

const SupersetEmbed: React.FC<SupersetEmbedProps> = ({ src }) => (
  <div className="w-full max-w-2xl mx-auto my-8">
    <iframe
      src={src}
      title="Superset Chart"
      width="100%"
      height="480"
      frameBorder="0"
      allowFullScreen
      className="rounded shadow"
    />
  </div>
);

export default SupersetEmbed;
