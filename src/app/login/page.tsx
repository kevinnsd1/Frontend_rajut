import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg border-primary/10">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="font-bold text-lg">WR</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Selamat Datang Kembali</CardTitle>
          <CardDescription>
            Masukkan email dan password untuk mengakses dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="admin@webrajut.com" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-sm font-medium text-primary hover:underline">
                Lupa password?
              </Link>
            </div>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Link href="/dashboard" className="w-full">
            <Button className="w-full text-md h-10">Masuk</Button>
          </Link>
          <div className="text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Daftar di sini
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
