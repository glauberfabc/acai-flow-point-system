import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertCircle, LogIn } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    
    if (!success) {
      setError('Email ou senha incorretos');
    }
  };

  const fillAdmin = () => {
    setEmail('admin@acaishop.com');
    setPassword('123456');
  };

  const fillFuncionario = () => {
    setEmail('funcionario@acaishop.com');
    setPassword('123456');
  };

  return (
    <div className="min-h-screen bg-gradient-acai flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-acai">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="w-20 h-20 bg-gradient-button rounded-full mx-auto flex items-center justify-center shadow-button-acai">
                <span className="text-3xl">🍇</span>
              </div>
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-acai-secondary bg-clip-text text-transparent">
                Açaí Shop PDV
              </CardTitle>
              <CardDescription>
                Sistema de Ponto de Venda
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-button hover:opacity-90 transition-opacity shadow-button-acai"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </>
                )}
              </Button>
            </form>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Contas de demonstração:
              </p>
              
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fillAdmin}
                  className="justify-between"
                >
                  <span>Administrador</span>
                  <Badge variant="secondary">Admin</Badge>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fillFuncionario}
                  className="justify-between"
                >
                  <span>Funcionário</span>
                  <Badge variant="outline">PDV</Badge>
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                Senha para ambas: <code className="bg-muted px-1 rounded">123456</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}