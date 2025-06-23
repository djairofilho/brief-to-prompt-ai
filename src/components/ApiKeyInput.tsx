
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Eye, EyeOff } from "lucide-react";

interface ApiKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
  isLoading?: boolean;
}

const ApiKeyInput = ({ onApiKeySubmit, isLoading }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
          <Key className="h-5 w-5 text-amber-500" />
          Configuração da API OpenAI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showApiKey ? "text" : "password"}
              placeholder="Cole sua chave da API OpenAI aqui (sk-...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-10 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="bg-amber-100 p-3 rounded-lg">
            <p className="text-sm text-amber-800">
              ⚠️ <strong>Aviso de Segurança:</strong> A chave da API será armazenada temporariamente no seu navegador. 
              Para uso em produção, recomendamos usar um backend seguro.
            </p>
          </div>

          <Button
            type="submit"
            disabled={!apiKey.trim() || isLoading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
          >
            {isLoading ? "Configurando..." : "Usar OpenAI"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
