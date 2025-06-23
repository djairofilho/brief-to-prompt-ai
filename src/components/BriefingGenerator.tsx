
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BriefingGenerator = () => {
  const [briefing, setBriefing] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const generatePrompt = async () => {
    if (!briefing.trim()) {
      toast({
        title: "Atenção",
        description: "Por favor, digite um briefing antes de gerar o prompt.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simula processamento de IA (substituir por API real)
    setTimeout(() => {
      const prompt = `Crie uma imagem publicitária profissional com base no seguinte briefing:

${briefing}

Especificações técnicas:
- Resolução: 1920x1080 pixels
- Estilo: Moderno e atrativo
- Composição: Equilibrada com hierarquia visual clara
- Cores: Harmoniosas e alinhadas com a marca
- Tipografia: Legível e impactante
- Qualidade: Ultra alta definição, fotorrealística
- Formato: Adequado para uso digital e impresso

Elementos visuais a considerar:
- Layout limpo e profissional
- Foco no produto/serviço principal
- Call-to-action visível e persuasivo
- Identidade visual consistente
- Apelo emocional apropriado ao público-alvo`;

      setGeneratedPrompt(prompt);
      setIsGenerating(false);
      
      toast({
        title: "Prompt gerado com sucesso!",
        description: "Seu prompt está pronto para ser usado.",
      });
    }, 2000);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setIsCopied(true);
      toast({
        title: "Copiado!",
        description: "O prompt foi copiado para sua área de transferência.",
      });
      
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o texto.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-500" />
            Seu Briefing Publicitário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Textarea
              placeholder="Descreva seu anúncio publicitário aqui... 

Exemplo:
- Produto: Smartphone premium
- Público-alvo: Jovens profissionais 25-35 anos
- Mensagem principal: Tecnologia que conecta
- Tom: Moderno e sofisticado
- Elementos visuais: Produto em destaque, fundo minimalista
- Cores: Azul e branco"
              value={briefing}
              onChange={(e) => setBriefing(e.target.value)}
              className="min-h-[200px] text-base leading-relaxed resize-none border-gray-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={generatePrompt}
              disabled={isGenerating}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Gerando Prompt...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar Prompt
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Output Section */}
      {generatedPrompt && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 animate-in slide-in-from-bottom duration-500">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-indigo-500" />
                Prompt Gerado
              </CardTitle>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="border-indigo-200 hover:bg-indigo-100 transition-colors"
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg p-6 border border-indigo-100">
              <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed font-mono text-sm">
                {generatedPrompt}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips Section */}
      <Card className="shadow-lg border-0 bg-white">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            💡 Dicas para um briefing eficaz
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Seja específico sobre o produto ou serviço</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Defina claramente seu público-alvo</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Mencione o tom e estilo desejado</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Inclua informações sobre cores e elementos visuais</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Descreva a mensagem principal que deseja transmitir</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BriefingGenerator;
