
import { useState } from "react";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import { Card, CardContent, CardTitle } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, AlertCircle, Star, Plus, RefreshCw, PenTool, MoreHorizontal, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Sample data for reviews
const sampleReviews = [
  {
    id: "rev1",
    businessName: "Restaurant Le Gourmet",
    platform: "Google",
    rating: 5,
    content: "Un service impeccable et une cuisine raffinée. Je recommande vivement le plat signature du chef, une vraie explosion de saveurs !",
    status: "published",
    date: "2023-10-15T14:30:00",
    author: "Marie Dubois",
    accountId: "a1"
  },
  {
    id: "rev2",
    businessName: "Tech Solutions",
    platform: "Trustpilot",
    rating: 4,
    content: "Très satisfait du service client qui a résolu mon problème rapidement. Seul bémol, le temps d'attente initial était un peu long.",
    status: "pending",
    date: "2023-10-16T10:15:00",
    author: "Jean Martin",
    accountId: "a2"
  },
  {
    id: "rev3",
    businessName: "Boutique Mode",
    platform: "Google",
    rating: 5,
    content: "Excellent choix de vêtements et personnel très attentionné. Les prix sont raisonnables pour la qualité proposée.",
    status: "published",
    date: "2023-10-14T16:45:00",
    author: "Sophie Leroy",
    accountId: "a1"
  },
  {
    id: "rev4",
    businessName: "Auto Repair Shop",
    platform: "Trustpilot",
    rating: 3,
    content: "Service correct mais délais un peu longs. La qualité du travail est néanmoins au rendez-vous.",
    status: "rejected",
    date: "2023-10-13T09:30:00",
    author: "Pierre Moreau",
    accountId: "a3"
  },
  {
    id: "rev5",
    businessName: "Restaurant Le Gourmet",
    platform: "Google",
    rating: 4,
    content: "Bonne expérience globale. La nourriture était délicieuse mais l'ambiance un peu bruyante.",
    status: "published",
    date: "2023-10-12T20:15:00",
    author: "Claire Blanc",
    accountId: "a4"
  },
  {
    id: "rev6",
    businessName: "Tech Solutions",
    platform: "Google",
    rating: 5,
    content: "Excellente entreprise, service client au top et produits de qualité. Je suis client depuis 3 ans et je n'ai jamais été déçu.",
    status: "pending",
    date: "2023-10-17T11:00:00",
    author: "Thomas Petit",
    accountId: "a5"
  }
];

