import Image from 'next/image';

const Logo = () => {
  return (
    <div className="flex justify-center">
      <div className="overflow-hidden rounded-full border border-gray-300">
        <Image width={100} height={100} src="/logo.jpg" alt="Logo"/>
      </div>
    </div>
  );
};

export default Logo;
