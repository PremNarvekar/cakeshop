"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Plus, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Chocolate');
  const [images, setImages] = useState<FileList | null>(null);
  const [video, setVideo] = useState<FileList | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      fetchCakes();
    }
  }, []);

  const fetchCakes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cakes?limit=100`);
      const data = await res.json();
      if (data.success) {
        setCakes(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    
    if (images) {
      Array.from(images).forEach((file) => {
        formData.append('images', file);
      });
    }
    if (video && video.length > 0) {
      formData.append('video', video[0]);
    }

    try {
      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/cakes/${editingId}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/cakes`;
        
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        resetForm();
        fetchCakes();
      } else {
        alert(data.message || 'Error saving cake');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cake?')) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cakes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        fetchCakes();
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleEdit = (cake: any) => {
    setEditingId(cake._id);
    setName(cake.name);
    setSlug(cake.slug);
    setDescription(cake.description);
    setPrice(cake.price);
    setCategory(cake.category);
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setPrice('');
    setCategory('Chocolate');
    setImages(null);
    setVideo(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
          <h1 className="text-3xl font-bold text-pink-500">CandyCake Admin</h1>
          <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-600 transition">
            <LogOut className="w-5 h-5 mr-2" /> Logout
          </button>
        </div>

        {showForm ? (
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <h2 className="text-2xl font-semibold mb-6">{editingId ? 'Edit Cake' : 'Add New Cake'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">Name</label>
                <input required type="text" value={name} onChange={e => { setName(e.target.value); if(!editingId) setSlug(e.target.value.toLowerCase().replace(/ /g, '-')); }} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Slug</label>
                <input required type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full border p-2 rounded bg-gray-50" />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">Description</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full border p-2 rounded" rows={3}></textarea>
              </div>
              <div>
                <label className="block mb-2 font-medium">Price (₹)</label>
                <input required type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border p-2 rounded">
                  <option>Chocolate</option>
                  <option>Rainbow</option>
                  <option>Birthday</option>
                  <option>Wedding</option>
                  <option>Custom Cakes</option>
                  <option>Cupcakes</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium">Images (Max 5)</label>
                <input type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Video (Optional)</label>
                <input type="file" accept="video/mp4" onChange={e => setVideo(e.target.files)} className="w-full border p-2 rounded" />
              </div>
              <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                <button type="button" onClick={resetForm} className="px-6 py-2 border rounded text-gray-600 hover:bg-gray-100 transition">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition">Save Cake</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Cakes Inventory</h2>
              <button onClick={() => setShowForm(true)} className="flex items-center bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition">
                <Plus className="w-5 h-5 mr-2" /> Add Cake
              </button>
            </div>
            
            {loading ? (
              <p className="text-gray-500 text-center py-8">Loading cakes...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="p-4 text-left font-mediumtext-gray-600">Image</th>
                      <th className="p-4 text-left font-medium text-gray-600">Name</th>
                      <th className="p-4 text-left font-medium text-gray-600">Category</th>
                      <th className="p-4 text-left font-medium text-gray-600">Price</th>
                      <th className="p-4 text-right font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cakes.map((cake: any) => (
                      <tr key={cake._id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-4">
                          {cake.images && cake.images.length > 0 ? (
                            <img src={`http://localhost:5000${cake.images[0]}`} alt={cake.name} className="w-16 h-16 object-cover rounded shadow-sm" crossOrigin="anonymous" />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs shadow-sm">No img</div>
                          )}
                        </td>
                        <td className="p-4 font-medium">{cake.name}</td>
                        <td className="p-4 text-gray-600">{cake.category}</td>
                        <td className="p-4 font-medium text-pink-600">₹{cake.price}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => handleEdit(cake)} className="text-blue-500 hover:text-blue-700 mr-4 transition p-2 hover:bg-blue-50 rounded-full">
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(cake._id)} className="text-red-500 hover:text-red-700 transition p-2 hover:bg-red-50 rounded-full">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {cakes.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500">No cakes found. Create one above!</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
