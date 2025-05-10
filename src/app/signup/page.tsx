 'use client'

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'

const Page: React.FC = () => {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mobile, setMobile] = useState('')
  const [bio, setBio] = useState('')
  const [college, setCollege] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      router.push('/dashboard')
    }
  }, [router]) // added dependency to prevent warnings

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setAvatar(file)
  }

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('fullname', fullname)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('mobile', mobile)
    formData.append('bio', bio)
    formData.append('college', college)
    if (avatar) formData.append('avatar', avatar)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/user/admin`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data.message === 'Admin created successfully') {
        router.push('/login')
      }
    } catch (error) {
      console.error("Error creating admin:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Image - 60% on large screens, full width on mobile */}
      <div className="relative w-full lg:w-[65%] h-64 lg:h-auto">
        <Image
          src='/image.png'
          alt='image'
          fill
          className="object-cover"
          priority
        />
      </div>
  
      {/* Right Form - 40% on large screens, full width on mobile */}
      <div className="w-full lg:w-[35%] flex items-center justify-center bg-white p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create a new account to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleClick}>
              <div className="grid w-full items-center gap-4">
                {/* form fields unchanged */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" onChange={(e) => setFullname(e.target.value)} placeholder="Enter your name" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Choose a password" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="mobile">Mobile No</Label>
                  <Input id="mobile" type="tel" onChange={(e) => setMobile(e.target.value)} placeholder="Enter your mobile number" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="bio">Bio</Label>
                  <Input id="bio" onChange={(e) => setBio(e.target.value)} placeholder="Write a short bio" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="college">College</Label>
                  <Input id="college" onChange={(e) => setCollege(e.target.value)} placeholder="Enter your college" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="avatar">Avatar</Label>
                  <Input id="avatar" type="file" accept="image/*" onChange={handleImage} />
                </div>
              </div>
              <CardFooter className="pt-4 px-0">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Account'}
                </Button>
              </CardFooter>
            </form>
            <Link href='/login'>
              <p className='text-center text-black text-md mt-2 underline'>
                Already have an account? Login
              </p>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
  
}

export default Page
