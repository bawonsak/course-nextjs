'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import PuffLoader from 'react-spinners/PuffLoader'
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';
import Link from 'next/link'

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(30)

  const handlePageClick = async (page) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get('https://dummyjson.com/products', {
          params: {
            limit: limit,
            skip: (currentPage - 1) * limit
          }
        })
        setProducts(data.products)
        setLoading(false)

        let pages = Math.ceil(data.total / data.limit)

        console.log('pages', pages)
        setTotalPages(pages)
      } catch {
        setLoading(false)
      }
    }

    getProducts()
  }, [currentPage])

  return (
    <div>
      <h1>Product List</h1>
      {loading ? (
        <PuffLoader />
      ) : (
        <div>
          <div className='flex flex-wrap items-center justify-center'>
            {products.map((item, index) => {
              return (
                <div
                  key={index}
                  className='relative m-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md'
                >
                  <Link href={'/product/' + item.id} className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
                    <Image
                      className='object-cover'
                      src={item.thumbnail}
                      alt={item.description}
                      width={500}
                      height={100}
                      sizes='100vw'
                    />
                  </Link>
                  <div className='mt-4 px-5 pb-5'>
                    <a href='#'>
                      <h5 className='text-xl tracking-tight text-slate-900'>{item.title}</h5>
                    </a>
                    <div className='mt-2 mb-5 flex items-center justify-between'>
                      <p>
                        <span className='text-3xl font-bold text-slate-900'>${item.price}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {totalPages > 1 ? <>
            <ResponsivePagination
              current={currentPage}
              total={totalPages}
              onPageChange={handlePageClick}
            />
          </> : <></>}
        </div>
      )}
    </div>
  )
}
export default ProductList
// This component is a placeholder for the product list page.
