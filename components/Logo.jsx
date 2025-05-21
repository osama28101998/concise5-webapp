import Image from "next/image";

export default function Logo({className}) {
  return (
    <div className="flex items-center justify-center">
      <Image
        className={className}
        src="/assets/images/concise5logo.webp"
        alt="Logo"
        width={500}
        height={500}
      />
    </div>
  );
}
