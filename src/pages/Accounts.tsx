
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/Button";
import { Card, CardContent, CardTitle } from "@/components/Card";
import { Search, Filter, Plus, MoreHorizontal, Check, X, RefreshCw, Shield, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PageTransition from "@/components/PageTransition";

// Sample data
const sampleAccounts = [
  { 
    id: "a1", 
    email: "user1@example.com", 
    platform: "Google", 
    status: "active", 
    lastUsed: "2023-10-15T14:30:00", 
    reviewCount: 28,
    ip: "85.142.xxx.xxx",
    country: "France"
  },
  { 
    id: "a2", 
    email: "user2@example.com", 
    platform: "Trustpilot", 
    status: "active", 
    lastUsed: "2023-10-14T10:15:00", 
    reviewCount: 16,
    ip: "91.213.xxx.xxx",
    country: "Allemagne"
  },
  { 
    id: "a3", 
    email: "user3@example.com", 
    platform: "Google", 
    status: "suspended", 
    lastUsed: "2023-10-10T09:45:00", 
    reviewCount: 12,
    ip: "77.111.xxx.xxx",
    country: "Espagne"
  },
  { 
    id: "a4", 
    email: "user4@example.com", 
    platform: "Yelp", 
    status: "active", 
    lastUsed: "2023-10-13T16:20:00", 
    reviewCount: 8,
    ip: "46.209.xxx.xxx",
    country: "Italie"
  },
  { 
    id: "a5", 
    email: "user5@example.com", 
    platform: "Trustpilot", 
    status: "inactive", 
    lastUsed: "2023-10-01T11:10:00", 
    reviewCount: 5,
    ip: "85.142.xxx.xxx",
    country: "France"
  },
  { 
    id: "a6", 
    email: "user6@example.com", 
    platform: "Google", 
    status: "active", 
    lastUsed: "2023-10-12T14:30:00", 
    reviewCount: 19,
    ip: "91.213.xxx.xxx",
    country: "Allemagne"
  },
];

// Component for displaying account cards
const AccountCard = ({ account, onActivate, onDeactivate, onRotateIP }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <Card variant="glass" className="h-full">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <Badge variant="outline" className={`px-2 py-1 capitalize ${getStatusColor(account.status)}`}>
              {account.status}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {account.status !== "active" ? (
                  <DropdownMenuItem onClick={() => onActivate(account)}>
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Activer
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => onDeactivate(account)}>
                    <X className="h-4 w-4 mr-2 text-red-500" />
                    Désactiver
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onRotateIP(account)}>
                  <RefreshCw className="h-4 w-4 mr-2 text-blue-500" />
                  Changer d'IP
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 mr-3">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium">{account.email}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{account.platform}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Avis publiés</span>
              <span className="font-medium">{account.reviewCount}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Dernière utilisation</span>
              <span className="font-medium">
                {new Date(account.lastUsed).toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'short'
                })}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">IP</span>
              <span className="font-medium">{account.ip}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Pays</span>
              <span className="font-medium">{account.country}</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={() => onRotateIP(account)} className="text-xs px-2 py-1 h-auto">
            <RefreshCw className="h-3 w-3 mr-1" />
            Changer d'IP
          </Button>
          
          {account.status === "active" ? (
            <Button variant="outline" size="sm" onClick={() => onDeactivate(account)} className="text-xs px-2 py-1 h-auto text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
              <X className="h-3 w-3 mr-1" />
              Désactiver
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => onActivate(account)} className="text-xs px-2 py-1 h-auto text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/10">
              <Check className="h-3 w-3 mr-1" />
              Activer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Accounts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  
  // Filter accounts based on search query and active tab
  const filteredAccounts = sampleAccounts.filter((account) => {
    const matchesSearch = 
      account.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
      account.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "active" && account.status === "active") ||
      (activeTab === "inactive" && account.status === "inactive") ||
      (activeTab === "suspended" && account.status === "suspended");
    
    return matchesSearch && matchesTab;
  });

  const handleActivateAccount = (account) => {
    console.log("Activating account:", account.id);
    alert(`Le compte ${account.email} serait activé dans une application réelle.`);
  };

  const handleDeactivateAccount = (account) => {
    console.log("Deactivating account:", account.id);
    alert(`Le compte ${account.email} serait désactivé dans une application réelle.`);
  };

  const handleRotateIP = (account) => {
    console.log("Rotating IP for account:", account.id);
    alert(`L'IP du compte ${account.email} serait changée dans une application réelle.`);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        
        <main className="page-container pt-28">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Comptes</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Gérez vos comptes de publication d'avis
              </p>
            </div>
            
            <Button onClick={() => setIsAddingAccount(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un compte
            </Button>
          </div>
          
          <Card delay={0.2} className="mb-8">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Rechercher un compte..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">Comptes actifs</p>
                    <h3 className="text-2xl font-bold">
                      {sampleAccounts.filter(a => a.status === "active").length}
                    </h3>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Gérer
                </Button>
              </CardContent>
            </Card>
            
            <Card className="flex-grow" delay={0.4}>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-4">
                    <RefreshCw className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Rotations d'IP ce mois</p>
                    <h3 className="text-2xl font-bold">126</h3>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Détails
                </Button>
              </CardContent>
            </Card>
            
            <Card className="flex-grow" delay={0.5}>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 mr-4">
                    <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Comptes à risque</p>
                    <h3 className="text-2xl font-bold">2</h3>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Protéger
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="active">Actifs</TabsTrigger>
              <TabsTrigger value="inactive">Inactifs</TabsTrigger>
              <TabsTrigger value="suspended">Suspendus</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account, index) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onActivate={handleActivateAccount}
                  onDeactivate={handleDeactivateAccount}
                  onRotateIP={handleRotateIP}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  Aucun compte trouvé pour cette recherche.
                </p>
              </div>
            )}
          </div>
        </main>
        
        {/* Add Account Dialog */}
        <Dialog open={isAddingAccount} onOpenChange={setIsAddingAccount}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau compte</DialogTitle>
              <DialogDescription>
                Entrez les informations pour créer un nouveau compte.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input id="email" type="email" placeholder="exemple@domaine.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="platform">Plateforme</Label>
                <Select>
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
                <Label htmlFor="proxy">Proxy (optionnel)</Label>
                <Input id="proxy" placeholder="ip:port ou laisser vide pour automatique" />
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsAddingAccount(false)}>
                Annuler
              </Button>
              <Button type="submit" onClick={() => setIsAddingAccount(false)}>
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default Accounts;
