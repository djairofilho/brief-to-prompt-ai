
import BriefingGenerator from "@/components/BriefingGenerator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Gerador de Prompts Publicitários
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Digite seu briefing publicitário e transforme-o em um prompt otimizado para inteligência artificial
            </p>
          </div>
          <BriefingGenerator />
        </div>
      </div>
    </div>
  );
};

export default Index;
