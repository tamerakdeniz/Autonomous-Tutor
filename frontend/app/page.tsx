import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">AI Chat</h1>
          <div className="flex gap-4">
            <Link href="/signin">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-white text-gray-900 hover:bg-gray-200">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="container mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Experience the power of AI conversation
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mb-10">
            Our advanced AI assistant helps you with answers, creative content,
            and problem-solving in a natural, conversational way.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-200 px-8 py-6 text-lg"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="bg-blue-500/10 p-3 rounded-full w-fit mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Natural Conversations
              </h3>
              <p className="text-gray-400">
                Interact with our AI in a natural, conversational way just like
                chatting with a human.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="bg-purple-500/10 p-3 rounded-full w-fit mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Creative Content</h3>
              <p className="text-gray-400">
                Generate creative content, from poetry and stories to code and
                business ideas.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="bg-green-500/10 p-3 rounded-full w-fit mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Answers</h3>
              <p className="text-gray-400">
                Get immediate responses to your questions and assistance with
                complex problems.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 px-6">
        <div className="container mx-auto text-center text-gray-500">
          <p>© {new Date().getFullYear()} AI Chat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
