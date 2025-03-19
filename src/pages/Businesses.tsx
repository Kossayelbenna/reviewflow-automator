
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/Button";
import BusinessCard from "@/components/BusinessCard";
import { Card, CardContent } from "@/components/Card";
import { Plus, Search, Filter, ArrowDownUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageTransition from "@/components/PageTransition";

// Sample data
const sampleBusinesses = [
  { id: "b1", name: "Café Parisien", type: "Restaurant", reviewCount: 87, averageRating: 4.8 },
  { id: "b2", name: "Tech Solutions", type: "Service", reviewCount: 54, averageRating: 4.2 },
  { id: "b3", name: "Fleuriste Élégance", type: "Commerce", reviewCount: 32, averageRating: 4.9 },
  { id: "b4", name: "Auto Express", type: "Automobile", reviewCount: 65, averageRating: 4.0 },
  { id: "b5", name: "Spa Sérénité", type: "Bien-être", reviewCount: 46, averageRating: 4.7 },
  { id: "b6", name: "Optique Vision", type: "Santé", reviewCount: 29, averageRating: 4.5 },
  { id: "b7", name: "Épicerie Fine", type: "Alimentation", reviewCount: 41, averageRating: 4.6 },
  { id: "b8", name: "Hôtel Riviera", type: "Hôtellerie", reviewCount: 112, averageRating: 4.3 },
];

const Businesses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddingBusiness, setIsAddingBusiness] = useState(false);
  
  // Filter businesses based on search query and active tab
  const filteredBusinesses = sampleBusinesses.filter((business) => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         business.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || 
                     (activeTab === "highRated" && business.averageRating >= 4.5) ||
                     (activeTab === "lowRated" && business.averageRating < 4.5);
    
    return matchesSearch && matchesTab;
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        
        <main className="page-container pt-28">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Entreprises</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Gérez vos entreprises et leurs avis
              </p>
            </div>
            
            <Button onClick={() => setIsAddingBusiness(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une entreprise
            </Button>
          </div>
          
          <Card delay={0.2} className="mb-8">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Rechercher une entreprise..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ArrowDownUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="highRated">Bien notées (4.5+)</TabsTrigger>
              <TabsTrigger value="lowRated">À améliorer (&lt;4.5)</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBusinesses.length > 0 ? (
              filteredBusinesses.map((business, index) => (
                <BusinessCard
                  key={business.id}
                  id={business.id}
                  name={business.name}
                  type={business.type}
                  reviewCount={business.reviewCount}
                  averageRating={business.averageRating}
                  delay={index * 0.1}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  Aucune entreprise trouvée pour cette recherche.
                </p>
              </div>
            )}
          </div>
        </main>
        
        {/* Add Business Dialog */}
        <Dialog open={isAddingBusiness} onOpenChange={setIsAddingBusiness}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter une entreprise</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour ajouter une nouvelle entreprise à gérer.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'entreprise</Label>
                <Input id="name" placeholder="Ex: Café Parisien" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Type d'entreprise</Label>
                <Input id="type" placeholder="Ex: Restaurant, Hôtel, Service..." />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (optionnel)</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Description courte de l'entreprise..."
                ></textarea>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="keywords">Mots-clés (séparés par des virgules)</Label>
                <Input id="keywords" placeholder="Ex: café, restaurant, cuisine française" />
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsAddingBusiness(false)}>
                Annuler
              </Button>
              <Button type="submit" onClick={() => setIsAddingBusiness(false)}>
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default Businesses;
