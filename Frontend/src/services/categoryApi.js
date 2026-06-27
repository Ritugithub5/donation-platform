import api from './api';

// Fetch all categories
export const getCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

// Admin: Add category
export const addCategory = async (categoryData) => {
    try {
        const response = await api.post('/admin/categories', categoryData);
        return response.data;
    } catch (error) {
        console.error('Error adding category:', error);
        throw error;
    }
};

// Admin: Update category
export const updateCategory = async (id, categoryData) => {
    try {
        const response = await api.put(`/admin/categories/${id}`, categoryData);
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

// Admin: Delete category
export const deleteCategory = async (id) => {
    try {
        const response = await api.delete(`/admin/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
};