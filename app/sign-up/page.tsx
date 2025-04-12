'use client';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignUp
        appearance={{ elements: { formButtonPrimary: "bg-blue-600" } }}
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        afterSignUpUrl="/dashboard"
      />
    </div>
  );
}
