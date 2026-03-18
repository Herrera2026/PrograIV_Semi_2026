<?php
// ============================================
// api.php  –  Backend MySQL para Sistema Académico
// Ubicación: C:\xampp\htdocs\PrograIV_Semi_2026\api.php
// ============================================

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Responder preflight de CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ── Conexión ─────────────────────────────────
$host   = "localhost";
$dbname = "db_academica";
$user   = "root";
$pass   = "";          // En XAMPP por defecto no tiene contraseña

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión: " . $e->getMessage()]);
    exit();
}

// ── Enrutamiento ─────────────────────────────
$tabla  = $_GET['tabla']  ?? '';
$accion = $_GET['accion'] ?? '';
$body   = json_decode(file_get_contents("php://input"), true) ?? [];

// Tablas permitidas (whitelist de seguridad)
$tablasPermitidas = ['alumnos','materias','docentes','matriculas','inscripciones'];
if (!in_array($tabla, $tablasPermitidas)) {
    http_response_code(400);
    echo json_encode(["error" => "Tabla no válida"]);
    exit();
}

// ── Funciones auxiliares ──────────────────────
function responder($data) {
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

function error400($msg) {
    http_response_code(400);
    responder(["error" => $msg]);
}

// ════════════════════════════════════════════
//  ALUMNOS
// ════════════════════════════════════════════
if ($tabla === 'alumnos') {

    // GET  /api.php?tabla=alumnos&accion=obtener[&buscar=texto]
    if ($accion === 'obtener') {
        $buscar = "%" . ($_GET['buscar'] ?? '') . "%";
        $stmt = $pdo->prepare(
            "SELECT * FROM alumnos
             WHERE codigo LIKE :b OR nombre LIKE :b2
             ORDER BY nombre"
        );
        $stmt->execute([':b' => $buscar, ':b2' => $buscar]);
        responder($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    // POST /api.php?tabla=alumnos&accion=guardar
    if ($accion === 'guardar') {
        // Verificar código duplicado
        $dup = $pdo->prepare(
            "SELECT idAlumno, nombre FROM alumnos WHERE codigo = :codigo"
        );
        $dup->execute([':codigo' => $body['codigo']]);
        $existente = $dup->fetch(PDO::FETCH_ASSOC);

        if ($existente && $existente['idAlumno'] != $body['idAlumno']) {
            error400("El código del alumno ya existe: " . $existente['nombre']);
        }

        $stmt = $pdo->prepare(
            "INSERT INTO alumnos
                (idAlumno,codigo,nombre,direccion,municipio,departamento,telefono,fechaNacimiento,sexo)
             VALUES
                (:id,:codigo,:nombre,:direccion,:municipio,:departamento,:telefono,:fechaNacimiento,:sexo)
             ON DUPLICATE KEY UPDATE
                codigo=VALUES(codigo), nombre=VALUES(nombre),
                direccion=VALUES(direccion), municipio=VALUES(municipio),
                departamento=VALUES(departamento), telefono=VALUES(telefono),
                fechaNacimiento=VALUES(fechaNacimiento), sexo=VALUES(sexo)"
        );
        $stmt->execute([
            ':id'              => $body['idAlumno'],
            ':codigo'          => $body['codigo'],
            ':nombre'          => $body['nombre'],
            ':direccion'       => $body['direccion'],
            ':municipio'       => $body['municipio'],
            ':departamento'    => $body['departamento'],
            ':telefono'        => $body['telefono'],
            ':fechaNacimiento' => $body['fechaNacimiento'],
            ':sexo'            => $body['sexo'],
        ]);
        responder(["ok" => true]);
    }

    // DELETE /api.php?tabla=alumnos&accion=eliminar&id=...
    if ($accion === 'eliminar' && in_array($_SERVER['REQUEST_METHOD'], ['GET','DELETE'])) {
        $stmt = $pdo->prepare("DELETE FROM alumnos WHERE idAlumno = :id");
        $stmt->execute([':id' => $_GET['id']]);
        responder(["ok" => true]);
    }
}

// ════════════════════════════════════════════
//  MATERIAS
// ════════════════════════════════════════════
if ($tabla === 'materias') {

    if ($accion === 'obtener') {
        $buscar = "%" . ($_GET['buscar'] ?? '') . "%";
        $stmt = $pdo->prepare(
            "SELECT * FROM materias
             WHERE codigo LIKE :b OR nombre LIKE :b2
             ORDER BY codigo"
        );
        $stmt->execute([':b' => $buscar, ':b2' => $buscar]);
        responder($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    if ($accion === 'guardar') {
        $dup = $pdo->prepare("SELECT idMateria, nombre FROM materias WHERE codigo = :codigo");
        $dup->execute([':codigo' => $body['codigo']]);
        $existente = $dup->fetch(PDO::FETCH_ASSOC);
        if ($existente && $existente['idMateria'] != $body['idMateria']) {
            error400("El código de la materia ya existe: " . $existente['nombre']);
        }

        $stmt = $pdo->prepare(
            "INSERT INTO materias (idMateria,codigo,nombre,uv)
             VALUES (:id,:codigo,:nombre,:uv)
             ON DUPLICATE KEY UPDATE
                codigo=VALUES(codigo), nombre=VALUES(nombre), uv=VALUES(uv)"
        );
        $stmt->execute([
            ':id'     => $body['idMateria'],
            ':codigo' => $body['codigo'],
            ':nombre' => $body['nombre'],
            ':uv'     => $body['uv'],
        ]);
        responder(["ok" => true]);
    }

    if ($accion === 'eliminar' && in_array($_SERVER['REQUEST_METHOD'], ['GET','DELETE'])) {
        $stmt = $pdo->prepare("DELETE FROM materias WHERE idMateria = :id");
        $stmt->execute([':id' => $_GET['id']]);
        responder(["ok" => true]);
    }
}

// ════════════════════════════════════════════
//  DOCENTES
// ════════════════════════════════════════════
if ($tabla === 'docentes') {

    if ($accion === 'obtener') {
        $buscar = "%" . ($_GET['buscar'] ?? '') . "%";
        $stmt = $pdo->prepare(
            "SELECT * FROM docentes
             WHERE codigo LIKE :b OR nombre LIKE :b2
             ORDER BY nombre"
        );
        $stmt->execute([':b' => $buscar, ':b2' => $buscar]);
        responder($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    if ($accion === 'guardar') {
        $dup = $pdo->prepare("SELECT idDocente, nombre FROM docentes WHERE codigo = :codigo");
        $dup->execute([':codigo' => $body['codigo']]);
        $existente = $dup->fetch(PDO::FETCH_ASSOC);
        if ($existente && $existente['idDocente'] != $body['idDocente']) {
            error400("El código del docente ya existe: " . $existente['nombre']);
        }

        $stmt = $pdo->prepare(
            "INSERT INTO docentes (idDocente,codigo,nombre,direccion,email,telefono,escalafon)
             VALUES (:id,:codigo,:nombre,:direccion,:email,:telefono,:escalafon)
             ON DUPLICATE KEY UPDATE
                codigo=VALUES(codigo), nombre=VALUES(nombre), direccion=VALUES(direccion),
                email=VALUES(email), telefono=VALUES(telefono), escalafon=VALUES(escalafon)"
        );
        $stmt->execute([
            ':id'        => $body['idDocente'],
            ':codigo'    => $body['codigo'],
            ':nombre'    => $body['nombre'],
            ':direccion' => $body['direccion'],
            ':email'     => $body['email'],
            ':telefono'  => $body['telefono'],
            ':escalafon' => $body['escalafon'],
        ]);
        responder(["ok" => true]);
    }

    if ($accion === 'eliminar' && in_array($_SERVER['REQUEST_METHOD'], ['GET','DELETE'])) {
        $stmt = $pdo->prepare("DELETE FROM docentes WHERE idDocente = :id");
        $stmt->execute([':id' => $_GET['id']]);
        responder(["ok" => true]);
    }
}

// ════════════════════════════════════════════
//  MATRICULAS
// ════════════════════════════════════════════
if ($tabla === 'matriculas') {

    if ($accion === 'obtener') {
        $buscar = "%" . ($_GET['buscar'] ?? '') . "%";
        $stmt = $pdo->prepare(
            "SELECT m.*, a.nombre AS nombreAlumno
             FROM matriculas m
             LEFT JOIN alumnos a ON a.idAlumno = m.idAlumno
             WHERE m.codigo LIKE :b OR a.nombre LIKE :b2
             ORDER BY m.codigo"
        );
        $stmt->execute([':b' => $buscar, ':b2' => $buscar]);
        responder($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    if ($accion === 'guardar') {
        $dup = $pdo->prepare("SELECT idMatricula, codigo FROM matriculas WHERE codigo = :codigo");
        $dup->execute([':codigo' => $body['codigo']]);
        $existente = $dup->fetch(PDO::FETCH_ASSOC);
        if ($existente && $existente['idMatricula'] != $body['idMatricula']) {
            error400("El código de la matrícula ya existe");
        }

        $stmt = $pdo->prepare(
            "INSERT INTO matriculas (idMatricula,codigo,idAlumno,fecha)
             VALUES (:id,:codigo,:idAlumno,:fecha)
             ON DUPLICATE KEY UPDATE
                codigo=VALUES(codigo), idAlumno=VALUES(idAlumno), fecha=VALUES(fecha)"
        );
        $stmt->execute([
            ':id'       => $body['idMatricula'],
            ':codigo'   => $body['codigo'],
            ':idAlumno' => $body['idAlumno'],
            ':fecha'    => $body['fecha'],
        ]);
        responder(["ok" => true]);
    }

    if ($accion === 'eliminar' && in_array($_SERVER['REQUEST_METHOD'], ['GET','DELETE'])) {
        $stmt = $pdo->prepare("DELETE FROM matriculas WHERE idMatricula = :id");
        $stmt->execute([':id' => $_GET['id']]);
        responder(["ok" => true]);
    }

    // GET lista de alumnos para el selector de matrículas
    if ($accion === 'alumnos') {
        $stmt = $pdo->query("SELECT idAlumno, codigo, nombre FROM alumnos ORDER BY nombre");
        responder($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
}

// ════════════════════════════════════════════
//  INSCRIPCIONES
// ════════════════════════════════════════════
if ($tabla === 'inscripciones') {

    if ($accion === 'obtener') {
        $buscar = "%" . ($_GET['buscar'] ?? '') . "%";
        $stmt = $pdo->prepare(
            "SELECT i.*,
                    m.codigo  AS codigoMatricula,
                    m.fecha   AS fechaMatricula,
                    a.nombre  AS alumnoNombre,
                    mt.codigo AS materiaCodigo,
                    mt.nombre AS materiaNombre,
                    mt.uv     AS materiaUv
             FROM inscripciones i
             LEFT JOIN matriculas m  ON m.idMatricula = i.idMatricula
             LEFT JOIN alumnos    a  ON a.idAlumno    = m.idAlumno
             LEFT JOIN materias   mt ON mt.idMateria   = i.idMateria
             WHERE m.codigo  LIKE :b
                OR a.nombre  LIKE :b2
                OR mt.codigo LIKE :b3
                OR mt.nombre LIKE :b4
             ORDER BY i.idInscripcion"
        );
        $stmt->execute([':b' => $buscar, ':b2' => $buscar, ':b3' => $buscar, ':b4' => $buscar]);
        responder($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    if ($accion === 'guardar') {
        // Verificar duplicado matrícula+materia
        $dup = $pdo->prepare(
            "SELECT idInscripcion FROM inscripciones
             WHERE idMatricula = :idMatricula AND idMateria = :idMateria"
        );
        $dup->execute([
            ':idMatricula' => $body['idMatricula'],
            ':idMateria'   => $body['idMateria'],
        ]);
        $existente = $dup->fetch(PDO::FETCH_ASSOC);
        if ($existente && $existente['idInscripcion'] != $body['idInscripcion']) {
            error400("Esta materia ya está inscrita para esta matrícula");
        }

        $stmt = $pdo->prepare(
            "INSERT INTO inscripciones (idInscripcion,idMatricula,idMateria)
             VALUES (:id,:idMatricula,:idMateria)
             ON DUPLICATE KEY UPDATE
                idMatricula=VALUES(idMatricula), idMateria=VALUES(idMateria)"
        );
        $stmt->execute([
            ':id'          => $body['idInscripcion'],
            ':idMatricula' => $body['idMatricula'],
            ':idMateria'   => $body['idMateria'],
        ]);
        responder(["ok" => true]);
    }

    if ($accion === 'eliminar' && in_array($_SERVER['REQUEST_METHOD'], ['GET','DELETE'])) {
        $stmt = $pdo->prepare("DELETE FROM inscripciones WHERE idInscripcion = :id");
        $stmt->execute([':id' => $_GET['id']]);
        responder(["ok" => true]);
    }

    // Selectores para el formulario de inscripciones
    if ($accion === 'selectores') {
        $matriculas = $pdo->query(
            "SELECT m.idMatricula, m.codigo, a.nombre AS nombreAlumno
             FROM matriculas m
             LEFT JOIN alumnos a ON a.idAlumno = m.idAlumno
             ORDER BY m.codigo"
        )->fetchAll(PDO::FETCH_ASSOC);

        $materias = $pdo->query(
            "SELECT idMateria, codigo, nombre, uv FROM materias ORDER BY codigo"
        )->fetchAll(PDO::FETCH_ASSOC);

        responder(["matriculas" => $matriculas, "materias" => $materias]);
    }
}

http_response_code(400);
echo json_encode(["error" => "Acción no reconocida"]);