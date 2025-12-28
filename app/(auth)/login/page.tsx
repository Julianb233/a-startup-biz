import { SignIn } from "@/components/clerk-safe"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 px-4 py-12">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl border border-gray-100",
            headerTitle: "font-montserrat text-2xl",
            headerSubtitle: "font-lato text-gray-600",
            formButtonPrimary:
              "bg-[#ff6a1a] hover:bg-[#ea580c] font-montserrat font-bold shadow-lg hover:shadow-xl transition-all",
            formFieldInput:
              "font-lato border-gray-300 focus:ring-[#ff6a1a] focus:border-[#ff6a1a]",
            formFieldLabel: "font-montserrat font-semibold text-gray-700",
            footerActionLink: "text-[#ff6a1a] hover:text-[#ea580c] font-semibold",
          },
        }}
        routing="path"
        path="/login"
        signUpUrl="/register"
        forceRedirectUrl="/dashboard"
      />
    </div>
  )
}
