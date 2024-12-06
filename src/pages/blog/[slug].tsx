import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import { Input } from "@/components/ui/input"
import Link from 'next/link'

interface PostProps {
  frontmatter: {
    title: string;
    date: string;
    excerpt: string;
    category?: string;
    image?: string;
  };
  slug: string;
  content: string;
}

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join(process.cwd(), 'src', 'posts'))

  const paths = files.map(filename => ({
    params: {
      slug: filename.replace('.md', '')
    }
  }))

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const markdownWithMeta = fs.readFileSync(path.join(process.cwd(), 'src', 'posts', params.slug + '.md'), 'utf-8')
  const { data: frontmatter, content } = matter(markdownWithMeta)

  return {
    props: {
      frontmatter,
      slug: params.slug,
      content,
    },
  }
}

const PostPage: React.FC<PostProps> = ({ frontmatter: { title, date, category, image }, content }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = date.toLocaleString('es', { month: 'short' }).slice(0, 3)
    return { day, month }
  }

  const { day, month } = formatDate(date)

  return (
    <div className="py-10 bg-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            {category && (
              <div className="uppercase text-sm font-medium text-teal-600 mb-4">
                {category}
              </div>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
            
            <div className="relative mb-8">
              <img
                src={image || "/placeholder.svg?height=400&width=800"}
                alt={title}
                className="w-full h-[400px] object-cover rounded-lg"
              />
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow px-3 py-2 text-center">
                <div className="text-xl font-bold text-teal-600">{day}</div>
                <div className="text-sm text-gray-600 uppercase">{month}</div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: marked(content) }}
                className="text-gray-600 leading-relaxed"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Search */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Buscar</h3>
              <Input 
                type="search" 
                placeholder="Buscar..." 
                className="w-full border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              />
            </div>

            {/* Recent Posts */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Entradas recientes</h3>
              <div className="space-y-4">
                <Link href="#" className="block text-teal-600 hover:text-teal-700">
                  ETF o Fondo indexado ¿cuál es mejor para mí?
                </Link>
                <Link href="#" className="block text-teal-600 hover:text-teal-700">
                  Truco de la semana: diversifica invirtiendo en proyectos inmobiliarios
                </Link>
                <Link href="#" className="block text-teal-600 hover:text-teal-700">
                  El origen del ajedrez y su relación con el interés compuesto
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostPage

