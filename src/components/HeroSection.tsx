
import { Button } from "./Button";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(100,100,255,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom_left,rgba(100,100,255,0.1),transparent_50%)]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-24 md:pt-48 md:pb-40 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-1"
        >
          <span className="inline-block px-3 py-1 mb-2 text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
            Gestion Intelligente d'Avis
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance mx-auto max-w-3xl">
            L'automatisation des avis <br className="hidden sm:block" />
            portée à la perfection
          </h1>
          <p className="mt-6 text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300 leading-relaxed">
            Notre plateforme sécurisée vous permet de générer et gérer des avis authentiques pour votre entreprise, le tout avec une interface utilisateur élégante et intuitive.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gradient" size="lg" className="px-8 py-3 text-base font-medium">
              Commencer maintenant
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-base font-medium">
              Voir la démo
            </Button>
          </div>
        </motion.div>
        
        {/* Dashboard Preview Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 relative w-full max-w-5xl"
        >
          <div className="overflow-hidden rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="aspect-[16/9] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center text-gray-400">
              <svg className="w-24 h-24 opacity-20" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -z-10 -left-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -z-10 right-10 -top-10 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl"></div>
        </motion.div>
      </div>
    </div>
  );
}
