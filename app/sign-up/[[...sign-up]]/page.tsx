import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16">
            <Image height={50} width={50} src="/logo.svg" alt="logo" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Tars Chat App</h1>
          <p className="text-gray-500 mt-2">Real-time messaging App</p>
        </div>
        <div className="flex items-center justify-center">
          <SignUp />
        </div>
      </div>
    </div>
  );
}
