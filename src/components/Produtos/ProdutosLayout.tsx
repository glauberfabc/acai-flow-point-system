import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Package,
  Coffee,
  Grape,
  MoreHorizontal
} from 'lucide-react';
import { Product, ProductSize } from '../../types';

export function ProdutosLayout() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: 'acai' as Product['category'],
    sizes: [{ size: 'P' as ProductSize, price: 0 }],
    active: true
  });

  const categories = [
    { value: 'all', label: 'Todos', icon: MoreHorizontal },
    { value: 'acai', label: 'Açaí', icon: Grape },
    { value: 'cobertura', label: 'Coberturas', icon: Package },
    { value: 'bebidas', label: 'Bebidas', icon: Coffee },
    { value: 'outros', label: 'Outros', icon: MoreHorizontal }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    addProduct(productForm);
    setProductForm({
      name: '',
      description: '',
      category: 'acai',
      sizes: [{ size: 'P', price: 0 }],
      active: true
    });
    setIsAddDialogOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      category: product.category,
      sizes: product.sizes,
      active: product.active
    });
  };

  const handleUpdateProduct = () => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productForm);
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        category: 'acai',
        sizes: [{ size: 'P', price: 0 }],
        active: true
      });
    }
  };

  const addPriceSize = () => {
    setProductForm(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size: 'P', price: 0 }]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-acai-light to-accent/20 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestão de Produtos</h1>
            <p className="text-muted-foreground">Gerencie o catálogo de produtos da loja</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="acai" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Produto</DialogTitle>
                <DialogDescription>
                  Preencha as informações do produto
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome do Produto</Label>
                    <Input
                      id="name"
                      value={productForm.name}
                      onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Açaí Tradicional"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={productForm.category}
                      onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value as Product['category'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="acai">Açaí</SelectItem>
                        <SelectItem value="cobertura">Coberturas</SelectItem>
                        <SelectItem value="bebidas">Bebidas</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={productForm.description}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição do produto"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Tamanhos e Preços</Label>
                    <Button variant="outline" size="sm" onClick={addPriceSize}>
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  
                  {productForm.sizes.map((size, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                      <Select
                        value={size.size}
                        onValueChange={(value) => {
                          const newSizes = [...productForm.sizes];
                          newSizes[index].size = value as ProductSize;
                          setProductForm(prev => ({ ...prev, sizes: newSizes }));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PP">PP</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                          <SelectItem value="M">M</SelectItem>
                          <SelectItem value="G">G</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Preço"
                        value={size.price}
                        onChange={(e) => {
                          const newSizes = [...productForm.sizes];
                          newSizes[index].price = parseFloat(e.target.value) || 0;
                          setProductForm(prev => ({ ...prev, sizes: newSizes }));
                        }}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button variant="acai" onClick={handleAddProduct}>
                    Adicionar Produto
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList>
                  {categories.map((category) => (
                    <TabsTrigger key={category.value} value={category.value} className="flex items-center gap-2">
                      <category.icon className="w-4 h-4" />
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Produtos */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preços</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {product.category === 'acai' && 'Açaí'}
                        {product.category === 'cobertura' && 'Coberturas'}
                        {product.category === 'bebidas' && 'Bebidas'}
                        {product.category === 'outros' && 'Outros'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {product.sizes.map((size, index) => (
                          <div key={index} className="text-sm">
                            {size.size}: R$ {size.price.toFixed(2)}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.active ? "default" : "destructive"}>
                        {product.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dialog de Edição */}
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
              <DialogDescription>
                Atualize as informações do produto
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Nome do Produto</Label>
                  <Input
                    id="edit-name"
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Açaí Tradicional"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-category">Categoria</Label>
                  <Select
                    value={productForm.category}
                    onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value as Product['category'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acai">Açaí</SelectItem>
                      <SelectItem value="cobertura">Coberturas</SelectItem>
                      <SelectItem value="bebidas">Bebidas</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição do produto"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingProduct(null)}>
                  Cancelar
                </Button>
                <Button variant="acai" onClick={handleUpdateProduct}>
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}