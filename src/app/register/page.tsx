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
import { StatusModal, StatusModalType } from "@/components/ui/status-modal";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<StatusModalType>("success");
  const [modalMessage, setModalMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await authService.register({ username, password });
      console.log("Register successful:", result);
      
      setModalType("success");
      setModalMessage("Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.");
      setModalOpen(true);
    } catch (error: any) {
      setModalType("error");
      setModalMessage(error.message || "Pendaftaran gagal. Username mungkin sudah digunakan.");
      setModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    if (modalType === "success") {
      router.push("/login");
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md shadow-lg border-primary/10">
          <form onSubmit={handleRegister}>
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <span className="font-bold text-xl">QL</span>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Daftar Akun Baru</CardTitle>
              <CardDescription className="text-slate-500">
                Isi data di bawah ini untuk membuat akun QueenyLook
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="username" className="text-sm font-semibold text-slate-700">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="admin123" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                  className="h-11 border-primary/20 focus:border-primary transition-colors rounded-xl"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="h-11 border-primary/20 focus:border-primary transition-colors rounded-xl"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-5 pt-2">
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:opacity-90 h-11 text-md font-bold rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-[0.98]" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Daftar"
                )}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Sudah punya akun?{" "}
                <Link href="/login" className="font-bold text-primary hover:underline">
                  Masuk di sini
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>

      <StatusModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        type={modalType}
        title={modalType === "success" ? "Berhasil!" : "Gagal"}
        description={modalMessage}
        onAction={handleModalClose}
        actionText={modalType === "success" ? "Ke Halaman Login" : "Tutup"}
      />
    </>
  );
}
