
import { Button } from "@/components/Button";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, RefreshCw, Users } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-24">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="flex-1 max-w-2xl mb-12 md:mb-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                    Gérez vos avis en ligne <span className="text-blue-600 dark:text-blue-400">intelligemment</span>
                  </h1>
                  <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
                    Automatisez vos avis sur Google et Trustpilot avec des techniques avancées d'anonymisation et d'intelligence artificielle. Une solution complète pour votre réputation en ligne.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/dashboard">
                      <Button variant="gradient" size="lg" className="px-8 py-3 h-auto">
                        Accéder au Dashboard
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="px-8 py-3 h-auto">
                      En savoir plus
                    </Button>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="relative p-4">
                  <div className="absolute inset-0 bg-blue-500 dark:bg-blue-600 rounded-3xl transform rotate-2"></div>
                  <div className="relative bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-6 w-6 fill-current" />
                        ))}
                      </div>
                      <p className="ml-2 text-gray-700 dark:text-gray-300 font-medium">4.9/5</p>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                      "Ce service a complètement transformé notre réputation en ligne. Les avis générés sont parfaitement naturels et crédibles."
                    </p>
                    <div className="flex items-center">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">JD</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Jean Dupont</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Restaurant Le Gourmet</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Fonctionnalités Principales</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Notre plateforme offre une solution complète pour gérer et automatiser vos avis en ligne en toute sécurité.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Star className="h-10 w-10 text-blue-500" />,
                  title: "Génération d'avis IA",
                  description: "Des avis naturels et variés générés par intelligence artificielle adaptés à votre entreprise."
                },
                {
                  icon: <Shield className="h-10 w-10 text-blue-500" />,
                  title: "Anonymisation avancée",
                  description: "Rotation d'IP, VPN résidentiel et proxies pour une sécurité maximale."
                },
                {
                  icon: <RefreshCw className="h-10 w-10 text-blue-500" />,
                  title: "Automatisation complète",
                  description: "Publication automatique sur Google et Trustpilot avec simulation de comportement humain."
                },
                {
                  icon: <Users className="h-10 w-10 text-blue-500" />,
                  title: "Gestion des comptes",
                  description: "Création et gestion automatisée des comptes pour publier vos avis."
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Prêt à améliorer votre réputation en ligne ?
              </h2>
              <p className="text-blue-100 mb-8 text-lg">
                Commencez dès maintenant à générer des avis de qualité pour votre entreprise.
              </p>
              <Link to="/dashboard">
                <Button 
                  variant="default" 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 h-auto"
                >
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
                © 2023 Review Manager. Tous droits réservés.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                  Conditions d'utilisation
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                  Politique de confidentialité
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Index;
