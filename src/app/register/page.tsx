import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg border-primary/10">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="font-bold text-lg">WR</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Daftar Akun Baru</CardTitle>
          <CardDescription>
            Isi data di bawah ini untuk membuat akun Web Rajut
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" type="text" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="nama@email.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Konfirmasi Password</Label>
            <Input id="confirm-password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Link href="/dashboard" className="w-full">
            <Button className="w-full text-md h-10">Daftar</Button>
          </Link>
          <div className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Masuk
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
