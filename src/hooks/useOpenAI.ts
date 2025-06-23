
import { useState } from 'react';

interface UseOpenAIProps {
  apiKey: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const useOpenAI = ({ apiKey }: UseOpenAIProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePrompt = async (briefing: string): Promise<string> => {
    if (!apiKey) {
      throw new Error('API key da OpenAI é obrigatória');
    }

    setIsLoading(true);
    setError(null);

    const systemPrompt = `Você é um especialista em criação de prompts visuais para IA. Dado um briefing de anúncio publicitário, 
gere um prompt estruturado e descritivo em português para ser usado em ferramentas de geração de imagem como Lovable.
Use linguagem clara, criativa e inspiradora.

Estruture o prompt com:
- Descrição visual principal
- Especificações técnicas (resolução, estilo, qualidade)
- Elementos de composição (cores, tipografia, layout)
- Contexto emocional e apelo visual
- Detalhes específicos baseados no briefing fornecido`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: `Briefing do anúncio: ${briefing}`
            }
          ],
          temperature: 0.8,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro da API OpenAI: ${response.status} ${response.statusText}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || 'Erro ao gerar prompt';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generatePrompt,
    isLoading,
    error,
  };
};
