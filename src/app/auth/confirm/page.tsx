// src/app/auth/confirm/page.tsx
export default function ConfirmPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <p className="text-lg">
        Thanks for signing up! Please check your email to confirm your account.
        Then <a href="/auth/signin" className="text-green-600 underline">Sign In</a>.
      </p>
    </div>
  );
}