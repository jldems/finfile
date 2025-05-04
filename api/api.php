<?php
require_once("rest.inc.php");

// require 'phpexcel/Classes/PHPExcel.php';

ini_set('memory_limit', '1024M');
class API extends REST
{
    public $data = "";

    const DB_SERVER = "localhost";
    const DB_USER = "finfile";
    const DB_PASSWORD = "[yVg36L8[43vG6!b"; 
    const DBfinfile = "finfile_db"; 

    private $finfile_db; 

    public function __construct()
    {
        // $this->myAccess = file_get_contents($this->q_path, "r");

        parent::__construct();        // Init parent contructor
        $this->dbConnect();            // Initiate Database connection
    }
    /*
	*  Connect to Database
	*/
    private function dbConnect()
    {
        $this->finfile_db = new mysqli(self::DB_SERVER, self::DB_USER, self::DB_PASSWORD, self::DBfinfile); 
    }

    public function processApi()
    {
        $func = strtolower(trim(str_replace("/", "", $_REQUEST['x'])));
        if ((int)method_exists($this, $func) > 0)
            $this->$func();
        else
            $this->response('', 404);
    }

    // authentication and users management
    private function login_user()
    {
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        date_default_timezone_set('Asia/Manila');
        $userObj = json_decode(file_get_contents("php://input"), true);
        $userObj = str_replace("'", "`", $userObj);

        $username = (string)$userObj["username"];
        $password = (string)$userObj["password"];
        $hash = md5($password);

        $stmt = $this->finfile_db->prepare(
            "SELECT 
            users.user_id,
            users.role,
            users.status,
            users.avatar_url,
            users.full_name,
            users.email
            FROM users
            WHERE user_name = '$username' AND password_hash = '$hash' LIMIT 1"
        );
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $rows = $row;
            }
            $this->response($this->json($rows), 200);
        } else {
            $error = array('status' => "error", "msg" => "Invalid username or password!");
            $this->response($this->json($error), 404);
        }
        $stmt->close();
        $this->finfile_db->close();
    }

    /* private function upload_file()
    {
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
            return;
        }

        if (!isset($_POST['user_id'])) {
            $callback = array("callback" => 'User ID not provided');
            $this->response($this->json($callback), 400);
            return;
        }

        $userId = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['user_id']); // sanitize
        $baseUploadDir = '../uploads/' . $userId . '/';

        if (!isset($_FILES['files'])) {
            $callback = array("callback" => 'No files uploaded');
            $this->response($this->json($callback), 400);
            return;
        }

        $names = $_FILES['files']['name'];
        $tmpNames = $_FILES['files']['tmp_name'];
        

        if (is_array($names)) {
            foreach ($names as $index => $relativePath) {
                $tempPath = $tmpNames[$index];
                $safePath = str_replace(['..', '\\'], '', $relativePath);
                $destination = $baseUploadDir . $safePath;

                echo $destination;

                $folder = dirname($destination);
                if (!is_dir($folder)) {
                    mkdir($folder, 0755, true);
                }

                if (!move_uploaded_file($tempPath, $destination)) {
                    $callback = array("callback" => 'Failed to upload: ' . $relativePath);
                    $this->response($this->json($callback), 500);
                    return;
                }
            }
        } else {
            // Single file fallback
            $relativePath = $_FILES['files']['name'];
            $tempPath = $_FILES['files']['tmp_name'];
            $safePath = str_replace(['..', '\\'], '', $relativePath);
            $destination = $baseUploadDir . $safePath;

            $folder = dirname($destination);
            if (!is_dir($folder)) {
                mkdir($folder, 0755, true);
            }

            if (!move_uploaded_file($tempPath, $destination)) {
                $callback = array("callback" => 'Failed to upload: ' . $relativePath);
                $this->response($this->json($callback), 500);
                return;
            }
        }

        $callback = array("callback" => 'Upload successful');
        $this->response($this->json($callback), 200);
    }
 */
    

    private function file_list(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        $categoryid = (int)$this->_request["categoryid"]; 

        if($categoryid > 0){
            $filterCateg = "AND fs.category_id = $categoryid";
        }else{
            $filterCateg = "";
        }

        $stmt = $this->finfile_db->prepare(
            "SELECT
            fs.file_id,
            fs.owner_id,
            fs.team_id ,
            fs.category_id,
            fs.shared_id,
            LEFT(fs.file_name, LOCATE('.', fs.file_name) - 1) AS file_name,
            fs.file_name AS fullfl_name,
            fs.file_type,
            fs.file_path,
            fs.file_size,
            fs.is_favorite,
            fs.is_trashed,
            fs.uploaded_at,
            fs.last_modified,
            sw.full_name AS shared_with,
            luby.full_name AS last_updated_by
            FROM files fs
            LEFT JOIN shared_files sf ON sf.shared_id = fs.shared_id
            LEFT JOIN users sw ON sw.user_id = sf.shared_with
            LEFT JOIN users luby ON luby.user_id = fs.last_updated_by
            WHERE fs.is_trashed = 0 $filterCateg
            ORDER BY fs.file_id"
        );
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }
            $this->response($this->json($rows), 200);
        } else { 
            $this->response('Failed to get file list', 204);
        }
        $stmt->close();
        $this->finfile_db->close();
    }
    private function share_files(){

        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $fnobj = json_decode(file_get_contents("php://input"), true); 

        $personid = (array)$fnobj["sharedid"];
        $userid = (int)$fnobj["userid"];  
        $fileid = (int)$fnobj["fileid"];  
        $permission = (string)$fnobj["permssn"];  

        try {

            foreach($personid as $ushareid){

                $sfselect = "SELECT shared_id AS sharedid FROM shared_files WHERE file_id = $fileid AND shared_with = $ushareid";
                $sfpselect = $this->finfile_db->prepare($sfselect);
                $sfpselect->execute();

                $result = $sfpselect->get_result();

                if ($result->num_rows > 0) {
                    $row = $result->fetch_assoc();
                    $sharedid = $row['sharedid'];  

                    $sql = "UPDATE shared_files SET  
                        permission = '$permission'
                        WHERE shared_id=$sharedid;";

                    $this->finfile_db->prepare($sql)->execute();
                    
                }else{
                    
                    $sql = "INSERT INTO shared_files SET 
                        file_id = $fileid,
                        shared_by = $userid,
                        shared_with = $ushareid,
                        permission = '$permission';";

                    $this->finfile_db->prepare($sql)->execute();
                }
            }
            return $this->response($this->json(["status" => "success"]), 200);
        } catch (PDOException $e) {
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
        }
    }
    private function add_file(){
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $fnobj = json_decode(file_get_contents("php://input"), true);
        $fnobj = str_replace("'", "`", $fnobj);

        $foldername = (string)$fnobj["foldername"];
        $userid = (int)$fnobj["userid"];

        $baseUploadDir = '../Uploads/' . $userid . '/';

         $fullPath = $baseUploadDir . $foldername;

        if (!is_dir($fullPath)) {
            if (!mkdir($fullPath, 0777, true)) {
                $callback = array("callback" => 'Invalid user ID');
                $this->response($this->json($callback), 400);
                return;
            }

            $sql = "INSERT INTO file_categories SET 
                        category_name='$foldername',
                        category_path = '$fullPath',
                        last_updated_by = $userid;";

            $stmt = $this->finfile_db->prepare($sql);
            $stmt->execute();

            $affected_rows = $stmt->affected_rows;
            $last_id = $this->finfile_db->insert_id;

            if ($affected_rows == 1) {
                $success = array('status' => "success", "folder_id" => $last_id);
                $this->response($this->json($success), 200);
            } else { 
                $this->response('Failed to create folder', 204);
            }

            $stmt->close();
            $this->finfile_db->close();
        }
    }
    private function update_file(){
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $fnobj = json_decode(file_get_contents("php://input"), true);
        $fnobj = str_replace("'", "`", $fnobj);

        $fileid = (int)$fnobj["fileid"];
        $userid = (int)$fnobj["userid"]; 
        $filename = (string)$fnobj["filename"]; 

        $fselect = "SELECT fs.file_name, fs.file_type, fc.category_name FROM files fs 
        LEFT JOIN file_categories fc ON fc.category_id = fs.category_id
        WHERE fs.file_id = $fileid AND fs.is_trashed = 0";
        $fpselect = $this->finfile_db->prepare($fselect);

        $fpselect->execute();

        $result = $fpselect->get_result();

        if($result->num_rows > 0){
            $row = $result->fetch_assoc();

            $oldname = $row['file_name'];
            $categname = $row['category_name'];
            $filetype = $row['file_type'];

            $baseUploadDir = '../uploads/' . $userid . '/';
            $baseUploadDir .= $categname ? $categname . '/' : '';

            $newFolder = $baseUploadDir . $filename.'.'.$filetype;
            $oldFolder = $baseUploadDir . $oldname;

            if (rename($oldFolder, $newFolder)) { 

                $sql = "UPDATE files SET 
                            file_name='$filename.$filetype',
                            file_path = '$newFolder',
                            last_updated_by = $userid
                            WHERE file_id= $fileid;";

                $stmt = $this->finfile_db->prepare($sql);
                $stmt->execute();

                $affected_rows = $stmt->affected_rows;
                $last_id = $this->finfile_db->insert_id;

                if ($affected_rows == 1) {
                    $success = array('status' => "success", "folder_id" => $last_id);
                    $this->response($this->json($success), 200);
                } else { 
                    $this->response('Failed to create folder', 204);
                }
            }

        }

        $fpselect->close();
        $this->finfile_db->close();
        
    }
    private function rename_file(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        $fileid = (int)$this->_request["fileid"];
        $type = (int)$this->_request["type"];

        if($type == 0){
            $stmt = $this->finfile_db->prepare(
                "SELECT
                fc.category_id,
                fc.category_name,
                fc.category_path,
                fc.category_size, 
                fc.last_modified
                FROM file_categories fc WHERE fc.category_id = $fileid
                ORDER BY fc.category_id"
            );
        }else{
            $stmt = $this->finfile_db->prepare(
                "SELECT
                fs.file_id,
                fs.owner_id,
                fs.team_id ,
                fs.category_id,
                fs.shared_id,
                LEFT(fs.file_name, LOCATE('.', fs.file_name) - 1) AS file_name,
                fs.file_type,
                fs.file_path,
                fs.file_size,
                fs.is_favorite,
                fs.is_trashed,
                fs.uploaded_at,
                fs.last_modified
                FROM files fs WHERE file_id = $fileid
                ORDER BY fs.file_id"
            );
        }

        
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $rows = $row;
            }
            $this->response($this->json($rows), 200);
        } else { 
            $this->response('Failed to get folder', 204);
        }
        $stmt->close();
        $this->finfile_db->close();
    }
    private function remove_files(){
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $fnobj = json_decode(file_get_contents("php://input"), true);
        $fnobj = str_replace("'", "`", $fnobj);

        $fileid = (int)$fnobj["fileid"];
        $userid = (int)$fnobj["userid"];  

        try {
            $sql = "UPDATE files SET 
                        is_trashed = 1,
                        last_updated_by = $userid
                        WHERE file_id= $fileid;";

            $this->finfile_db->prepare($sql)->execute();

            return $this->response($this->json(["status" => "success"]), 200);
        } catch (PDOException $e) {
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
        }
    }

    private function folder_list(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        // $deptcode = (int)$this->_request["deptcode"];

        $stmt = $this->finfile_db->prepare(
            "SELECT
            fc.category_id,
            fc.category_name,
            fc.category_path,
            fc.category_size, 
            fc.last_modified,
            sw.full_name AS shared_with,
            luby.full_name AS last_updated_by
            FROM file_categories fc
            LEFT JOIN shared_files sf ON sf.shared_id = fc.shared_id
            LEFT JOIN users sw ON sw.user_id = sf.shared_with
            LEFT JOIN users luby ON luby.user_id = fc.last_updated_by
            WHERE fc.is_trashed = 0
            ORDER BY fc.category_id"
        );
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }
            $this->response($this->json($rows), 200);
        } else { 
            $this->response('Failed to get file list', 204);
        }
        $stmt->close();
        $this->finfile_db->close();
    }
    private function share_folder(){

        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $fnobj = json_decode(file_get_contents("php://input"), true); 

        $personid = (array)$fnobj["sharedid"];
        $userid = (int)$fnobj["userid"];  
        $categoryid = (int)$fnobj["categoryid"];  
        $permission = (string)$fnobj["permssn"];  

        try {

            foreach($personid as $ushareid){

                $sfselect = "SELECT shared_id AS sharedid FROM shared_files WHERE category_id = $categoryid AND shared_with = $ushareid";
                $sfpselect = $this->finfile_db->prepare($sfselect);
                $sfpselect->execute();

                $result = $sfpselect->get_result();

                if ($result->num_rows > 0) {
                    $row = $result->fetch_assoc();
                    $sharedid = $row['sharedid'];  

                    $sql = "UPDATE shared_files SET  
                        permission = '$permission'
                        WHERE shared_id=$sharedid;";

                    $this->finfile_db->prepare($sql)->execute();
                    
                }else{
                    
                    $sql = "INSERT INTO shared_files SET 
                        category_id = $categoryid,
                        shared_by = $userid,
                        shared_with = $ushareid,
                        permission = '$permission';";

                    $this->finfile_db->prepare($sql)->execute();

                    $last_id = $this->finfile_db->insert_id;

                    if($last_id > 0){

                        $sql2 = "UPDATE files SET 
                                    shared_id = $last_id,
                                    last_updated_by = $userid
                                WHERE category_id = $categoryid";

                        $this->finfile_db->prepare($sql2)->execute();
                    }
                }
            }
            return $this->response($this->json(["status" => "success"]), 200);
        } catch (PDOException $e) {
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
        }
    }
    private function update_folder(){
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $fnobj = json_decode(file_get_contents("php://input"), true);
        $fnobj = str_replace("'", "`", $fnobj);

        $categoryid = (int)$fnobj["categoryid"];
        $userid = (int)$fnobj["userid"]; 
        $foldername = (string)$fnobj["foldername"];
        $categoryname = (string)$fnobj["categoryname"];

        $baseUploadDir = '../Uploads/' . $userid . '/';

         $newFolder = $baseUploadDir . $foldername;
         $oldFolder = $baseUploadDir . $categoryname;

        if (rename($oldFolder, $newFolder)) { 

            $sql = "UPDATE file_categories SET 
                        category_name='$foldername',
                        category_path = '$newFolder',
                        last_updated_by = $userid
                        WHERE category_id= $categoryid;";

            $stmt = $this->finfile_db->prepare($sql);
            $stmt->execute();

            $affected_rows = $stmt->affected_rows;
            $last_id = $this->finfile_db->insert_id;

            if ($affected_rows == 1) {
                $success = array('status' => "success", "folder_id" => $last_id);
                $this->response($this->json($success), 200);
            } else { 
                $this->response('Failed to create folder', 204);
            }

            $stmt->close();
            $this->finfile_db->close();
        }
    }
    private function rename_folder(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        $fileid = (int)$this->_request["fileid"];
        $type = (int)$this->_request["type"];

        if($type == 0){
            $stmt = $this->finfile_db->prepare(
                "SELECT
                fc.category_id,
                fc.category_name,
                fc.category_path,
                fc.category_size, 
                fc.last_modified
                FROM file_categories fc WHERE fc.category_id = $fileid
                ORDER BY fc.category_id"
            );
        }else{
            $stmt = $this->finfile_db->prepare(
                "SELECT
                fs.file_id,
                fs.owner_id,
                fs.team_id ,
                fs.category_id,
                fs.shared_id,
                LEFT(fs.file_name, LOCATE('.', fs.file_name) - 1) AS file_name,
                fs.file_type,
                fs.file_path,
                fs.file_size,
                fs.is_favorite,
                fs.is_trashed,
                fs.uploaded_at,
                fs.last_modified
                FROM files fs WHERE file_id = $fileid
                ORDER BY fs.file_id"
            );
        }

        
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $rows = $row;
            }
            $this->response($this->json($rows), 200);
        } else { 
            $this->response('Failed to get folder', 204);
        }
        $stmt->close();
        $this->finfile_db->close();
    }

    private function remove_folder(){
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $fnobj = json_decode(file_get_contents("php://input"), true);
        $fnobj = str_replace("'", "`", $fnobj);

        $categoryid = (int)$fnobj["categoryid"];
        $userid = (int)$fnobj["userid"];  

        try {
            $sql = "UPDATE file_categories SET 
                        is_trashed = 1,
                        last_updated_by = $userid
                        WHERE category_id= $categoryid;";

            $this->finfile_db->prepare($sql)->execute();
    
            $sql2 = "UPDATE files SET 
                        is_trashed = 1,
                        last_updated_by = $userid
                    WHERE category_id = $categoryid";

            $this->finfile_db->prepare($sql2)->execute();

            return $this->response($this->json(["status" => "success"]), 200);
        } catch (PDOException $e) {
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
        }
    }
    private function download_folder() {
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        $fnobj = json_decode(file_get_contents("php://input"), true);
        $fnobj = str_replace("'", "`", $fnobj);

        $userid = (int)$fnobj["userid"]; 
        $name = basename($fnobj["name"]); // sanitize
        $baseUploadDir = realpath('../uploads/' . $userid);
        $sourcePath = $baseUploadDir . '/' . $name;
        $tempDir = realpath('../temp');
        $zipPath = $tempDir . '/' . $name . '.zip';

        if (!is_dir($sourcePath)) {
            $this->response($this->json(["error" => "Folder does not exist"]), 404);
        }

        $zip = new ZipArchive();
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE)) {
            $files = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($sourcePath, RecursiveDirectoryIterator::SKIP_DOTS),
                RecursiveIteratorIterator::LEAVES_ONLY
            );
            foreach ($files as $file) {
              
                $filePath = $file->getRealPath();
                if (file_exists($filePath)) {
                    $relativePath = substr($filePath, strlen($sourcePath) + 1);
                    $zip->addFile($filePath, $relativePath);
                    $filesFound = true;
                }
            }

            if (!$filesFound) {
                $this->response($this->json(["error" => "No files found in the folder"]), 200); 
            }

            $zip->close();
            
            $publicUrl = 'http://' . $_SERVER['HTTP_HOST'] . '/finfile/temp/' . $name . '.zip';
            $this->response($this->json(["ZipNamePath" => $publicUrl]), 200);

            sleep(10);
            unlink($publicUrl);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to create ZIP"]);
            exit;
        }
    }
    private function download_file() {
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        $fnobj = json_decode(file_get_contents("php://input"), true);
        $fnobj = str_replace("'", "`", $fnobj);

        $fileid = (int)$fnobj["fileid"]; 
        $categid = (int)$fnobj["categid"]; 
        $userid = (int)$fnobj["userid"]; 

        $fselect = "SELECT 
            fs.file_name AS filenames, 
            fc.category_name AS categname
            FROM files fs
            LEFT JOIN file_categories fc ON fc.category_id = fs.category_id
            WHERE fs.file_id = $fileid 
            AND fs.category_id = $categid
            AND fs.is_trashed = 0
        ";
        $fpselect = $this->finfile_db->prepare($fselect);

        $fpselect->execute();
        $result = $fpselect->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $filenames = $row['filenames'];
                $categname = $row['categname'];

                 $publicUrl = 'http://' . $_SERVER['HTTP_HOST'] . '/finfile/uploads/'. $userid. '/'. $categname .'/'. $filenames;
            } 
        } else { 
            $this->response('Failed to get file list', 204);
        }
        $this->response($this->json(["success" => $publicUrl]), 200);
    }
    private function user_list(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        $stmt = $this->finfile_db->prepare(
            "SELECT
            us.user_id,
            us.full_name,
            us.email,
            us.user_name, 
            us.avatar_url,
            us.role,
            us.status,
            us.created_at
            FROM users us
            WHERE is_trashed = 0
            ORDER BY us.user_id"
        );
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }
            $this->response($this->json($rows), 200);
        } else { 
            $this->response('Failed to get user list', 204);
        }
        $stmt->close();
        $this->finfile_db->close();
    }

    private function upload_file()
    {
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
            return;
        }

        if (!isset($_POST['user_id'])) {
            $callback = array("callback" => 'User ID not provided');
            $this->response($this->json($callback), 400);
            return;
        }

        $user_id = $_POST['user_id'];
        $categid = $_POST['category_id'];
        $categpath = $_POST['category_path'] . '/';
        
        try {
            $uploadedFiles = [];

            foreach ($_FILES['files']['name'] as $index => $name) {
                $error = $_FILES['files']['error'][$index];
                $tmpName = $_FILES['files']['tmp_name'][$index];

                if ($error === UPLOAD_ERR_OK) {

                    $filename = basename($name);
                    $targetPath = $categpath . $filename;
                    $fileExtension = pathinfo($name, PATHINFO_EXTENSION);
                    $fileSize = $_FILES['files']['size'][$index];

                    $check = "SELECT file_id FROM files WHERE file_name = '$filename' AND file_size = $fileSize AND file_type = '$fileExtension'";
                    $pcheck = $this->finfile_db->prepare($check);
                    $pcheck->execute();

                    $result = $pcheck->get_result(); 

                    if ($result->num_rows <= 0){

                        if (move_uploaded_file($tmpName, $targetPath)) {
                            $uploadedFiles[] = $filename;
                        }

                        $sql = "INSERT INTO files SET 
                        file_name='$filename',
                        file_type = '$fileExtension',
                        file_path = '$targetPath',
                        file_size = $fileSize,
                        last_updated_by = $user_id,
                        category_id = $categid,
                        uploaded_at = NOW();";

                        $stmt = $this->finfile_db->prepare($sql);
                        $stmt->execute();

                       
                    } 
                }
            }
            $this->calfolder_size($categid, $categpath); 
        }catch (PDOException $e){
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
        }

       /*  $userId = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['user_id']);
        if (empty($userId)) {
            $callback = array("callback" => 'Invalid user ID');
            $this->response($this->json($callback), 400);
            return;
        }

        $baseUploadDir = '../Uploads/' . $userId . '/';

        if (!file_exists($baseUploadDir) && !mkdir($baseUploadDir, 0755, true)) {
            $callback = array("callback" => 'Failed to create upload directory');
            $this->response($this->json($callback), 500);
            return;
        }

        if (!isset($_FILES['files']) || !is_array($_FILES['files']['name'])) {
            $callback = array("callback" => 'No files uploaded');
            $this->response($this->json($callback), 400);
            return;
        }

        $uploadedFiles = [];

        foreach ($_FILES['files']['name'] as $index => $name) {
            $error = $_FILES['files']['error'][$index];
            $tmpName = $_FILES['files']['tmp_name'][$index];

            if ($error === UPLOAD_ERR_OK) {
                $filename = basename($name);
                $targetPath = $baseUploadDir . $filename;
                $fileExtension = pathinfo($name, PATHINFO_EXTENSION);
                $fileSize = $_FILES['files']['size'][$index];

                if (move_uploaded_file($tmpName, $targetPath)) {
                    $uploadedFiles[] = $filename;
                }

                $check = "SELECT file_id FROM files WHERE file_name = '$filename' AND file_size = $fileSize AND file_type = '$fileExtension'";
                $pcheck = $this->finfile_db->prepare($check);
                $pcheck->execute(); 

                $result = $pcheck->get_result();
                $row = $result->fetch_assoc();

                if($row['file_id'] > 0){

                }else{
                    $sql = "INSERT INTO files SET 
                    file_name='$filename',
                    file_type = '$fileExtension',
                    file_path = '$targetPath',
                    file_size = $fileSize,
                    last_updated_by = $userId,
                    uploaded_at = NOW();";

                    $stmt = $this->finfile_db->prepare($sql);
                    $stmt->execute();

                    $affected_rows = $stmt->affected_rows;

                    if ($affected_rows == 1) {
                        $success = "success";
                        $this->response($success, 200);
                    } else { 
                        $this->response('Failed to create folder', 204);
                    }

                    $stmt->close();
                    $this->finfile_db->close();

                }
            }
        }

        $callback = array(
            "callback" => 'Files uploaded successfully',
            "uploaded_files" => $uploadedFiles
        );

        $this->response($this->json($callback), 200); */
    }
    public function calfolder_size($categid, $categpath){
        try {
            $categsize = 0;
            foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($categpath)) as $file) {
                if ($file->isFile()) {
                    $categsize += $file->getSize();
                }
            } 
            $sql = "UPDATE file_categories SET 
                category_size=$categsize
                WHERE category_id = $categid;";
            $stmt = $this->finfile_db->prepare($sql);
            $stmt->execute();
        } catch (PDOException $e){
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
        }
    }


   /*  // inventory management
    private function get_inventory()
    {
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        $deptcode = (int)$this->_request["deptcode"];
        $iclass = (int)$this->_request["iclass"];
        $isearch = (string)$this->_request["isearch"];

        $deptThis = $deptcode == 0 ? "" : "AND product.DeptCode = '$deptcode'";
        $classThis = $iclass == 0 ? "" : "AND product.itemclass = '$iclass'";
        $searchThis = $isearch == "" ? "" : "AND (product.Description LIKE '%$isearch%' OR product.ProductRID LIKE '%$isearch%' OR product.Brand LIKE '%$isearch%')";

        $stmt = $this->wgfinance->prepare(
            "SELECT
            LPAD(product.ProductRID, 5, '0') AS fileno,
            product.ProductRID,
            product.CS_ProductRID,
            product.UPC,
            product.DeptCode,
            product.itemclass,
            product.itemloc,
            product.Description,
            product.VendorRID,
            product.Brand,
            product.UOMRID,
            product.UOMRIDMinor,
            product.UOMQty,
            product.UOMQtyMinor,
            product.UserRID,
            product.MinStock,
            product.SRP1,
            product.SRP2,
            product.SRP3,
            product.SRP4,
            product.SRP5,
            product.SRP6,
            product.SRP7,
            product.SRP8,
            product.SRP9,
            product.SRP10,
            product.SRP11,
            product.SRP12,
            product.SRP13,
            product.SRP14,
            product.SRP15,
            product.SRP16,
            product.SRP17,
            product.SRP18,
            product.SRP19,
            product.SRP20,
            product.SRP1mup,
            product.SRP2mup,
            product.SRP3mup,
            product.SRP4mup,
            product.SRP5mup,
            product.SRP6mup,
            product.SRP7mup,
            product.SRP8mup,
            product.SRP9mup,
            product.SRP10mup,
            product.SRP11mup,
            product.SRP12mup,
            product.SRP13mup,
            product.SRP14mup,
            product.SRP15mup,
            product.SRP16mup,
            product.SRP17mup,
            product.SRP18mup,
            product.SRP19mup,
            product.SRP20mup,
            product.BestSRP,
            product.UnitBestSRP,
            product.UnitCost,
            product.BasedCost,
            product.UnTaxable,
            product.NotAllowedSenior,
            product.OpenSRP,
            product.SetCombo,
            product.LastCount,
            product.ShowVariance,
            product.LastCountDateTime,
            product.CSMinor,
            product.Foto,
            product.inactive,
            IF(product.ExpiryDate = '0000-00-00', '', product.ExpiryDate) AS ExpiryDate,
            product.LotNumber,
            product.SeniorStandardSRP,
            product.Deleted,
            product.InvAccount,
            itemclass.classDesc AS classes,
            dept.DeptDesc AS deparments,
            uom.uom_code AS uomcode
            FROM product 
            LEFT JOIN lkup_itemclass itemclass ON itemclass.classRID = product.itemclass
            LEFT JOIN department dept ON dept.DeptCode = product.DeptCode
            LEFT JOIN uomplu uom ON uom.UOMRID = product.UOMRID
            WHERE product.deleted = 0 $deptThis $classThis $searchThis
            ORDER BY product.ProductRID, product.Description ASC"
        );
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }
            $this->response($this->json($rows), 200);
        } else {
            // $error = array('status' => "error", "msg" => "No results found");
            // $this->response($this->json($error), 404);
            $this->response('', 204);
        }
        $stmt->close();
        $this->wgfinance->close();
    }
    private function edit_inventory()
    {
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $id = (int)$this->_request["id"];
        $stmt = $this->wgfinance->prepare("SELECT 
            product.ProductRID,
            product.CS_ProductRID,
            product.UPC,
            product.DeptCode,
            product.itemclass,
            product.itemloc,
            product.Description,
            product.VendorRID,
            product.Brand,
            product.UOMRID,
            product.UOMRIDMinor,
            product.UOMQty,
            product.UOMQtyMinor,
            product.UserRID,
            product.DrugType,
            product.ControlDrug,
            product.SRP1,
            product.SRP2,
            product.SRP3,
            product.SRP4,
            product.SRP5,
            product.SRP6,
            product.SRP7,
            product.SRP8,
            product.SRP9,
            product.SRP10,
            product.SRP11,
            product.SRP12,
            product.SRP13,
            product.SRP14,
            product.SRP15,
            product.SRP16,
            product.SRP17,
            product.SRP18,
            product.SRP19,
            product.SRP20,
            product.SRP1mup,
            product.SRP2mup,
            product.SRP3mup,
            product.SRP4mup,
            product.SRP5mup,
            product.SRP6mup,
            product.SRP7mup,
            product.SRP8mup,
            product.SRP9mup,
            product.SRP10mup,
            product.SRP11mup,
            product.SRP12mup,
            product.SRP13mup,
            product.SRP14mup,
            product.SRP15mup,
            product.SRP16mup,
            product.SRP17mup,
            product.SRP18mup,
            product.SRP19mup,
            product.SRP20mup,
            product.BestSRP,
            product.UnitBestSRP,
            product.UnitCost,
            product.BasedCost,
            product.UnTaxable,
            product.NotAllowedSenior,
            product.Dosage,
            product.MinStock,
            product.OpenSRP,
            product.SetCombo,
            product.LastCount,
            product.ShowVariance,
            product.LastCountDateTime,
            product.CSMinor,
            product.Foto,
            product.inactive,
            product.ExpiryDate,
            product.LotNumber,
            product.SeniorStandardSRP,
            product.Deleted,
            product.InvAccount
            FROM product WHERE product.ProductRID = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $rows = $row;
            }
            $this->response($this->json($rows), 200);
        } else {
            $this->response('', 204);
        }
        $stmt->close();
        $this->wgfinance->close();
    }
    private function add_inventory()
    {
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $product_obj = json_decode(file_get_contents("php://input"), true);
        $product_obj = str_replace("'", "`", $product_obj);

        // $id = (int)$product_obj["id"];
        $userid = (int)$product_obj["userid"];
        $description = (string)$product_obj["description"];
        $brand = (string)$product_obj["brand"];
        $dosage = (string)$product_obj["dosage"];
        $expiry = (string)$product_obj["expiry"];
        $supplier = (int)$product_obj["supplier"];
        $department = (int)$product_obj["department"];
        $classes = (int)$product_obj["classes"];
        $location = (int)$product_obj["location"];
        $untaxable = (int)$product_obj["untaxable"];
        $discountable = (int)$product_obj["discountable"];
        $opensrp = (int)$product_obj["opensrp"];
        $status = (int)$product_obj["status"];
        $combo = (int)$product_obj["combo"];
        $invaccount = (int)$product_obj["invaccount"];
        $upc =  (string)$product_obj["upc"];
        $units = (int)$product_obj["units"];
        $qunits = (float)$product_obj["qunits"];
        $munits = (int)$product_obj["munits"];
        $qmunits = (float)$product_obj["qmunits"];
        $stock_warn = (float)$product_obj["stock_warn"];
        $cost = (float)$product_obj["cost"];
        $bcost = (float)$product_obj["bcost"];
        $csminor = (float)$product_obj["csminor"];
        $lotnum = (string)$product_obj["lotnum"];
        $foto = (string)$product_obj["foto"];
        $drugtype = (string)$product_obj["drugtype"];

        // srp
        $srp1 = (float)$product_obj["srp1"];
        $srp2 = (float)$product_obj["srp2"];
        $srp3 = (float)$product_obj["srp3"];
        $srp4 = (float)$product_obj["srp4"];
        $srp5 = (float)$product_obj["srp5"];
        $srp6 = (float)$product_obj["srp6"];
        $srp7 = (float)$product_obj["srp7"];
        $srp8 = (float)$product_obj["srp8"];
        $srp9 = (float)$product_obj["srp9"];
        $srp10 = (float)$product_obj["srp10"];
        $srp11 = (float)$product_obj["srp11"];
        $srp12 = (float)$product_obj["srp12"];
        $srp13 = (float)$product_obj["srp13"];
        $srp14 = (float)$product_obj["srp14"];
        $srp15 = (float)$product_obj["srp15"];
        $srp16 = (float)$product_obj["srp16"];
        $srp17 = (float)$product_obj["srp17"];
        $srp18 = (float)$product_obj["srp18"];
        $srp19 = (float)$product_obj["srp19"];
        $srp20 = (float)$product_obj["srp20"];

        // markup srp
        $mupsrp1 = (float)$product_obj["mupsrp1"];
        $mupsrp2 = (float)$product_obj["mupsrp2"];
        $mupsrp3 = (float)$product_obj["mupsrp3"];
        $mupsrp4 = (float)$product_obj["mupsrp4"];
        $mupsrp5 = (float)$product_obj["mupsrp5"];
        $mupsrp6 = (float)$product_obj["mupsrp6"];
        $mupsrp7 = (float)$product_obj["mupsrp7"];
        $mupsrp8 = (float)$product_obj["mupsrp8"];
        $mupsrp9 = (float)$product_obj["mupsrp9"];
        $mupsrp10 = (float)$product_obj["mupsrp10"];
        $mupsrp11 = (float)$product_obj["mupsrp11"];
        $mupsrp12 = (float)$product_obj["mupsrp12"];
        $mupsrp13 = (float)$product_obj["mupsrp13"];
        $mupsrp14 = (float)$product_obj["mupsrp14"];
        $mupsrp15 = (float)$product_obj["mupsrp15"];
        $mupsrp16 = (float)$product_obj["mupsrp14"];
        $mupsrp17 = (float)$product_obj["mupsrp17"];
        $mupsrp18 = (float)$product_obj["mupsrp18"];
        $mupsrp19 = (float)$product_obj["mupsrp19"];
        $mupsrp20 = (float)$product_obj["mupsrp20"];

        $stmt = $this->wgfinance->prepare(
            "INSERT INTO product SET 
                UPC='$upc', 
                DeptCode='$department', 
                Description='$description', 
                itemclass='$classes', 
                itemloc='$location', 
                VendorRID='$supplier', 
                Brand='$brand',
                UOMRID='$units', 
                UOMRIDMinor='$munits', 
                UOMQty='$qunits', 
                UOMQtyMinor='$qmunits', 
                UserRID='$userid',
                UnitCost='$cost',
                BasedCost='$bcost',
                MinStock='$stock_warn',  
                UnTaxable='$untaxable', 
                NotAllowedSenior='$discountable', 
                OpenSRP='$opensrp', 
                inactive='$status',
                SetCombo='$combo', 
                CSMinor='$csminor', 
                Foto='$foto', 
                ExpiryDate='$expiry', 
                LotNumber='$lotnum', 
                Dosage='$dosage',
                InvAccount='$invaccount',
                DrugType='$drugtype',

                SRP1='$srp1', 
                SRP2='$srp2', 
                SRP3='$srp3', 
                SRP4='$srp4', 
                SRP5='$srp5', 
                SRP6='$srp6', 
                SRP7='$srp7', 
                SRP8='$srp8', 
                SRP9='$srp9', 
                SRP10='$srp10', 
                SRP11='$srp11', 
                SRP12='$srp12', 
                SRP13='$srp13', 
                SRP14='$srp14', 
                SRP15='$srp15', 
                SRP16='$srp16', 
                SRP17='$srp17', 
                SRP18='$srp18', 
                SRP19='$srp19', 
                SRP20='$srp20', 
                
                SRP1mup='$mupsrp1', 
                SRP2mup='$mupsrp2', 
                SRP3mup='$mupsrp3', 
                SRP4mup='$mupsrp4', 
                SRP5mup='$mupsrp5', 
                SRP6mup='$mupsrp6', 
                SRP7mup='$mupsrp7', 
                SRP8mup='$mupsrp8', 
                SRP9mup='$mupsrp9', 
                SRP10mup='$mupsrp10', 
                SRP11mup='$mupsrp11', 
                SRP12mup='$mupsrp12', 
                SRP13mup='$mupsrp13', 
                SRP14mup='$mupsrp14', 
                SRP15mup='$mupsrp15', 
                SRP16mup='$mupsrp16', 
                SRP17mup='$mupsrp17', 
                SRP18mup='$mupsrp18', 
                SRP19mup='$mupsrp19', 
                SRP20mup='$mupsrp20';"
        );
        $stmt->execute();
        $affected_rows = $stmt->affected_rows;
        $last_id = $this->wgfinance->insert_id;

        if ($affected_rows == 1) {
            $success = array('status' => "success", "item_id" => $last_id);
            $this->response($this->json($success), 200);
        } else {
            $arr = $stmt->error;
            print_r($arr);
            // $error = "error";
            // return $error;
        }

        $stmt->close();
        $this->wgfinance->close();
    }

    //home page
    private function recent_supplies()
    {
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $today = (string)$this->_request["today"];

        $stmt = $this->wgfinance->prepare(
            "SELECT 
         LPAD(product.Productrid, 5, '0') AS fileno,
         product.ProductRID,
         product.Description,
         product.Brand,
         product.UnitCost
         FROM product
         WHERE product.Deleted = 0 
         AND product.inactive = 0
         AND DATE(product.created_dt) = '$today'
         ORDER BY product.ProductRID DESC
         LIMIT 20"
        );
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }
            $this->response($this->json($rows), 200);
        } else {
            // $error = array('status' => "error", "msg" => "No results found");
            // $this->response($this->json($error), 404);
            $this->response('', 204);
        }
        $stmt->close();
        $this->wgfinance->close();
    }
    private function expired_supplies()
    {
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $stmt = $this->wgfinance->prepare(
            "SELECT 
            pb.BatchRID,
            pb.ProductRID,
            pb.LotNumber,
            pb.ExpiryDate,
            DATEDIFF(pb.ExpiryDate, CURDATE()) AS DaysBeforeExpiry,
            pb.QtyIn AS  QtyIn,
            pb.CSMinor AS  CSMinor,
            p.Description,
            p.Brand

            FROM product_batch pb
            LEFT JOIN product p ON p.ProductRID = pb.ProductRID
            WHERE p.Deleted = 0
            AND p.inactive = 0
            AND pb.Deleted = 0
            AND (pb.ExpiryDate != '' || pb.LotNumber != '');"
        );
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }
            $this->response($this->json($rows), 200);
        } else {
            $this->response('', 204);
        }
        $stmt->close();
        $this->wgfinance->close();
    }
    private function critical_supplies()
    {
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $stmt = $this->wgfinance->prepare(
            "SELECT 
            LPAD(p.Productrid, 5, '0') AS fileno,
            p.ProductRID,
            p.CSMinor,
            p.Description,
            p.Brand,
            DATE(p.updated_dt) AS updated_dt,
            p.MinStock

            FROM product p 
            WHERE p.Deleted = 0
            AND p.inactive = 0
            AND p.CSMinor <= p.MinStock
            LIMIT 20;"
        );
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }
            $this->response($this->json($rows), 200);
        } else {
            $this->response('', 204);
        }
        $stmt->close();
        $this->wgfinance->close();
    } */
    /** 
     *Encode array into JSON
     */
    private function json($data)
    {
        if (is_array($data)) {
            return json_encode($data);
        }
    }
    // return json with numbers aligning to string
    private function json_num($data)
    {
        if (is_array($data)) {
            return json_encode($data, JSON_NUMERIC_CHECK);
        }
    }
}
// initaite api process
$api = new API;
$api->processApi();
