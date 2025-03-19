
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/Button";
import { Card, CardContent, CardTitle } from "@/components/Card";
import { Search, Filter, ArrowDownUp, Star, Plus, Trash2, Edit, MoreHorizontal, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageTransition from "@/components/PageTransition";

// Sample data
const sampleReviews = [
  { 
    id: "r1", 
    business: "Café Parisien", 
    content: "J'ai découvert ce café la semaine dernière et je suis déjà conquis ! L'ambiance est chaleureuse, le personnel attentionné et les pâtisseries sont simplement divines. Le café est torréfié sur place, ce qui lui donne un arôme incomparable. Je recommande particulièrement leur pain au chocolat qui est le meilleur que j'ai jamais goûté.", 
    rating: 5, 
    platform: "Google", 
    status: "published", 
    date: "2023-10-15",
    author: "Marie L."
  },
  { 
    id: "r2", 
    business: "Tech Solutions", 
    content: "Service client exceptionnel. Mon problème a été résolu en moins de 30 minutes par un technicien très compétent et sympathique. Le tarif était raisonnable et transparent. Je n'hésiterai pas à faire appel à eux pour mes futurs besoins informatiques.", 
    rating: 4, 
    platform: "Trustpilot", 
    status: "published", 
    date: "2023-10-14",
    author: "Thomas M."
  },
  { 
    id: "r3", 
    business: "Fleuriste Élégance", 
    content: "J'ai commandé un bouquet pour l'anniversaire de ma mère et le résultat était magnifique ! Les fleurs étaient fraîches et l'arrangement très élégant. La livraison a été effectuée à l'heure prévue. Un grand merci pour avoir contribué à rendre cette journée spéciale.", 
    rating: 5, 
    platform: "Google", 
    status: "published", 
    date: "2023-10-13",
    author: "Sophie D."
  },
  { 
    id: "r4", 
    business: "Auto Express", 
    content: "J'ai fait réviser ma voiture chez Auto Express. Le service était bon mais les tarifs sont un peu élevés comparés à d'autres garages de la région. Le travail a été bien fait cependant, et ils m'ont proposé un véhicule de prêt pendant la durée des réparations.", 
    rating: 3, 
    platform: "Trustpilot", 
    status: "pending", 
    date: "2023-10-12",
    author: "Pierre B."
  },
  { 
    id: "r5", 
    business: "Spa Sérénité", 
    content: "Une expérience relaxante du début à la fin. Le massage aux pierres chaudes était parfait après une semaine stressante. L'ambiance zen et le professionnalisme des praticiens font de cet endroit une véritable bulle de détente. Je reviendrai très bientôt !", 
    rating: 5, 
    platform: "Google", 
    status: "published", 
    date: "2023-10-11",
    author: "Julie F."
  },
];

// Component for displaying reviews
const ReviewCard = ({ review, onEdit, onDelete }) => {
  return (
    <div className="p-6 border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <Badge variant="outline" className="px-2.5 py-1">
          {review.platform}
        </Badge>
        
        <div className="flex items-center gap-1">
          {review.status === "published" ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : review.status === "pending" ? (
            <Clock className="h-4 w-4 text-yellow-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          
          <span className="text-xs font-medium mr-2 capitalize">
            {review.status === "published" ? "Publié" : review.status === "pending" ? "En attente" : "Échec"}
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(review)}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(review)} className="text-red-500 focus:text-red-500">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{review.business}</h3>
      
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < review.rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
        {review.content}
      </p>
      
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>Par {review.author}</span>
        <span>
          {new Date(review.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>
    </div>
  );
};

const Reviews = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  
  // Filter reviews based on search query and active tab
  const filteredReviews = sampleReviews.filter((review) => {
    const matchesSearch = 
      review.business.toLowerCase().includes(searchQuery.toLowerCase()) || 
      review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "published" && review.status === "published") ||
      (activeTab === "pending" && review.status === "pending") ||
      (activeTab === "failed" && review.status === "failed");
    
    return matchesSearch && matchesTab;
  });

  const handleEditReview = (review) => {
    setEditingReview(review);
    setIsAddingReview(true);
  };

  const handleDeleteReview = (review) => {
    // In a real application, you would delete the review from your backend
    console.log("Deleting review:", review.id);
    
    // For demo purposes, we'll just log it
    alert(`Le commentaire pour ${review.business} serait supprimé dans une application réelle.`);
  };

  const handleViewDetails = (review) => {
    setSelectedReview(review);
    setIsViewingDetails(true);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        
        <main className="page-container pt-28">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Avis</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Gérez et surveillez tous vos avis
              </p>
            </div>
            
            <Button onClick={() => {
              setEditingReview(null);
              setIsAddingReview(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Créer un avis
            </Button>
          </div>
          
          <Card delay={0.2} className="mb-8">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Rechercher un avis..." 
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
              <TabsTrigger value="all">Tous les avis</TabsTrigger>
              <TabsTrigger value="published">Publiés</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="failed">Échecs</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ReviewCard
                    review={review}
                    onEdit={handleEditReview}
                    onDelete={handleDeleteReview}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  Aucun avis trouvé pour cette recherche.
                </p>
              </div>
            )}
          </div>
        </main>
        
        {/* Add/Edit Review Dialog */}
        <Dialog open={isAddingReview} onOpenChange={setIsAddingReview}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingReview ? "Modifier un avis" : "Créer un nouvel avis"}</DialogTitle>
              <DialogDescription>
                {editingReview 
                  ? "Modifiez les détails de l'avis existant." 
                  : "Remplissez les informations pour créer un nouvel avis."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="business">Entreprise</Label>
                <Select defaultValue={editingReview?.business || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une entreprise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Café Parisien">Café Parisien</SelectItem>
                    <SelectItem value="Tech Solutions">Tech Solutions</SelectItem>
                    <SelectItem value="Fleuriste Élégance">Fleuriste Élégance</SelectItem>
                    <SelectItem value="Auto Express">Auto Express</SelectItem>
                    <SelectItem value="Spa Sérénité">Spa Sérénité</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="platform">Plateforme</Label>
                <Select defaultValue={editingReview?.platform || "Google"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une plateforme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Google">Google</SelectItem>
                    <SelectItem value="Trustpilot">Trustpilot</SelectItem>
                    <SelectItem value="Yelp">Yelp</SelectItem>
                    <SelectItem value="TripAdvisor">TripAdvisor</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rating">Note</Label>
                <Select defaultValue={editingReview?.rating.toString() || "5"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une note" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 étoiles</SelectItem>
                    <SelectItem value="4">4 étoiles</SelectItem>
                    <SelectItem value="3">3 étoiles</SelectItem>
                    <SelectItem value="2">2 étoiles</SelectItem>
                    <SelectItem value="1">1 étoile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Nom de l'auteur</Label>
                <Input id="author" defaultValue={editingReview?.author || ""} placeholder="Ex: Marie L." />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Contenu de l'avis</Label>
                <textarea
                  id="content"
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Écrivez votre avis ici..."
                  defaultValue={editingReview?.content || ""}
                ></textarea>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select defaultValue={editingReview?.status || "pending"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="failed">Échec</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsAddingReview(false)}>
                Annuler
              </Button>
              <Button type="submit" onClick={() => setIsAddingReview(false)}>
                {editingReview ? "Mettre à jour" : "Créer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default Reviews;
