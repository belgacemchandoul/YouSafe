"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mediaSchema, MediaFormData } from "@/app/types/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Loader2, Video, Music } from "lucide-react";

interface Media {
  id: string;
  title: string;
  description?: string;
  type: "VIDEO" | "AUDIO";
  url: string;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MediaFormData>({
    resolver: zodResolver(mediaSchema),
  });

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/media");
      const data = await res.json();
      setMedia(data);
    } catch (error) {
      console.error("[FETCH MEDIA]", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const openCreateDialog = () => {
    setEditingMedia(null);
    setServerError("");
    reset();
    setDialogOpen(true);
  };

  const openEditDialog = (item: Media) => {
    setEditingMedia(item);
    setServerError("");
    reset({
      title: item.title,
      description: item.description,
      type: item.type,
      url: item.url,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: MediaFormData) => {
    setServerError("");
    try {
      const url = editingMedia ? `/api/media/${editingMedia.id}` : "/api/media";
      const method = editingMedia ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        setServerError(err.error || "Something went wrong");
        return;
      }

      setDialogOpen(false);
      fetchMedia();
    } catch (error) {
      console.error("[SUBMIT MEDIA]", error);
      setServerError("Something went wrong. Try again.");
    }
  };

  const deleteMedia = async (id: string) => {
    try {
      await fetch(`/api/media/${id}`, { method: "DELETE" });
      fetchMedia();
    } catch (error) {
      console.error("[DELETE MEDIA]", error);
    }
  };

  const renderTypeBadge = (type: "VIDEO" | "AUDIO") => {
    if (type === "VIDEO") {
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 flex items-center gap-1 w-fit">
          <Video size={12} />
          Video
        </Badge>
      );
    }
    return (
      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 flex items-center gap-1 w-fit">
        <Music size={12} />
        Audio
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Media
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage videos and audio content
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openCreateDialog}
              className="gap-2 w-full sm:w-auto"
            >
              <Plus size={16} />
              Add Media
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingMedia ? "Edit Media" : "Add New Media"}
              </DialogTitle>
            </DialogHeader>

            {serverError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{serverError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <Label>Title</Label>
                <Input
                  {...register("title")}
                  placeholder="Wheelchair Accessibility in Dublin"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <Label>
                  Description <span className="text-slate-400">(optional)</span>
                </Label>
                <textarea
                  {...register("description")}
                  placeholder="Brief description..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-input text-sm outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Type */}
              <div className="space-y-1">
                <Label>Type</Label>
                <Select
                  onValueChange={(val) =>
                    setValue("type", val as MediaFormData["type"])
                  }
                  defaultValue={editingMedia?.type}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIDEO">Video</SelectItem>
                    <SelectItem value="AUDIO">Audio</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-red-500 text-xs">{errors.type.message}</p>
                )}
              </div>

              {/* URL */}
              <div className="space-y-1">
                <Label>URL</Label>
                <Input
                  {...register("url")}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {errors.url && (
                  <p className="text-red-500 text-xs">{errors.url.message}</p>
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 size={16} className="mr-2 animate-spin" />
                  )}
                  {editingMedia ? "Update Media" : "Add Media"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-slate-400" />
          </div>
        ) : media.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <p className="text-sm">No media yet</p>
            <p className="text-xs mt-1">Click Add Media to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">URL</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {media.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {renderTypeBadge(item.type)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-slate-500 max-w-xs truncate">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-brand-blue underline underline-offset-2"
                      >
                        {item.url}
                      </a>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(item)}
                        >
                          <Pencil size={16} />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Media</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {item.title} ?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMedia(item.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
