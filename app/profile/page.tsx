'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-100 to-white py-32">
      <div className="max-w-4xl mx-auto px-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/your-image.jpg" alt="Ankit Sharma" />
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-serif text-stone-800 mb-2">Ankit Sharma</h1>
                <p className="text-stone-600">
                  A software engineer passionate about creating immersive digital experiences. 
                  Combining technology with creativity to build intuitive and engaging applications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif text-stone-800 mb-6">Projects</h2>
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Music World</CardTitle>
                <CardDescription>An interactive music visualization experience</CardDescription>
              </CardHeader>
              <CardContent>
                Built with Next.js, TypeScript, and Web Audio API. Creates a visual representation 
                of music theory concepts through an engaging interface.
              </CardContent>
            </Card>
            {/* Add more project cards */}
          </div>
        </div>

        {/* Tabbed Sections */}
        <Tabs defaultValue="travel" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="travel">Travel</TabsTrigger>
            <TabsTrigger value="music">Music Journey</TabsTrigger>
          </TabsList>

          <TabsContent value="travel">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Places Visited</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-4 space-y-2">
                    {/* Add your travel locations */}
                    <li>Location 1 - Brief description or date</li>
                    <li>Location 2 - Brief description or date</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="music">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Musical Background</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Add your music journey */}
                    <p>Your music journey details...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
} 