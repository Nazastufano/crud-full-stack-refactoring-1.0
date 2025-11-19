<?php
/**
*    File        : backend/routes/studentsRoutes.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 1.0 ( prototype )
*/
require_once("./config/databaseConfig.php");
require_once("./routes/routesFactory.php");
require_once("./controllers/studentsController.php");

//routeRequest($conn);

/**
 * Ejemplo de como se extiende un archivo de rutas 
 * para casos particulares
 * o validaciones:
 */
// routeRequest($conn, [
//     'POST' => function($conn) 
//     {
//         // Validación o lógica extendida
//         $input = json_decode(file_get_contents("php://input"), true);
//         if (empty($input['fullname'])) 
//         {
//             http_response_code(400);
//             echo json_encode(["error" => "Falta el nombre"]);
//             return;
//         }
//         handlePost($conn);
//     }
// ]);

routeRequest($conn, [
    'POST' => function($conn) {
        $input = json_decode(file_get_contents("php://input"), true);
        //  Validar que el email no exista
        require_once("./repositories/students.php");
        if (emailExists($conn, $input['email'])) {
            http_response_code(409); // Conflict
            echo json_encode(["error" => "El correo ya está registrado"]);
            return;
        }

        // Si pasa las validaciones, delegar al controlador
        handlePost($conn);
    }, 'DELETE' => function($conn) 
    {
        $input = json_decode(file_get_contents("php://input"), true);
        $hayMateriaAsociada = getSubjectsByStudent($conn, $input['id']); //verifico si hay materias asociadas al estudiante
        if (empty($hayMateriaAsociada)) {
            handleDelete($conn);
        } else {//si la hay agarro un nombre (Podria haber mas de 1, me quedo con el primero)
            $nombrePrimerMat = $hayMateriaAsociada[0]['name'];
            
            http_response_code(202); //Tomo como valida la peticion
            echo json_encode(["error" => "No se puede eliminar estudiantes con materias",
                            "materia" => $nombrePrimerMat]);// devuelvo el nombre de la materia
        }   
    }
]);

