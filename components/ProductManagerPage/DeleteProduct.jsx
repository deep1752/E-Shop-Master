export async function deleteProductById(id) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/products/delete/${id}`, {
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
