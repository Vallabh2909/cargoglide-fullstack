'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from 'lucide-react'
import axios from 'axios';
import { useRouter } from 'next/navigation'

export default function Component() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.password) newErrors.password = 'Password is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


const handleSubmit = async (e: any) => {
  e.preventDefault();
  if (validateForm()) {
    try {
      const response = await axios.post(`${process.env.SERVER || "http://localhost:8000"}/api/v1/users/login`, formData, {
        withCredentials: true,
      });
      // Assuming the response data structure
      // alert(response.data.message);
      router.push('/dashboard');
      // localStorage.setItem('token', response.data.token);
      // Redirect to dashboard
    } catch (error: any) {
      // Handle errors (network or server errors)
      if (error.response) {
        alert(error.response.data.error); // Server-side error message
      } else {
        alert('An unexpected error occurred.');
      }
    }
  }
};

  

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4">
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>SMB Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.password}</p>}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full" onClick={handleSubmit}>Log In</Button>
        <p className="text-sm text-center text-gray-500">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
        </p>
      </CardFooter>
    </Card>
  </div>
  )
}