import Image from "next/image";

const LogoLoader = ({ size = 100 }: { size?: number }) => {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <Image width={size} height={size} src="/logo.svg" alt="logo" />
    </div>
  );
};

export default LogoLoader;
