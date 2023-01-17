export function generateToken() {
    return (Math.random() + 1).toString(36).substring(2)+(Math.random() + 1).toString(36).substring(2);
}