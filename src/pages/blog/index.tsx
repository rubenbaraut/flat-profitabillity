import { useState } from 'react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import { Input } from "@/components/ui/input"

interface Post {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    excerpt: string;
    image?: string;
  };
}

function Blog({ posts }: { posts: Post[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPosts = posts.filter(post =>
    post.frontmatter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.frontmatter.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = date.toLocaleString('es', { month: 'short' }).slice(0, 3)
    return { day, month }
  }

  return (
    <div className="py-10 bg-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog</h1>
            <div className="space-y-8">
              {filteredPosts.map((post, index) => {
                const { day, month } = formatDate(post.frontmatter.date)
                return (
                  <div key={index} className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="md:w-1/3 relative">
                      <img
                        src={post.frontmatter.image || "/placeholder.svg?height=200&width=300"}
                        alt={post.frontmatter.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-white rounded-lg shadow px-2 py-1 text-center">
                        <div className="text-xl font-bold text-teal-600">{day}</div>
                        <div className="text-sm text-gray-600 uppercase">{month}</div>
                      </div>
                    </div>
                    <div className="md:w-2/3 p-6">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="text-xl font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                      >
                        {post.frontmatter.title}
                      </Link>
                      <p className="mt-2 text-gray-600">{post.frontmatter.excerpt}</p>
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="mt-4 inline-block text-teal-600 hover:text-teal-700 font-semibold"
                      >
                        Leer más →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Search */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <Input 
                type="search" 
                placeholder="Buscar..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              />
            </div>

            {/* Recent Posts */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Entradas recientes</h2>
              <div className="space-y-4">
                {posts.slice(0, 5).map((post, index) => (
                  <Link
                    key={index}
                    href={`/blog/${post.slug}`}
                    className="block text-teal-600 hover:text-teal-700"
                  >
                    {post.frontmatter.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog

export async function getStaticProps() {
  const files = fs.readdirSync(path.join(process.cwd(), 'src', 'posts'))

  const posts = files.map(filename => {
    const slug = filename.replace('.md', '')
    const markdownWithMeta = fs.readFileSync(path.join(process.cwd(), 'src', 'posts', filename), 'utf-8')
    const { data: frontmatter } = matter(markdownWithMeta)
    return {
      slug,
      frontmatter,
    }
  })

  return {
    props: {
      posts,
    },
  }
}

