
import { Card, CardContent } from "./Card";
import { ChartPie, ShieldCheck, BarChart, Zap, Globe, RefreshCw } from "lucide-react";

const features = [
  {
    title: "Génération d'avis intelligente",
    description: "Notre système génère des avis réalistes et personnalisés pour chaque type d'entreprise.",
    icon: <ChartPie className="h-10 w-10 text-blue-500" />
  },
  {
    title: "Sécurité maximale",
    description: "Protection avancée pour éviter toute détection et garantir l'anonymat de vos opérations.",
    icon: <ShieldCheck className="h-10 w-10 text-green-500" />
  },
  {
    title: "Rapports analytiques",
    description: "Suivez l'impact de vos campagnes d'avis avec des tableaux de bord détaillés et personnalisables.",
    icon: <BarChart className="h-10 w-10 text-purple-500" />
  },
  {
    title: "Automatisation complète",
    description: "Planifiez vos publications d'avis avec des comportements humains simulés.",
    icon: <Zap className="h-10 w-10 text-yellow-500" />
  },
  {
    title: "Multi-plateformes",
    description: "Compatible avec Google, Trustpilot et d'autres plateformes d'avis populaires.",
    icon: <Globe className="h-10 w-10 text-indigo-500" />
  },
  {
    title: "Rotation des comptes",
    description: "Système intelligent de rotation des comptes et des proxies pour une sécurité optimale.",
    icon: <RefreshCw className="h-10 w-10 text-red-500" />
  }
];

export default function FeatureSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Fonctionnalités avancées</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Notre plateforme combine technologie de pointe et design intuitif pour une gestion d'avis sans effort.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} variant="glass" hover={true} delay={index * 0.2}>
              <CardContent className="flex flex-col items-center text-center p-8">
                <div className="mb-4 p-3 rounded-full bg-gray-100 dark:bg-gray-800/50">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
