"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await authService.login({ username, password });
      console.log("Login successful:", result);
      
      setModalType("success");
      setModalMessage("Login berhasil! Anda akan dialihkan ke dashboard.");
      setModalOpen(true);
    } catch (error: any) {
      setModalType("error");
      setModalMessage(error.message || "Username atau password salah.");
      setModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    if (modalType === "success") {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md shadow-lg border-primary/10">
          <form onSubmit={handleLogin}>
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
                  <span className="font-bold text-lg">VM</span>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Selamat Datang Kembali</CardTitle>
              <CardDescription>
                Masukkan username dan password untuk mengakses dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="username" className="text-sm font-semibold">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="admin123" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                  className="h-11"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                  <Link href="#" className="text-sm font-medium text-slate-500 hover:text-black">
                    Lupa password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="h-11"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-5 pt-2">
              <Button type="submit" className="w-full bg-black text-white hover:bg-black/80 h-11 text-md font-semibold" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Masuk"
                )}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Belum punya akun?{" "}
                <Link href="/register" className="font-semibold text-black hover:underline">
                  Daftar di sini
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>

      <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
        <AlertDialogContent className="sm:max-w-md flex flex-col items-center text-center p-8">
          <AlertDialogHeader className="flex flex-col items-center w-full sm:text-center">
            <div className="flex justify-center mb-4">
              <div className={`flex h-16 w-16 items-center justify-center rounded-full ${modalType === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {modalType === 'success' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                )}
              </div>
            </div>
            <AlertDialogTitle className="text-2xl font-bold">
              {modalType === "success" ? "Berhasil!" : "Gagal"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-md text-slate-500 mt-2">
              {modalMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center w-full mt-6">
            <AlertDialogAction onClick={handleModalClose} className={`w-full sm:w-auto ${modalType === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
              {modalType === "success" ? "Lanjutkan" : "Tutup"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
