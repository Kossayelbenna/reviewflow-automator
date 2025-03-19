
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/Button";
import { Card, CardContent, CardTitle } from "@/components/Card";
import { 
  BarChart, 
  PieChart, 
  LineChart, 
  Pie,
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Line,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Star, 
  Store, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  MoreHorizontal,
  Info
} from "lucide-react";
import PageTransition from "@/components/PageTransition";

// Sample data
const recentReviews = [
  { id: "1", business: "Café Parisien", content: "Service impeccable et nourriture délicieuse. Je recommande vivement!", rating: 5, status: "success", date: "2023-10-15" },
  { id: "2", business: "Tech Solutions", content: "Excellente assistance technique, problème résolu rapidement.", rating: 4, status: "success", date: "2023-10-14" },
  { id: "3", business: "Fleuriste Élégance", content: "Magnifique composition florale, livraison à l'heure.", rating: 5, status: "success", date: "2023-10-13" },
  { id: "4", business: "Auto Express", content: "Service correct mais tarifs un peu élevés.", rating: 3, status: "warning", date: "2023-10-12" },
];

const reviewsData = [
  { month: 'Jan', Google: 40, Trustpilot: 24 },
  { month: 'Fév', Google: 30, Trustpilot: 13 },
  { month: 'Mar', Google: 20, Trustpilot: 8 },
  { month: 'Avr', Google: 27, Trustpilot: 12 },
  { month: 'Mai', Google: 18, Trustpilot: 7 },
  { month: 'Juin', Google: 23, Trustpilot: 11 },
  { month: 'Juil', Google: 34, Trustpilot: 19 },
  { month: 'Août', Google: 45, Trustpilot: 25 },
  { month: 'Sep', Google: 65, Trustpilot: 30 },
  { month: 'Oct', Google: 80, Trustpilot: 45 },
  { month: 'Nov', Google: 90, Trustpilot: 60 },
  { month: 'Déc', Google: 110, Trustpilot: 80 },
];

const ratingDistribution = [
  { name: '5 étoiles', value: 65 },
  { name: '4 étoiles', value: 20 },
  { name: '3 étoiles', value: 10 },
  { name: '2 étoiles', value: 3 },
  { name: '1 étoile', value: 2 },
];

const statusData = [
  { name: 'Publiés', value: 85 },
  { name: 'En attente', value: 10 },
  { name: 'Échecs', value: 5 },
];

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];
const STATUS_COLORS = ['#10B981', '#F59E0B', '#EF4444'];

const Dashboard = () => {
  const [dateRange, setDateRange] = useState("month");

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        
        <main className="page-container pt-28">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Aperçu de vos performances et activités récentes
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {["semaine", "month", "year"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-4 py-2 text-sm font-medium ${
                      dateRange === range
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {range === "semaine" ? "Semaine" : range === "month" ? "Mois" : "Année"}
                  </button>
                ))}
              </div>
              
              <Button variant="outline">
                <Info className="h-4 w-4 mr-2" />
                Rapport
              </Button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { 
                title: "Total des avis", 
                value: "1,284", 
                change: "+12.5%", 
                status: "increase",
                icon: <Star className="h-5 w-5 text-blue-500" /> 
              },
              { 
                title: "Entreprises actives", 
                value: "24", 
                change: "+2", 
                status: "increase",
                icon: <Store className="h-5 w-5 text-indigo-500" /> 
              },
              { 
                title: "Comptes utilisés", 
                value: "68", 
                change: "-3", 
                status: "decrease",
                icon: <Users className="h-5 w-5 text-purple-500" /> 
              },
              { 
                title: "Taux de réussite", 
                value: "96.4%", 
                change: "+0.8%", 
                status: "increase",
                icon: <TrendingUp className="h-5 w-5 text-green-500" /> 
              },
            ].map((stat, index) => (
              <Card key={index} delay={index * 0.1}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                    </div>
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                      {stat.icon}
                    </div>
                  </div>
                  
                  <div className={`mt-4 inline-flex items-center text-sm font-medium ${
                    stat.status === "increase" ? "text-green-500" : "text-red-500"
                  }`}>
                    {stat.status === "increase" ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                    )}
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card delay={0.4}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <CardTitle>Évolution des avis</CardTitle>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
                
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reviewsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="Google" 
                      stroke="#3B82F6" 
                      strokeWidth={3} 
                      dot={{ r: 0 }} 
                      activeDot={{ r: 5 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Trustpilot" 
                      stroke="#10B981" 
                      strokeWidth={3} 
                      dot={{ r: 0 }} 
                      activeDot={{ r: 5 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Card delay={0.5}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <CardTitle>Distribution des notes</CardTitle>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={ratingDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {ratingDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Pourcentage']}
                        contentStyle={{ 
                          borderRadius: '8px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                        }} 
                      />
                      <Legend formatter={(value, entry, index) => {
                        return <span style={{ color: COLORS[index % COLORS.length] }}>{value}: {ratingDistribution[index].value}%</span>;
                      }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card delay={0.6}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <CardTitle>Statut des avis</CardTitle>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={statusData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" axisLine={false} tickLine={false} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Pourcentage']}
                        contentStyle={{ 
                          borderRadius: '8px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Recent Reviews */}
          <Card delay={0.7}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <CardTitle>Avis récents</CardTitle>
                <Button variant="outline" size="sm">Voir tous les avis</Button>
              </div>
              
              <div className="space-y-4">
                {recentReviews.map((review, index) => (
                  <div key={index} className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-2">
                          <p className="font-semibold">{review.business}</p>
                          <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                          <div className="flex">
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
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                          {review.content}
                        </p>
                        <p className="text-xs text-gray-500">
                          Publié le {new Date(review.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {review.status === "success" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
