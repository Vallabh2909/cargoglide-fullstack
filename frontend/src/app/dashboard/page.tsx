'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, Package, Truck, Clock, ShoppingCart, Plus,DownloadCloud } from 'lucide-react'
import Link from 'next/link'

// Mock data - replace with actual API call in a real application
const mockOrders = [
  { id: '001', customer: 'John Doe', date: '2023-05-15', status: 'delayed_delivery' },
  { id: '002', customer: 'Jane Smith', date: '2023-05-16', status: 'delayed_pickup' },
  { id: '003', customer: 'Bob Johnson', date: '2023-05-17', status: 'new' },
  { id: '004', customer: 'Alice Brown', date: '2023-05-18', status: 'ready_to_ship' },
  { id: '005', customer: 'Charlie Davis', date: '2023-05-19', status: 'delayed_delivery' },
  { id: '006', customer: 'Eva Wilson', date: '2023-05-20', status: 'new' },
  { id: '007', customer: 'Frank Miller', date: '2023-05-21', status: 'ready_to_ship' },
  { id: '008', customer: 'Grace Lee', date: '2023-05-22', status: 'delayed_pickup' },
]

type OrderStatus = 'delayed_delivery' | 'delayed_pickup' | 'new' | 'ready_to_ship'

const statusConfig: Record<OrderStatus, { label: string, color: string, icon: React.ReactNode }> = {
  delayed_delivery: { label: 'Delayed (Delivery)', color: 'bg-red-100 text-red-800', icon: <AlertCircle className="w-4 h-4 mr-1" /> },
  delayed_pickup: { label: 'Delayed (Pickup)', color: 'bg-orange-100 text-orange-800', icon: <Clock className="w-4 h-4 mr-1" /> },
  new: { label: 'New Order', color: 'bg-blue-100 text-blue-800', icon: <ShoppingCart className="w-4 h-4 mr-1" /> },
  ready_to_ship: { label: 'Ready to Ship', color: 'bg-green-100 text-green-800', icon: <Package className="w-4 h-4 mr-1" /> },
}

export default function Component() {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all')

  const filteredOrders = selectedStatus === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === selectedStatus)

  const orderCounts = {
    delayed_delivery: mockOrders.filter(o => o.status === 'delayed_delivery').length,
    delayed_pickup: mockOrders.filter(o => o.status === 'delayed_pickup').length,
    new: mockOrders.filter(o => o.status === 'new').length,
    ready_to_ship: mockOrders.filter(o => o.status === 'ready_to_ship').length,
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Order Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
        {(Object.keys(statusConfig) as OrderStatus[]).map((status) => (
          <Card key={status} className="cursor-pointer" onClick={() => setSelectedStatus(status)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {statusConfig[status].label}
              </CardTitle>
              {statusConfig[status].icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderCounts[status]}</div>
              <p className="text-xs text-muted-foreground">
                {orderCounts[status] === 1 ? 'order' : 'orders'}
              </p>
            </CardContent>
          </Card>
        ))}
        <Link href="/dashboard/createorder">
        <Card className="cursor-pointer bg-primary text-primary-foreground" onClick={() => console.log('Create new order')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Create New Order</CardTitle>
            <Plus className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+</div>
            <p className="text-xs">Click to create</p>
          </CardContent>
        </Card>
        </Link>
        <Link href="/dashboard/docs">
        <Card className="cursor-pointer bg-primary text-primary-foreground" onClick={() => console.log('Create new order')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upload or Retrive Docs</CardTitle>
            <DownloadCloud className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Docs</div>
            <p className="text-xs">Access your docs</p>
          </CardContent>
        </Card>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>
            {selectedStatus === 'all' ? 'All orders' : `${statusConfig[selectedStatus as OrderStatus].label} orders`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge className={`${statusConfig[order.status as OrderStatus].color} flex items-center w-fit`}>
                      {statusConfig[order.status as OrderStatus].icon}
                      {statusConfig[order.status as OrderStatus].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
