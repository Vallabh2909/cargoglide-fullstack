'use client'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useState } from 'react'
import { CreditCard, Download, Package, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import axios from 'axios'
// Mock data for demonstration purposes
const orderSummary = {
  orderId: 'ORD-123456',
  items: [
    { name: 'Product A', quantity: 2, price: 50 },
    { name: 'Product B', quantity: 1, price: 75 },
  ],
  subtotal: 175,
  shipping: {
    method: 'Express Air Shipping',
    cost: 25,
  },
}

export default function OrderPayment() {
  const [isPaid, setIsPaid] = useState(false)
  const [waybillNumber, setWaybillNumber] = useState('')
  const orderState = useSelector((state: RootState) => state.order)
  const handlePayment = () => {
     try {
        // Send order to the backend
        const res =axios.post(`${process.env.SERVER}/api/v1/customers/create-order`, orderState)
        setIsPaid(true)
        setWaybillNumber(`WB-${Math.random().toString(36).substr(2, 9).toUpperCase()}`)
        console.log('Full order object:', orderState)
    } catch (error) {
        console.error('Error creating order:', error)
    }
  }

  const downloadLabel = () => {
    // Simulate label download
    console.log('Downloading shipping label...')
  }

  const downloadInvoice = () => {
    // Simulate invoice download
    console.log('Downloading invoice...')
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Order Payment</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Order ID: {orderSummary.orderId}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderSummary.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>${item.price * item.quantity}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>${orderSummary.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>{orderSummary.shipping.method}</span>
              <span>${orderSummary.shipping.cost}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${orderSummary.subtotal + orderSummary.shipping.cost}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup defaultValue="card">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card">Credit Card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal">PayPal</Label>
              </div>
            </RadioGroup>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handlePayment} disabled={isPaid}>
              {isPaid ? 'Paid' : 'Pay Now'}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {isPaid && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Shipping Execution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span className="font-semibold">Waybill Number:</span>
              <span>{waybillNumber}</span>
            </div>
            <div className="flex space-x-4">
              <Button onClick={downloadLabel} className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Download Shipping Label
              </Button>
              <Button onClick={downloadInvoice} variant="outline" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}