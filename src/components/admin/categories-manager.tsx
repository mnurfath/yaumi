"use client";

import { useState } from "react";
import { createCategory, updateCategory, deleteCategory } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  CATEGORY_ICONS,
  CATEGORY_ICON_NAMES,
  CategoryIcon,
  type CategoryIconName,
} from "@/components/category-icon";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  display_order: number;
}

interface CategoriesManagerProps {
  initialCategories: Category[];
}

function IconPicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (name: string | null) => void;
}) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
      {CATEGORY_ICON_NAMES.map((name) => {
        const Icon = CATEGORY_ICONS[name as CategoryIconName];
        const selected = value === name;
        return (
          <button
            key={name}
            type="button"
            aria-label={name}
            aria-pressed={selected}
            onClick={() => onChange(selected ? null : name)}
            className={cn(
              "flex size-10 items-center justify-center rounded-lg border transition-colors",
              selected
                ? "border-primary bg-primary/10 text-primary"
                : "border-input bg-background hover:bg-muted"
            )}
          >
            <Icon className="h-5 w-5" />
          </button>
        );
      })}
    </div>
  );
}

function CategoryFormFields({
  category,
}: {
  category?: Pick<Category, "name" | "slug" | "description" | "icon" | "display_order"> | null;
}) {
  const [icon, setIcon] = useState<string | null>(category?.icon ?? null);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={category ? "edit-name" : "name"}>Name</Label>
        <Input
          id={category ? "edit-name" : "name"}
          name="name"
          defaultValue={category?.name}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={category ? "edit-slug" : "slug"}>Slug</Label>
        <Input
          id={category ? "edit-slug" : "slug"}
          name="slug"
          defaultValue={category?.slug}
          required
          pattern="[a-z0-9-]+"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={category ? "edit-description" : "description"}>Description</Label>
        <Textarea
          id={category ? "edit-description" : "description"}
          name="description"
          defaultValue={category?.description || ""}
        />
      </div>
      <div className="space-y-2">
        <Label>Icon</Label>
        <IconPicker value={icon} onChange={setIcon} />
        <input type="hidden" name="icon" value={icon ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor={category ? "edit-display_order" : "display_order"}>Display Order</Label>
        <Input
          id={category ? "edit-display_order" : "display_order"}
          name="display_order"
          type="number"
          defaultValue={category?.display_order ?? 0}
        />
      </div>
    </>
  );
}

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async (formData: FormData) => {
    setIsLoading(true);
    const result = await createCategory(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Category created");
      setIsAddOpen(false);
      window.location.reload();
    }
    setIsLoading(false);
  };

  const handleEdit = async (formData: FormData) => {
    if (!editingCategory) return;

    setIsLoading(true);
    const result = await updateCategory(editingCategory.id, formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Category updated");
      setEditingCategory(null);
      window.location.reload();
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will delete all adhkars in this category.")) {
      return;
    }

    const result = await deleteCategory(id);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Category deleted");
      window.location.reload();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>
                Create a new adhkar category
              </DialogDescription>
            </DialogHeader>
            <form action={handleAdd}>
              <div className="space-y-3 py-3">
                <CategoryFormFields />
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
            <TableHead className="w-[60px]">Icon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Order</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <CategoryIcon name={category.icon} className="h-4 w-4 text-primary" />
                </div>
              </TableCell>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="text-muted-foreground">{category.slug}</TableCell>
              <TableCell>{category.display_order}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingCategory(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category details
            </DialogDescription>
          </DialogHeader>
          <form action={handleEdit}>
            <div className="space-y-3 py-3">
              <CategoryFormFields category={editingCategory} />
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