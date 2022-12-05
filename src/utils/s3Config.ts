import S3 from "react-aws-s3";

const config = {
  bucketName: process.env.REACT_APP_S3_BUCKET,
  region: process.env.REACT_APP_S3_REGION,
  accessKeyId: process.env.REACT_APP_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_SECRET_KEY,
};
export const ReactS3Client = new S3(config);
