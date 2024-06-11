export async function getComponents() {
    const response = await fetch('http://localhost:8080/components')
    return await response.json()
}