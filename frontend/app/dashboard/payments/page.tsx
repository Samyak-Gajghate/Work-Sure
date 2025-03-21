import { CreditCard, Download, DollarSign, ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PaymentsPage() {
  // Mock payment data
  const payments = [
    {
      id: "p1",
      project: "E-commerce Website Redesign",
      client: "Acme Corporation",
      amount: 500,
      status: "Completed",
      date: "2023-10-25",
      type: "Milestone",
      description: "Project Planning & Wireframes",
    },
    {
      id: "p2",
      project: "Content Writing",
      client: "BlogMedia",
      amount: 400,
      status: "Pending",
      date: "2023-11-20",
      type: "Milestone",
      description: "Blog Articles (5)",
    },
    {
      id: "p3",
      project: "Mobile App Development",
      client: "TechStart Inc.",
      amount: 1200,
      status: "Processing",
      date: "2023-11-15",
      type: "Milestone",
      description: "User Authentication",
    },
    {
      id: "p4",
      project: "SEO Optimization",
      client: "GrowthHackers",
      amount: 1200,
      status: "Completed",
      date: "2023-10-30",
      type: "Full Payment",
      description: "Complete SEO Audit and Implementation",
    },
    {
      id: "p5",
      project: "Withdrawal",
      client: "-",
      amount: -1500,
      status: "Completed",
      date: "2023-11-01",
      type: "Withdrawal",
      description: "Bank Transfer",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold md:text-2xl">Payments</h1>
        <Button>
          <DollarSign className="mr-2 h-4 w-4" />
          Withdraw Funds
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,731.89</div>
            <p className="text-xs text-muted-foreground">Available for withdrawal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,600.00</div>
            <p className="text-xs text-muted-foreground">Awaiting release</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,231.89</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawn</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,500.00</div>
            <p className="text-xs text-muted-foreground">All time withdrawals</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Bank Account</p>
                <p className="text-sm text-muted-foreground">**** 1234 • Default</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
          <Button variant="outline" className="w-full">
            <CreditCard className="mr-2 h-4 w-4" />
            Add Payment Method
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <TabsList>
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="incoming">Incoming</TabsTrigger>
            <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Select defaultValue="all-time">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-time">All Time</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View all your payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${payment.amount > 0 ? "bg-green-100" : "bg-red-100"}`}
                      >
                        {payment.amount > 0 ? (
                          <ArrowDownIcon className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowUpIcon className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{payment.description}</p>
                        <p className="text-sm text-muted-foreground">{payment.project}</p>
                        <p className="text-xs text-muted-foreground">{new Date(payment.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end mt-2 sm:mt-0">
                      <p className={`font-bold ${payment.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                        {payment.amount > 0 ? "+" : ""}
                        {payment.amount.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </p>
                      <Badge
                        variant={
                          payment.status === "Completed"
                            ? "outline"
                            : payment.status === "Processing"
                              ? "default"
                              : "secondary"
                        }
                        className="mt-1"
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Load More
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="incoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Incoming Payments</CardTitle>
              <CardDescription>View all your incoming payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments
                  .filter((p) => p.amount > 0)
                  .map((payment) => (
                    <div
                      key={payment.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                          <ArrowDownIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{payment.description}</p>
                          <p className="text-sm text-muted-foreground">{payment.project}</p>
                          <p className="text-xs text-muted-foreground">{new Date(payment.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end mt-2 sm:mt-0">
                        <p className="font-bold text-green-600">
                          +
                          {payment.amount.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </p>
                        <Badge
                          variant={
                            payment.status === "Completed"
                              ? "outline"
                              : payment.status === "Processing"
                                ? "default"
                                : "secondary"
                          }
                          className="mt-1"
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outgoing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Outgoing Payments</CardTitle>
              <CardDescription>View all your withdrawals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments
                  .filter((p) => p.amount < 0)
                  .map((payment) => (
                    <div
                      key={payment.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                          <ArrowUpIcon className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">{payment.description}</p>
                          <p className="text-sm text-muted-foreground">{payment.type}</p>
                          <p className="text-xs text-muted-foreground">{new Date(payment.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end mt-2 sm:mt-0">
                        <p className="font-bold text-red-600">
                          {payment.amount.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

