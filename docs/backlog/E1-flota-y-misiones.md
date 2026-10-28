# E1 · Flota y misiones

Sprint de hoy: HU-1.1 y HU-1.3. Las demás historias quedan por refinar.

## HU-1.1 Registrar una nave

Como jefe de hangar, quiero registrar una nave, para incorporarla a la flota.

Dentro del alcance del MVP.

Reglas del PRD que aplican: el combustible es un porcentaje entero de 0 a 100, y una nave recién registrada cuenta como revisada en su fecha de registro.

### Criterios de aceptación

DADO un jefe de hangar con nombre, clase y combustible válidos
CUANDO registra la nave
ENTONCES la nave aparece en el hangar y cuenta como revisada en la fecha de registro.

DADO que falta el nombre, la clase o el combustible
CUANDO intenta registrar la nave
ENTONCES la nave no aparece y el jefe ve qué falta.

DADO que ya hay una nave con ese nombre
CUANDO intenta registrar otra igual
ENTONCES la nave no aparece y el jefe ve que el nombre está repetido.

DADO una clase distinta de exploradora, carguera o transporte
CUANDO intenta registrar la nave
ENTONCES la nave no aparece y el jefe ve que la clase no vale.

DADO un combustible que no es un entero de 0 a 100
CUANDO intenta registrar la nave
ENTONCES la nave no aparece y el jefe ve que el combustible no vale.

DADO un combustible de 25, o de menos de 25, con nombre y clase válidos
CUANDO registra la nave
ENTONCES la nave sí aparece. Con 25 % cumple la condición de combustible; con menos queda registrada, aunque no esté apta para despegar.

## HU-1.2 Consultar las naves

Como jefe de hangar, quiero consultar las naves del hangar, para saber cuáles están registradas.

Dentro del alcance del MVP. Por refinar.

## HU-1.3 Asignar una misión a una nave

Como jefe de hangar, quiero asignar una misión a una nave, para dejar programado su trabajo.

Dentro del alcance del MVP.

Reglas del PRD que aplican: una nave admite como máximo 3 misiones entre revisiones y, si ya tiene 3, no recibe otra hasta su próxima revisión; cuentan todas las misiones asignadas desde la última revisión, ya realizadas o programadas; asignar una misión no cambia el combustible; una nave en dique seco no puede recibir misiones mientras esté así.

### Criterios de aceptación

DADO una nave que puede recibir trabajo, con destino, fecha de despegue y duración válidos
CUANDO el jefe le asigna la misión
ENTONCES la misión queda en esa nave y el combustible se ve igual que antes.

DADO que falta la nave, el destino, la fecha de despegue o la duración
CUANDO intenta asignar la misión
ENTONCES la misión no aparece y el jefe ve qué falta.

DADO una fecha de despegue anterior a hoy
CUANDO intenta asignar la misión
ENTONCES la misión no aparece y el jefe ve que la fecha no vale.

DADO una fecha de despegue igual a hoy y el resto válido
CUANDO asigna la misión
ENTONCES la misión sí aparece.

DADO una duración que no es un número entero de días, o es menor que 1
CUANDO intenta asignar la misión
ENTONCES la misión no aparece y el jefe ve que la duración no vale.

DADO una nave en reparación
CUANDO intenta asignarle una misión
ENTONCES la misión no aparece y el jefe ve que la nave está en reparación.

DADO una nave con 3 misiones ya asignadas desde su última revisión, hechas o programadas
CUANDO intenta asignarle otra
ENTONCES la misión no aparece y el jefe ve que ya llegó al máximo.

DADO una nave con menos de 3 misiones desde su última revisión
CUANDO asigna otra con datos válidos
ENTONCES la misión sí aparece.

Punto abierto: no está decidido si una nave puede tener dos misiones con fechas superpuestas. El jefe todavía no puede comprobar un sí o un no en la pantalla.

## HU-1.4 Consultar las misiones de una nave

