"use client";

import { useState } from "react";
import { createAdhkar, updateAdhkar, deleteAdhkar } from "@/app/admin/actions";
import type { TimingType } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

interface SalahEvent {
  id: string;
  name: string;
  slug: string;
  event_type: string;
}

interface Adhkar {
  id: string;
  title: string;
  category_id: string;
  arabic_text: string;
  latin_transliteration: string | null;
  english_translation: string | null;
  recitation_context: string | null;
  timing_type: TimingType | null;
  target_count: number;
  display_order: number;
  categories: { name: string } | null;
  adhkar_salah_events: { salah_events: { id: string; name: string } }[] | null;
}

interface AdhkarsManagerProps {
  initialAdhkars: Adhkar[];
  categories: Category[];
  salahEvents: SalahEvent[];
}

const TIMING_TYPE_LABELS: Record<TimingType, string> = {
  SPECIFIC_SALAH: "Specific Salah",
  SPECIFIC_IBADAH: "Specific Ibadah",
  GENERAL: "General",
};

export function AdhkarsManager({ initialAdhkars, categories, salahEvents }: AdhkarsManagerProps) {
  const [adhkars, setAdhkars] = useState(initialAdhkars);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAdhkar, setEditingAdhkar] = useState<Adhkar | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [addTimingType, setAddTimingType] = useState<TimingType>("GENERAL");
  const [editTimingType, setEditTimingType] = useState<TimingType>("GENERAL");

  const filteredAdhkars = filterCategory === "all"
    ? adhkars
    : adhkars.filter((a) => a.category_id === filterCategory);

  const handleAdd = async (formData: FormData) => {
    setIsLoading(true);
    const result = await createAdhkar(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Adhkar created");
      setIsAddOpen(false);
      window.location.reload();
    }
    setIsLoading(false);
  };

  const handleEdit = async (formData: FormData) => {
    if (!editingAdhkar) return;

    setIsLoading(true);
    const result = await updateAdhkar(editingAdhkar.id, formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Adhkar updated");
      setEditingAdhkar(null);
      window.location.reload();
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this adhkar?")) {
      return;
    }

    const result = await deleteAdhkar(id);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Adhkar deleted");
      window.location.reload();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Adhkars</h2>
          <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value || "all")}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Adhkar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Adhkar</DialogTitle>
              <DialogDescription>
                Add a new adhkar with Arabic text and translation
              </DialogDescription>
            </DialogHeader>
            <form action={handleAdd}>
              <div className="space-y-3 py-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category_id">Category</Label>
                    <Select name="category_id" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arabic_text">Arabic Text</Label>
                  <Textarea
                    id="arabic_text"
                    name="arabic_text"
                    dir="rtl"
                    className="font-arabic text-lg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="latin_transliteration">Latin Transliteration</Label>
                  <Textarea id="latin_transliteration" name="latin_transliteration" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="english_translation">English Translation</Label>
                  <Textarea id="english_translation" name="english_translation" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="recitation_context">Context</Label>
                    <Input id="recitation_context" name="recitation_context" placeholder="e.g., After Fajr" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target_count">Target Count</Label>
                    <Input id="target_count" name="target_count" type="number" defaultValue="1" min="1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input id="display_order" name="display_order" type="number" defaultValue="0" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timing_type">Timing Type</Label>
                  <Select name="timing_type" value={addTimingType} onValueChange={(v) => setAddTimingType(v as TimingType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GENERAL">General</SelectItem>
                      <SelectItem value="SPECIFIC_SALAH">Specific Salah</SelectItem>
                      <SelectItem value="SPECIFIC_IBADAH">Specific Ibadah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {addTimingType === "SPECIFIC_SALAH" && (
                  <div className="space-y-2">
                    <Label>Associated Salah Events</Label>
                    <div className="flex flex-wrap gap-3 rounded-md border p-3">
                      {salahEvents.map((event) => (
                        <label key={event.id} className="flex items-center gap-2 text-sm">
                          <input type="checkbox" name="salah_event_ids" value={event.id} className="h-4 w-4" />
                          {event.name}
                        </label>
                      ))}
                      {salahEvents.length === 0 && (
                        <p className="text-sm text-muted-foreground">No salah events configured.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Arabic Preview</TableHead>
            <TableHead>Timing</TableHead>
            <TableHead>Target</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAdhkars.map((adhkar) => (
            <TableRow key={adhkar.id}>
              <TableCell className="font-medium">{adhkar.title}</TableCell>
              <TableCell>
                <Badge variant="outline">{adhkar.categories?.name}</Badge>
              </TableCell>
              <TableCell className="max-w-[200px] truncate" dir="rtl">
                {adhkar.arabic_text}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <Badge variant="secondary">
                    {TIMING_TYPE_LABELS[adhkar.timing_type || "GENERAL"]}
                  </Badge>
                  {adhkar.timing_type === "SPECIFIC_SALAH" &&
                    adhkar.adhkar_salah_events &&
                    adhkar.adhkar_salah_events.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {adhkar.adhkar_salah_events.map((ase) => (
                          <Badge key={ase.salah_events.id} variant="outline" className="text-xs">
                            {ase.salah_events.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                </div>
              </TableCell>
              <TableCell>{adhkar.target_count}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingAdhkar(adhkar);
                      setEditTimingType(adhkar.timing_type || "GENERAL");
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(adhkar.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editingAdhkar} onOpenChange={() => setEditingAdhkar(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Adhkar</DialogTitle>
            <DialogDescription>
              Update adhkar details
            </DialogDescription>
          </DialogHeader>
          <form action={handleEdit}>
            <div className="space-y-3 py-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    defaultValue={editingAdhkar?.title}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category_id">Category</Label>
                  <Select name="category_id" defaultValue={editingAdhkar?.category_id}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-arabic_text">Arabic Text</Label>
                <Textarea
                  id="edit-arabic_text"
                  name="arabic_text"
                  dir="rtl"
                  className="font-arabic text-lg"
                  defaultValue={editingAdhkar?.arabic_text}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-latin_transliteration">Latin Transliteration</Label>
                <Textarea
                  id="edit-latin_transliteration"
                  name="latin_transliteration"
                  defaultValue={editingAdhkar?.latin_transliteration || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-english_translation">English Translation</Label>
                <Textarea
                  id="edit-english_translation"
                  name="english_translation"
                  defaultValue={editingAdhkar?.english_translation || ""}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-recitation_context">Context</Label>
                  <Input
                    id="edit-recitation_context"
                    name="recitation_context"
                    defaultValue={editingAdhkar?.recitation_context || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-target_count">Target Count</Label>
                  <Input
                    id="edit-target_count"
                    name="target_count"
                    type="number"
                    defaultValue={editingAdhkar?.target_count}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-display_order">Display Order</Label>
                  <Input
                    id="edit-display_order"
                    name="display_order"
                    type="number"
                    defaultValue={editingAdhkar?.display_order}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-timing_type">Timing Type</Label>
                <Select name="timing_type" value={editTimingType} onValueChange={(v) => setEditTimingType(v as TimingType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GENERAL">General</SelectItem>
                    <SelectItem value="SPECIFIC_SALAH">Specific Salah</SelectItem>
                    <SelectItem value="SPECIFIC_IBADAH">Specific Ibadah</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editTimingType === "SPECIFIC_SALAH" && (
                <div className="space-y-2">
                  <Label>Associated Salah Events</Label>
                  <div className="flex flex-wrap gap-3 rounded-md border p-3">
                    {salahEvents.map((event) => {
                      const isSelected = editingAdhkar?.adhkar_salah_events?.some(
                        (ase) => ase.salah_events.id === event.id
                      );
                      return (
                        <label key={event.id} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            name="salah_event_ids"
                            value={event.id}
                            defaultChecked={isSelected}
                            className="h-4 w-4"
                          />
                          {event.name}
                        </label>
                      );
                    })}
                    {salahEvents.length === 0 && (
                      <p className="text-sm text-muted-foreground">No salah events configured.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
