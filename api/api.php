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
        date_default_timezone_set('Asia/Manila');
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
    private function login_user(){
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
       
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
    
    private function profile(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        $userid = (int)$this->_request["userid"];

        $stmt = $this->finfile_db->prepare(
            "SELECT
            user_id,
            full_name,
            email,
            user_name,
            password_hash,
            avatar_url, 
            created_at,
            is_trashed
            FROM users 
            WHERE is_trashed = 0
            AND user_id = $userid"
        );
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $rows = $row;
            }
            $this->response($this->json($rows), 200);
        } else { 
            $this->response('Failed to get user', 204);
        }
        $stmt->close();
        $this->finfile_db->close();
    }
    private function create_profile(){
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
            return;
        }

        $fullname = $_POST['fullname'];
        $email = $_POST['email'];
        $username = $_POST['username'];
        $password = md5($_POST['password']);
        
        try {

            $baseUploadDir = '../src/assets/images/'; 
            $relativeUploadDir = 'src/assets/images/'; 
                
            $check = "SELECT user_id FROM users 
            WHERE full_name = '$fullname' 
            AND email = '$email'";

            $pcheck = $this->finfile_db->prepare($check);
            $pcheck->execute();

            $result = $pcheck->get_result(); 

            if ($result->num_rows > 0) {
                return $this->response($this->json([
                    "success" => false,
                    "message" => "User with this email already exists"
                ]), 200);
            }

            $sql = "INSERT INTO users SET
                    full_name='$fullname',
                    email = '$email',
                    user_name = '$username',
                    password_hash = '$password',
                    avatar_url = '$relativeUploadDir';";  

            $stmt = $this->finfile_db->prepare($sql);
            $stmt->execute();

            $userId = $this->finfile_db->insert_id;

            if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
                $tmpName = $_FILES['avatar']['tmp_name'];
                $originalName = $_FILES['avatar']['name'];
                $ext = pathinfo($originalName, PATHINFO_EXTENSION);
    
                $cleanFullname = strtolower(preg_replace('/[^a-zA-Z0-9]/', '_', $fullname));
                $filename = preg_replace('/_+/', '_', $cleanFullname . '_' . $userId . '.' . $ext);
                $targetPath = $baseUploadDir . $filename;
    
                if (move_uploaded_file($tmpName, $targetPath)) {
                    $avatarPath = $relativeUploadDir . $filename;

                    $uupdate = "UPDATE users SET avatar_url = '$avatarPath' WHERE user_id = $userId";
                    $upStmt = $this->finfile_db->prepare($uupdate); 
                    $upStmt->execute();
                }
            } 
            $this->file_access_logs(0, $userId, "Create Account", "User", "create"); 
            return $this->response($this->json([
                "success" => true,
                "message" => "Account created successfully",
                "avatar" => $avatarPath
            ]), 200);

        }catch (PDOException $e){
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
        }
    }
    private function update_profile(){
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
            return;
        }

        $userid = $_POST['userid'];
        $fullname = $_POST['fullname'];
        $email = $_POST['email'];
        $username = $_POST['username'];
        $password = $_POST['password'];
        $oldavatar = $_POST['oldavatar'];
        $confirmpassword = md5($_POST['confirmpassword']);
        $newpassword = md5($_POST['newpassword']);

        try {

            $baseUploadDir = '../src/assets/images/';  
            $relativeUploadDir = 'src/assets/images/';  

            $avatarPath = "";
                
            if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
                $tmpName = $_FILES['avatar']['tmp_name'];
                $originalName = $_FILES['avatar']['name'];
                $ext = pathinfo($originalName, PATHINFO_EXTENSION);
    
                $cleanFullname = strtolower(preg_replace('/[^a-zA-Z0-9]/', '_', $fullname));
                $filename = preg_replace('/_+/', '_', $cleanFullname . '_' . $userid . '.' . $ext);
                $targetPath = $baseUploadDir . $filename;
    
                if (move_uploaded_file($tmpName, $targetPath)) {
                    $avatarPath = $relativeUploadDir . $filename;
                }
            } else{
                $avatarPath = $oldavatar;
            }
 
            if ($password  == $confirmpassword) {
                $uppass = "UPDATE users SET  
                password_hash = '$newpassword'
                WHERE user_id = $userid";
                $uppstmt = $this->finfile_db->prepare($uppass); 
                $uppstmt->execute();
                $this->file_access_logs(0, $userid, "Updated Profile Password", "User", "update"); 
                return $this->response($this->json([
                    "success" => true,
                    "message" => "Profile update successfully", 
                ]), 200);

            } else if(!$_POST['confirmpassword'] && !$_POST['newpassword']){

                $uppass = "UPDATE users SET 
                avatar_url = '$avatarPath',
                email = '$email',
                user_name = '$username',
                full_name = '$fullname'
                WHERE user_id = $userid";
                $upStmt = $this->finfile_db->prepare($uppass); 
                $upStmt->execute();
                $this->file_access_logs(0, $userid, "Updated Profile Info", "User", "update"); 
                return $this->response($this->json([
                    "success" => true,
                    "message" => "Profile update successfully", 
                ]), 200);
            } else {
                return $this->response($this->json([
                    "success" => false,
                    "message" => "Old Password is not equal to Confirm Password", 
                ]), 200);
            }
        }catch (PDOException $e){
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
        }
    }
    private function remove_avatar(){

        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
            return;
        }

        $userobj = json_decode(file_get_contents("php://input"), true);
        $userobj = str_replace("'", "`", $userobj);
        
        $userid = (string)$userobj["userid"];
        $path = (string)$userobj["path"];

        try {

            $sql = "UPDATE users SET avatar_url = null WHERE user_id = $userid";
            $stmt = $this->finfile_db->prepare($sql); 
            $stmt->execute(); 

            unlink('../'.$path);

            return $this->response($this->json(["status" => "success"]), 200);
        } catch (PDOException $e) {
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
        }
    }

    /* files */
    private function file_list(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        $categoryid = (int)$this->_request["categoryid"]; 
        $teamid = (int)$this->_request["teamid"]; 
        $userid = (int)$this->_request["userid"]; 

        if($categoryid > 0){
            $filterCateg = "AND fs.category_id = $categoryid";
        }else{
            $filterCateg = "";
        }
        if($teamid > 0){
            $filtertm = "AND fs.team_id = $teamid";
        }else{
            $filtertm = "";
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
            fs.module_type,
            sw.full_name AS shared_with,
            luby.full_name AS last_updated_by,
            ux.full_name AS file_owner
            FROM files fs
            LEFT JOIN shared_files sf ON sf.shared_id = fs.shared_id
            LEFT JOIN users sw ON sw.user_id = sf.shared_with
            LEFT JOIN users luby ON luby.user_id = fs.last_updated_by
            LEFT JOIN users ux ON ux.user_id = fs.owner_id
            WHERE fs.is_trashed = 0
            AND fs.owner_id = $userid
            $filterCateg $filtertm
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
        $fullfl_name = (string)$fnobj["fullfl_name"];  
        $username = (string)$fnobj["username"];  

        try {

            foreach($personid as $ushareid){

                $sfselect = "SELECT shared_id AS sharedid 
                FROM shared_files 
                WHERE file_id = $fileid 
                AND shared_with = $ushareid";
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
                        shared_location = 'Shared File',
                        permission = '$permission';";

                    $this->finfile_db->prepare($sql)->execute(); 
                }
                $message = "$username shared the file $fullfl_name with you.";
                $this->notifications($ushareid, $userid, "Shared File", $message, "shared_file", $fileid, "File", "share", "app.myfiles.files");
                $this->file_access_logs($fileid, $userid, "Shared File", "File", "share"); 
            }
           
            return $this->response($this->json(["status" => "success"]), 200);
        } catch (PDOException $e) {
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
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
                    $this->file_access_logs($fileid, $userid, "Updated File", "File", "update"); 
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
            $this->file_access_logs($fileid, $userid, "Removed File", "File", "remove"); 
            return $this->response($this->json(["status" => "success"]), 200);
        } catch (PDOException $e) {
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
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
        $userid = (int)$fnobj["userid"]; 

        $fselect = "SELECT 
            fs.file_name AS filenames, 
            fc.category_name AS categname
            FROM files fs
            LEFT JOIN file_categories fc ON fc.category_id = fs.category_id
            WHERE fs.file_id = $fileid 
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
            $this->file_access_logs($fileid, $userid, "Downloaded File", "File", "download"); 
            $this->response($this->json(["success" => $publicUrl]), 200);
        } else { 
            $this->response('Failed to get file list', 204);
        }
       
    }
    private function upload_file(){
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
            return;
        }

        $user_id = $_POST['user_id'];
        $categid = $_POST['category_id']? $_POST['category_id'] : 'NULL';
        $categpath = $_POST['category_path'] . '/';
        $categname = $_POST['category_name'];
        
        try {

            if (empty($user_id)) {
                $callback = array("callback" => 'Invalid user ID');
                $this->response($this->json($callback), 400);
                return;
            }

            $baseUploadDir = '../uploads/' . $user_id . '/'; 

            if (!file_exists($baseUploadDir) && !mkdir($baseUploadDir, 0755, true)) {
                return $this->response($this->json(["error" => "Failed to create upload directory"]), 500);
            }

            if (!isset($_FILES['files']) || !is_array($_FILES['files']['name'])) {
                return $this->response($this->json(["error" => "No files uploaded"]), 400);
            }

            $uploadedFiles = [];

            foreach ($_FILES['files']['name'] as $index => $name) {
                $error = $_FILES['files']['error'][$index];
                $tmpName = $_FILES['files']['tmp_name'][$index];

                if ($error === UPLOAD_ERR_OK) {

                    $filename = basename($name);
                    $targetPath = $categpath . $filename;
                    $fileExtension = pathinfo($name, PATHINFO_EXTENSION);
                    $fileSize = $_FILES['files']['size'][$index];
 

                    $check = "SELECT file_id FROM files WHERE file_name = '$filename' AND file_size = $fileSize AND file_type = '$fileExtension' AND owner_id = $user_id";
                    $pcheck = $this->finfile_db->prepare($check);
                    $pcheck->execute();

                    $result = $pcheck->get_result(); 

                    if ($result->num_rows > 0){

                        $row = $result->fetch_assoc();

                        $rowfileid = $row['file_id'];

                        if($rowfileid > 0){
                            $sql = "UPDATE files SET
                            is_trashed = 0,
                            file_type = '$fileExtension',
                            file_path = '$targetPath',
                            file_size = $fileSize,
                            last_updated_by = $user_id,
                            category_id = $categid,
                            owner_id = $user_id,
                            uploaded_at = NOW()
                            WHERE file_name = '$filename' 
                            AND file_size = $fileSize 
                            AND file_type = '$fileExtension'
                            AND is_trashed = 1;";  

                            $stmt = $this->finfile_db->prepare($sql);
                            $stmt->execute();

                            $this->file_access_logs($rowfileid, $user_id, "Upload File", "File", "upload"); 

                        }else{
                            if (move_uploaded_file($tmpName, $targetPath)) {
                            
                                $sql = "INSERT INTO files SET
                                file_name='$filename',
                                file_type = '$fileExtension',
                                file_path = '$targetPath',
                                file_size = $fileSize,
                                file_location = '$categname',
                                last_updated_by = $user_id,
                                category_id = $categid,
                                owner_id = $user_id,
                                uploaded_at = NOW(),;";  

                                $stmt = $this->finfile_db->prepare($sql);
                                $stmt->execute();

                                $fileid = $this->finfile_db->insert_id;

                                $this->file_access_logs($fileid, $user_id, "Upload File", "File", "upload"); 
                                
                                $uploadedFiles[] = $filename;
                            }
                        }
                    }else{
                        if (move_uploaded_file($tmpName, $targetPath)) {
                            
                            $sql = "INSERT INTO files SET
                            file_name='$filename',
                            file_type = '$fileExtension',
                            file_path = '$targetPath',
                            file_size = $fileSize,
                            file_location = '$categname',
                            last_updated_by = $user_id,
                            category_id = $categid,
                            owner_id = $user_id,
                            uploaded_at = NOW();";  

                            $stmt = $this->finfile_db->prepare($sql);
                            $stmt->execute();

                            $fileid =  $this->finfile_db->insert_id;

                            $this->file_access_logs($fileid, $user_id, "Upload File", "File", "upload"); 
                            
                            $uploadedFiles[] = $filename;
                        }
                    }
                    
                }
            }
            if($categid > 0){
                $this->calfolder_size($categid, $categpath); 
            }
        }catch (PDOException $e){
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
        }
    }
    private function is_favorite(){
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $fnobj = json_decode(file_get_contents("php://input"), true);
        $fnobj = str_replace("'", "`", $fnobj);

        $id = (int)$fnobj["id"];
        $userid = (int)$fnobj["userid"];  
        $favorite = (int)$fnobj["favorite"];  
        $moduletype = (string)$fnobj["moduletype"]; 
        
        $action = $favorite == 1 ? "Marked as Favorite" : "Removed from Favorite";
        $module = $moduletype == 1 ? "File" : ($moduletype == 2 ? "Folder" : "Shared");

        try{

            if($moduletype == 1){
                $sql = "UPDATE files SET is_favorite = $favorite , last_updated_by = $userid WHERE file_id= $id ;";
            }else if($moduletype == 2){
                $sql = "UPDATE file_categories SET is_favorite = $favorite , last_updated_by = $userid WHERE category_id= $id ;";
            }else{
                $sql = "UPDATE shared_files SET is_favorite = $favorite WHERE file_id= $id AND shared_with = $userid;";
            }
            
            $stmt = $this->finfile_db->prepare($sql);
            $stmt->execute();

            $affected_rows = $stmt->affected_rows; 

            if ($affected_rows == 1) {
                $this->file_access_logs($id, $userid, $action, $module, "favorite");
                $success = array('status' => "success");
                $this->response($this->json($success), 200);
            } else { 
                $this->response('Failed to update files', 204);
            }

            $fpselect->close();
            $this->finfile_db->close();
        }catch (PDOException $e){
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
        }
    }

    /* folders */
    private function folder_list(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        $userid = (int)$this->_request["userid"];

        $stmt = $this->finfile_db->prepare(
            "SELECT
            fc.category_id,
            fc.category_name,
            fc.category_path,
            fc.category_size, 
            fc.last_modified,
            fc.is_favorite,
            fc.module_type,
            sw.full_name AS shared_with,
            luby.full_name AS last_updated_by,
            ux.full_name AS file_owner
            FROM file_categories fc
            LEFT JOIN shared_files sf ON sf.shared_id = fc.shared_id
            LEFT JOIN users sw ON sw.user_id = sf.shared_with
            LEFT JOIN users luby ON luby.user_id = fc.last_updated_by
            LEFT JOIN users ux ON ux.user_id = fc.owner_id
            WHERE fc.is_trashed = 0 AND fc.owner_id = $userid
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
    private function new_folder(){
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $fnobj = json_decode(file_get_contents("php://input"), true);
        $fnobj = str_replace("'", "`", $fnobj);

        $foldername = (string)$fnobj["foldername"]; 
        $userid = (int)$fnobj["userid"];

        $baseUploadDir = '../uploads/' . $userid . '/';

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
                        category_location = 'My Files',
                        owner_id = $userid,
                        last_updated_by = $userid;";

            $stmt = $this->finfile_db->prepare($sql);
            $stmt->execute();

            $affected_rows = $stmt->affected_rows;
            $last_id = $this->finfile_db->insert_id;
           
            if ($affected_rows == 1) { 
 
                $this->file_access_logs($last_id, $userid, "Created Folder", "Folder", "create"); 
                $this->response($this->json(["status" => "success", "folder_id" => $last_id]), 200);
                
            } else { 
                $this->response('Failed to create folder', 204);
            }
            
        }
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
        $categname = (string)$fnobj["categname"];  
        $username = (string)$fnobj["username"];  

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

                    $this->file_access_logs($categoryid, $userid, "Shared Folder", "Folder", "share");
                    
                }else{
                    
                    $sql = "INSERT INTO shared_files SET 
                        category_id = $categoryid,
                        shared_by = $userid,
                        shared_with = $ushareid,
                        shared_location = 'Shared Folder',
                        permission = '$permission';";

                    $this->finfile_db->prepare($sql)->execute();

                    $last_id = $this->finfile_db->insert_id;

                    if($last_id > 0){

                        $sql2 = "UPDATE files SET 
                                    shared_id = $last_id,
                                    last_updated_by = $userid
                                WHERE category_id = $categoryid";

                        $this->finfile_db->prepare($sql2)->execute();

                        $this->file_access_logs($categoryid, $userid, "Shared Folder", "Folder", "share"); 
                    }
                }
            }
            $message = "$username shared the file $categname with you.";
            $this->notifications($ushareid, $userid, "Shared Folder", $message, "shared_folder", $categoryid, "Folder", "share", "app.myfiles.folder");
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
                $this->file_access_logs($categoryid, $userid, "Updated Folder", "Folder", "update"); 
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

            $this->file_access_logs($categoryid, $userid, "Removed Folder", "Folder", "remove"); 
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
        $categoryid = (int)$fnobj["categoryid"]; 
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

            $urlLink = 'http://' . $_SERVER['HTTP_HOST'] . '/finfile/temp/' . $name . '.zip';
            $pathLink = $_SERVER['DOCUMENT_ROOT'] . '/finfile/temp/' . $name . '.zip';
            $this->response($this->json(["urlLink" => $urlLink, "pathLink" => $pathLink]), 200);  
            $this->file_access_logs($categoryid, $userid, "Downloaded Folder", "Folder", "download"); 
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to create ZIP"]);
            exit;
        }
    }

    /* recent uploads */
    private function recent_list(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        $userid = (int)$this->_request["userid"]; 
 
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
            fs.module_type,
            fs.last_modified, 
            luby.full_name AS file_owner,
            fc.category_name
            FROM files fs
            LEFT JOIN file_categories fc ON fc.category_id = fs.category_id  
            LEFT JOIN users luby ON luby.user_id = fs.owner_id
            WHERE fs.is_trashed = 0 AND fs.owner_id = $userid
            ORDER BY fs.uploaded_at DESC" 
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
    private function shared_recent_list(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        $userid = (int)$this->_request["userid"];
 
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
            luby.full_name AS file_owner,
            fc.category_name
            FROM shared_files sf
            LEFT JOIN files fs ON fs.file_id = sf.file_id
            LEFT JOIN file_categories fc ON fc.category_id = fs.category_id  
            LEFT JOIN users luby ON luby.user_id = fs.owner_id
            WHERE fs.is_trashed = 0 AND sf.shared_with = $userid
            ORDER BY fs.uploaded_at DESC" 
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

    /* trash */
    private function trash_list(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
 
        $userid = (int)$this->_request["userid"]; 

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
            fs.module_type,
            sw.full_name AS shared_with,
            luby.full_name AS last_updated_by,
            ux.full_name AS file_owner
            FROM files fs
            LEFT JOIN shared_files sf ON sf.shared_id = fs.shared_id
            LEFT JOIN users sw ON sw.user_id = sf.shared_with
            LEFT JOIN users luby ON luby.user_id = fs.last_updated_by
            LEFT JOIN users ux ON ux.user_id = fs.owner_id
            WHERE fs.is_trashed = 1 AND fs.owner_id = $userid 
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
    private function trashfolder_list(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        $userid = (int)$this->_request["userid"];

        $stmt = $this->finfile_db->prepare(
            "SELECT
            fc.category_id,
            fc.category_name,
            fc.category_path,
            fc.category_size, 
            fc.last_modified,
            fc.owner_id,
            fc.module_type,
            sw.full_name AS shared_with,
            luby.full_name AS last_updated_by,
            ux.full_name AS file_owner
            FROM file_categories fc
            LEFT JOIN shared_files sf ON sf.shared_id = fc.shared_id
            LEFT JOIN users sw ON sw.user_id = sf.shared_with
            LEFT JOIN users luby ON luby.user_id = fc.last_updated_by
            LEFT JOIN users ux ON ux.user_id = fc.owner_id
            WHERE fc.is_trashed = 1 AND fc.owner_id = $userid
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
    private function restore_files(){
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $fnobj = json_decode(file_get_contents("php://input"), true);
        $fnobj = str_replace("'", "`", $fnobj);

        $categoryid = (int)$fnobj["categid"];
        $fileid = (int)$fnobj["fileid"];
        $userid = (int)$fnobj["userid"];  
        $ids =  $categoryid > 0? $categoryid : $fileid;
        $remarks =  $categoryid > 0? "Restored Folder" : "Restored File";
        $types =  $categoryid > 0? "Folder" : "File";

        try {
            if ($categoryid > 0) {
                 
                $stmt1 = $this->finfile_db->prepare("UPDATE file_categories SET is_trashed = 0 WHERE category_id = $categoryid");
                $stmt1->execute();

                $stmt2 = $this->finfile_db->prepare("UPDATE files SET is_trashed = 0 WHERE category_id = $categoryid");
                $stmt2->execute();
            } else { 

                $stmt2 = $this->finfile_db->prepare("UPDATE files SET is_trashed = 0 WHERE file_id = $fileid");
                $stmt2->execute();
            }
            $this->file_access_logs($ids, $userid, $remarks, $types, "restore");
            return $this->response($this->json(["status" => "success"]), 200);
        } catch (PDOException $e) {
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
        }
    }
    private function delete_forever(){
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $fnobj = json_decode(file_get_contents("php://input"), true);
        $fnobj = str_replace("'", "`", $fnobj);

        $categoryid = (int)$fnobj["categid"];
        $fileid = (int)$fnobj["fileid"];
        $userid = (int)$fnobj["userid"];  
        $path = (string)$fnobj["path"];  
        $ids =  $categoryid > 0? $categoryid : $fileid;
        $remarks =  $categoryid > 0? "Deleted Forever Folder" : "Deleted Forever File";
        $types =  $categoryid > 0? "Folder" : "File";

        try {
            if ($categoryid > 0) {
                $stmt3 = $this->finfile_db->prepare("DELETE FROM shared_files WHERE category_id = $categoryid OR file_id = $userid");
                $stmt3->execute();

                $stmt2 = $this->finfile_db->prepare("DELETE FROM files WHERE category_id = $categoryid OR file_id = $userid ");
                $stmt2->execute();

                $stmt1 = $this->finfile_db->prepare("DELETE FROM file_categories WHERE category_id = $categoryid");
                $stmt1->execute();
            } else {

                $stmt3 = $this->finfile_db->prepare("DELETE FROM shared_files WHERE file_id = $fileid");
                $stmt3->execute();

                $stmt2 = $this->finfile_db->prepare("DELETE FROM files WHERE file_id = $fileid");
                $stmt2->execute();
            }

            $dirPath = $_SERVER['DOCUMENT_ROOT'] . $path;

            echo $dirPath;

            if (is_dir($dirPath)) {
                $this->delete_directory($dirPath);
            } elseif (is_file($dirPath)) {
                unlink($dirPath);
            } 
            $this->file_access_logs($ids, $userid, $remarks, $types, "remove");
            return $this->response($this->json(["status" => "success"]), 200);
        } catch (PDOException $e) {
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
        }
    }
    private function delete_directory($dirPath) {
        if (!is_dir($dirPath)) {
            return false;
        }

        $files = array_diff(scandir($dirPath), array('.', '..'));

        foreach ($files as $file) {
            $filePath = $dirPath . DIRECTORY_SEPARATOR . $file;

            if (is_dir($filePath)) {
                $this->delete_directory($filePath);
            } else {
                unlink($filePath);
            }
        }
        return rmdir($dirPath);
    }

    /* shared folder */
    private function sharedfolder_list(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        } 
        $userid = (int)$this->_request["userid"]; 

        $stmt = $this->finfile_db->prepare(
            "SELECT
            sf.shared_id, 
            sf.shared_by, 
            sf.category_id, 
            fc.category_name,
            fc.category_path,
            sf.shared_at, 
            sf.permission,
            sf.module_type,
            ui.full_name AS shared_by_name,
            ux.full_name AS shared_with_name
            FROM shared_files sf
            LEFT JOIN file_categories fc ON fc.category_id = sf.category_id
            LEFT JOIN users ui ON ui.user_id = sf.shared_by
            LEFT JOIN users ux ON ux.user_id = sf.shared_with
            WHERE (sf.shared_with = $userid OR sf.shared_by = $userid )
            AND sf.category_id > 0
            ORDER BY sf.shared_id;"
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
    private function sharedfolder_files(){
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
            fs.module_type,
            sw.full_name AS shared_with,
            luby.full_name AS last_updated_by,
            ux.full_name AS file_owner
            FROM files fs
            LEFT JOIN shared_files sf ON sf.shared_id = fs.shared_id
            LEFT JOIN users sw ON sw.user_id = sf.shared_with
            LEFT JOIN users luby ON luby.user_id = fs.last_updated_by
            LEFT JOIN users ux ON ux.user_id = fs.owner_id
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
    private function sharedfolder_remove(){
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $fnobj = json_decode(file_get_contents("php://input"), true);
        $fnobj = str_replace("'", "`", $fnobj);

        $categoryid = (int)$fnobj["categoryid"];
        $ushareid = (int)$fnobj["ushareid"];
        $userid = (int)$fnobj["userid"];  
        $username = (string)$fnobj["username"];  
        $categname = (string)$fnobj["categname"];  

        try {
            $sql = "DELETE FROM shared_files WHERE category_id= $categoryid AND (shared_with = $userid OR shared_by = $userid);";

            $this->finfile_db->prepare($sql)->execute();

            $this->file_access_logs($categoryid, $userid, "Shared Folder Remove", "Folder", "remove");
            $message = "$username remove the shared file $categname with you.";
            $this->notifications($ushareid, $userid, "Remove Shared Folder", $message, "remove_shared_folder", $categoryid, "Folder", "remove_share", "app.shared_folder");
            return $this->response($this->json(["status" => "success"]), 200);
        } catch (PDOException $e) {
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
        }
    }

    /* shared files */
    private function sf_list(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        } 
        $userid = (int)$this->_request["userid"]; 

        $stmt = $this->finfile_db->prepare(
            "SELECT
            sf.shared_id, 
            sf.shared_by, 
            sf.shared_with, 
            sf.file_id, 
            sf.is_favorite,
            fs.file_name,
            fs.file_path,
            fs.file_type,
            sf.shared_at, 
            sf.permission,
            sf.module_type,
            ui.full_name AS shared_by_name,
            ux.full_name AS shared_with_name
            FROM shared_files sf
            LEFT JOIN files fs ON fs.file_id = sf.file_id
            LEFT JOIN users ui ON ui.user_id = sf.shared_by
            LEFT JOIN users ux ON ux.user_id = sf.shared_with
            WHERE (sf.shared_with = $userid OR sf.shared_by = $userid) 
            AND sf.file_id > 0
            ORDER BY sf.shared_id;"
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
    private function sf_remove(){
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $fnobj = json_decode(file_get_contents("php://input"), true);
        $fnobj = str_replace("'", "`", $fnobj);

        $fileid = (int)$fnobj["fileid"];
        $ushareid = (int)$fnobj["ushareid"];
        $userid = (int)$fnobj["userid"];  
        $username = (string)$fnobj["username"];  
        $filename = (string)$fnobj["filename"]; 

        try {
            $sql = "DELETE FROM shared_files WHERE file_id= $fileid AND (shared_with = $userid OR shared_by = $userid);";

            $this->finfile_db->prepare($sql)->execute();
            $this->file_access_logs($fileid, $userid, "Shared File Remove", "File", "remove");
            $message = "$username remove the shared file $filename with you.";
            $this->notifications($ushareid, $userid, "Remove Shared File", $message, "remove_shared_file", $fileid, "File", "remove_share", "app.shared_files");

            return $this->response($this->json(["status" => "success"]), 200);
        } catch (PDOException $e) {
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
        }
    }


    /* favorite */
    private function files_favorite(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
 
        $userid = (int)$this->_request["userid"]; 

        $stmt = $this->finfile_db->prepare(
            "SELECT 
            fs.file_id AS id, 
            LEFT(fs.file_name, LOCATE('.', fs.file_name) - 1) AS names,
            fs.file_type AS ftype,
            fs.file_path AS fpath,
            fs.file_size AS fsize,
            fs.file_location AS locations,
            fs.is_favorite,  
            fs.last_modified,
            fs.owner_id AS ownerid,
            fs.module_type,
            luby.full_name AS last_updated_by,
            ux.full_name AS ownername
            FROM files fs
            LEFT JOIN users luby ON luby.user_id = fs.last_updated_by
            LEFT JOIN users ux ON ux.user_id = fs.owner_id
            WHERE fs.is_trashed = 0 AND fs.is_favorite = 1 AND fs.owner_id = $userid 
            ORDER BY fs.file_id;"
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
    private function folder_favorite(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        $userid = (int)$this->_request["userid"];

        $stmt = $this->finfile_db->prepare(
            "SELECT
            fc.category_id AS id,
            fc.category_name AS names,
            'folder' AS ftype, 
            fc.category_path AS fpath,
            fc.category_size AS fsize, 
            fc.category_location AS locations,
            fc.is_favorite,  
            fc.last_modified,
            fc.owner_id AS ownerid,
            fc.module_type,
            luby.full_name AS last_updated_by,
            ux.full_name AS ownername
            FROM file_categories fc  
            LEFT JOIN users luby ON luby.user_id = fc.last_updated_by
            LEFT JOIN users ux ON ux.user_id = fc.owner_id
            WHERE fc.is_trashed = 0 AND fc.is_favorite = 1 AND fc.owner_id = $userid
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
    private function sf_favorites(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        } 
        $userid = (int)$this->_request["userid"]; 

        $stmt = $this->finfile_db->prepare(
            "SELECT 
            COALESCE(fs.file_id, fc.category_id) AS id, 
            COALESCE(LEFT(fs.file_name, LOCATE('.', fs.file_name) - 1), fc.category_name) AS names,
            COALESCE(fs.file_type, 'folder') AS ftype,  
            COALESCE(fs.file_path, fc.category_path) AS fpath,
            COALESCE(fs.file_size, fc.category_size) AS fsize, 
            sf.shared_at AS last_modified,
            sf.shared_location AS locations,
            sf.is_favorite,  
            sf.shared_by AS ownerid,
            sf.module_type,
           	uo.full_name AS ownername,  
            ux.full_name AS shared_with_name,
            sf.permission
            FROM shared_files sf
            LEFT JOIN files fs ON fs.file_id = sf.file_id AND fs.is_trashed = 0
            LEFT JOIN file_categories fc ON fc.category_id = sf.category_id AND fc.is_trashed = 0
            LEFT JOIN users ui ON ui.user_id = sf.shared_by
            LEFT JOIN users ux ON ux.user_id = sf.shared_with
            LEFT JOIN users uo ON uo.user_id = fs.owner_id OR uo.user_id = fc.owner_id
            WHERE sf.shared_with = $userid AND sf.is_favorite = 1
            ORDER BY sf.shared_id;"
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
    private function remove_favorite(){
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $fnobj = json_decode(file_get_contents("php://input"), true);
        $fnobj = str_replace("'", "`", $fnobj);

        $id = (int)$fnobj["id"];
        $moduletype = (int)$fnobj["moduletype"];
        $userid = (int)$fnobj["userid"];   
        $module = $moduletype == 1 ? "File" : ($moduletype == 2 ? "Folder" : "Shared");

        try {

            if($moduletype == 1){
                $fsql = "UPDATE files SET 
                        is_trashed = 1,
                        last_updated_by = $userid
                        WHERE file_id= $id;";

                $this->finfile_db->prepare($fsql)->execute();
                
            }else if($moduletype == 2){
                $fcsql = "UPDATE file_categories SET 
                        is_trashed = 1,
                        last_updated_by = $userid
                        WHERE category_id= $id;";

                $this->finfile_db->prepare($fcsql)->execute();
        
                $fsql = "UPDATE files SET 
                            is_trashed = 1,
                            last_updated_by = $userid
                        WHERE category_id = $id";

                $this->finfile_db->prepare($fsql)->execute();
                
            }else{
                $sql = "DELETE FROM shared_files WHERE (file_id= $id OR category_id = $id) AND shared_with = $userid;";

                $this->finfile_db->prepare($sql)->execute();
            }
            $this->file_access_logs($id, $userid, "Removed from Favorite", $module, "remove");
            return $this->response($this->json(["status" => "success"]), 200);
        } catch (PDOException $e) {
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
        }
    }

    /* team folder */
    private function team_list(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
 
        $userid = (int)$this->_request["userid"];  

        $stmt = $this->finfile_db->prepare(
            "SELECT
            ts.team_id,
            ts.team_name,
            ts.created_at,
            ts.created_by,  
            ts.team_size, 
            ux.full_name AS createdname
            FROM teams ts 
            LEFT JOIN team_members tms ON tms.team_id = ts.team_id
            LEFT JOIN users ux ON ux.user_id = ts.created_by
            WHERE ts.is_trashed = 0 AND tms.user_id = $userid
            ORDER BY ts.team_id"
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
    private function team_members(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
 
        $teamid = (int)$this->_request["teamid"];  

        $stmt = $this->finfile_db->prepare(
            "SELECT
            tm.team_id,
            tm.user_id, 
            tm.added_at,
            ux.full_name AS teammname
            FROM team_members tm 
            LEFT JOIN users ux ON ux.user_id = tm.user_id
            WHERE tm.team_id = $teamid"
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
    private function team_add(){
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $fnobj = json_decode(file_get_contents("php://input"), true);
        $fnobj = str_replace("'", "`", $fnobj);

        $teamuserid = (array)$fnobj["teamuserid"];
        $teamid = (int)$fnobj["teamid"];
        $userid = (int)$fnobj["userid"];

        try {
            foreach($teamuserid as $tmid){

                $tmselet = "SELECT team_id FROM team_members WHERE team_id = $teamid AND user_id = $tmid";
                $tmpselect = $this->finfile_db->prepare($tmselet);

                $result = $tmpselect->get_result();

                if ($result->num_rows > 0) { 
                } else {  
                    $tmsql1 = "INSERT INTO team_members SET 
                    team_id = $teamid,
                    user_id = $tmid,
                    added_at = NOW();";
                    $tmstmt1 = $this->finfile_db->prepare($tmsql1);
                    $tmstmt1->execute();
                }
            } 
            $this->file_access_logs($teamid, $userid, "Add Team Members", "Team Folder", "add");
            return $this->response($this->json(["status" => "success"]), 200);
        } catch (PDOException $e) {
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
        }
    }
    private function create_teamfolder(){
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $fnobj = json_decode(file_get_contents("php://input"), true);
        $fnobj = str_replace("'", "`", $fnobj);

        $teamemberid = (array)$fnobj["teamemberid"];
        $foldername = (string)$fnobj["foldername"];
        $username = (string)$fnobj["username"];
        $userid = (int)$fnobj["userid"];

        $baseUploadDir = '../uploads/';

        $fullPath = $baseUploadDir . $foldername;

        if (!is_dir($fullPath)) {
            if (!mkdir($fullPath, 0777, true)) {
                $callback = array("callback" => 'Invalid user ID');
                $this->response($this->json($callback), 400);
                return;
            }
          
            $sql = "INSERT INTO teams SET 
                        team_name='$foldername',
                        created_by = $userid,
                        created_at = NOW();";

            $stmt = $this->finfile_db->prepare($sql);
            $stmt->execute();

            $affected_rows = $stmt->affected_rows;
            $teamid = $this->finfile_db->insert_id;

            if ($affected_rows == 1) {

                $tmsql = "INSERT INTO team_members SET 
                        team_id = $teamid,
                        user_id = $userid,
                        added_at = NOW();";

                $tmstmt = $this->finfile_db->prepare($tmsql);
                $tmstmt->execute();

                foreach($teamemberid as $tmid){
                    $tmsql1 = "INSERT INTO team_members SET 
                        team_id = $teamid,
                        user_id = $tmid,
                        added_at = NOW();";

                    $tmstmt1 = $this->finfile_db->prepare($tmsql1);
                    $tmstmt1->execute(); 

                    $message = "$username created a team folder $foldername and shared it with you.";
                    $this->notifications($tmid, $userid, "Team Folder Created", $message, "team_folder_created", $teamid, "Folder", "share", "app.team_folders");
                }
            $this->file_access_logs($teamid, $userid, "Create Team Folder", "Team Folder", "create");
            $success = array('status' => "success", "folder_id" => $teamid);
            $this->response($this->json($success), 200);
            } else { 
                $this->response('Failed to create folder', 204);
            }

            $stmt->close();
            $this->finfile_db->close();
        }
    }
    private function upload_team() {
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
            return;
        }
    
        $user_id = $_POST['user_id']; 
        $teamid = $_POST['team_id'];
        $teamname = $_POST['team_name'];
        $username = $_POST['user_name'];
    
        if (empty($user_id)) {
            $callback = array("callback" => 'Invalid user ID');
            $this->response($this->json($callback), 400);
            return;
        }
    
        $baseUploadDir = '../uploads/' . $teamname . '/'; 
    
        if (!is_dir($baseUploadDir)) {
            mkdir($baseUploadDir, 0777, true);
        }
    
        if (!isset($_FILES['files']) || !is_array($_FILES['files']['name'])) {
            return $this->response($this->json(["error" => "No files uploaded"]), 400);
        }
    
        try {
            $uploadedFiles = [];
    
            // Fetch team member IDs once
            $sql = "SELECT user_id FROM team_members WHERE team_id = $teamid";
            $stmt = $this->finfile_db->prepare($sql);
            $stmt->execute();
            $result = $stmt->get_result();
            $team_member_ids = [];
            while ($row = $result->fetch_assoc()) {
                $team_member_ids[] = $row['user_id'];
            }
    
            foreach ($_FILES['files']['name'] as $index => $name) {
                $error = $_FILES['files']['error'][$index];
                $tmpName = $_FILES['files']['tmp_name'][$index];
    
                if ($error === UPLOAD_ERR_OK) {
                    $filename = basename($name);
                    $fileExtension = pathinfo($filename, PATHINFO_EXTENSION);
                    $fileSize = $_FILES['files']['size'][$index];
                    $targetPath = $baseUploadDir . $filename;
    
                    $check = "SELECT file_id FROM files WHERE file_name = '$filename' 
                        AND file_size = $fileSize AND file_type = '$fileExtension' 
                        AND owner_id = $user_id AND team_id = $teamid";
                    $pcheck = $this->finfile_db->prepare($check);
                    $pcheck->execute();
                    $result = $pcheck->get_result(); 
    
                    if ($result->num_rows > 0) {
                        $row = $result->fetch_assoc();
                        $rowfileid = $row['file_id'];
    
                        if ($rowfileid > 0) {
                            $sql = "UPDATE files SET
                                is_trashed = 0,
                                file_type = '$fileExtension',
                                file_path = '$targetPath',
                                file_size = $fileSize,
                                last_updated_by = $user_id,
                                team_id = $teamid,
                                owner_id = $user_id,
                                uploaded_at = NOW()
                                WHERE file_name = '$filename' 
                                AND file_size = $fileSize 
                                AND file_type = '$fileExtension'
                                AND is_trashed = 1";  
    
                            $stmt = $this->finfile_db->prepare($sql);
                            $stmt->execute();
    
                            $this->file_access_logs($rowfileid, $user_id, "Team Upload File", "Team File", "upload");
    
                            $message = "$username uploaded $filename to the team folder $teamname.";
                            foreach ($team_member_ids as $tmid) {
                                $this->notifications($tmid, $user_id, "File Uploaded", $message, "file_upload", $teamid, "Folder", "upload", "app.team_folders");
                            }
                        } else {
                            if (move_uploaded_file($tmpName, $targetPath)) {
                                $sql = "INSERT INTO files SET
                                    team_id = $teamid,
                                    file_name = '$filename',
                                    file_type = '$fileExtension',
                                    file_path = '$targetPath',
                                    file_size = $fileSize,
                                    file_location = '$teamname',
                                    last_updated_by = $user_id,
                                    owner_id = $user_id,
                                    uploaded_at = NOW()";  
    
                                $stmt = $this->finfile_db->prepare($sql);
                                $stmt->execute();
    
                                $fileid = $this->finfile_db->insert_id;
                                $this->file_access_logs($fileid, $user_id, "Team Upload File", "Team File", "upload");
    
                                $message = "$username uploaded $filename to the team folder $teamname.";
                                foreach ($team_member_ids as $tmid) {
                                    $this->notifications($tmid, $user_id, "File Uploaded", $message, "file_upload", $teamid, "Folder", "upload", "app.team_folders");
                                }
    
                                $uploadedFiles[] = $filename;
                            }
                        }
                    } else {
                        if (move_uploaded_file($tmpName, $targetPath)) {
                            $sql = "INSERT INTO files SET
                                file_name = '$filename',
                                file_type = '$fileExtension',
                                file_path = '$targetPath',
                                file_size = $fileSize,
                                file_location = '$teamname',
                                last_updated_by = $user_id,
                                team_id = $teamid,
                                owner_id = $user_id,
                                uploaded_at = NOW()";  
    
                            $stmt = $this->finfile_db->prepare($sql);
                            $stmt->execute();
    
                            $fileid = $this->finfile_db->insert_id;
                            $this->file_access_logs($fileid, $user_id, "Team Upload File", "Team File", "upload");
    
                            $message = "$username uploaded $filename to the team folder $teamname.";
                            foreach ($team_member_ids as $tmid) {
                                $this->notifications($tmid, $user_id, "File Uploaded", $message, "file_upload", $teamid, "Folder", "upload", "app.team_folders");
                            }
    
                            $uploadedFiles[] = $filename;
                        }
                    }
                }
            }
    
            if ($teamid > 0) {
                $this->calteamfolder_size($teamid, $baseUploadDir); 
            }
    
            return $this->response($this->json([
                "status" => "success",
                "uploaded_files" => $uploadedFiles
            ]), 200);
    
        } catch (PDOException $e) {
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
        }
    }
    
    private function download_team() {
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        $fnobj = json_decode(file_get_contents("php://input"), true);
        $fnobj = str_replace("'", "`", $fnobj);

        $fileid = (int)$fnobj["fileid"]; 
        $userid = (int)$fnobj["userid"]; 
        $filename = (string)$fnobj["filename"]; 
        $teamname = (string)$fnobj["teamname"]; 

        $publicUrl = 'http://' . $_SERVER['HTTP_HOST'] . '/finfile/uploads/'. $teamname. '/'. $filename;

        if($publicUrl){
            $this->file_access_logs($fileid, $userid, "Team Downloaded File", "Team File", "download"); 
            $this->response($this->json(["success" => $publicUrl]), 200);
        }else{
            $this->response('Failed to download file', 204);
        }
    }
    private function update_team(){
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $fnobj = json_decode(file_get_contents("php://input"), true);
        $fnobj = str_replace("'", "`", $fnobj);

        $fileid = (int)$fnobj["fileid"];
        $userid = (int)$fnobj["userid"]; 
        $filetype = (string)$fnobj["filetype"]; 
        $filename = (string)$fnobj["filename"]; 
        $teamname = (string)$fnobj["teamname"]; 
        $oldname = (string)$fnobj["oldname"]; 

        $baseUploadDir = '../uploads/' . $teamname . '/'; 

        $newFolder = $baseUploadDir . $filename. '.' .$filetype;
        $oldFolder = $baseUploadDir . $oldname . '.' .$filetype;

        echo $oldFolder;

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
                $this->file_access_logs($fileid, $userid, "Team Updated File", "Team File", "update"); 
                $success = "success";
                $this->response($this->json($success), 200);
            } else { 
                $this->response('Failed to create folder', 204);
            }

            $stmt->close();
            $this->finfile_db->close();
        }
    }
    private function team_remove(){
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $fnobj = json_decode(file_get_contents("php://input"), true);
        $fnobj = str_replace("'", "`", $fnobj);

        $teamid = (int)$fnobj["teamid"]; 
        $userid = (int)$fnobj["userid"]; 

        try {
            $sql = "DELETE FROM team_members WHERE team_id= $teamid AND user_id = $userid;";

            $this->finfile_db->prepare($sql)->execute();

            $this->file_access_logs($teamid, $userid, "Removed Team Members", "Team Members", "remove"); 
            return $this->response($this->json(["status" => "success"]), 200);
        } catch (PDOException $e) {
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
        }
    }
    private function team_download_folder() {

        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        $fnobj = json_decode(file_get_contents("php://input"), true);
        $fnobj = str_replace("'", "`", $fnobj);

        $teamid = (int)$fnobj["teamid"]; 
        $userid = (int)$fnobj["userid"]; 
        $name = basename($fnobj["name"]);
        $baseUploadDir = realpath('../uploads/');
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
            
            $urlLink = 'http://' . $_SERVER['HTTP_HOST'] . '/finfile/temp/' . $name . '.zip';
            $pathLink = $_SERVER['DOCUMENT_ROOT'] . '/finfile/temp/' . $name . '.zip';
            $this->response($this->json(["urlLink" => $urlLink, "pathLink" => $pathLink]), 200); 
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to create ZIP"]);
            exit;
        }
        $this->file_access_logs($teamid, $userid, "Downloaded Team Folder", "Folder", "download");
    }

    private function falogs_list(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
 
        $userid = (int)$this->_request["userid"];  
        $moduleval = (int)$this->_request["moduleval"];  

        if($moduleval == 0){
            $limit = "ORDER BY fa.log_id DESC LIMIT 5";
        }else{
            $limit = " ";
        }

        $stmt = $this->finfile_db->prepare(
            "SELECT
            fa.log_id,
            fa.file_id,
            fa.user_id,
            fa.types,  
            fa.remarks, 
            fa.logsdate, 
            fa.actions, 
            ux.full_name AS logsname
            FROM file_access_logs fa  
            LEFT JOIN users ux ON ux.user_id = fa.user_id
            WHERE fa.user_id = $userid 
            $limit"
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
    private function file_access_logs($fileid, $userid, $remarks, $types, $actions) { 
    
        $falsql = "INSERT INTO file_access_logs SET 
            file_id = $fileid,
            user_id = $userid,
            types = '$types',
            actions = '$actions',
            remarks = '$remarks'"; 
    
        $stmt2 = $this->finfile_db->prepare($falsql);
        $stmt2->execute(); 
    }
    private function ntfctns_list(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
 
        $userid = (int)$this->_request["userid"];  
        $moduleval = (int)$this->_request["moduleval"]; 
        
        if($moduleval == 0){
            $limit = "ORDER BY notif.ntfctns_id DESC
            LIMIT 5";
        }else{
            $limit = " ";
        }

        $stmt = $this->finfile_db->prepare(
            "SELECT
            notif.ntfctns_id,
            notif.recipient_id,
            notif.sender_id,
            notif.title,
            notif.messages,  
            notif.types, 
            notif.entity_id, 
            notif.entity_type, 
            notif.actions, 
            notif.urls, 
            notif.is_read, 
            notif.created_at, 
            ux.full_name AS recipientname,
            xu.full_name AS sendername
            FROM notifications notif  
            LEFT JOIN users ux ON ux.user_id = notif.recipient_id
            LEFT JOIN users xu ON xu.user_id = notif.sender_id
            WHERE notif.recipient_id = $userid 
            $limit"
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
    private function mark_as_read(){
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $notifobj = json_decode(file_get_contents("php://input"), true); 

        $ntfsobj = (array)$notifobj["ntfsobj"]; 
        $userid = (int)$notifobj["userid"]; 

       

        try {
            foreach($ntfsobj as $row){
                $ntfsid = $row['ntfctns_id'];

                $sql = "UPDATE notifications SET 
                is_read = 1 WHERE ntfctns_id = $ntfsid";
                $stmt = $this->finfile_db->prepare($sql);
                $stmt->execute();
            } 
            $this->file_access_logs($ntfsid, $userid, "Mark as read all notification", "Mark as read", "mark");
            return $this->response($this->json(["status" => "success"]), 200);
        } catch (PDOException $e) {
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
        }
    }
    private function notifications($recipid, $sendid, $title, $message, $type, $fileid, $enttype, $actions, $urls){


        $ntfssql = "INSERT INTO notifications SET 
            recipient_id  = '$recipid',
            sender_id  = '$sendid',
            title = '$title',
            messages = '$message',
            types  = '$type',
            entity_id = '$fileid',
            entity_type = '$enttype',
            actions = '$actions',
            urls='$urls';"; 

        $stmt = $this->finfile_db->prepare($ntfssql);
        $stmt->execute(); 
    }


    //---------------------------
    private function unlink_zip(){
        if ($this->get_request_method() != 'POST') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
        $fnobj = json_decode(file_get_contents("php://input"), true);
        $fnobj = str_replace("'", "`", $fnobj);

        $url = (string)$fnobj["urls"]; 

        unlink($url);
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
    public function calteamfolder_size($teamid, $categpath){
        try {
            $categsize = 0;
            foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($categpath)) as $file) {
                if ($file->isFile()) {
                    $categsize += $file->getSize();
                }
            } 
            $sql = "UPDATE teams SET 
                team_size=$categsize
                WHERE team_id = $teamid;";
            $stmt = $this->finfile_db->prepare($sql);
            $stmt->execute();
        } catch (PDOException $e){
            return $this->response($this->json(["error" => $e->getMessage()]), 500);
        }
    }
    

    //home page
    private function recent_files()
    {
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        $userid = (int)$this->_request["userid"]; 
 
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
            luby.full_name AS file_owner,
            fc.category_name
            FROM files fs
            LEFT JOIN file_categories fc ON fc.category_id = fs.category_id  
            LEFT JOIN users luby ON luby.user_id = fs.owner_id
            WHERE fs.is_trashed = 0 AND fs.owner_id = $userid
            AND DATE(fs.uploaded_at) = CURDATE()
            ORDER BY fs.uploaded_at DESC" 
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
    private function suggest_files()
    {
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        $userid = (int)$this->_request["userid"]; 
 
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
            luby.full_name AS file_owner,
            fc.category_name
            FROM files fs
            LEFT JOIN file_categories fc ON fc.category_id = fs.category_id  
            LEFT JOIN users luby ON luby.user_id = fs.owner_id
            WHERE fs.is_trashed = 0 AND fs.owner_id = $userid
            AND DATE(fs.last_modified) = CURDATE()
            ORDER BY fs.last_modified DESC
            LIMIT 4" 
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
    private function total_image()
    {
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        $userid = (int)$this->_request["userid"]; 
 
        $stmt = $this->finfile_db->prepare(
            "SELECT
            COUNT(fs.file_id) AS totalimg,
            SUM(fs.file_size) AS totalsize
            FROM files fs  
            WHERE fs.is_trashed = 0 
            AND fs.owner_id = $userid 
            AND fs.file_type IN ('jpg', 'jpeg', 'png', 'gif', 'webp')" 
        );
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $rows = $row;
            }
            $this->response($this->json($rows), 200);
        } else { 
            $this->response('Failed to get file list', 204);
        }
        $stmt->close();
        $this->finfile_db->close();
    }
    private function total_documents()
    {
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        $userid = (int)$this->_request["userid"]; 
 
        $stmt = $this->finfile_db->prepare(
            "SELECT
            COUNT(fs.file_id) AS totaldocs,
            SUM(fs.file_size) AS totalsize
            FROM files fs  
            WHERE fs.is_trashed = 0 
            AND fs.owner_id = $userid 
            AND fs.file_type IN ('pdf', 'docx', 'doc', 'xls', 'xlsx')" 
        );
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $rows = $row;
            }
            $this->response($this->json($rows), 200);
        } else { 
            $this->response('Failed to get file list', 204);
        }
        $stmt->close();
        $this->finfile_db->close();
    }
    private function total_folder()
    {   
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        $userid = (int)$this->_request["userid"]; 
 
        $stmt = $this->finfile_db->prepare(
            "SELECT
            COUNT(fc.category_id) AS totalfolder,
            SUM(fc.category_size) AS totalsize
            FROM file_categories fc  
            WHERE fc.is_trashed = 0 
            AND fc.owner_id = $userid" 
        );
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $rows = $row;
            }
            $this->response($this->json($rows), 200);
        } else { 
            $this->response('Failed to get file list', 204);
        }
        $stmt->close();
        $this->finfile_db->close();
    }
    private function total_team(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }
 
        $userid = (int)$this->_request["userid"];  

        $stmt = $this->finfile_db->prepare(
            "SELECT
            COUNT(ts.team_id) AS totalfolder,
            SUM(ts.team_size AS totalsize
            FROM teams ts 
            LEFT JOIN team_members tms ON tms.team_id = ts.team_id 
            WHERE ts.is_trashed = 0 AND tms.user_id = $userid
            ORDER BY ts.team_id"
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

    private function disk_usage(){
        if ($this->get_request_method() != 'GET') {
            $callback = array("callback" => 'Request method not acceptable');
            $this->response($this->json($callback), 406);
        }

        $uploadDir = $_SERVER['DOCUMENT_ROOT'];
        
        $path = realpath($uploadDir);
        
        $drive = substr($path, 0, 3); 

        $totalSpace = disk_total_space($drive); // in bytes
        $freeSpace = disk_free_space($drive);   // in bytes
        $usedSpace = $totalSpace - $freeSpace; 

        $rows = [
            "TotalSpace" => round($totalSpace / (1024 ** 3), 2),
            "UsedSpace" => round($usedSpace / (1024 ** 3), 2),
            "FreePace" => round($freeSpace / (1024 ** 3), 2),
        ];

        $this->response($this->json($rows), 200);
    }
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
