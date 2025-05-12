
import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Job, JobData } from "@/types/file";

interface DashboardSectionProps {
  className?: string;
}

const DashboardSection = ({ className = "" }: DashboardSectionProps) => {
  const [endpoints, setEndpoints] = useState<Job[]>([
    { name: 'CHANNELSTORE', url: '/api/job/CHANNELSTORE/api/json?tree=lastBuild[number,status,timestamp,result,url]', successUrl: '/api/job/CHANNELSTORE/api/json?tree=lastSuccessfulBuild[number,status,timestamp,result,url]' },
    { name: 'FREQUENCY', url: '/api/job/FREQUENCY/api/json?tree=lastBuild[number,status,timestamp,result,url]', successUrl: '/api/job/FREQUENCY/api/json?tree=lastSuccessfulBuild[number,status,timestamp,result,url]' },
    { name: 'Google_DELUXE_EST', url: '/api/job/Google_DELUXE_EST/api/json?tree=lastBuild[number,status,timestamp,result,url]', successUrl: '/api/job/Google_DELUXE_EST/api/json?tree=lastSuccessfulBuild[number,status,timestamp,result,url]' },
    { name: 'HULU_SVOD', url: '/api/job/HULU_SVOD/api/json?tree=lastBuild[number,status,timestamp,result,url]', successUrl: '/api/job/HULU_SVOD/api/json?tree=lastSuccessfulBuild[number,status,timestamp,result,url]' },
    { name: 'NETFLIX', url: '/api/job/NETFLIX/api/json?tree=lastBuild[number,status,timestamp,result,url]', successUrl: '/api/job/NETFLIX/api/json?tree=lastSuccessfulBuild[number,status,timestamp,result,url]' },
    { name: 'PLUTO', url: '/api/job/PLUTO/api/json?tree=lastBuild[number,status,timestamp,result,url]', successUrl: '/api/job/PLUTO/api/json?tree=lastSuccessfulBuild[number,status,timestamp,result,url]' },
    { name: 'ROKU', url: '/api/job/Roku/api/json?tree=lastBuild[number,status,timestamp,result,url]', successUrl: '/api/job/Roku/api/json?tree=lastSuccessfulBuild[number,status,timestamp,result,url]' },
    { name: 'ROKU_AVOD', url: '/api/job/ROKU_AVOD/api/json?tree=lastBuild[number,status,timestamp,result,url]', successUrl: '/api/job/ROKU_AVOD/api/json?tree=lastSuccessfulBuild[number,status,timestamp,result,url]' },
    { name: 'SAMSUNG', url: '/api/job/SAMSUNG/api/json?tree=lastBuild[number,status,timestamp,result,url]', successUrl: '/api/job/SAMSUNG/api/json?tree=lastSuccessfulBuild[number,status,timestamp,result,url]' },
    { name: 'TELUS', url: '/api/job/TELUS_REFACTORED/api/json?tree=lastBuild[number,status,timestamp,result,url]', successUrl: '/api/job/TELUS_REFACTORED/api/json?tree=lastSuccessfulBuild[number,status,timestamp,result,url]' },
    { name: 'TUBI', url: '/api/job/TUBI/api/json?tree=lastBuild[number,status,timestamp,result,url]', successUrl: '/api/job/TUBI/api/json?tree=lastSuccessfulBuild[number,status,timestamp,result,url]' },
    { name: 'VUDU', url: '/api/job/VUDU/api/json?tree=lastBuild[number,status,timestamp,result,url]', successUrl: '/api/job/VUDU/api/json?tree=lastSuccessfulBuild[number,status,timestamp,result,url]' },
    { name: 'XBOX', url: '/api/job/XBOX/api/json?tree=lastBuild[number,status,timestamp,result,url]', successUrl: '/api/job/XBOX/api/json?tree=lastSuccessfulBuild[number,status,timestamp,result,url]' },
    { name: 'XUMO', url: '/api/job/XUMO/api/json?tree=lastBuild[number,status,timestamp,result,url]', successUrl: '/api/job/XUMO/api/json?tree=lastSuccessfulBuild[number,status,timestamp,result,url]' },
  ]);
  
  const [regressions, setRegressions] = useState<Job[]>([
    { name: 'Regression', url: '/api/job/EXL_New_Regression/api/json?tree=lastBuild[number,status,timestamp,result,url]', successUrl: '/api/job/EXL_New_Regression/api/json?tree=lastSuccessfulBuild[number,status,timestamp,result,url]' },
  ]);
  
  const [dbHealth, setDbHealth] = useState<Job[]>([
    { name: 'DB Health', url: '/api/job/DB_Health_check/api/json?tree=lastBuild[number,status,timestamp,result,url]', successUrl: '/api/job/DB_Health_check/api/json?tree=lastSuccessfulBuild[number,status,timestamp,result,url]' },
  ]);
  
  const [jobData, setJobData] = useState<JobData>({});
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchJobData = async (jobList: Job[]) => {
    const newJobData: JobData = {};
    await Promise.all(
      jobList.map(async (job) => {
        try {
          const lastBuildResponse = await axios.get(job.url, {
            headers: {
              Authorization: 'Basic bWs3OTg6MTEwNTdhMzJlYmI3OGVjMzdkNDFmNjVmMzg1MDJiMjQ4OQ==',
            },
          });
          const lastBuildData = lastBuildResponse.data.lastBuild || { result: 'RUNNING' };
          
          let lastSuccessfulData = null;
          if (lastBuildData.result !== 'SUCCESS') {
            const lastSuccessfulResponse = await axios.get(job.successUrl, {
              headers: {
                Authorization: 'Basic bWs3OTg6MTEwNTdhMzJlYmI3OGVjMzdkNDFmNjVmMzg1MDJiMjQ4OQ==',
              },
            });
            lastSuccessfulData = lastSuccessfulResponse.data.lastSuccessfulBuild || null;
          }
          
          newJobData[job.name] = {
            lastBuild: lastBuildData,
            lastSuccessfulBuild: lastSuccessfulData,
          };
        } catch (error) {
          console.error(`Error fetching data for ${job.name}:`, error);
        }
      })
    );
    
    setJobData((prevData) => ({ ...prevData, ...newJobData }));
    setLastRefreshed(new Date());
  };

  useEffect(() => {
    const fetchData = () => {
      fetchJobData([...endpoints, ...regressions, ...dbHealth]);
    };
    fetchData();
    const intervalId = setInterval(fetchData, 21600000); // Auto-refresh every 6 hours
    return () => clearInterval(intervalId);
  }, [endpoints, regressions, dbHealth]);

  const renderJobRows = (jobs: Job[]) =>
    jobs.map((job) => {
      const jobInfo = jobData[job.name];
      return (
        <TableRow key={job.name}>
          <TableCell>{job.name}</TableCell>
          <TableCell>{new Date((jobInfo?.lastBuild?.timestamp) || Date.now()).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</TableCell>
          <TableCell className={
            jobInfo?.lastBuild?.result === 'SUCCESS' 
              ? "text-green-600 font-medium" 
              : jobInfo?.lastBuild?.result === 'RUNNING' 
                ? "text-orange-500 font-medium" 
                : "text-red-600 font-bold"
          }>
            {jobInfo?.lastBuild?.result || 'RUNNING'}
          </TableCell>
          <TableCell>
            {jobInfo?.lastBuild?.url ? (
              <a href={jobInfo.lastBuild.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                View Build
              </a>
            ) : (
              'N/A'
            )}
          </TableCell>
          <TableCell>
            {jobInfo?.lastBuild?.result !== 'SUCCESS' && jobInfo?.lastSuccessfulBuild
              ? new Date(jobInfo.lastSuccessfulBuild.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
              : 'N/A'}
          </TableCell>
        </TableRow>
      );
    });

  return (
    <div className={`${className}`}>
      <h2 className="text-2xl font-bold text-blue-800 mb-4">QA Monitoring Dashboard</h2>
      <div className="text-sm text-gray-500 mb-4">
        Last refreshed: {lastRefreshed.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
      </div>

      {/* Endpoints Accordion */}
      <Card className="mb-6 bg-blue-50">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="endpoints" className="border-none">
            <AccordionTrigger className="px-4 py-3 bg-blue-100 hover:bg-blue-200 rounded-t-lg">
              <h3 className="text-xl font-semibold text-blue-900">Endpoints</h3>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="rounded-b-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-blue-700">
                    <TableRow>
                      <TableHead className="text-white">Job Name</TableHead>
                      <TableHead className="text-white">Last Run Timestamp (IST)</TableHead>
                      <TableHead className="text-white">Last Run Status</TableHead>
                      <TableHead className="text-white">Last Run Build Details</TableHead>
                      <TableHead className="text-white">Last Successful Run Timestamp (IST)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {renderJobRows(endpoints)}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* Regression Accordion */}
      <Card className="mb-6 bg-green-50">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="regression" className="border-none">
            <AccordionTrigger className="px-4 py-3 bg-green-100 hover:bg-green-200 rounded-t-lg">
              <h3 className="text-xl font-semibold text-green-900">Regression</h3>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="rounded-b-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-green-700">
                    <TableRow>
                      <TableHead className="text-white">Job Name</TableHead>
                      <TableHead className="text-white">Last Run Timestamp (IST)</TableHead>
                      <TableHead className="text-white">Last Run Status</TableHead>
                      <TableHead className="text-white">Last Run Build Details</TableHead>
                      <TableHead className="text-white">Last Successful Run Timestamp (IST)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {renderJobRows(regressions)}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* DB Health Accordion */}
      <Card className="mb-6 bg-pink-50">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="health" className="border-none">
            <AccordionTrigger className="px-4 py-3 bg-pink-100 hover:bg-pink-200 rounded-t-lg">
              <h3 className="text-xl font-semibold text-pink-900">Health Status</h3>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="rounded-b-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-pink-600">
                    <TableRow>
                      <TableHead className="text-white">Job Name</TableHead>
                      <TableHead className="text-white">Last Run Timestamp (IST)</TableHead>
                      <TableHead className="text-white">Last Run Status</TableHead>
                      <TableHead className="text-white">Last Run Build Details</TableHead>
                      <TableHead className="text-white">Last Successful Run Timestamp (IST)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {renderJobRows(dbHealth)}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
};

export default DashboardSection;
