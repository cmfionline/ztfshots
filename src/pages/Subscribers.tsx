import { SubscribersTable } from "@/components/subscribers/SubscribersTable";

const Subscribers = () => {
  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Subscribers</h1>
      <SubscribersTable />
    </main>
  );
};

export default Subscribers;