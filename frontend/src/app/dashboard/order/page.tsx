'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { MapPin, Package, Truck, Calendar, DollarSign, Star } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const OrderSummary = () => {
  const orderState = useSelector((state: RootState) => state.order)
  const { orderId, orderDate, sourceAddress, destinationAddress, products, dimensions, selectedShippingOption } = orderState
  const router = useRouter()

  const handleProceed = () => {
    // try {
    //     // Send order to the backend
    //     const res =axios.post('http://localhost:8000/api/v1/customers/create-order', orderState)
        
    //     console.log('Full order object:', orderState)
    // } catch (error) {
    //     console.error('Error creating order:', error)
    // }
    router.push('/dashboard/payment')
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 ">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center"><Package className="mr-2 h-5 w-5" /> Order Details</h3>
              <p><span className="font-medium">Order ID:</span> {orderId}</p>
              <p><span className="font-medium">Order Date:</span> {orderDate}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center"><MapPin className="mr-2 h-5 w-5" /> Source Address</h3>
              <p>{sourceAddress.street}</p>
              <p>{sourceAddress.city}, {sourceAddress.state} - {sourceAddress.pincode}</p>
              <p>{sourceAddress.country}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center"><MapPin className="mr-2 h-5 w-5" /> Destination Address</h3>
              <p>{destinationAddress.street}</p>
              <p>{destinationAddress.city}, {destinationAddress.state} - {destinationAddress.pincode}</p>
              <p>{destinationAddress.country}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center"><Package className="mr-2 h-5 w-5" /> Products</h3>
              {products.map((product, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md mb-2">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">Price: ${product.unitPrice.toFixed(2)} x {product.quantity}</p>
                  <Badge variant="secondary" className="mt-1">{product.category}</Badge>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center"><Package className="mr-2 h-5 w-5" /> Package Dimensions</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="font-medium">Weight:</span> {dimensions.weight} kg</p>
                <p><span className="font-medium">Length:</span> {dimensions.length} cm</p>
                <p><span className="font-medium">Width:</span> {dimensions.width} cm</p>
                <p><span className="font-medium">Height:</span> {dimensions.height} cm</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <Separator className="my-4" />
            <h3 className="text-lg font-semibold mb-4 flex items-center"><Truck className="mr-2 h-5 w-5" /> Shipping Details</h3>
            {selectedShippingOption && (
              <div className="bg-primary/5 p-4 rounded-lg grid gap-4 md:grid-cols-3">
                <div>
                  <p className="font-medium text-primary">{selectedShippingOption.company}</p>
                  <Badge variant="outline" className="mt-1">{selectedShippingOption.mode}</Badge>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center"><Calendar className="mr-2 h-4 w-4" /> Pickup: {selectedShippingOption.pickupTime}</p>
                  <p className="flex items-center"><Calendar className="mr-2 h-4 w-4" /> Delivery: {selectedShippingOption.deliveryTime}</p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center"><DollarSign className="mr-2 h-4 w-4" /> Price: ${selectedShippingOption.price.toFixed(2)}</p>
                  <p className="flex items-center"><Star className="mr-2 h-4 w-4" /> Rating: {selectedShippingOption.rating}/5</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center mt-6">
          <Button onClick={handleProceed} className="w-full sm:w-auto">
            Proceed
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default OrderSummary

