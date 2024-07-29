import { Button } from '@/components/ui/button'
import { auth } from '@/server/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ProductForm } from './product-form'

export default async function NewProductPage() {
  const session = await auth()
  const isAdmin = session?.user.role === 'admin'

  if (!session) redirect('/auth/login')
  if (!isAdmin) {
    redirect('/auth/not-allowed')
  }
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
        <Button variant={'outline'} asChild>
          <Link href="/studio/products">Back to products</Link>
        </Button>
      </div>
      <div className="flex flex-1 p-0 sm:border sm:border-dashed sm:shadow-sm md:p-6 sm:rounded-lg">
        <ProductForm />
      </div>
    </>
  )
}
