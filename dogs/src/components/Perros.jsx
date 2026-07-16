import { useEffect, useState } from "react";

function Perros() {
    const [perros, setPerros] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function obtenerPerros() {
            try {
                // Obtener listado de 20 imágenes aleatorias de perros
                const respuesta = await fetch("https://dog.ceo/api/breeds/image/random/20");
                const datosApi = await respuesta.json();
                
                // Verificamos que la API haya respondido correctamente
                if (datosApi.status === "success") {
                    // Mapeamos las URLs para crear nuestro objeto de datos
                    const datos = datosApi.message.map((url, index) => {
                        
                        // Extraemos la raza de la URL (ej. https://images.dog.ceo/breeds/hound-english/...)
                        const partesUrl = url.split('/');
                        let raza = partesUrl[4].replace('-', ' '); // Reemplazamos guiones por espacios
                        
                        return {
                            id: index + 1, // Usamos el índice como ID temporal
                            nombre: raza,
                            imagen: url,
                            descripcion: `Un hermoso ejemplar de la raza ${raza}.`
                        };
                    });
                    
                    setPerros(datos);
                } else {
                    throw new Error("La API no devolvió los datos esperados");
                }
                
                setCargando(false);
            } catch (err) {
                setError("No fue posible obtener la información de los perros");
                setCargando(false);
            }
        }
        
        obtenerPerros();
    }, []);

    if (cargando) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="grid">
            {perros.map((perro) => (
                <div className="card" key={perro.id}>
                    <img 
                        src={perro.imagen} 
                        alt={`Perro de raza ${perro.nombre}`} 
                        width="180" 
                        /* Añadimos object-fit y height para que las imágenes de diferentes tamaños se vean uniformes */
                        style={{ height: "180px", objectFit: "cover" }} 
                    />
                    <h2>{perro.nombre.toUpperCase()}</h2>
                    <p><strong>NO. </strong>{perro.id}</p>
                    <p>{perro.descripcion}</p>
                </div>
            ))}
        </div>
    );
}

export default Perros;