import stickerImage from 'figma:asset/9970fd1775fec21a467755d8f0773a1952884e6a.png';

export default function UpdateStickerV16() {
  return (
    <div className="relative size-full">
      <img 
        src={stickerImage} 
        alt="New Drink Sticker" 
        className="block size-full object-contain"
      />
    </div>
  );
}
