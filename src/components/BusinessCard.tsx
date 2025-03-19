
import { motion } from "framer-motion";
import { Card, CardContent, CardTitle, CardDescription } from "./Card";
import { Star, MoreVertical, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BusinessCardProps {
  id: string;
  name: string;
  type: string;
  reviewCount: number;
  averageRating: number;
  delay?: number;
}

export default function BusinessCard({ id, name, type, reviewCount, averageRating, delay = 0 }: BusinessCardProps) {
  return (
    <Card hover={true} delay={delay} className="h-full">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <Badge variant="outline" className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300">
              {type}
            </Badge>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
          
          <CardTitle className="text-xl font-bold mb-2">{name}</CardTitle>
          <CardDescription className="mb-6">ID: {id.substring(0, 8)}</CardDescription>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-1" />
              <span className="font-medium">{averageRating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-blue-500 mr-1" />
              <span className="font-medium">{reviewCount} avis</span>
            </div>
          </div>
          
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(averageRating / 5 * 100, 100)}%` }}
              transition={{ duration: 1, delay: delay * 0.1 + 0.5 }}
            />
          </div>
        </div>
        
        <div className="border-t border-gray-100 dark:border-gray-800 px-6 py-3 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
          <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
            Voir les détails
          </button>
          <button className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium">
            Générer des avis
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
