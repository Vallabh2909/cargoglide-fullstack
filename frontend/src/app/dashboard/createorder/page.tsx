'use client'

import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  updateOrderId,
  updateOrderDate,
  addProduct,
  removeProduct,
  updateProduct,
  updateSourceAddress,
  updateDestinationAddress,
  updatePackageDimensions,
} from '@/slices/orderSlice'
import Link from 'next/link'
const countries: { [key: string]: string[] } = {
  'United States': ['Alabama', 'Alaska', 'California', 'Texas'],
  'Canada': ['Alberta', 'British Columbia', 'Ontario', 'Quebec'],
  'India': ['Andhra Pradesh', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Kerala', 'Maharashtra'],
}

export default function OrderCreation() {
  const dispatch = useDispatch()
  const router = useRouter()
  const order = useSelector((state: any) => state.order)

  const handleAddProduct = () => {
    dispatch(addProduct())
  }

  const handleRemoveProduct = (index: number) => {
    dispatch(removeProduct(index))
  }

  const renderAddressFields = (type: 'source' | 'destination') => {
    const address = type === 'source' ? order.sourceAddress : order.destinationAddress
    const updateAddressAction = type === 'source' ? updateSourceAddress : updateDestinationAddress

    return (
      <>
        <div>
          <Label htmlFor={`${type}Street`}>Street Address</Label>
          <Textarea
            id={`${type}Street`}
            value={address.street}
            onChange={(e) =>
              dispatch(updateAddressAction({ field: 'street', value: e.target.value }))
            }
            placeholder="Enter street address"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${type}City`}>City</Label>
            <Input
              id={`${type}City`}
              value={address.city}
              onChange={(e) =>
                dispatch(updateAddressAction({ field: 'city', value: e.target.value }))
              }
              placeholder="Enter city"
            />
          </div>
          <div>
            <Label htmlFor={`${type}County`}>County</Label>
            <Input
              id={`${type}County`}
              value={address.county}
              onChange={(e) =>
                dispatch(updateAddressAction({ field: 'county', value: e.target.value }))
              }
              placeholder="Enter county"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${type}Country`}>Country</Label>
            <Select
              onValueChange={(value) =>
                dispatch(updateAddressAction({ field: 'country', value }))
              }
            >
              <SelectTrigger id={`${type}Country`}>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(countries).map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor={`${type}State`}>State/Province</Label>
            <Select
              onValueChange={(value) =>
                dispatch(updateAddressAction({ field: 'state', value }))
              }
            >
              <SelectTrigger id={`${type}State`}>
                <SelectValue placeholder="Select state/province" />
              </SelectTrigger>
              <SelectContent>
                {(countries[address.country] || []).map((state:any) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor={`${type}Pincode`}>Pincode/Zip Code</Label>
          <Input
            id={`${type}Pincode`}
            value={address.pincode}
            onChange={(e) =>
              dispatch(updateAddressAction({ field: 'pincode', value: e.target.value }))
            }
            placeholder="Enter pincode/zip code"
          />
        </div>
      </>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!order.products[0].name) {
      alert('Add at least one product.')
      return
    }
    console.log('Order submitted:', order)
    router.push('/dashboard/select-shipping')
  }

  return (
    <form className="max-w-4xl mx-auto p-6 space-y-8" onSubmit={handleSubmit}>
      <h1 className="text-3xl font-bold">Create New Order</h1>
      <Link href="/dashboard">Back</Link>
      <Card>
        <CardHeader>
          <CardTitle>Create New Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="orderId">Order ID</Label>
              <Input id="orderId" value={order.orderId} readOnly />
            </div>
            <div>
              <Label htmlFor="orderDate">Order Date</Label>
              <Input id="orderDate" value={order.orderDate} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Warehouse Addresses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Source Warehouse Address</h3>
            {renderAddressFields('source')}
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Destination Warehouse Address</h3>
            {renderAddressFields('destination')}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.products.map((product: any, index: number) => (
            <div key={index} className="grid grid-cols-6 gap-4 items-end">
              <div className="col-span-2">
                <Label htmlFor={`productName-${index}`}>Product Name</Label>
                <Input
                  id={`productName-${index}`}
                  value={product.name}
                  onChange={(e) =>
                    dispatch(updateProduct({ index, field: 'name', value: e.target.value }))
                  }
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor={`unitPrice-${index}`}>Unit Price</Label>
                <Input
                  id={`unitPrice-${index}`}
                  type="number"
                  value={product.unitPrice}
                  onChange={(e) =>
                    dispatch(updateProduct({ index, field: 'unitPrice', value: +e.target.value }))
                  }
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                <Input
                  id={`quantity-${index}`}
                  type="number"
                  value={product.quantity}
                  onChange={(e) =>
                    dispatch(updateProduct({ index, field: 'quantity', value: +e.target.value }))
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor={`category-${index}`}>Category</Label>
                <Select
                  onValueChange={(value) =>
                    dispatch(updateProduct({ index, field: 'category', value }))
                  }
                >
                  <SelectTrigger id={`category-${index}`}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {index > 0 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveProduct(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button type="button" variant="outline" onClick={handleAddProduct}>
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Package Dimensions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={order.dimensions.weight}
              onChange={(e) =>
                dispatch(updatePackageDimensions({ field: 'weight', value: +e.target.value }))
              }
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="length">Length (cm)</Label>
            <Input
              id="length"
              type="number"
              value={order.dimensions.length}
              onChange={(e) =>
                dispatch(updatePackageDimensions({ field: 'length', value: +e.target.value }))
              }
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="length">Height (cm)</Label>
            <Input
              id="length"
              type="number"
              value={order.dimensions.height}
              onChange={(e) =>
                dispatch(updatePackageDimensions({ field: 'height', value: +e.target.value }))
              }
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="width">Width (cm)</Label>
            <Input
              id="width"
              type="number"
              value={order.dimensions.width}
              onChange={(e) =>
                dispatch(updatePackageDimensions({ field: 'width', value: +e.target.value }))
              }
              placeholder="0"
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">
        Submit Order
      </Button>
    </form>
  )
}
