import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Copy, Check, RefreshCw, ArrowLeft, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOpenAI } from "@/hooks/useOpenAI";
import ApiKeyInput from "./ApiKeyInput";

const BriefingGenerator = () => {
  const [briefing, setBriefing] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [useSimulation, setUseSimulation] = useState(false);
  const { toast } = useToast();

  const { generatePrompt, generateImage, isLoading, isGeneratingImage, error } = useOpenAI({ apiKey });

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
    toast({
      title: "API Key configurada!",
      description: "Agora você pode gerar prompts com OpenAI GPT-4.",
    });
  };

  const generatePromptWithAI = async () => {
    if (!briefing.trim()) {
      toast({
        title: "Atenção",
        description: "Por favor, digite um briefing antes de gerar o prompt.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (useSimulation || !apiKey) {
        // Simulação original
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

        await new Promise(resolve => setTimeout(resolve, 2000));
        setGeneratedPrompt(prompt);
      } else {
        // Usar OpenAI
        const prompt = await generatePrompt(briefing);
        setGeneratedPrompt(prompt);
      }
      
      toast({
        title: "Prompt gerado com sucesso!",
        description: useSimulation || !apiKey ? "Prompt simulado criado." : "Prompt criado com OpenAI GPT-4.",
      });
    } catch (err) {
      console.error('Erro ao gerar prompt:', err);
      toast({
        title: "Erro",
        description: error || "Não foi possível gerar o prompt.",
        variant: "destructive",
      });
    }
  };

  const generateImageFromPrompt = async () => {
    if (!generatedPrompt.trim()) {
      toast({
        title: "Atenção",
        description: "Por favor, gere um prompt antes de criar a imagem.",
        variant: "destructive",
      });
      return;
    }

    if (useSimulation || !apiKey) {
      toast({
        title: "Atenção",
        description: "A geração de imagem requer uma API Key da OpenAI.",
        variant: "destructive",
      });
      return;
    }

    try {
      const imageUrl = await generateImage(generatedPrompt);
      setGeneratedImageUrl(imageUrl);
      toast({
        title: "Imagem gerada com sucesso!",
        description: "Sua imagem foi criada usando DALL-E 3.",
      });
    } catch (err) {
      console.error('Erro ao gerar imagem:', err);
      toast({
        title: "Erro",
        description: error || "Não foi possível gerar a imagem.",
        variant: "destructive",
      });
    }
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

  const resetToInitialState = () => {
    setApiKey("");
    setUseSimulation(false);
    setGeneratedPrompt("");
    setGeneratedImageUrl("");
    localStorage.removeItem('openai_api_key');
    toast({
      title: "Configuração resetada",
      description: "Você pode escolher novamente como usar o gerador.",
    });
  };

  // Carrega API key do localStorage na inicialização
  useState(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  });

  return (
    <div className="space-y-8">
      {/* API Configuration */}
      {!apiKey && !useSimulation && (
        <div className="space-y-4">
          <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} isLoading={isLoading} />
          
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setUseSimulation(true)}
              className="border-gray-300 hover:bg-gray-50"
            >
              Usar modo simulação (sem OpenAI)
            </Button>
          </div>
        </div>
      )}

      {/* API Status */}
      {(apiKey || useSimulation) && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-800 font-medium">
                  {apiKey ? "OpenAI GPT-4 Conectado" : "Modo Simulação Ativo"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetToInitialState}
                  className="text-green-700 hover:text-green-900"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (apiKey) {
                      setApiKey("");
                      localStorage.removeItem('openai_api_key');
                    }
                    setUseSimulation(!useSimulation);
                  }}
                  className="text-green-700 hover:text-green-900"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Trocar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input Section */}
      {(apiKey || useSimulation) && (
        <>
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
                  onClick={generatePromptWithAI}
                  disabled={isLoading}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                  size="lg"
                >
                  {isLoading ? (
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
                    Prompt Gerado {apiKey && "(OpenAI GPT-4)"}
                  </CardTitle>
                  <div className="flex gap-2">
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
                    {apiKey && (
                      <Button
                        onClick={generateImageFromPrompt}
                        disabled={isGeneratingImage}
                        variant="outline"
                        size="sm"
                        className="border-indigo-200 hover:bg-indigo-100 transition-colors"
                      >
                        {isGeneratingImage ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                            Gerando...
                          </>
                        ) : (
                          <>
                            <Image className="h-4 w-4 mr-2" />
                            Gerar Imagem
                          </>
                        )}
                      </Button>
                    )}
                  </div>
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

          {/* Generated Image Section */}
          {generatedImageUrl && (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50 animate-in slide-in-from-bottom duration-500">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
                  <Image className="h-6 w-6 text-purple-500" />
                  Imagem Gerada (DALL-E 3)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-4 border border-purple-100">
                  <img 
                    src={generatedImageUrl} 
                    alt="Imagem gerada pelo DALL-E 3"
                    className="w-full h-auto rounded-lg shadow-md"
                  />
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
        </>
      )}
    </div>
  );
};

export default BriefingGenerator;