// Review Item Component
const ReviewItem = ({ review, onPublish, onReject }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "published": return "Publié";
      case "pending": return "En attente";
      case "rejected": return "Rejeté";
      default: return status;
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <Badge variant="outline" className={`px-2 py-1 capitalize ${getStatusColor(review.status)}`}>
              {getStatusText(review.status)}
            </Badge>
            
            <div className="flex items-center">
              <Badge variant="outline" className="mr-2">{review.platform}</Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <PenTool className="h-4 w-4 mr-2 text-blue-500" />
                    Modifier
                  </DropdownMenuItem>
                  {review.status === "pending" && (
                    <>
                      <DropdownMenuItem onClick={() => onPublish(review)}>
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        Publier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onReject(review)}>
                        <X className="h-4 w-4 mr-2 text-red-500" />
                        Rejeter
                      </DropdownMenuItem>
                    </>
                  )}
                  {review.status === "rejected" && (
                    <DropdownMenuItem onClick={() => onPublish(review)}>
                      <RefreshCw className="h-4 w-4 mr-2 text-blue-500" />
                      Réessayer
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="mb-3">
            <h3 className="text-base font-semibold">{review.businessName}</h3>
            <div className="flex items-center">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">{review.author}</span>
            </div>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
            {review.content}
          </p>
          
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Compte: {review.accountId}</span>
            <span>
              {new Date(review.date).toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'short', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
        
        {review.status === "pending" && (
          <div className="border-t border-gray-100 dark:border-gray-800 p-3 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={() => onReject(review)} className="text-xs h-8">
              <X className="h-3 w-3 mr-1" />
              Rejeter
            </Button>
            <Button variant="default" size="sm" onClick={() => onPublish(review)} className="text-xs h-8">
              <Check className="h-3 w-3 mr-1" />
              Publier
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Reviews = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isGeneratingReview, setIsGeneratingReview] = useState(false);
  const [reviewsData, setReviewsData] = useState(sampleReviews);
  
  // Filter reviews based on search query and active tab
  const filteredReviews = reviewsData.filter((review) => {
    const matchesSearch = 
      review.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "published" && review.status === "published") ||
      (activeTab === "pending" && review.status === "pending") ||
      (activeTab === "rejected" && review.status === "rejected");
    
    return matchesSearch && matchesTab;
  });

  const handlePublishReview = (review) => {
    setReviewsData(prevReviews => 
      prevReviews.map(r => 
        r.id === review.id ? {...r, status: "published"} : r
      )
    );
    toast({
      title: "Avis publié",
      description: `L'avis pour ${review.businessName} a été publié avec succès.`,
    });
  };

  const handleRejectReview = (review) => {
    setReviewsData(prevReviews => 
      prevReviews.map(r => 
        r.id === review.id ? {...r, status: "rejected"} : r
      )
    );
    toast({
      title: "Avis rejeté",
      description: `L'avis pour ${review.businessName} a été rejeté.`,
      variant: "destructive"
    });
  };

  const handleGenerateReview = () => {
    setIsGeneratingReview(false);
    const newReview = {
      id: `rev${reviewsData.length + 1}`,
      businessName: "Restaurant Le Gourmet", // Cette valeur serait sélectionnée dans le formulaire
      platform: "Google", // Cette valeur serait sélectionnée dans le formulaire
      rating: 5,
      content: "J'ai eu l'occasion de dîner dans ce restaurant et j'ai été impressionné par la qualité du service et la finesse des plats. Une véritable découverte gastronomique que je recommande vivement !",
      status: "pending",
      date: new Date().toISOString(),
      author: "Nouveau Utilisateur",
      accountId: "a1"
    };
    
    setReviewsData(prevReviews => [...prevReviews, newReview]);
    toast({
      title: "Avis généré",
      description: "Un nouvel avis a été généré avec succès et est en attente de publication.",
    });
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
                Générez et gérez vos avis sur Google et Trustpilot
              </p>
            </div>
            
            <Button onClick={() => setIsGeneratingReview(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Générer un avis
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
                  <Select defaultValue="recent">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Plus récents</SelectItem>
                      <SelectItem value="oldest">Plus anciens</SelectItem>
                      <SelectItem value="rating-high">Note ↑</SelectItem>
                      <SelectItem value="rating-low">Note ↓</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <Card className="flex-grow" delay={0.3}>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 mr-4">
                    <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Avis publiés</p>
                    <h3 className="text-2xl font-bold">
                      {reviewsData.filter(r => r.status === "published").length}
                    </h3>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Voir
                </Button>
              </CardContent>
            </Card>
            
            <Card className="flex-grow" delay={0.4}>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mr-4">
                    <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">En attente</p>
                    <h3 className="text-2xl font-bold">
                      {reviewsData.filter(r => r.status === "pending").length}
                    </h3>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Gérer
                </Button>
              </CardContent>
            </Card>
            
            <Card className="flex-grow" delay={0.5}>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-4">
                    <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Note moyenne</p>
                    <h3 className="text-2xl font-bold">4.6</h3>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Analyse
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="published">Publiés</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="rejected">Rejetés</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review, index) => (
                <ReviewItem
                  key={review.id}
                  review={review}
                  onPublish={handlePublishReview}
                  onReject={handleRejectReview}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  Aucun avis trouvé correspondant à votre recherche.
                </p>
              </div>
            )}
          </div>
        </main>
        
        {/* Generate Review Dialog */}
        <Dialog open={isGeneratingReview} onOpenChange={setIsGeneratingReview}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Générer un nouvel avis</DialogTitle>
              <DialogDescription>
                Sélectionnez une entreprise et une plateforme pour générer un avis.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="business">Entreprise</Label>
                <Select defaultValue="restaurant">
                  <SelectTrigger id="business">
                    <SelectValue placeholder="Sélectionner une entreprise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Restaurant Le Gourmet</SelectItem>
                    <SelectItem value="tech">Tech Solutions</SelectItem>
                    <SelectItem value="boutique">Boutique Mode</SelectItem>
                    <SelectItem value="auto">Auto Repair Shop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="platform">Plateforme</Label>
                <Select defaultValue="google">
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Sélectionner une plateforme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="trustpilot">Trustpilot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rating">Note</Label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map(value => (
                    <button key={value} className="p-1">
                      <Star className="h-6 w-6 text-yellow-400 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tone">Ton de l'avis</Label>
                <Select defaultValue="positive">
                  <SelectTrigger id="tone">
                    <SelectValue placeholder="Sélectionner un ton" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positive">Positif</SelectItem>
                    <SelectItem value="neutral">Neutre</SelectItem>
                    <SelectItem value="mixed">Mitigé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specificPoints">Points spécifiques à mentionner (optionnel)</Label>
                <Textarea 
                  id="specificPoints" 
                  placeholder="Entrez des points spécifiques que vous souhaitez voir dans l'avis..." 
                  className="resize-none" 
                />
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsGeneratingReview(false)}>
                Annuler
              </Button>
              <Button type="submit" onClick={handleGenerateReview}>
                Générer l'avis
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default Reviews;
