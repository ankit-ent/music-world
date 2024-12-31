'use client';

import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Footer from '@/components/Footer';

export default function ProfilePage() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-stone-100 to-white py-24">
        <div className="max-w-4xl mx-auto px-8">
          {/* Back Link */}
          <Link 
            href="/" 
            className="inline-flex items-center text-stone-600 hover:text-stone-800 mb-8 group"
          >
            <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Go back
          </Link>

          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <Avatar className="h-24 w-24 bg-stone-200 border-2 border-stone-300/50 mx-auto md:mx-0">
                  <AvatarImage src="/images/profile.jpeg" alt="Ankit Sharma" />
                  <AvatarFallback className="text-xl text-stone-500">AS</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-serif text-stone-800 mb-2">Ankit Sharma</h1>
                  <p className="text-stone-600">
                    Just a weird mix of wanting to learn and do everything, but in the end barely getting anything done.
                    A computer science and music nerd. Occasionally trekking mountains or swimming in seas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Projects Section */}
          <div className="mb-16 mt-16">
            <h2 className="text-2xl font-serif text-stone-800 mb-6">Projects</h2>
            <Card>
              <CardContent className="py-6">
                <div className="divide-y divide-stone-200 space-y-8">
                  {/* Wavy Lines */}
                  <div className="pt-8 first:pt-0 group">
                    <div className="flex items-start justify-between">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium">Wavy Lines</h3>
                          <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                          <Link 
                            href="https://wavylines.in" 
                            className="text-stone-700 bg-stone-200 px-2 py-0.5 rounded text-sm hover:bg-stone-300 transition-colors"
                          >
                            wavylines.in
                          </Link>
                        </div>
                        <div className="space-y-2">
                          <p className="text-stone-600">An experimental website made primarily for music</p>
                          <p className="text-stone-400 text-xs italic"> - A more data structures and algorithms focused website</p>
                        </div>
                        {/* <div className="flex gap-2">
                          <span className="text-xs text-stone-600 px-2 py-0.5 rounded-full bg-stone-100">
                            music theory
                          </span>
                          <span className="text-xs text-stone-600 px-2 py-0.5 rounded-full bg-stone-100">
                            maths
                          </span>
                        </div> */}
                      </div>
                    </div>
                  </div>

                  {/* Nimble */}
                  <div className="pt-8 first:pt-0 group">
                    <div className="flex items-start justify-between">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium">Nimble</h3>
                          <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                          <Link 
                            href="https://gonimble.in" 
                            className="text-white bg-blue-400 px-2 py-0.5 rounded text-sm hover:bg-blue-500 transition-colors"
                          >
                            gonimble.in
                          </Link>
                        </div>
                        <div className="space-y-2">
                          <p className="text-stone-600">A marketplace platform helping schools and companies connect with vendors across India</p>
                          <p className="text-stone-400 text-xs italic"> - A very backend heavy project, with a well defined design system</p>
                        </div>
                      </div>
                      <span className="text-xs text-stone-500 px-2 py-0.5 rounded-full bg-stone-100">wip</span>
                    </div>
                  </div>

                  {/* School Pages */}
                  <div className="pt-8 first:pt-0 group">
                    <div className="flex items-start justify-between">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium">SchoolPages</h3>
                          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                          <Link 
                            href="https://school-page.com" 
                            className="text-white bg-emerald-600 px-2 py-0.5 rounded text-sm hover:bg-emerald-700 transition-colors"
                          >
                            school-pages.com
                          </Link>
                        </div>
                        <div className="space-y-2">
                          <p className="text-stone-600">An LLM Assistant for teachers and schools. Helps make lesson plans, questions, and even provides an NCF Assistant</p>
                          <p className="text-stone-400 text-xs italic"> - First attempt at making a website truly from scratch, backend and frontend. And also working with LLM apis</p>
                        </div>
                        {/* <div className="flex gap-2">
                          <span className="text-xs text-emerald-600 px-2 py-0.5 rounded-full bg-emerald-50">
                            backend & frontend
                          </span>
                          <span className="text-xs text-emerald-600 px-2 py-0.5 rounded-full bg-emerald-50">
                            auth
                          </span>
                          <span className="text-xs text-emerald-600 px-2 py-0.5 rounded-full bg-emerald-50">
                            LLM apis
                          </span>
                        </div> */}
                      </div>
                    </div>
                  </div>

                  {/* Dots and Grids */}
                  <div className="pt-8 first:pt-0 group">
                    <div className="flex items-start justify-between">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium">Dots & Grids</h3>
                          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                          <Link 
                            href="https://dotsandgrids.com" 
                            className="text-yellow-950 bg-yellow-200 px-2 py-0.5 rounded text-sm hover:bg-amber-300 transition-colors"
                          >
                            dotsandgrids.com
                          </Link>
                        </div>
                        <div className="space-y-2">
                          <p className="text-stone-600">A notebook, stationery, and uniform store for school students</p>
                          <p className="text-stone-400 text-xs italic"> - An attempt at making a shopify store for my Dad&apos;s business. Quickly realised need more high margin items for it, but haven&apos;t gotten around to what that could be</p>
                        </div>
                        {/* <div className="flex gap-2">
                          <span className="text-xs text-yellow-800 px-2 py-0.5 rounded-full bg-yellow-100">
                            shopify
                          </span>
                        </div> */}
                      </div>
                    </div>
                  </div>

                  {/* CodeWorld */}
                  <div className="pt-8 first:pt-0 group">
                    <div className="flex items-start justify-between">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium">CodeWorld</h3>
                          <svg className="w-4 h-4 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                          <Link 
                            href="https://mycodeworld.in" 
                            className="text-white bg-blue-700 px-2 py-0.5 rounded text-sm hover:bg-blue-800 transition-colors"
                          >
                            mycodeworld.in
                          </Link>
                        </div>
                        <div className="space-y-2">
                          <p className="text-stone-600">A computer course curriculum for schools</p>
                          <p className="text-stone-400 text-xs italic"> - A go at wordpress</p>
                        </div>
                        {/* <div className="flex gap-2">
                          <span className="text-xs text-blue-600 px-2 py-0.5 rounded-full bg-blue-50">
                            wordpress
                          </span>
                          <span className="text-xs text-blue-600 px-2 py-0.5 rounded-full bg-blue-50">
                            design systems
                          </span>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Travel Section
          <div className="mb-12">
            <h2 className="text-2xl font-serif text-stone-800 mb-2">Travel</h2>
            <Card>
              <CardContent className="h-24 flex flex-col justify-center py-4">
                <div className="flex items-center justify-center gap-3">
                  <svg 
                    className="w-5 h-5 text-stone-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                  </svg>
                  <p className="text-stone-600 italic text-sm">
                    A fun interactive bingo map coming soon...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div> */}

          {/* After Travel Section */}
          <div className="flex justify-center gap-6 mt-12 mb-2">
            <Link 
              href="https://twitter.com/ankitsharma_yf" 
              className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="text-sm"></span>
            </Link>

            <Link 
              href="https://instagram.com/ankitsharma_yf" 
              className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className="text-sm"></span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 