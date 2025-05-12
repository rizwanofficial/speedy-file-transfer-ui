
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadSection from "@/components/UploadSection";
import DashboardSection from "@/components/DashboardSection";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("upload");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-6 text-center">
          Express Lane Management System
        </h1>
        
        <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-4">
            <UploadSection />
          </TabsContent>
          
          <TabsContent value="dashboard" className="mt-4">
            <DashboardSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
