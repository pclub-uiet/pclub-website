export default function SuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-50 px-4 text-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-4 text-3xl font-bold text-green-600">🎉 Verified!</h1>
        <p className="mb-6 text-gray-700">
          Your email has been successfully verified.
        </p>
        <a
          href="/"
          className="inline-block rounded-lg bg-green-600 px-6 py-2 font-semibold text-white transition hover:bg-green-700"
        >
          Go to Home
        </a>
      </div>
    </div>
  )
}
