# Multilingual Audio/Video Transcription Web Application

My project offers a seamless solution for converting audio or video files into accessible transcripts through the integration of modern technology and user-friendly interfaces. By leveraging AWS services and a dynamic web application, users can easily upload their files and receive accurate transcripts, making transcription accessible to all. With AWS S3 buckets managing data storage, AWS Transcribe handles the transcription process, while our web interface provides a convenient platform for users to interact with the system and download their transcripts.

AWS Services Used are: IAM, Lambda, S3, AWS SDK, AWS Transcribe.


This a serverless Web application that takes an audio or a video file of different languages a s input and gives their transcripts. This happens as when we uploaded a file from the web page in will be uploaded into the s3 input bucket because of the AWS SDK permissions to S3. When the file is uploaded into the input s3 bucket the lambda function will create a new transcribe job for the file and the output .JSON file will be uploaded in output s3 bucket. Finally we the user click the download on the webpage the .js file which we created will create a link to a .TXT file which will have the transcript of .JSON file 

