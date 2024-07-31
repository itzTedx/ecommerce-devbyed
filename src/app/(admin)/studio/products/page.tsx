import { Button } from '@/components/ui/button'
import { db } from '@/server'
import { auth } from '@/server/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { DataTable } from './data-table'
import { columns } from './columns'

export default async function ProductsPage() {
  const session = await auth()
  const isAdmin = session?.user.role === 'admin'

  if (!session) redirect('/auth/login')
  if (!isAdmin) {
    redirect('/auth/not-allowed')
  }

  const products = await db.query.products.findMany({
    with: {
      productImages: true,
      productTags: true,
    },

    orderBy: (products, { desc }) => [desc(products.id)],
  })

  const dataTable = products.map((product) => {
    return {
      id: product.id,
      title: product.title,
      created: product.createdAt,
      image: product.productImages,
    }
  })

  if (!dataTable) throw new Error('No data found')

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
        <Button variant={'outline'} asChild>
          <Link href="/studio/products/new">Add Product</Link>
        </Button>
      </div>

      <DataTable columns={columns} data={dataTable} />
    </>
  )
}
