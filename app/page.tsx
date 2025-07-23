"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import {
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  CheckCircle,
  XCircle,
  Bell,
  DollarSign,
  Shield,
  AlertCircle,
  RotateCcw,
  Timer,
} from "lucide-react"

// Enhanced mock data generators
const generateSLABreaches = () => {
  const breaches = [
    {
      id: 1,
      model: "GPT-4",
      type: "latency",
      threshold: 200,
      actual: 450,
      timestamp: "2024-01-22 14:30:00",
      severity: "high",
      duration: "15m",
      impact: "Customer complaints increased by 23%",
    },
    {
      id: 2,
      model: "Claude-3",
      type: "response_time",
      threshold: 500,
      actual: 850,
      timestamp: "2024-01-22 13:45:00",
      severity: "medium",
      duration: "8m",
      impact: "API timeout rate: 12%",
    },
    {
      id: 3,
      model: "LLaMA-2",
      type: "cost",
      threshold: 0.05,
      actual: 0.12,
      timestamp: "2024-01-22 12:15:00",
      severity: "low",
      duration: "45m",
      impact: "Budget overrun: $2,340",
    },
  ]
  return breaches
}

const generateFailoverEvents = () => {
  return [
    {
      id: 1,
      primaryModel: "GPT-4",
      failoverModel: "Claude-3",
      reason: "excess_load",
      timestamp: "2024-01-22 14:28:00",
      duration: "18m",
      requestsAffected: 1247,
      recoveryTime: "3m 45s",
    },
    {
      id: 2,
      primaryModel: "BERT",
      failoverModel: "RoBERTa",
      reason: "response_delay",
      timestamp: "2024-01-22 11:20:00",
      duration: "25m",
      requestsAffected: 892,
      recoveryTime: "5m 12s",
    },
    {
      id: 3,
      primaryModel: "Claude-3",
      failoverModel: "GPT-4",
      reason: "service_unavailable",
      timestamp: "2024-01-22 09:15:00",
      duration: "12m",
      requestsAffected: 456,
      recoveryTime: "2m 30s",
    },
  ]
}

