import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SubscriberTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Role</TableHead>
        <TableHead>Nation</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Registered On</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}