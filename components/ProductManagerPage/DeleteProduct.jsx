export async function deleteProductById(id) {
  try {
    const res = await fetch(`https://e-shop-api-1vr0.onrender.com/products/delete/${id}`, {
      method: 'DELETE'
    })
    if (res.ok) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error('Error deleting product:', error)
    return false
  }
}
