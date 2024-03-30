var region= "ap-south-1"
var accessKeyId = "AKIAXGDFE6TIDBO36VRH"
var secretAccessKey = "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"

AWS.config.update({
    region: region,
    credentials: new AWS.Credentials(accessKeyId,secretAccessKey)
})

var s3 = new AWS.S3()

function refreshFileList(inputBucketName, outputBucketName){
    var tableBody = document.querySelector("#fileTable tbody");
    tableBody.innerHTML = "";

    s3.listObjectsV2({Bucket:inputBucketName},(err,data) => {
        if(err){
            console.log("Error fetching file list",err)
        }
        else{
            data.Contents.forEach((object) => {
                var fileRoW = document.createElement('tr');

                var fileNameCell = document.createElement('td');
                fileNameCell.textContent = object.Key;
                fileRoW.appendChild(fileNameCell);

                var fileSizeCell = document.createElement('td');
                fileSizeCell.textContent = object.Size;
                fileRoW.appendChild(fileSizeCell);

                var downloadCell = document.createElement('td');
                var downloadLink = document.createElement('a');
                downloadLink.href = "#";
                downloadLink.textContent = "Download";
                downloadLink.onclick = function() {
                    setTimeout(() => {
                        refreshFileList(inputBucketName, outputBucketName);
                    }, 4000);
                    downloadTranscript(inputBucketName, outputBucketName, object.Key);
                };
                downloadCell.appendChild(downloadLink);
                fileRoW.appendChild(downloadCell);

                var deleteCell = document.createElement('td');
                var deleteButton = document.createElement('button');
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener('click',()=>{
                    deleteFile(inputBucketName,outputBucketName,object.Key)
                });

                deleteCell.appendChild(deleteButton);
                fileRoW.appendChild(deleteCell);

                tableBody.appendChild(fileRoW);
            });
        }
    });
}

function uploadFiles(inputBucketName,outputBucketName){
    let files = document.getElementById('fileInput').files

    var fileCount = files.length

    for(var i=0;i<fileCount;i++){
        var file = files[i];
        var params = {
            Bucket: inputBucketName,
            Key: file.name,
            Body: file
        }

        s3.upload(params,(err,data) => {
            setTimeout(() => {
                refreshFileList(inputBucketName, outputBucketName);
            }, 4000);
            console.log("file uploaded")
        })
    }
}

function deleteFile(inputBucketName, outputBucketName, key){
    var params={
        Bucket: inputBucketName,
        Key: key
    };
    s3.deleteObject(params,(err,data) => {
        if (err) {
            console.log("Error deleting file", err);
            return;
        }

        // Delete the corresponding file in the output bucket
        var outputKey = key + ".json";
        var outputParams = {
            Bucket: outputBucketName,
            Key: outputKey
        };
        s3.deleteObject(outputParams, (outputErr, outputData) => {
            if (outputErr) {
                console.log("Error deleting corresponding file in output bucket", outputErr);
                return;
            }
            console.log("File deleted successfully");
            refreshFileList(inputBucketName, outputBucketName); // Refresh file list after deletion
        });
    });
}

function downloadTranscript(inputBucketName, outputBucketName, key) {
    var params = {
        Bucket: outputBucketName,
        Key: key + ".json"
    };

    s3.getObject(params, function(err, data) {
        if (err) {
            console.log("Error retrieving JSON file:", err);
            return;
        }

        // Parse JSON data to extract transcript
        var jsonContent = JSON.parse(data.Body.toString());
        var transcript = jsonContent.results.transcripts[0].transcript;

        // Create a text file with transcript data
        var blob = new Blob([transcript], { type: 'text/plain' });
        var url = window.URL.createObjectURL(blob);

        // Create a link element to download the text file
        var a = document.createElement('a');
        a.href = url;
        a.download = key + ".txt"; // Set the filename
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    });
}

refreshFileList("inputaudios","output-textfiles")