# Solución: Error de Dígito de Verificación

## Problema
El sistema está validando que el dígito de verificación (DV) del NIT de la empresa sea `4`, pero en la base de datos está almacenado como `9`.

## Solución

### Opción 1: Actualizar directamente en la base de datos

Ejecuta esta consulta SQL en tu base de datos:

```sql
-- Primero, verifica qué empresa tiene el problema
SELECT id, nit, verification_digit, business_name 
FROM companies 
WHERE id = '9e0500fb-6e79-42c8-809c-a3b83de41040';

-- Luego, actualiza el dígito de verificación al correcto
UPDATE companies 
SET verification_digit = 4 
WHERE id = '9e0500fb-6e79-42c8-809c-a3b83de41040';
```

### Opción 2: Calcular el DV correcto

Si no estás seguro de cuál es el DV correcto, necesitas calcularlo a partir del NIT.

El algoritmo para calcular el DV en Colombia es:

1. Toma el NIT sin el DV
2. Multiplica cada dígito por: 71, 67, 59, 53, 47, 43, 41, 37, 29, 23, 19, 17, 13, 7, 3 (de derecha a izquierda)
3. Suma todos los resultados
4. Divide la suma entre 11
5. Resta el residuo de 11
6. Si el resultado es 11, el DV es 0; si es 10, el DV es 1; de lo contrario, el DV es el resultado

### Opción 3: Usar una herramienta online

Puedes verificar el DV correcto en:
- https://www.calculadora.com.co/dv/
- https://www.dian.gov.co/

Ingresa el NIT de tu empresa (sin el DV) y te dirá cuál es el DV correcto.

## Después de corregir

Una vez actualices el `verification_digit` en la base de datos, vuelve a crear la factura y el error debería desaparecer.
