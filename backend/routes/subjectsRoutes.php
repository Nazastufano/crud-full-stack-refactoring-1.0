<?php
/**
*    File        : backend/routes/subjectsRoutes.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 1.0 ( prototype )
*/

require_once("./config/databaseConfig.php");
require_once("./routes/routesFactory.php");
require_once("./controllers/subjectsController.php");

routeRequest($conn,['DELETE' => function($conn)
{
    $input = json_decode(file_get_contents("php://input"), true);
    $id = $input['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "ID no especificado"]);
        return;
    }

    require_once("./repositories/studentsSubjects.php");

    // Verificar si existe asignación con esta materia
    $assignments = getAssignmentsBySubject($conn, $id);

    if (count($assignments) > 0) {
        http_response_code(400);
        echo json_encode([
            "error" => "No se puede borrar la materia porque está asignada",
            "assignments" => $assignments
        ]);
        return;
    }

    handleDelete($conn);
}]);