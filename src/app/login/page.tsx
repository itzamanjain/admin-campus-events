"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { useRouter } from 'next/navigation'
import Link from 'next/link';

const Page = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading , setloading] = useState<boolean>(false);
  const Router = useRouter();

  const handle = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault(); // prevent page reload
    setloading(true); // set loading to true
  
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/user/login`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json' // <- tell backend it's JSON
        }
      });

      setloading(false); // set loading to false
  
      console.log("response here", response.data.data.accessToken);

      const accessToken = response.data.data.accessToken;

      console.log("access token", accessToken);
      

      localStorage.setItem("accessToken" ,accessToken)

      Router.push('/dashboard')
    } catch (error) {
      console.log("error in logged in", error);
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[320px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handle}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="outline" type="button">Cancel</Button>
                <Button type="submit"
                disabled={loading} // ✅ Disable button when loading
                > {loading ? 'Loading...' : 'Login'}</Button> {/* ✅ Form submission works */}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
     
    </div>
  );
};

export default Page;