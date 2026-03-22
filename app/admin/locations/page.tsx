"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { locationSchema, LocationFormData } from "@/app/types/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Location } from "@/app/generated/prisma/client";
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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { CATEGORIES, ACCESSIBILITY_FEATURES } from "@/app/constants";
import { generateSlug } from "@/app/utils/slug";

interface AdminLocation extends Omit<Location, "features" | "images"> {
  features: { id: string; name: string }[];
  images: { id: string; url: string }[];
}

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<AdminLocation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editingLocation, setEditingLocation] = useState<AdminLocation | null>(
    null,
  );
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      isApproved: true,
      isFeatured: false,
      verified: false,
    },
  });

  const nameValue = watch("name");

  useEffect(() => {
    if (!editingLocation && nameValue) {
      setValue("slug", generateSlug(nameValue));
    }
  }, [nameValue, editingLocation, setValue]);

  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/locations");
      const data = await res.json();
      setLocations(data);
    } catch (error) {
      console.error("[FETCH LOCATIONS]", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const openCreateDialog = () => {
    setEditingLocation(null);
    setSelectedFeatures([]);
    setServerError("");
    reset({ isApproved: true, isFeatured: false, verified: false });
    setDialogOpen(true);
  };

  const openEditDialog = (location: AdminLocation) => {
    setEditingLocation(location);
    setSelectedFeatures(location.features.map((f) => f.name));
    setServerError("");
    reset({
      name: location.name,
      slug: location.slug,
      description: location.description,
      address: location.address,
      city: location.city,
      latitude: location.latitude,
      longitude: location.longitude,
      category: location.category as LocationFormData["category"],
      isApproved: location.isApproved,
      isFeatured: location.isFeatured,
      verified: location.verified,
      accessibilityRating: location.accessibilityRating ?? undefined,
      accessibilityNotes: location.accessibilityNotes ?? undefined,
    });
    setDialogOpen(true);
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature],
    );
  };

  const onSubmit = async (data: LocationFormData) => {
    setServerError("");
    try {
      const payload = { ...data, features: selectedFeatures };
      const url = editingLocation
        ? `/api/locations/${editingLocation.id}`
        : "/api/locations";
      const method = editingLocation ? "PUT" : "POST";

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
      fetchLocations();
    } catch (error) {
      console.error("[SUBMIT LOCATION]", error);
      setServerError("Something went wrong. Try again.");
    }
  };

  const deleteLocation = async (id: string) => {
    try {
      await fetch(`/api/locations/${id}`, { method: "DELETE" });
      fetchLocations();
    } catch (error) {
      console.error("[DELETE LOCATION]", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Locations
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage wheelchair accessible locations
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openCreateDialog}
              className="gap-2 w-full sm:w-auto"
            >
              <Plus size={16} />
              Add Location
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLocation ? "Edit Location" : "Add New Location"}
              </DialogTitle>
            </DialogHeader>

            {serverError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{serverError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <Label>Name</Label>
                <Input {...register("name")} placeholder="Damascus Gate" />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name.message}</p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-1">
                <Label>Slug</Label>
                <Input {...register("slug")} placeholder="damascus-gate" />
                {errors.slug && (
                  <p className="text-red-500 text-xs">{errors.slug.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <Label>Description</Label>
                <textarea
                  {...register("description")}
                  placeholder="Describe the location..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-input text-sm outline-none focus:border-primary resize-none"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Address + City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Address</Label>
                  <Input
                    {...register("address")}
                    placeholder="Camden Street, Dublin 2"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>City</Label>
                  <Input {...register("city")} placeholder="Dublin" />
                  {errors.city && (
                    <p className="text-red-500 text-xs">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Latitude + Longitude */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Latitude</Label>
                  <Input
                    {...register("latitude", { valueAsNumber: true })}
                    type="number"
                    step="any"
                    placeholder="53.3336"
                  />
                  {errors.latitude && (
                    <p className="text-red-500 text-xs">
                      {errors.latitude.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Longitude</Label>
                  <Input
                    {...register("longitude", { valueAsNumber: true })}
                    type="number"
                    step="any"
                    placeholder="-6.2663"
                  />
                  {errors.longitude && (
                    <p className="text-red-500 text-xs">
                      {errors.longitude.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <Label>Category</Label>
                <Select
                  onValueChange={(val) =>
                    setValue("category", val as LocationFormData["category"])
                  }
                  defaultValue={editingLocation?.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.replace("_", " ").charAt(0) +
                          cat.replace("_", " ").slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-500 text-xs">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Accessibility Rating */}
              <div className="space-y-1">
                <Label>Accessibility Rating (1-5)</Label>
                <Input
                  {...register("accessibilityRating", { valueAsNumber: true })}
                  type="number"
                  min={1}
                  max={5}
                  placeholder="5"
                />
                {errors.accessibilityRating && (
                  <p className="text-red-500 text-xs">
                    {errors.accessibilityRating.message}
                  </p>
                )}
              </div>

              {/* Accessibility Notes */}
              <div className="space-y-1">
                <Label>
                  Accessibility Notes{" "}
                  <span className="text-slate-400">(optional)</span>
                </Label>
                <textarea
                  {...register("accessibilityNotes")}
                  placeholder="Specific accessibility details..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-input text-sm outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Accessibility Features */}
              <div className="space-y-2">
                <Label>Accessibility Features</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border border-input rounded-lg">
                  {ACCESSIBILITY_FEATURES.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Checkbox
                        id={feature}
                        checked={selectedFeatures.includes(feature)}
                        onCheckedChange={() => toggleFeature(feature)}
                      />
                      <label
                        htmlFor={feature}
                        className="text-sm text-slate-700 cursor-pointer"
                      >
                        {feature}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isApproved"
                    checked={watch("isApproved")}
                    onCheckedChange={(val) => setValue("isApproved", !!val)}
                  />
                  <label
                    htmlFor="isApproved"
                    className="text-sm text-slate-700 cursor-pointer"
                  >
                    Approved
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isFeatured"
                    checked={watch("isFeatured")}
                    onCheckedChange={(val) => setValue("isFeatured", !!val)}
                  />
                  <label
                    htmlFor="isFeatured"
                    className="text-sm text-slate-700 cursor-pointer"
                  >
                    Featured
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="verified"
                    checked={watch("verified")}
                    onCheckedChange={(val) => setValue("verified", !!val)}
                  />
                  <label
                    htmlFor="verified"
                    className="text-sm text-slate-700 cursor-pointer"
                  >
                    Verified
                  </label>
                </div>
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
                  {editingLocation ? "Update Location" : "Add Location"}
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
        ) : locations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <p className="text-sm">No locations yet</p>
            <p className="text-xs mt-1">Click Add Location to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Category
                  </TableHead>
                  <TableHead className="hidden md:table-cell">City</TableHead>
                  <TableHead className="hidden lg:table-cell">Rating</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Features
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">
                      {location.name}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">
                        {location.category.replace("_", " ").charAt(0) +
                          location.category
                            .replace("_", " ")
                            .slice(1)
                            .toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-slate-500">
                      {location.city}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-slate-500">
                      {location.accessibilityRating
                        ? `${location.accessibilityRating}/5`
                        : "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-slate-500">
                      {location.features.length} features
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {location.isApproved ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 w-fit">
                            Approved
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 w-fit">
                            Pending
                          </Badge>
                        )}
                        {location.isFeatured && (
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 w-fit">
                            Featured
                          </Badge>
                        )}
                        {location.verified && (
                          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 w-fit">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(location)}
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
                              <AlertDialogTitle>
                                Delete Location
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {location.name}?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteLocation(location.id)}
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
