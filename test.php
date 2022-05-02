<?php
error_reporting(E_ALL);
    $file = 'index.js';
    $fp = fopen($file, 'r');

    // set up basic connection
    $ftp = ftp_connect("localhost");

    // login with username and password
    $login_result = ftp_login($ftp, "test", "test");

    // try to upload $file
    if (ftp_fput($ftp, $file, $fp, FTP_BINARY)) {
        echo "Successfully uploaded $file\n";
    } else {
        echo "There was a problem while uploading $file\n";
    }

    ftp_rename($ftp, "index.js", "test.js");

    var_dump(ftp_nlist($ftp, "."));

ftp_mkdir($ftp, "foobar");

    ftp_chdir($ftp, "foobar");

    var_dump(ftp_nlist($ftp, "."));

    ftp_delete($ftp, "test.js");

    var_dump(ftp_nlist($ftp, "."));

    // close the connection and the file handler
    ftp_close($ftp);
    fclose($fp);
