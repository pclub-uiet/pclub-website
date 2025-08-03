export default function FailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-red-50 px-4 text-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-4 text-3xl font-bold text-red-600">
          😞 Verification Failed
        </h1>
        <p className="mb-6 text-gray-700">
          The token is invalid or has expired. Please try subscribing again.
        </p>
        <a
          href="/blog"
          className="inline-block rounded-lg bg-red-600 px-6 py-2 font-semibold text-white transition hover:bg-red-700"
        >
          Try Again
        </a>
      </div>
    </div>
  )
}
