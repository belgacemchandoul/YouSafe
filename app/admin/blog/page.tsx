"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogSchema, BlogFormData } from "@/app/types/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "@/app/components/shared";
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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { generateSlug } from "@/app/utils/slug";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [serverError, setServerError] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: { published: false },
  });

  const titleValue = watch("title");

  useEffect(() => {
    if (!editingPost && titleValue) {
      setValue("slug", generateSlug(titleValue));
    }
  }, [titleValue, editingPost, setValue]);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blog");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("[FETCH POSTS]", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const openCreateDialog = () => {
    setEditingPost(null);
    setContent("");
    setServerError("");
    reset({ published: false });
    setDialogOpen(true);
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setContent(post.content);
    setServerError("");
    reset({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage ?? undefined,
      published: post.published,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: BlogFormData) => {
    setServerError("");

    if (!content || content === "<p></p>") {
      setServerError("Content is required");
      return;
    }

    try {
      const payload = { ...data, content };
      const url = editingPost ? `/api/blog/${editingPost.id}` : "/api/blog";
      const method = editingPost ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        setServerError(err.error || "Something went wrong");
        return;
      }

      setDialogOpen(false);
      fetchPosts();
    } catch (error) {
      console.error("[SUBMIT POST]", error);
      setServerError("Something went wrong. Try again.");
    }
  };

  const deletePost = async (id: string) => {
    try {
      await fetch(`/api/blog/${id}`, { method: "DELETE" });
      fetchPosts();
    } catch (error) {
      console.error("[DELETE POST]", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Blog</h1>
          <p className="text-slate-500 text-sm mt-1">Manage blog posts</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openCreateDialog}
              className="gap-2 w-full sm:w-auto"
            >
              <Plus size={16} />
              New Post
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? "Edit Post" : "New Blog Post"}
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
                  placeholder="5 Most Accessible Restaurants in Dublin"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs">{errors.title.message}</p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-1">
                <Label>Slug</Label>
                <Input
                  {...register("slug")}
                  placeholder="5-most-accessible-restaurants-in-dublin"
                />
                {errors.slug && (
                  <p className="text-red-500 text-xs">{errors.slug.message}</p>
                )}
              </div>

              {/* Excerpt */}
              <div className="space-y-1">
                <Label>Excerpt</Label>
                <textarea
                  {...register("excerpt")}
                  placeholder="A short summary of the post..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-input text-sm outline-none focus:border-primary resize-none"
                />
                {errors.excerpt && (
                  <p className="text-red-500 text-xs">
                    {errors.excerpt.message}
                  </p>
                )}
              </div>

              {/* Cover Image */}
              <div className="space-y-1">
                <Label>
                  Cover Image URL{" "}
                  <span className="text-slate-400">(optional)</span>
                </Label>
                <Input {...register("coverImage")} placeholder="https://..." />
              </div>

              {/* Content */}
              <div className="space-y-1">
                <Label>Content</Label>
                <RichTextEditor
                  value={content}
                  onChange={(val) => {
                    setContent(val);
                    setValue("content", val);
                  }}
                  placeholder="Write your blog post here..."
                />
                {errors.content && (
                  <p className="text-red-500 text-xs">
                    {errors.content.message}
                  </p>
                )}
              </div>

              {/* Published */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="published"
                  checked={watch("published")}
                  onCheckedChange={(val) => setValue("published", !!val)}
                />
                <label
                  htmlFor="published"
                  className="text-sm text-slate-700 cursor-pointer"
                >
                  Publish immediately
                </label>
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
                  {editingPost ? "Update Post" : "Create Post"}
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
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <p className="text-sm">No posts yet</p>
            <p className="text-xs mt-1">Click New Post to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Excerpt
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell className="hidden sm:table-cell text-slate-500 max-w-xs truncate">
                      {post.excerpt}
                    </TableCell>
                    <TableCell>
                      {post.published ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Published
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100">
                          Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-slate-500 text-sm">
                      {new Date(post.createdAt).toLocaleDateString("en-IE")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(post)}
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
                              <AlertDialogTitle>Delete Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {post.title}?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deletePost(post.id)}
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
