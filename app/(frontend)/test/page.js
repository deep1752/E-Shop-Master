export async function Test() {
    const res = await fetch("http://127.0.0.1:8000/products/all_products")
    const data = await res.json();
    return (
        <div>
            <h1>products list</h1>
            <ul>
                {data.map((product) => (<li key={product.id}>{product.name}</li>)
                )}
            </ul>
        </div>
    )
}
export default Test;
