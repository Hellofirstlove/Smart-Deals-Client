import React, { use, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

const MyProducts = () => {
    const { user } = use(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const editModalRef = useRef(null);

    // Fetch user's products
    useEffect(() => {
        if (!user?.email) return;

        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/products?email=${user.email}`)
            .then(res => res.json())
            .then(data => {
                setProducts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load products:', err);
                setLoading(false);
            });
    }, [user]);

    // Handle Delete
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, {
                        method: 'DELETE'
                    });
                    const data = await res.json();
                    if (data.deletedCount > 0) {
                        setProducts(prev => prev.filter(p => p._id !== id));
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Your product has been deleted.',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    }
                } catch (err) {
                    console.error('Delete failed:', err);
                    Swal.fire('Error', 'Failed to delete product', 'error');
                }
            }
        });
    };

    // Handle Make Sold
    const handleMakeSold = (id) => {
        Swal.fire({
            title: 'Mark as Sold?',
            text: 'This will update the product status to Sold.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, mark as sold!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'sold' })
                    });
                    const data = await res.json();
                    if (data.modifiedCount > 0 || data.acknowledged) {
                        setProducts(prev =>
                            prev.map(p => (p._id === id ? { ...p, status: 'sold' } : p))
                        );
                        Swal.fire({
                            icon: 'success',
                            title: 'Updated!',
                            text: 'Product marked as Sold.',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    }
                } catch (err) {
                    console.error('Update failed:', err);
                    Swal.fire('Error', 'Failed to update product status', 'error');
                }
            }
        });
    };

    // Open Edit Modal
    const handleOpenEdit = (product) => {
        setSelectedProduct(product);
        if (editModalRef.current) {
            editModalRef.current.showModal();
        }
    };

    // Handle Edit Submit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProduct) return;

        const form = e.target;
        const title = form.title.value.trim();
        const category = form.category.value;
        const price_min = parseFloat(form.price_min.value);
        const status = form.status.value;
        const description = form.description.value.trim();

        const updatedData = {
            title,
            category,
            price_min,
            status,
            description
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/products/${selectedProduct._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            const data = await res.json();
            if (data.modifiedCount > 0 || data.acknowledged) {
                setProducts(prev =>
                    prev.map(p =>
                        p._id === selectedProduct._id ? { ...p, ...updatedData } : p
                    )
                );
                if (editModalRef.current) {
                    editModalRef.current.close();
                }
                Swal.fire({
                    icon: 'success',
                    title: 'Saved!',
                    text: 'Product details updated successfully.',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (err) {
            console.error('Update failed:', err);
            Swal.fire('Error', 'Failed to save product updates', 'error');
        }
    };

    const renderStatusBadge = (status) => {
        const s = (status || 'pending').toLowerCase();
        if (s === 'sold') {
            return (
                <span className="bg-[#10b981] text-white text-xs font-semibold px-3 py-1 rounded-full inline-block">
                    Sold
                </span>
            );
        }
        if (s === 'active' || s === 'available') {
            return (
                <span className="bg-[#632EE3] text-white text-xs font-semibold px-3 py-1 rounded-full inline-block">
                    Active
                </span>
            );
        }
        return (
            <span className="bg-[#f59e0b] text-white text-xs font-semibold px-3 py-1 rounded-full inline-block">
                Pending
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-72">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="py-8 px-4">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                    My Products: <span className="text-primary">{products.length}</span>
                </h1>
            </div>

            {/* Table Container Card */}
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        {/* Table Head */}
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-700 text-xs font-semibold">
                                <th className="py-3 px-4">SL No</th>
                                <th className="py-3 px-4">Image</th>
                                <th className="py-3 px-4">Product Name</th>
                                <th className="py-3 px-4">Category</th>
                                <th className="py-3 px-4">Price</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-gray-400">
                                        No products created yet.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product, index) => (
                                    <tr key={product._id || index} className="hover:bg-gray-50/60 transition-colors">
                                        {/* SL No */}
                                        <td className="py-3 px-4 font-medium text-gray-600">
                                            {index + 1}
                                        </td>

                                        {/* Image */}
                                        <td className="py-3 px-4">
                                            <div className="w-12 h-10 rounded-md bg-gray-200 overflow-hidden flex items-center justify-center border border-gray-100 shadow-2xs">
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.title}
                                                        className="w-full h-full object-cover"
                                                        onError={e => {
                                                            e.target.onerror = null;
                                                            e.target.parentElement.innerHTML = '<span class="text-xs text-gray-400">N/A</span>';
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="text-xs text-gray-400">N/A</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Product Name */}
                                        <td className="py-3 px-4 font-semibold text-gray-800">
                                            {product.title || 'Untitled Product'}
                                        </td>

                                        {/* Category */}
                                        <td className="py-3 px-4 text-gray-600">
                                            {product.category || 'General'}
                                        </td>

                                        {/* Price */}
                                        <td className="py-3 px-4 font-semibold text-gray-900">
                                            ${product.price_min ?? 0}
                                        </td>

                                        {/* Status */}
                                        <td className="py-3 px-4">
                                            {renderStatusBadge(product.status)}
                                        </td>

                                        {/* Actions */}
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* Edit Button */}
                                                <button
                                                    onClick={() => handleOpenEdit(product)}
                                                    className="border border-[#a855f7] text-[#9333ea] hover:bg-purple-50 text-xs px-2.5 py-1 rounded font-normal transition-colors cursor-pointer"
                                                >
                                                    Edit
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="border border-[#fb923c] text-[#ea580c] hover:bg-orange-50 text-xs px-2.5 py-1 rounded font-normal transition-colors cursor-pointer"
                                                >
                                                    Delete
                                                </button>

                                                {/* Make Sold Button */}
                                                <button
                                                    onClick={() => handleMakeSold(product._id)}
                                                    disabled={product.status === 'sold'}
                                                    className={`border border-[#4ade80] text-[#16a34a] hover:bg-green-50 text-xs px-2.5 py-1 rounded font-normal transition-colors cursor-pointer ${
                                                        product.status === 'sold' ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : ''
                                                    }`}
                                                >
                                                    Make Sold
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Product Modal */}
            <dialog ref={editModalRef} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-white max-w-md rounded-2xl p-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Edit Product</h3>
                    {selectedProduct && (
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Product Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    defaultValue={selectedProduct.title}
                                    className="input input-bordered w-full rounded-lg text-sm bg-white border-gray-200 focus:border-primary focus:outline-none"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        name="category"
                                        defaultValue={selectedProduct.category}
                                        className="input input-bordered w-full rounded-lg text-sm bg-white border-gray-200 focus:border-primary focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="price_min"
                                        defaultValue={selectedProduct.price_min}
                                        className="input input-bordered w-full rounded-lg text-sm bg-white border-gray-200 focus:border-primary focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    defaultValue={selectedProduct.status || 'pending'}
                                    className="select select-bordered w-full rounded-lg text-sm bg-white border-gray-200 focus:border-primary focus:outline-none"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="active">Active</option>
                                    <option value="sold">Sold</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    rows="3"
                                    defaultValue={selectedProduct.description || ''}
                                    className="textarea textarea-bordered w-full rounded-lg text-sm bg-white border-gray-200 focus:border-primary focus:outline-none"
                                ></textarea>
                            </div>

                            <div className="modal-action gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => editModalRef.current?.close()}
                                    className="btn btn-sm btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-sm btn-primary"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </dialog>
        </div>
    );
};

export default MyProducts;