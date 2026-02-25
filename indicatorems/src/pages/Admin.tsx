import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, Database, Cpu, Palette, Bell, Shield, Trash2, Edit, Plus } from "lucide-react";
import { agents, mockUsers, suppliers, customers } from "@/data/mockData";

export default function Admin() {
  const [agentStates, setAgentStates] = useState(agents.map((a) => ({ ...a })));

  const toggleAgent = (id: string) => {
    setAgentStates((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-indigo"><Settings className="h-6 w-6 text-primary" />Admin Panel</h1>
        <p className="text-sm font-semibold text-muted-foreground">Manage platform settings, agents, and master data.</p>
      </div>

      <Tabs defaultValue="agents">
        <TabsList className="grid w-full max-w-2xl grid-cols-5">
          <TabsTrigger value="agents" className="gap-1 text-xs"><Cpu className="h-3.5 w-3.5" />Agents</TabsTrigger>
          <TabsTrigger value="master" className="gap-1 text-xs"><Database className="h-3.5 w-3.5" />Master Data</TabsTrigger>
          <TabsTrigger value="schema" className="gap-1 text-xs"><Shield className="h-3.5 w-3.5" />Schema</TabsTrigger>
          <TabsTrigger value="users" className="gap-1 text-xs"><Users className="h-3.5 w-3.5" />Users</TabsTrigger>
          <TabsTrigger value="settings" className="gap-1 text-xs"><Palette className="h-3.5 w-3.5" />Settings</TabsTrigger>
        </TabsList>

        {/* AGENTS */}
        <TabsContent value="agents" className="space-y-4">
          {agentStates.map((agent) => (
            <Card key={agent.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${agent.enabled ? "bg-primary/10" : "bg-muted"}`}>
                    <Cpu className={`h-5 w-5 ${agent.enabled ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-muted-foreground">Priority: {agent.priority}</p>
                    <p className="text-xs text-muted-foreground">Assignee: {agent.assignee}</p>
                  </div>
                  <Switch checked={agent.enabled} onCheckedChange={() => toggleAgent(agent.id)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* MASTER DATA */}
        <TabsContent value="master" className="space-y-4">
          <div className="flex gap-2 flex-wrap mb-4">
            {["Customers", "Suppliers", "Commodities", "Manufacturers", "Departments"].map((tab) => (
              <Badge key={tab} variant="outline" className="cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-colors">{tab}</Badge>
            ))}
          </div>
          <Card className="shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base text-indigo">Customers</CardTitle>
              <Button size="sm" className="gap-1"><Plus className="h-3.5 w-3.5" />Add</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Region</TableHead><TableHead>Revenue</TableHead><TableHead>Orders</TableHead><TableHead></TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((c) => (
                    <TableRow key={c.id} className="hover:bg-primary/5">
                      <TableCell className="font-mono text-xs">{c.id}</TableCell>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell><Badge variant="outline">{c.region}</Badge></TableCell>
                      <TableCell>${(c.revenue / 1e6).toFixed(1)}M</TableCell>
                      <TableCell>{c.orders}</TableCell>
                      <TableCell className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SCHEMA */}
        <TabsContent value="schema" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-base text-indigo">Schema Mappings</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Field</TableHead><TableHead>Type</TableHead><TableHead>Source</TableHead><TableHead>Mapped To</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { field: "MPN", type: "string", source: "Excel/SAP", mapped: "components.mpn" },
                    { field: "Supplier Name", type: "string", source: "SAP MARA", mapped: "suppliers.name" },
                    { field: "Unit Cost", type: "number", source: "Excel", mapped: "components.unitCost" },
                    { field: "Lead Time", type: "number", source: "SAP EKPO", mapped: "components.leadTime" },
                    { field: "MOQ", type: "number", source: "Manual", mapped: "components.moq" },
                  ].map((s) => (
                    <TableRow key={s.field} className="hover:bg-primary/5">
                      <TableCell className="font-medium">{s.field}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{s.type}</Badge></TableCell>
                      <TableCell>{s.source}</TableCell>
                      <TableCell className="font-mono text-xs">{s.mapped}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* USERS */}
        <TabsContent value="users" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base text-indigo">Users & Roles</CardTitle>
              <Button size="sm" className="gap-1"><Plus className="h-3.5 w-3.5" />Invite User</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead></TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((u) => (
                    <TableRow key={u.id} className="hover:bg-primary/5">
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Select defaultValue={u.role}>
                          <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CEO">CEO</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                            <SelectItem value="Employee">Employee</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-3 w-3" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SETTINGS */}
        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2 text-indigo"><Palette className="h-4 w-4 text-primary" />Brand Colors</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-primary" />
                  <div><Label className="text-xs">Indic Green</Label><p className="text-xs text-muted-foreground">#019E4E</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-amber" />
                  <div><Label className="text-xs">Amber Gold</Label><p className="text-xs text-muted-foreground">#FFBF00</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-indigo" />
                  <div><Label className="text-xs">Deep Indigo</Label><p className="text-xs text-muted-foreground">#3F51B5</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-rose" />
                  <div><Label className="text-xs">Dusty Rose</Label><p className="text-xs text-muted-foreground">#BC6E78</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-gray" />
                  <div><Label className="text-xs">Cool Gray</Label><p className="text-xs text-muted-foreground">#6C757D</p></div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2 text-indigo"><Bell className="h-4 w-4 text-amber" />Notifications</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Email on sync failure</Label><Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Weekly summary digest</Label><Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Lead time threshold alerts</Label><Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
