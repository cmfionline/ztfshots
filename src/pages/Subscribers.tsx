import { SubscribersTable } from "@/components/subscribers/SubscribersTable";

export default function Subscribers() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>
      
      <SubscribersTable />
    </div>
  );
}