Como jefe de hangar, quiero consultar las misiones de una nave, para saber qué trabajo tiene desde la última revisión.

Dentro del alcance del MVP. Por refinar.

## HU-1.5 Calcular el consumo al asignar

Como jefe de hangar, quiero que el combustible baje solo al asignar una misión, para no anotarlo a mano.

Fuera de alcance: el MVP no calcula el consumo y el combustible se actualiza a mano.

## Tickets del sprint

Solo HU-1.1 y HU-1.3. Ningún ticket diseña cómo se guardan los datos ni cómo se llama cada pantalla.

### T-01 · HU-1.1 · Configuración

Deja la aplicación lista para guardar naves y para correr las pruebas, sin escribir claves en el código.

Definition of Done:

- [ ] Se puede guardar una nave sin poner claves en el código.
- [ ] Las pruebas del proyecto se pueden ejecutar.

Dependencias: ninguna.

### T-02 · HU-1.1 · Modelo/Dominio

Reglas que aceptan o rechazan el registro de una nave según el nombre, la clase y el combustible.

Definition of Done:

- [ ] Rechaza el registro si falta el nombre, la clase o el combustible.
- [ ] Rechaza el nombre repetido, una clase distinta de las tres y un combustible fuera de 0 a 100.
- [ ] Una nave aceptada cuenta como revisada en su fecha de registro.

Dependencias: ninguna.

### T-03 · HU-1.1 · Test

Pruebas automáticas de las reglas de registro, sin usar la pantalla.

Definition of Done:

- [ ] Cubren los datos obligatorios, el nombre repetido, la clase y el combustible.
- [ ] Cubren que la nave nueva queda revisada en la fecha de registro.
- [ ] Fallan si alguna de esas reglas deja de cumplirse.

Dependencias: T-02.

### T-04 · HU-1.1 · Datos/Interfaz

El jefe registra una nave y ve si quedó en el hangar o por qué no.

Definition of Done:

- [ ] Con datos válidos la nave queda a la vista del jefe.
- [ ] Si los datos no cumplen, la nave no aparece y se ve el motivo.
- [ ] El jefe no necesita saber cómo se guardan los datos.

Dependencias: T-01 y T-02.

### T-05 · HU-1.3 · Modelo/Dominio

Reglas que aceptan o rechazan asignar una misión a una nave que ya existe.

Definition of Done:

- [ ] Exige nave, destino, fecha de despegue y duración.
- [ ] Rechaza una fecha anterior a hoy, una duración menor que 1, una nave en reparación y una nave que ya tiene 3 misiones desde la revisión.
- [ ] Aceptar la misión no cambia el combustible.

Dependencias: T-02. La misión depende de la nave.

### T-06 · HU-1.3 · Test

Pruebas automáticas de las reglas de asignación, sin usar la pantalla.

Definition of Done:

- [ ] Cubren datos incompletos, la fecha, la duración, la reparación y el tope de 3 misiones.
- [ ] Comprueban que el combustible no cambia al asignar.
- [ ] Fallan si alguna de esas reglas deja de cumplirse.

Dependencias: T-05.

### T-07 · HU-1.3 · Datos/Interfaz

El jefe asigna una misión a una nave ya registrada y ve si quedó o por qué no.

Definition of Done:

- [ ] Solo se puede asignar una misión a una nave que ya está en el hangar.
- [ ] Con datos válidos la misión queda a la vista en esa nave.
- [ ] Si no se puede, la misión no aparece y se ve el motivo.

Dependencias: T-04 y T-05. La misión depende de la nave.

## Orden de ejecución

1. T-01, para poder guardar naves y ejecutar pruebas.
2. T-02, reglas de registro.
3. T-03, pruebas de esas reglas.
4. T-04, el jefe ya puede registrar una nave.
5. T-05, reglas de la misión, que dependen de la nave.
6. T-06, pruebas de la misión.
7. T-07, el jefe ya puede asignar una misión a una nave registrada.
