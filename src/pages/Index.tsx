
import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import { Button } from "@/components/Button";
import { Card, CardContent } from "@/components/Card";
import { ArrowRight, MessageCircle, Zap, Shield, BarChart3 } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const Index = () => {
  // Add smooth scroll to top when page loads
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        
        <main>
          <HeroSection />
          <FeatureSection />
          
          {/* How It Works Section */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Comment ça marche</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Notre processus simplifié en quatre étapes pour optimiser votre présence en ligne.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-10">
                  {[
                    {
                      number: "01",
                      title: "Configurez votre entreprise",
                      description: "Ajoutez les informations de votre entreprise et définissez vos préférences de contenu."
                    },
                    {
                      number: "02",
                      title: "Créez vos templates d'avis",
                      description: "Personnalisez vos templates d'avis avec des mots-clés et des variations."
                    },
                    {
                      number: "03",
                      title: "Planifiez vos publications",
                      description: "Définissez un calendrier de publication adapté à votre stratégie."
                    },
                    {
                      number: "04",
                      title: "Analysez les résultats",
                      description: "Suivez l'impact de vos avis et ajustez votre stratégie en conséquence."
                    }
                  ].map((step, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex gap-6"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                        {step.number}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                    <div className="p-12 text-center">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <MessageCircle className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Interface intuitive</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Notre plateforme est conçue pour être simple et efficace.
                      </p>
                      <Button variant="gradient" size="lg" className="mt-4">
                        Essayer maintenant
                      </Button>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -z-10 -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute -z-10 -left-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
                </motion.div>
              </div>
            </div>
          </section>
          
          {/* Advantages Section */}
          <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos avantages</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Pourquoi choisir notre plateforme pour la gestion de vos avis en ligne.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Zap className="h-8 w-8 text-yellow-500" />,
                    title: "Performance",
                    description: "Notre système optimisé permet la génération et la publication d'avis de manière fluide et rapide."
                  },
                  {
                    icon: <Shield className="h-8 w-8 text-green-500" />,
                    title: "Sécurité",
                    description: "Protection avancée et anonymat garantis grâce à nos systèmes de rotation d'IP et de comptes."
                  },
                  {
                    icon: <BarChart3 className="h-8 w-8 text-blue-500" />,
                    title: "Analytique",
                    description: "Tableaux de bord détaillés pour suivre vos performances et optimiser vos stratégies."
                  }
                ].map((advantage, index) => (
                  <Card key={index} variant="glass" hover={true} delay={index * 0.2}>
                    <CardContent className="p-8">
                      <div className="mb-4 inline-flex p-3 rounded-xl bg-gray-100 dark:bg-gray-800/50">
                        {advantage.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{advantage.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{advantage.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <Card variant="glass" className="overflow-hidden border-0 shadow-xl">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden py-12 px-8 md:py-16 md:px-12 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                    <div className="relative z-10">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4 max-w-xl">
                        Prêt à révolutionner votre stratégie d'avis en ligne ?
                      </h2>
                      <p className="mb-8 max-w-2xl opacity-90">
                        Commencez dès aujourd'hui à automatiser votre gestion d'avis et voyez la différence sur votre réputation en ligne.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button className="bg-white text-blue-600 hover:bg-blue-50">
                          Commencer gratuitement
                        </Button>
                        <Button variant="outline" className="border-white text-white hover:bg-white/10">
                          Voir la démo
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
        
        {/* Footer */}
        <footer className="py-12 bg-gray-100 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="col-span-2 md:col-span-1">
                <h3 className="text-xl font-bold mb-4">ReviewFlow</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  La solution complète pour la gestion automatisée de vos avis en ligne.
                </p>
              </div>
              
              {[
                {
                  title: "Produit",
                  links: ["Fonctionnalités", "Tarifs", "Témoignages", "FAQ"]
                },
                {
                  title: "Entreprise",
                  links: ["À propos", "Blog", "Carrières", "Contact"]
                },
                {
                  title: "Légal",
                  links: ["Conditions d'utilisation", "Politique de confidentialité", "Cookies"]
                }
              ].map((column, index) => (
                <div key={index}>
                  <h4 className="font-semibold mb-4">{column.title}</h4>
                  <ul className="space-y-2">
                    {column.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                © {new Date().getFullYear()} ReviewFlow. Tous droits réservés.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Index;
