export async function deleteProductById(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/delete/${id}`, {
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