const generateCostData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`,
    gpt4: Math.random() * 50 + 20,
    claude3: Math.random() * 40 + 15,
    llama2: Math.random() * 30 + 10,
    bert: Math.random() * 20 + 5,
    total: 0,
  })).map((item) => ({
    ...item,
    total: item.gpt4 + item.claude3 + item.llama2 + item.bert,
  }))
}

const generateSLAComplianceData = () => {
  return [
    { model: "GPT-4", latency: 94.2, responseTime: 96.8, availability: 99.1, cost: 87.5 },
    { model: "Claude-3", latency: 97.1, responseTime: 95.3, availability: 98.9, cost: 92.1 },
    { model: "LLaMA-2", latency: 89.7, responseTime: 91.4, availability: 97.8, cost: 95.6 },
    { model: "BERT", latency: 98.5, responseTime: 97.9, availability: 99.5, cost: 98.2 },
  ]
}

const generateLatencyTrendData = () => {
  return Array.from({ length: 48 }, (_, i) => ({
    time: `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`,
    gpt4: 150 + Math.sin(i * 0.2) * 50 + Math.random() * 30,
    claude3: 120 + Math.sin(i * 0.15) * 40 + Math.random() * 25,
    slaThreshold: 200,
    breaches: Math.random() > 0.9 ? 1 : 0,
  }))
}

const models = [
  {
    id: "gpt-4",
    name: "GPT-4",
    status: "active",
    accuracy: 0.94,
    slaCompliance: 94.2,
    failoverCount: 2,
    costPerRequest: 0.045,
  },
  {
    id: "claude-3",
    name: "Claude-3",
    status: "failover",
    accuracy: 0.89,
    slaCompliance: 95.8,
    failoverCount: 1,
    costPerRequest: 0.038,
  },
  {
    id: "llama-2",
    name: "LLaMA-2",
    status: "active",
    accuracy: 0.87,
    slaCompliance: 93.1,
    failoverCount: 0,
    costPerRequest: 0.025,
  },
  {
    id: "bert",
    name: "BERT",
    status: "idle",
    accuracy: 0.91,
    slaCompliance: 98.5,
    failoverCount: 1,
    costPerRequest: 0.015,
  },
]

export default function AIFrameworkDashboard() {
  const [selectedModel, setSelectedModel] = useState("gpt-4")
  const [timeRange, setTimeRange] = useState("24h")
  const [slaBreaches, setSlaBreaches] = useState(generateSLABreaches())
  const [failoverEvents, setFailoverEvents] = useState(generateFailoverEvents())
  const [costData, setCostData] = useState(generateCostData())
  const [slaComplianceData, setSlaComplianceData] = useState(generateSLAComplianceData())
  const [latencyTrendData, setLatencyTrendData] = useState(generateLatencyTrendData())
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "error",
      title: "SLA Breach - High Latency",
      message: "GPT-4 latency exceeded 200ms threshold (450ms recorded)",
      time: "2 min ago",
    },
    {
      id: 2,
      type: "warning",
      title: "Failover Activated",
      message: "GPT-4 → Claude-3 due to excess load (1,247 requests affected)",
      time: "5 min ago",
    },
    {
      id: 3,
      type: "info",
      title: "Cost Alert",
      message: "LLaMA-2 cost per request exceeded budget threshold",
      time: "15 min ago",
    },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCostData(generateCostData())
      setLatencyTrendData(generateLatencyTrendData())
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const chartConfig = {
    gpt4: { label: "GPT-4", color: "hsl(var(--chart-1))" },
    claude3: { label: "Claude-3", color: "hsl(var(--chart-2))" },
    llama2: { label: "LLaMA-2", color: "hsl(var(--chart-3))" },
    bert: { label: "BERT", color: "hsl(var(--chart-4))" },
    slaThreshold: { label: "SLA Threshold", color: "hsl(var(--destructive))" },
    total: { label: "Total Cost", color: "hsl(var(--chart-5))" },
  }

  const currentModel = models.find((m) => m.id === selectedModel)
  const totalBreaches = slaBreaches.length
  const totalFailovers = failoverEvents.length
  const avgSlaCompliance = models.reduce((acc, model) => acc + model.slaCompliance, 0) / models.length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ALFA.jpg-DAxY65CJ9s6aOowlRXGHj19ZjAvtWG.jpeg"
              alt="ALFA Logo"
              className="h-8 w-8"
            />
            <div>
              <h1 className="text-2xl font-bold">ALFA SLA & Performance Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Real-time SLA monitoring, breach tracking & failover management
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          model.status === "active"
                            ? "bg-green-500"
                            : model.status === "failover"
                              ? "bg-orange-500"
                              : model.status === "training"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                        }`}
                      />
                      <span>{model.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1H</SelectItem>
                <SelectItem value="24h">24H</SelectItem>
                <SelectItem value="7d">7D</SelectItem>
                <SelectItem value="30d">30D</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      {alerts.length > 0 && (
        <div className="p-6 space-y-2">
          {alerts.map((alert) => (
            <Alert
              key={alert.id}
              variant={alert.type === "error" ? "destructive" : alert.type === "warning" ? "default" : "default"}
            >
              {alert.type === "error" ? (
                <AlertCircle className="h-4 w-4" />
              ) : alert.type === "warning" ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <Bell className="h-4 w-4" />
              )}
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription className="flex justify-between">
                <span>{alert.message}</span>
                <span className="text-xs text-muted-foreground">{alert.time}</span>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="p-6">
        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SLA Compliance</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgSlaCompliance.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Average across all models</p>
              <Progress value={avgSlaCompliance} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SLA Breaches</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{totalBreaches}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failover Events</CardTitle>
              <RotateCcw className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{totalFailovers}</div>
              <p className="text-xs text-muted-foreground">Active failovers: 1</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cost per Request</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${currentModel?.costPerRequest.toFixed(3)}</div>
              <p className="text-xs text-muted-foreground">{currentModel?.name}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">187ms</div>
              <p className="text-xs text-destructive">Above SLA (200ms)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Cost</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,247</div>
              <p className="text-xs text-muted-foreground">+12% vs yesterday</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Charts Section */}
        <Tabs defaultValue="sla-monitoring" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="sla-monitoring">SLA Monitoring</TabsTrigger>
            <TabsTrigger value="failover-tracking">Failover Tracking</TabsTrigger>
            <TabsTrigger value="cost-analysis">Cost Analysis</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="sla-monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Latency vs SLA Threshold</CardTitle>
                  <CardDescription>Real-time latency monitoring with SLA breach detection</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={latencyTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Line type="monotone" dataKey="gpt4" stroke="var(--color-gpt4)" strokeWidth={2} dot={false} />
                        <Line
                          type="monotone"
                          dataKey="claude3"
                          stroke="var(--color-claude3)"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="slaThreshold"
                          stroke="var(--color-slaThreshold)"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SLA Compliance by Model</CardTitle>
                  <CardDescription>Current compliance rates across different SLA metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={slaComplianceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="model" />
                        <YAxis domain={[80, 100]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="latency" fill="hsl(var(--chart-1))" name="Latency SLA" />
                        <Bar dataKey="responseTime" fill="hsl(var(--chart-2))" name="Response Time SLA" />
                        <Bar dataKey="availability" fill="hsl(var(--chart-3))" name="Availability SLA" />
                        <Bar dataKey="cost" fill="hsl(var(--chart-4))" name="Cost SLA" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* SLA Breach Log */}
            <Card>
              <CardHeader>
                <CardTitle>Recent SLA Breaches</CardTitle>
                <CardDescription>Detailed log of SLA violations and their impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {slaBreaches.map((breach) => (
                    <div key={breach.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            breach.severity === "high"
                              ? "bg-red-500"
                              : breach.severity === "medium"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                          }`}
                        />
                        <div>
                          <div className="font-semibold">
                            {breach.model} - {breach.type.replace("_", " ").toUpperCase()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Threshold: {breach.threshold}
                            {breach.type === "cost" ? "$" : "ms"} | Actual: {breach.actual}
                            {breach.type === "cost" ? "$" : "ms"} | Duration: {breach.duration}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">{breach.impact}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            breach.severity === "high"
                              ? "destructive"
                              : breach.severity === "medium"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {breach.severity}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">{breach.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="failover-tracking" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Failover Events Timeline</CardTitle>
                  <CardDescription>Recent failover activations and recovery times</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {failoverEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <RotateCcw className="h-5 w-5 text-orange-500" />
                          <div>
                            <div className="font-semibold">
                              {event.primaryModel} → {event.failoverModel}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Reason: {event.reason.replace("_", " ")} | Duration: {event.duration}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Requests affected: {event.requestsAffected.toLocaleString()} | Recovery:{" "}
                              {event.recoveryTime}
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">{event.timestamp}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Failover Statistics</CardTitle>
                  <CardDescription>Failover frequency by model and reason</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={models}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="failoverCount" fill="hsl(var(--chart-2))" name="Failover Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cost-analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hourly Cost Breakdown</CardTitle>
                  <CardDescription>Cost per model over the last 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={costData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Area
                          type="monotone"
                          dataKey="gpt4"
                          stackId="1"
                          stroke="var(--color-gpt4)"
                          fill="var(--color-gpt4)"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="claude3"
                          stackId="1"
                          stroke="var(--color-claude3)"
                          fill="var(--color-claude3)"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="llama2"
                          stackId="1"
                          stroke="var(--color-llama2)"
                          fill="var(--color-llama2)"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="bert"
                          stackId="1"
                          stroke="var(--color-bert)"
                          fill="var(--color-bert)"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost per Request by Model</CardTitle>
                  <CardDescription>Current cost efficiency comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={models}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="costPerRequest" fill="hsl(var(--chart-1))" name="Cost per Request ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Response Time Distribution</CardTitle>
                  <CardDescription>Latency patterns and SLA compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={latencyTrendData.slice(0, 30)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Scatter dataKey="gpt4" fill="hsl(var(--chart-1))" name="GPT-4" />
                        <Scatter dataKey="claude3" fill="hsl(var(--chart-2))" name="Claude-3" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Model Availability</CardTitle>
                  <CardDescription>Uptime and availability metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={slaComplianceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="model" />
                        <YAxis domain={[95, 100]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="availability" fill="hsl(var(--chart-3))" name="Availability %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall SLA Compliance Dashboard</CardTitle>
                <CardDescription>Comprehensive view of all SLA metrics and compliance status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {models.map((model) => (
                    <div key={model.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{model.name}</h3>
                        <Badge
                          variant={
                            model.slaCompliance >= 95
                              ? "default"
                              : model.slaCompliance >= 90
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {model.slaCompliance >= 95 && <CheckCircle className="h-3 w-3 mr-1" />}
                          {model.slaCompliance < 90 && <XCircle className="h-3 w-3 mr-1" />}
                          {model.slaCompliance.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Failovers:</span>
                          <span className={model.failoverCount > 0 ? "text-orange-600" : "text-green-600"}>
                            {model.failoverCount}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Cost/Req:</span>
                          <span>${model.costPerRequest.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Status:</span>
                          <span
                            className={`capitalize ${
                              model.status === "active"
                                ? "text-green-600"
                                : model.status === "failover"
                                  ? "text-orange-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {model.status}
                          </span>
                        </div>
                      </div>
                      <Progress value={model.slaCompliance} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
