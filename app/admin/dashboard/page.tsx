import { MapPin, Video, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";

async function getStats() {
  const [totalLocations, approvedLocations, pendingLocations, totalMedia] =
    await Promise.all([
      prisma.location.count(),
      prisma.location.count({ where: { isApproved: true } }),
      prisma.location.count({ where: { isApproved: false } }),
      prisma.media.count(),
    ]);

  return {
    totalLocations,
    approvedLocations,
    pendingLocations,
    totalMedia,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      title: "Total Locations",
      value: stats.totalLocations,
      icon: <MapPin size={20} className="text-teal-600" />,
      description: "All locations in the database",
    },
    {
      title: "Approved Locations",
      value: stats.approvedLocations,
      icon: <CheckCircle size={20} className="text-green-600" />,
      description: "Visible on the map",
    },
    {
      title: "Pending Locations",
      value: stats.pendingLocations,
      icon: <XCircle size={20} className="text-amber-600" />,
      description: "Waiting for approval",
    },
    {
      title: "Total Media",
      value: stats.totalMedia,
      icon: <Video size={20} className="text-blue-600" />,
      description: "Videos and audio files",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Welcome back to YouSafe Admin
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((card) => (
          <Card
            key={card.title}
            className="border border-slate-200 shadow-none"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {card.title}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                {card.value}
              </p>
              <p className="text-xs text-slate-500 mt-1">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
