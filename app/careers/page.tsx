import { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { Briefcase, Users, TrendingUp, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers | A Startup Biz",
  description:
    "Join the A Startup Biz team. We're always looking for talented individuals who share our passion for helping entrepreneurs succeed.",
};

export default function CareersPage() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-orange-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Help entrepreneurs build successful businesses. Work with a team
            that values impact, growth, and genuine relationships.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Work With Us
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Real Impact
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Help real entrepreneurs build real businesses
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Great Team
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Work with experienced professionals who care
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Flexibility
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Remote-friendly with flexible schedules
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Growth
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Learn and grow with every client engagement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Open Positions
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We don't have any open positions at the moment, but we're always
              interested in connecting with talented people who share our
              mission.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              If you're passionate about helping entrepreneurs succeed and think
              you'd be a great fit for our team, we'd love to hear from you.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
