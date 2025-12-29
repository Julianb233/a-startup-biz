"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  MessageSquare,
  BookOpen,
  Tag,
  Save,
} from "lucide-react";
import { toast } from "sonner";

interface KnowledgeDocument {
  id: string;
  title: string;
  category: string;
  content: string;
  keywords: string[];
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export default function ChatbotKnowledgePage() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Partial<KnowledgeDocument> | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/admin/chatbot-knowledge");
      const data = await res.json();
      if (data.success) {
        setDocuments(data.documents);
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Failed to fetch knowledge:", error);
      toast.error("Failed to load knowledge base");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Filter documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      !searchQuery ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.keywords.some((k) => k.includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || doc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Handle save
  const handleSave = async () => {
    if (!editingDoc?.title || !editingDoc?.content || !editingDoc?.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const method = editingDoc.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/chatbot-knowledge", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingDoc),
      });

      const data = await res.json();
      if (data.success) {
        await fetchDocuments();
        setIsDialogOpen(false);
        setEditingDoc(null);
        toast.success(editingDoc.id ? "Knowledge updated" : "Knowledge added");
      } else {
        toast.error(data.error || "Failed to save");
      }
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save document");
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/chatbot-knowledge?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        await fetchDocuments();
        toast.success("Knowledge deleted");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete");
    }
  };

  // Toggle active status
  const toggleActive = async (doc: KnowledgeDocument) => {
    try {
      const res = await fetch("/api/admin/chatbot-knowledge", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: doc.id, is_active: !doc.is_active }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchDocuments();
        toast.success(doc.is_active ? "Deactivated" : "Activated");
      }
    } catch (error) {
      console.error("Toggle failed:", error);
    }
  };

  const openNewDialog = () => {
    setEditingDoc({
      title: "",
      category: categories[0]?.name || "About",
      content: "",
      keywords: [],
      is_active: true,
      priority: 0,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (doc: KnowledgeDocument) => {
    setEditingDoc({ ...doc });
    setIsDialogOpen(true);
  };

  const stats = {
    total: documents.length,
    active: documents.filter((d) => d.is_active).length,
    inactive: documents.filter((d) => !d.is_active).length,
    categories: categories.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-orange-500" />
            Chatbot Knowledge Base
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage the training documents that power the Startup Biz Butler
          </p>
        </div>
        <Button onClick={openNewDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Add Knowledge
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">Total Documents</span>
          </div>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">Active</span>
          </div>
          <p className="text-2xl font-bold">{stats.active}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">Inactive</span>
          </div>
          <p className="text-2xl font-bold">{stats.inactive}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 text-orange-600 mb-1">
            <Tag className="w-4 h-4" />
            <span className="text-sm">Categories</span>
          </div>
          <p className="text-2xl font-bold">{stats.categories}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search knowledge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Documents Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Keywords</TableHead>
              <TableHead className="text-center">Priority</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="animate-pulse">Loading knowledge base...</div>
                </TableCell>
              </TableRow>
            ) : filteredDocs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="text-muted-foreground">
                    {searchQuery
                      ? "No documents found matching your search"
                      : "No knowledge documents yet. Add your first one!"}
                  </div>
                  {!searchQuery && (
                    <Button onClick={openNewDialog} className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Knowledge
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredDocs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="font-medium">{doc.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {doc.content.substring(0, 80)}...
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{doc.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {doc.keywords.slice(0, 3).map((kw, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {kw}
                        </Badge>
                      ))}
                      {doc.keywords.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{doc.keywords.length - 3}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{doc.priority}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={doc.is_active ? "default" : "secondary"}
                      className={
                        doc.is_active
                          ? "bg-green-500/20 text-green-700"
                          : ""
                      }
                    >
                      {doc.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(doc)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(doc.id, doc.title)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDoc?.id ? "Edit Knowledge" : "Add Knowledge"}
            </DialogTitle>
          </DialogHeader>

          {editingDoc && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={editingDoc.title || ""}
                  onChange={(e) =>
                    setEditingDoc({ ...editingDoc, title: e.target.value })
                  }
                  placeholder="e.g., EIN Filing Service"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={editingDoc.category || ""}
                    onValueChange={(value) =>
                      setEditingDoc({ ...editingDoc, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority (0-10)</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="0"
                    max="10"
                    value={editingDoc.priority || 0}
                    onChange={(e) =>
                      setEditingDoc({
                        ...editingDoc,
                        priority: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={editingDoc.content || ""}
                  onChange={(e) =>
                    setEditingDoc({ ...editingDoc, content: e.target.value })
                  }
                  rows={6}
                  placeholder="Write the knowledge content here. Be conversational and informative. Avoid markdown formatting."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Write in a warm, conversational tone. No markdown or special
                  formatting.
                </p>
              </div>

              <div>
                <Label htmlFor="keywords">
                  <Tag className="inline h-4 w-4 mr-1" />
                  Keywords
                </Label>
                <Input
                  id="keywords"
                  value={
                    Array.isArray(editingDoc.keywords)
                      ? editingDoc.keywords.join(", ")
                      : ""
                  }
                  onChange={(e) =>
                    setEditingDoc({
                      ...editingDoc,
                      keywords: e.target.value
                        .split(",")
                        .map((k) => k.trim().toLowerCase())
                        .filter(Boolean),
                    })
                  }
                  placeholder="ein, tax id, federal id, filing"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Comma-separated keywords that trigger this response
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={editingDoc.is_active ?? true}
                  onCheckedChange={(checked) =>
                    setEditingDoc({ ...editingDoc, is_active: checked })
                  }
                />
                <Label htmlFor="is_active">
                  Active (include in chatbot responses)
                </Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
