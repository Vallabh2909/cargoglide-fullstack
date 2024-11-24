// ShippingOptions.tsx
'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux' // Import useDispatch
import { setSelectedShippingOption } from '@/slices/orderSlice' // Import the action from the slice
import { Star, Plane, Ship, Truck, Clock, DollarSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

type ShippingOption = {
  id: string
  company: string
  mode: 'air' | 'water' | 'road' | 'air+water' | 'air+road' | 'water+road'
  price: number
  pickupTime: string
  deliveryTime: string
  rating: number
}

const shippingOptions: ShippingOption[] = [
  { id: '1', company: 'FastAir', mode: 'air', price: 150, pickupTime: '1 day', deliveryTime: '3-5 days', rating: 4.5 },
  { id: '2', company: 'OceanCargo', mode: 'water', price: 80, pickupTime: '2 days', deliveryTime: '15-20 days', rating: 4.2 },
  { id: '3', company: 'RoadRunner', mode: 'road', price: 100, pickupTime: '1 day', deliveryTime: '7-10 days', rating: 4.0 },
  { id: '4', company: 'AirSea Express', mode: 'air+water', price: 130, pickupTime: '1 day', deliveryTime: '10-15 days', rating: 4.3 },
  { id: '5', company: 'SkyRoad Logistics', mode: 'air+road', price: 140, pickupTime: '1 day', deliveryTime: '5-7 days', rating: 4.4 },
  { id: '6', company: 'SeaRoad Shipping', mode: 'water+road', price: 90, pickupTime: '2 days', deliveryTime: '12-18 days', rating: 4.1 },
]

const getModeIcon = (mode: ShippingOption['mode']) => {
  switch (mode) {
    case 'air':
      return <Plane className="h-6 w-6" />
    case 'water':
      return <Ship className="h-6 w-6" />
    case 'road':
      return <Truck className="h-6 w-6" />
    case 'air+water':
      return <div className="flex"><Plane className="h-6 w-6 mr-1" /><Ship className="h-6 w-6" /></div>
    case 'air+road':
      return <div className="flex"><Plane className="h-6 w-6 mr-1" /><Truck className="h-6 w-6" /></div>
    case 'water+road':
      return <div className="flex"><Ship className="h-6 w-6 mr-1" /><Truck className="h-6 w-6" /></div>
    default:
      return null
  }
}

export default function ShippingOptions() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const dispatch = useDispatch() // Initialize dispatch

  const router = useRouter()
  const handleShippingOptionChange = (id: string) => {
    const selectedOption = shippingOptions.find(option => option.id === id)
    if (selectedOption) {
      setSelectedOption(id)
      dispatch(setSelectedShippingOption(selectedOption)) // Dispatch the action to update Redux state
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Shipping Options</h1>
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all">All Options</TabsTrigger>
          <TabsTrigger value="air">Air</TabsTrigger>
          <TabsTrigger value="water">Water</TabsTrigger>
          <TabsTrigger value="road">Road</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ShippingOptionsList 
            options={shippingOptions} 
            selectedOption={selectedOption} 
            onShippingOptionChange={handleShippingOptionChange}
          />
        </TabsContent>
        <TabsContent value="air">
          <ShippingOptionsList 
            options={shippingOptions.filter(option => option.mode === 'air' || option.mode.includes('air'))} 
            selectedOption={selectedOption}
            onShippingOptionChange={handleShippingOptionChange}
          />
        </TabsContent>
        <TabsContent value="water">
          <ShippingOptionsList 
            options={shippingOptions.filter(option => option.mode === 'water' || option.mode.includes('water'))} 
            selectedOption={selectedOption}
            onShippingOptionChange={handleShippingOptionChange}
          />
        </TabsContent>
        <TabsContent value="road">
          <ShippingOptionsList 
            options={shippingOptions.filter(option => option.mode === 'road' || option.mode.includes('road'))} 
            selectedOption={selectedOption}
            onShippingOptionChange={handleShippingOptionChange}
          />
        </TabsContent>
      </Tabs>
      <div className="mt-6">
        <Button disabled={!selectedOption} onClick={()=>router.push("/dashboard/order")} className="w-full">
          Proceed with Selected Shipping Option
        </Button>
      </div>
    </div>
  )
}

function ShippingOptionsList({ options, selectedOption, onShippingOptionChange }: { options: ShippingOption[], selectedOption: string | null, onShippingOptionChange: (id: string) => void }) {
  return (
    <RadioGroup value={selectedOption || ''} onValueChange={onShippingOptionChange}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => (
          <Card key={option.id} className={`cursor-pointer transition-all ${selectedOption === option.id ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{option.company}</CardTitle>
                {getModeIcon(option.mode)}
              </div>
              <CardDescription>
                {option.mode.split('+').map((m) => m.charAt(0).toUpperCase() + m.slice(1)).join(' + ')} Transport
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="font-semibold">${option.price}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>{option.rating.toFixed(1)}</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center mb-1">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Pickup in {option.pickupTime}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Estimated delivery: {option.deliveryTime}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
              <Label
                htmlFor={option.id}
                className="flex items-center justify-center w-full py-2 bg-secondary text-secondary-foreground rounded-md cursor-pointer hover:bg-secondary/80"
              >
                Select Option
              </Label>
            </CardFooter>
          </Card>
        ))}
      </div>
    </RadioGroup>
  )
}
