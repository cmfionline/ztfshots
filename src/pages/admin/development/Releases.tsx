import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const Releases = () => {
  const { data: releases, isLoading } = useQuery({
    queryKey: ["admin-releases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("releases")
        .select("*")
        .order("release_date", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Release Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Release
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Version</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Release Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {releases?.map((release) => (
              <TableRow key={release.id}>
                <TableCell>v{release.version}</TableCell>
                <TableCell>{release.title}</TableCell>
                <TableCell>
                  {format(new Date(release.release_date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <Badge>{release.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Releases;